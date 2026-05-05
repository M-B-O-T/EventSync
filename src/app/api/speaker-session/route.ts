import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { speakerId, sessionId } = await req.json();

  const relation = await prisma.speakerSession.create({
    data: {
      speakerId,
      sessionId,
    },
  });

  return Response.json(relation);
}