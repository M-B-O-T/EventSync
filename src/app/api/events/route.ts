import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    include: {
      sessions: true,
      _count: {
        select: {
          sessions: true,
        },
      },
    },
  });

  return new Response(JSON.stringify(events), {
    headers: {
      "Content-Type": "application/json",
      "Content-Range": `events 0-${events.length - 1}/${events.length}`,
      "Access-Control-Expose-Headers": "Content-Range",
    },
  });
}