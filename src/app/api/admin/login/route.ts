import { NextResponse } from "next/server";
import { checkAdminPassword, adminToken, ADMIN_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };
  if (!password || !checkAdminPassword(password))
    return NextResponse.json({ error: "wrong_password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
