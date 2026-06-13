import fs from "node:fs";
import path from "node:path";
import { products as seedProducts } from "./products";
import { services as seedServices } from "./services";
import { events as seedEvents } from "./events";
import { courses as seedCourses } from "./courses";

/**
 * Единое хранилище контента сайта. Админка пишет, витрина читает.
 * Файлы в .data/content/*.json. Если файла нет — сидится из статичных дефолтов
 * (тогда сайт работает сразу и становится редактируемым).
 */
const DIR = path.join(process.cwd(), ".data", "content");

export type ContentType = "products" | "services" | "events" | "courses";

const slug = (s: string) =>
  String(s).toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 32);

function withId<T extends Record<string, unknown>>(item: T, type: string, i: number): T & { id: string } {
  const id = (item.id as string) || `${type}-${i}-${slug((item.title || item.name || "") as string)}`;
  return { ...item, id };
}

const SEEDS: Record<ContentType, Record<string, unknown>[]> = {
  products: seedProducts as unknown as Record<string, unknown>[],
  services: seedServices as unknown as Record<string, unknown>[],
  events: seedEvents as unknown as Record<string, unknown>[],
  courses: seedCourses as unknown as Record<string, unknown>[],
};

function file(type: ContentType) {
  return path.join(DIR, `${type}.json`);
}

export function readContent<T = Record<string, unknown>>(type: ContentType): (T & { id: string })[] {
  try {
    return JSON.parse(fs.readFileSync(file(type), "utf8"));
  } catch {
    const seeded = SEEDS[type].map((it, i) => withId(it, type, i));
    try {
      fs.mkdirSync(DIR, { recursive: true });
      fs.writeFileSync(file(type), JSON.stringify(seeded, null, 2));
    } catch {}
    return seeded as (T & { id: string })[];
  }
}

export function writeContent(type: ContentType, items: Record<string, unknown>[]) {
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(file(type), JSON.stringify(items, null, 2));
}

export function addItem(type: ContentType, item: Record<string, unknown>) {
  const items = readContent(type);
  const id = (item.id as string) || `${type}-${Date.now().toString(36)}`;
  const next = [{ ...item, id }, ...items];
  writeContent(type, next);
  return next;
}

export function updateItem(type: ContentType, id: string, patch: Record<string, unknown>) {
  const items = readContent(type).map((it) => (it.id === id ? { ...it, ...patch, id } : it));
  writeContent(type, items);
  return items;
}

export function removeItem(type: ContentType, id: string) {
  const items = readContent(type).filter((it) => it.id !== id);
  writeContent(type, items);
  return items;
}

/** Слить опубликованные движком товары (по id) в управляемый каталог. */
export function mergeProducts(incoming: Record<string, unknown>[]) {
  const items = readContent("products");
  const ids = new Set(items.map((i) => i.id));
  const fresh = incoming.filter((p) => p.id && !ids.has(p.id as string));
  if (fresh.length) writeContent("products", [...fresh, ...items]);
  return fresh.length;
}
