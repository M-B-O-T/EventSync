import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

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
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  const room = await prisma.room.create({
    data: { name },
  });

  return NextResponse.json(room);
}
