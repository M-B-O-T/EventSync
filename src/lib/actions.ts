"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitQuestion(sessionId: string, content: string, author: string | null) {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error("Session not found");

  const now = new Date();
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);

  if (now < start || now > end) {
    throw new Error("La session n'est pas en cours (Live).");
  }

  await prisma.question.create({
    data: {
      content,
      author: author || null,
      sessionId,
    },
  });

  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath(`/events/${session.eventId}`);
}

export async function upvoteQuestion(questionId: string, sessionId: string) {
  await prisma.question.update({
    where: { id: questionId },
    data: {
      votes: { increment: 1 },
    },
  });

  revalidatePath(`/sessions/${sessionId}`);
}
