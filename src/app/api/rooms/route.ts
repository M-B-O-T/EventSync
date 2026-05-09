import { prisma } from "@/lib/prisma";

export async function GET() {
  const rooms = await prisma.room.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return new Response(JSON.stringify(rooms), {
    headers: {
      "Content-Type": "application/json",
      "Content-Range": `rooms 0-${rooms.length - 1}/${rooms.length}`,
      "Access-Control-Expose-Headers": "Content-Range",
    },
  });
}

export async function POST(req: Request) {
  const { name } = await req.json();

  const room = await prisma.room.create({
    data: { name },
  });

  return new Response(JSON.stringify(room), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
