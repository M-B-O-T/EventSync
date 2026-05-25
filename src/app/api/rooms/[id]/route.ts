import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(room), {
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
  const { name } = await req.json();

  const room = await prisma.room.update({
    where: { id },
    data: { name },
  });

  return new Response(JSON.stringify(room), {
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

  const sessions = await prisma.session.findMany({
    where: { roomId: id },
    select: { id: true },
  });

  if (sessions.length > 0) {
    return new Response(
      JSON.stringify({ error: "Room is used by sessions" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  await prisma.room.delete({
    where: { id },
  });

  return new Response(null, { status: 204 });
}