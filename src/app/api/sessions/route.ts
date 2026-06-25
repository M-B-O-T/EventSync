import { prisma } from "@/lib/prisma";

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

  return Response.json(session);
}