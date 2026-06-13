import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getUser } from "@/lib/session";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "registrations.json");

type Reg = { id: string; event: string; userEmail: string; name: string; createdAt: number };
const read = (): Reg[] => {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
};

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "auth_required" }, { status: 401 });
  const { event } = (await req.json()) as { event?: string };
  if (!event) return NextResponse.json({ error: "event required" }, { status: 400 });

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const all = read();
  if (all.some((r) => r.userEmail === user.email && r.event === event))
    return NextResponse.json({ ok: true, already: true });

  const reg: Reg = {
    id: "REG-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    event,
    userEmail: user.email,
    name: user.name,
    createdAt: Date.now(),
  };
  fs.writeFileSync(FILE, JSON.stringify([reg, ...all], null, 2));
  return NextResponse.json({ ok: true });
}
