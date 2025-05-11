// /app/api/current-user/route.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const token = await cookies().get("token")?.value;

  if (!token) return new Response(JSON.stringify(null), { status: 401 });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return new Response(JSON.stringify(user));
  } catch {
    return new Response(JSON.stringify(null), { status: 401 });
  }
}
