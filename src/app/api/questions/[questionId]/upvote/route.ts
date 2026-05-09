import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const question = await prisma.question.findUnique({ where: { id: params.id } });

  if (!question) {
    return new Response(JSON.stringify({ error: "Question not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify(question), { headers: { "Content-Type": "application/json" } });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const question = await prisma.question.update({
    where: { id: params.id },
    data: { votes: { increment: 1 } },
  });

  return new Response(JSON.stringify(question), { headers: { "Content-Type": "application/json" } });
}