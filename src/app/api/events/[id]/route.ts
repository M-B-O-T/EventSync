import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          room: true,
          speakers: { include: { speaker: true } },
          questions: true,
        },
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const event = await prisma.event.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      location: body.location,
      imageUrl: body.imageUrl,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    },
  });

  return NextResponse.json(event);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.event.deleteMany({
    where: { id },
  });

  return NextResponse.json({ data: { id } });
}