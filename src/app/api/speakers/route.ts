import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

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
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, photoUrl, bio } = await req.json();

  const speaker = await prisma.speaker.create({
    data: {
      name,
      photoUrl,
      bio,
    },
  });

  return NextResponse.json(speaker);
}