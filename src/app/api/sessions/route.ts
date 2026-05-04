import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.session.findMany({
    include: {
      event: true,
      room: true,
      speakers: {
        include: {
          speaker: true,
        },
      },
    },
  });

  return new Response(JSON.stringify(sessions), {
    headers: {
      "Content-Type": "application/json",
      "Content-Range": `sessions 0-${sessions.length - 1}/${sessions.length}`,
      "Access-Control-Expose-Headers": "Content-Range",
    },
  });
}