import { NextResponse } from "next/server";
import { getUser } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ user: await getUser() });
}
