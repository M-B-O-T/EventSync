import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type SpeakerInput = string | { speakerId: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      event: true,
      room: true,
      speakers: {
        include: { speaker: true },
      },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...session,
    speakers: session.speakers.map((s) => s.speakerId),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  await prisma.session.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      capacity: body.capacity,
      eventId: body.eventId,
      roomId: body.roomId,
    },
  });

  if (Array.isArray(body.speakers)) {
    const speakers: string[] = (body.speakers as SpeakerInput[]).map((s) =>
      typeof s === "string" ? s : s.speakerId
    );

    const uniqueSpeakers = [...new Set(speakers)];

    await prisma.speakerSession.deleteMany({
      where: { sessionId: id },
    });

    if (uniqueSpeakers.length > 0) {
      await prisma.speakerSession.createMany({
        data: uniqueSpeakers.map((speakerId) => ({
          sessionId: id,
          speakerId,
        })),
        skipDuplicates: true,
      });
    }
  }

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      event: true,
      room: true,
      speakers: {
        include: { speaker: true },
      },
    },
  });

  return NextResponse.json(session);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.speakerSession.deleteMany({
      where: { sessionId: id },
    });

    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: true });
  }
}