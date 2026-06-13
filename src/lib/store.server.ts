import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), ".data");

function read<T>(file: string): T[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
  } catch {
    return [];
  }
}

export type StoredOrder = {
  id: string;
  items: { id: string; name: string; price: number; qty: number; size?: string }[];
  total: number;
  contact: { name: string; phone: string; email?: string; note?: string };
  userEmail?: string;
  createdAt: number;
  status: string;
};

export type StoredRegistration = {
  id: string;
  event: string;
  userEmail: string;
  name: string;
  createdAt: number;
};

export function ordersFor(email: string): StoredOrder[] {
  return read<StoredOrder>("orders.json").filter(
    (o) => o.userEmail === email || o.contact?.email === email
  );
}
export function registrationsFor(email: string): StoredRegistration[] {
  return read<StoredRegistration>("registrations.json").filter((r) => r.userEmail === email);
}
