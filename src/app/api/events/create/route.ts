import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { title, description, location, startDate, endDate } = await req.json();

  const event = await prisma.event.create({
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