import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getUser } from "@/lib/session";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS = path.join(DATA_DIR, "orders.json");

type OrderItem = { id: string; name: string; price: number; qty: number; size?: string };
type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  contact: { name: string; phone: string; email?: string; note?: string };
  userEmail?: string; // привязка к аккаунту, если вошёл
  createdAt: number;
  status: "new";
};

function read(): Order[] {
  try {
    return JSON.parse(fs.readFileSync(ORDERS, "utf8"));
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Order>;
  if (!body.items?.length) return NextResponse.json({ error: "empty cart" }, { status: 400 });
  if (!body.contact?.name || !body.contact?.phone)
    return NextResponse.json({ error: "name and phone required" }, { status: 400 });

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const user = await getUser();
  const order: Order = {
    id: "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    items: body.items as OrderItem[],
    total: body.total ?? 0,
    contact: body.contact as Order["contact"],
    userEmail: user?.email,
    createdAt: Date.now(),
    status: "new",
  };
  fs.writeFileSync(ORDERS, JSON.stringify([order, ...read()], null, 2));
  // TODO: уведомление в Telegram/почту при подключении
  return NextResponse.json({ ok: true, id: order.id });
}

export async function GET() {
  return NextResponse.json(read());
}
