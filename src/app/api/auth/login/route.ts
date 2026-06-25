import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = signToken({
      id: admin.id,
      email: admin.email,
    });

    return Response.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}