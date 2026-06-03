"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/data";

export async function submitQuestion(
  sessionId: string,
  content: string,
  author: string | null
) {
  const session = await getSession(sessionId);
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
  revalidateTag(`questions-session-${sessionId}`, "max");
}

export async function upvoteQuestion(
  questionId: string,
  sessionId: string,
  action: "up" | "down"
) {
  await prisma.question.update({
    where: { id: questionId },
    data: {
      votes: {
        increment: action === "up" ? 1 : -1,
      },
    },
  });
  revalidateTag(`questions-session-${sessionId}`, "max");
}