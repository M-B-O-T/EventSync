import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
      questions: true,
    },
  });

  if (!session) {
    return new Response(JSON.stringify({ error: "Session not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(session), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { title, description, startTime, endTime, eventId, roomId, speakers } =
    await req.json();

  await prisma.speakerSession.deleteMany({
    where: { sessionId: id },
  });

  const session = await prisma.session.update({
    where: { id },
    data: {
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      eventId,
      roomId,
      speakers: {
        create: speakers?.map((speakerId: string) => ({ speakerId })) ?? [],
      },
    },
  });

  return new Response(JSON.stringify(session), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.session.delete({ where: { id } });

  return new Response(null, { status: 204 });
}