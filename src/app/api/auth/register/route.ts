import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      return Response.json({ error: "Admin already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return Response.json({
      id: admin.id,
      email: admin.email,
    });
  } catch (e) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}