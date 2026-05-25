import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        event: true,
        room: true,
        speakers: {
          include: {
            speaker: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      await prisma.speakerSession.deleteMany({
        where: {
          sessionId: id,
        },
      });

      await prisma.speakerSession.createMany({
        data: body.speakers.map((speaker: any) => ({
          sessionId: id,
          speakerId:
            typeof speaker === "string"
              ? speaker
              : speaker.speakerId,
        })),
      });
    }

    const updatedSession = await prisma.session.findUnique({
      where: { id },
      include: {
        event: true,
        room: true,
        speakers: {
          include: {
            speaker: true,
          },
        },
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating session:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting session:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}