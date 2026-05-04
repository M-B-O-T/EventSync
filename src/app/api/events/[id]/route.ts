import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { title, description, location, startDate, endDate } = await req.json();

  const event = await prisma.event.update({
    where: { id: params.id },
    data: {
      title,
      description,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return Response.json(event);
}