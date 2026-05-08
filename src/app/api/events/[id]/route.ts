import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      sessions: {
        include: {
          room: true,
          speakers: {
            include: {
              speaker: true,
            },
          },
          questions: true,
        },
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!event) {
    return new Response(JSON.stringify({ error: "Event not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(event), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { title, description, location, startDate, endDate, imageUrl } =
    await req.json();

  const event = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      location,
      imageUrl,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return new Response(JSON.stringify(event), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.event.delete({ where: { id } });

  return new Response(null, { status: 204 });
}