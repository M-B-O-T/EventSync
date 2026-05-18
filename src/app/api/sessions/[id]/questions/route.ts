import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const questions = await prisma.question.findMany({
    where: { sessionId: params.id },
    orderBy: { votes: "desc" },
  });

  return Response.json(questions);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { content, author } = await req.json();

  const session = await prisma.session.findUnique({
    where: { id: params.id },
  });

  if (!session) {
    return Response.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }

  const now = new Date();
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);

  if (now < start || now > end) {
    return Response.json(
      { error: "Questions are only accepted while the session is live." },
      { status: 400 }
    );
  }

  const question = await prisma.question.create({
    data: {
      content,
      author: author || null,
      sessionId: params.id,
    },
  });

  return Response.json(question);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { questionId, action } = await req.json();

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    return Response.json(
      { error: "Question not found" },
      { status: 404 }
    );
  }

  let newVotes = question.votes;

  if (action === "up") {
    newVotes += 1;
  } else if (action === "down") {
    newVotes -= 1;
  }

  if (newVotes < 0) {
    newVotes = 0;
  }

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: {
      votes: newVotes,
    },
  });

  return Response.json(updated);
}