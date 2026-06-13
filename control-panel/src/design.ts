import fs from "node:fs";
import path from "node:path";
import { config, ROOT } from "./config.ts";

const DESIGNS_DIR = path.join(ROOT, "public", "designs");

export type DesignResult = { image: string; mode: "live" | "mock"; note?: string };

/**
 * Промпт → принт. С ключом Ideogram — реальная генерация (прозрачный фон).
 * Без ключа — подбор из образцов по ключевым словам (демо).
 */
export async function generateDesign(prompt: string): Promise<DesignResult> {
  if (config.ideogram.live) {
    try {
      const img = await ideogram(prompt);
      return { image: img, mode: "live" };
    } catch (e) {
      console.warn("[design] ideogram failed, mock:", (e as Error).message);
    }
  }
  // mock: выбрать образец по теме
  const p = prompt.toLowerCase();
  let file = "cross.png";
  if (/(рыб|fish|ихтис|ichthys)/.test(p)) file = "ichthys.png";
  const exists = fs.existsSync(path.join(DESIGNS_DIR, file));
  return {
    image: `/designs/${exists ? file : "cross.png"}`,
    mode: "mock",
    note: "Демо-режим: подключите ключ Ideogram для генерации по вашему промпту.",
  };
}

/** Ideogram v3 generate (прозрачный фон). Возвращает URL изображения. */
async function ideogram(prompt: string): Promise<string> {
  const form = new FormData();
  form.set("prompt", `${prompt}. Minimalist screen-print design, transparent background, clean vector-like lines, no extra text.`);
  form.set("rendering_speed", "DEFAULT");
  const res = await fetch("https://api.ideogram.ai/v1/ideogram-v3/generate", {
    method: "POST",
    headers: { "Api-Key": config.ideogram.apiKey },
    body: form,
  });
  if (!res.ok) throw new Error(`ideogram ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { data?: { url: string }[] };
  const url = data.data?.[0]?.url;
  if (!url) throw new Error("ideogram: no image");
  // скачиваем к себе, чтобы отдавать стабильно
  if (!fs.existsSync(DESIGNS_DIR)) fs.mkdirSync(DESIGNS_DIR, { recursive: true });
  const name = `gen-${Date.now()}.png`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(path.join(DESIGNS_DIR, name), buf);
  return `/designs/${name}`;
}
