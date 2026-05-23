import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await prisma.session.findUnique({
      where: { id },
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

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
