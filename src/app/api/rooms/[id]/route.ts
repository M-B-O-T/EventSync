import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({
    where: { id: params.id },
  });

  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify(room), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { name } = await req.json();

  const room = await prisma.room.update({
    where: { id: params.id },
    data: { name },
  });

  return new Response(JSON.stringify(room), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.room.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}