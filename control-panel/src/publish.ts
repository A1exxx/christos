import fs from "node:fs";
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

/** Собирает одобренные товары в catalog.generated.json для витрины. */
export function publish(): { count: number; path: string } {
  const approved = store.byStatus("approved").filter((c) => c.category !== "Другое");
  const products: PublishedProduct[] = approved.map((c) => ({
    id: c.id,
    name: c.titleRu || c.title,
    category: c.category as "Одежда" | "Аксессуары",
    price: Math.round((c.price * USD_TO_THB) / 10) * 10,
    collection: "Найдено",
    description: c.title,
    material: "—",
    image: c.imageCut || c.imageLocal || c.imageOriginal,
    sizes: c.category === "Одежда" ? ["S", "M", "L", "XL"] : ["One size"],
    source: c.source,
  }));
  fs.writeFileSync(config.storefrontCatalog, JSON.stringify(products, null, 2));
  return { count: products.length, path: config.storefrontCatalog };
}
