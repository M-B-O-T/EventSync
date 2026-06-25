import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  const sessions = await prisma.session.findMany({
    include: {
      event: true,
      room: true,
      speakers: true,
    },
  });

  const formatted = sessions.map((s) => ({
    ...s,
    speakers: s.speakers.map((sp) => sp.speakerId),
  }));

  return new Response(JSON.stringify(formatted), {
    headers: {
      "Content-Type": "application/json",
      "Content-Range": `sessions 0-${sessions.length - 1}/${sessions.length}`,
      "Access-Control-Expose-Headers": "Content-Range",
    },
  });
}

export async function POST(req: Request) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, startTime, endTime, eventId, roomId, speakers } =
    await req.json();

  const session = await prisma.session.create({
    data: {
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      eventId,
      roomId,
      speakers: {
        create: speakers?.map((speakerId: string) => ({
          speakerId,
        })),
      },
    },
  });

  return NextResponse.json(session);
}