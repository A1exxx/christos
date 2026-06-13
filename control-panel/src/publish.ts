import fs from "node:fs";
import path from "node:path";
import { config } from "./config.ts";
import { store } from "./store.ts";

const USD_TO_THB = 36; // грубая конвертация для витрины (уточним позже)

export type PublishedProduct = {
  id: string;
  name: string;
  category: "Одежда" | "Аксессуары";
  price: number; // THB
  collection: string;
  description: string;
  material: string;
  image: string; // путь для витрины (вырезанный)
  sizes: string[];
  source: string;
};

/**
 * Сливает одобренные товары в управляемый каталог витрины (.data/content/products.json).
 * Не затирает уже существующие (по id) — добавляет только новые.
 */
export function publish(): { count: number; added: number; path: string } {
  const approved = store.byStatus("approved").filter((c) => c.category !== "Другое");
  const products: PublishedProduct[] = approved.map((c) => ({
    id: c.id,
    name: c.titleRu || c.title,
    category: c.category as "Одежда" | "Аксессуары",
    price: Math.round((c.price * USD_TO_THB) / 10) * 10,
    collection: c.source === "manual" ? "Студия" : "Найдено",
    description: c.title,
    material: "—",
    image: c.imageCut || c.imageLocal || c.imageOriginal,
    sizes: c.category === "Одежда" ? ["S", "M", "L", "XL"] : ["One size"],
    source: c.source,
  }));

  let existing: PublishedProduct[] = [];
  try {
    existing = JSON.parse(fs.readFileSync(config.storefrontCatalog, "utf8"));
  } catch {
    /* файла ещё нет — витрина засидит дефолты при первом чтении, но если
       публикуем раньше первого рендера, начнём с пустого и добавим найденное */
  }
  const ids = new Set(existing.map((p) => p.id));
  const fresh = products.filter((p) => !ids.has(p.id));
  const merged = [...fresh, ...existing];

  fs.mkdirSync(path.dirname(config.storefrontCatalog), { recursive: true });
  fs.writeFileSync(config.storefrontCatalog, JSON.stringify(merged, null, 2));
  return { count: merged.length, added: fresh.length, path: config.storefrontCatalog };
}
