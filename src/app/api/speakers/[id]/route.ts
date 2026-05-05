import { prisma } from "@/lib/prisma";

export async function GET() {
  const speakers = await prisma.speaker.findMany({
    include: {
      sessions: {
        include: {
          session: true,
        },
      },
    },
  });

  return new Response(JSON.stringify(speakers), {
    headers: {
      "Content-Type": "application/json",
      "Content-Range": `speakers 0-${speakers.length - 1}/${speakers.length}`,
      "Access-Control-Expose-Headers": "Content-Range",
    },
  });
}