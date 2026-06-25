import { verifyToken } from "@/lib/jwt";

export function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}