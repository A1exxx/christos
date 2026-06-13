import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import {
  readContent,
  addItem,
  updateItem,
  removeItem,
  type ContentType,
} from "@/lib/content.server";

export const runtime = "nodejs";

const TYPES: ContentType[] = ["products", "services", "events", "courses"];
const ok = (t: unknown): t is ContentType => TYPES.includes(t as ContentType);

async function guard() {
  return (await isAdmin()) ? null : NextResponse.json({ error: "forbidden" }, { status: 403 });
}

export async function GET(req: Request) {
  const g = await guard();
  if (g) return g;
  const type = new URL(req.url).searchParams.get("type");
  if (!ok(type)) return NextResponse.json({ error: "bad type" }, { status: 400 });
  return NextResponse.json({ items: readContent(type) });
}

export async function POST(req: Request) {
  const g = await guard();
  if (g) return g;
  const { type, item } = (await req.json()) as { type?: string; item?: Record<string, unknown> };
  if (!ok(type) || !item) return NextResponse.json({ error: "bad request" }, { status: 400 });
  return NextResponse.json({ items: addItem(type, item) });
}

export async function PUT(req: Request) {
  const g = await guard();
  if (g) return g;
  const { type, id, patch } = (await req.json()) as { type?: string; id?: string; patch?: Record<string, unknown> };
  if (!ok(type) || !id || !patch) return NextResponse.json({ error: "bad request" }, { status: 400 });
  return NextResponse.json({ items: updateItem(type, id, patch) });
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (g) return g;
  const u = new URL(req.url);
  const type = u.searchParams.get("type");
  const id = u.searchParams.get("id");
  if (!ok(type) || !id) return NextResponse.json({ error: "bad request" }, { status: 400 });
  return NextResponse.json({ items: removeItem(type, id) });
}
