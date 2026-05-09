import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, photoUrl, bio } = await req.json();

  const speaker = await prisma.speaker.create({
    data: {
      name,
      photoUrl,
      bio,
    },
  });

  return Response.json(speaker);
}