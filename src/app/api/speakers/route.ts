import { prisma } from "@/lib/prisma";

export async function GET() {
  const speakers = await prisma.speaker.findMany();

  return new Response(JSON.stringify(speakers), {
    headers: {
      "Content-Type": "application/json",
      "Content-Range": `speakers 0-${speakers.length - 1}/${speakers.length}`,
      "Access-Control-Expose-Headers": "Content-Range",
    },
  });
}

export async function POST(req: Request) {
  const { name, photoUrl, bio } = await req.json();

  const speaker = await prisma.speaker.create({
    data: {
      name,
      photoUrl,
      bio,
    },
  });

  return new Response(JSON.stringify(speaker), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}