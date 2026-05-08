import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const questions = await prisma.question.findMany({
    where: { sessionId: params.id },
    orderBy: { votes: "desc" },
  });

  return new Response(JSON.stringify(questions), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { content, author } = await req.json();

  const session = await prisma.session.findUnique({ where: { id: params.id } });
  if (!session) {
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  const now = new Date();
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);

  if (now < start || now > end) {
    return new Response(JSON.stringify({ error: "Questions are only accepted while the session is live." }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const question = await prisma.question.create({
    data: {
      content,
      author: author || null,
      sessionId: params.id,
    },
  });

  return new Response(JSON.stringify(question), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { questionId } = await req.json();

  const question = await prisma.question.update({
    where: { id: questionId },
    data: {
      votes: { increment: 1 },
    },
  });

  return new Response(JSON.stringify(question), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
