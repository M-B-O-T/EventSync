import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { title, description, startTime, endTime, eventId, roomId, speakers } =
    await req.json();

  await prisma.speakerSession.deleteMany({
    where: { sessionId: params.id },
  });

  const session = await prisma.session.update({
    where: { id: params.id },
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