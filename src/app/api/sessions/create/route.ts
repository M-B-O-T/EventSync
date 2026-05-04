import { prisma } from "@/lib/prisma";

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