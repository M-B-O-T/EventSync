import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

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
    orderBy: {
      startDate: "asc",
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

export async function POST(req: Request) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, location, startDate, endDate, imageUrl } =
    await req.json();

  const event = await prisma.event.create({
    data: {
      title,
      description,
      location,
      imageUrl,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return NextResponse.json(event);
}