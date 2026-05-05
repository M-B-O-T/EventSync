import { prisma } from "@/lib/prisma";

export async function GET() {
  const questions = await prisma.question.findMany({
    select: {
      id: true,
      content: true,
      author: true,
      votes: true,
      sessionId: true,
      session: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return new Response(JSON.stringify(questions), {
    headers: {
      "Content-Type": "application/json",
      "Content-Range": `questions 0-${questions.length - 1}/${questions.length}`,
      "Access-Control-Expose-Headers": "Content-Range",
    },
  });
}