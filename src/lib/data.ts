import { prisma } from "@/lib/prisma";
import { unstable_cacheTag as cacheTag } from "next/cache";

export async function getSession(sessionId: string) {
  "use cache";
  cacheTag(`session-${sessionId}`);

  return prisma.session.findUnique({
    where: { id: sessionId },
    select: { startTime: true, endTime: true, eventId: true },
  });
}

export async function getQuestionsForSession(sessionId: string) {
  "use cache";
  cacheTag(`questions-session-${sessionId}`);

  return prisma.question.findMany({
    where: { sessionId },
    orderBy: { votes: "desc" },
  });
}