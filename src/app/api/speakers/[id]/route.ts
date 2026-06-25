import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const speaker = await prisma.speaker.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          session: {
            include: {
              event: true,
              room: true,
            },
          },
        },
      },
    },
  });

  if (!speaker) {
    return new Response(JSON.stringify({ error: "Speaker not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(speaker), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name, photoUrl, bio } = await req.json();

  const speaker = await prisma.speaker.update({
    where: { id },
    data: {
      name,
      photoUrl,
      bio,
    },
  });

  return NextResponse.json(speaker);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.speakerSession.deleteMany({
    where: { speakerId: id },
  });

  await prisma.speaker.deleteMany({
    where: { id },
  });

  return NextResponse.json({ success: true });
}