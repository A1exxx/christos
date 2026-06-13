import { NextResponse } from "next/server";
import { makeToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { name, email } = (await req.json()) as { name?: string; email?: string };
  if (!email || !email.includes("@"))
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  const user = { name: name?.trim() || email.split("@")[0], email: email.trim().toLowerCase() };
  const res = NextResponse.json({ ok: true, user });
  res.cookies.set(SESSION_COOKIE, makeToken(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
