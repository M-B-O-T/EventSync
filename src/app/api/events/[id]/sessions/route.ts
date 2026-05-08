import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sessions = await prisma.session.findMany({
    where: { eventId: params.id },
    include: {
      room: true,
      speakers: {
        include: {
          speaker: true,
        },
      },
      questions: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return new Response(JSON.stringify(sessions), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
