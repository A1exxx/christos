import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./config.ts";

export type Candidate = {
  id: string; // стабильный id (cj productId или mock)
  source: "cj" | "aliexpress" | "manual";
  title: string;
  titleRu?: string;
  price: number; // в исходной валюте источника (USD/CNY)
  currency: string;
  rating?: number;
  orders?: number;
  category: "Одежда" | "Аксессуары" | "Другое";
  imageOriginal: string; // URL исходного фото
  imageLocal?: string; // путь к скачанному/обработанному фото
  imageCut?: string; // путь к вырезанному (прозрачный фон)
  url?: string;
  status: "pending" | "approved" | "rejected";
  classification?: { christian: boolean; reason: string; confidence: number };
  searchPrompt?: string;
  createdAt: number;
};

const QUEUE = path.join(DATA_DIR, "queue.json");
const SEARCHES = path.join(DATA_DIR, "searches.json");

function readJSON<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}
function writeJSON(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export const store = {
  all(): Candidate[] {
    return readJSON<Candidate[]>(QUEUE, []);
  },
  byStatus(status: Candidate["status"]): Candidate[] {
    return this.all().filter((c) => c.status === status);
  },
  has(id: string): boolean {
    return this.all().some((c) => c.id === id);
  },
  /** Добавляет новых кандидатов (дедуп по id). Возвращает кол-во добавленных. */
  addMany(items: Candidate[]): number {
    const existing = this.all();
    const ids = new Set(existing.map((c) => c.id));
    const fresh = items.filter((c) => !ids.has(c.id));
    if (fresh.length) writeJSON(QUEUE, [...fresh, ...existing]);
    return fresh.length;
  },
  update(id: string, patch: Partial<Candidate>): Candidate | null {
    const all = this.all();
    const i = all.findIndex((c) => c.id === id);
    if (i < 0) return null;
    all[i] = { ...all[i], ...patch };
    writeJSON(QUEUE, all);
    return all[i];
  },
  remove(id: string) {
    writeJSON(
      QUEUE,
      this.all().filter((c) => c.id !== id)
    );
  },
  // история поисков (промпт → во что превратился)
  searches(): unknown[] {
    return readJSON<unknown[]>(SEARCHES, []);
  },
  logSearch(entry: unknown) {
    writeJSON(SEARCHES, [entry, ...this.searches()].slice(0, 100));
  },
};
