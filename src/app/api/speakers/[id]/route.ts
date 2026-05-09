import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const speaker = await prisma.speaker.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          session: {
            include: {
              event: true,
              room: true,
            },
          },
        },
      },
    },
  });

  if (!speaker) {
    return new Response(JSON.stringify({ error: "Speaker not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(speaker), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, photoUrl, bio } = await req.json();

  const speaker = await prisma.speaker.update({
    where: { id },
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.speaker.delete({ where: { id } });

  return new Response(null, { status: 204 });
}