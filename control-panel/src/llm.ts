import { config } from "./config.ts";

/** Прямой вызов Anthropic Messages API без SDK. Возвращает текст. */
async function anthropic(system: string, user: string, maxTokens = 512): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.llm.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.llm.model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { content: { text: string }[] };
  return data.content.map((c) => c.text).join("");
}

function extractJSON<T>(text: string): T {
  const m = text.match(/\{[\s\S]*\}/);
  return JSON.parse(m ? m[0] : text) as T;
}

export type SearchConfig = {
  keywords: string[]; // англ. ключевые слова для CJ
  minRating: number;
  minOrders: number;
  maxPriceUsd: number | null;
  category: "Одежда" | "Аксессуары" | "Другое" | "any";
  excludeWords: string[];
};

const HEURISTIC_KEYWORDS: Record<string, string[]> = {
  крест: ["cross necklace", "cross pendant", "cross bracelet"],
  футбол: ["christian t-shirt", "faith t-shirt cross"],
  худи: ["christian hoodie", "faith hoodie"],
  кепк: ["christian cap cross", "faith hat"],
  браслет: ["cross bracelet", "christian bracelet"],
  рыб: ["ichthys fish christian"],
  библ: ["bible verse shirt"],
};

/** Промпт куратора → структурированный поисковый запрос. */
export async function promptToSearch(prompt: string): Promise<SearchConfig> {
  if (config.llm.live) {
    try {
      const text = await anthropic(
        `Ты помощник для поиска христианских товаров на дропшиппинг-площадке CJ Dropshipping.
По запросу куратора (на русском) верни ТОЛЬКО JSON с полями:
keywords (массив 3-6 англ. поисковых фраз), minRating (число 0-5), minOrders (целое),
maxPriceUsd (число или null), category ("Одежда"|"Аксессуары"|"Другое"|"any"), excludeWords (массив англ. слов-исключений).
Фокус на христианской/религиозной тематике, современный минимализм, без китчевых/кричащих изделий.`,
        prompt
      );
      const cfg = extractJSON<SearchConfig>(text);
      if (Array.isArray(cfg.keywords) && cfg.keywords.length) return normalize(cfg);
    } catch (e) {
      console.warn("[llm] promptToSearch fallback:", (e as Error).message);
    }
  }
  // эвристика
  const lower = prompt.toLowerCase();
  const kws = new Set<string>();
  for (const [stem, list] of Object.entries(HEURISTIC_KEYWORDS))
    if (lower.includes(stem)) list.forEach((k) => kws.add(k));
  if (!kws.size) ["christian cross", "faith apparel", "religious gift"].forEach((k) => kws.add(k));
  const priceM = lower.match(/(\d+)\s*(usd|\$|долл)/);
  return normalize({
    keywords: [...kws],
    minRating: /рейтинг|качеств|хорош/.test(lower) ? 4.5 : 4.0,
    minOrders: 10,
    maxPriceUsd: priceM ? Number(priceM[1]) : null,
    category: /футбол|худи|свитшот|одежд/.test(lower)
      ? "Одежда"
      : /браслет|кепк|кулон|аксессуар|цепоч/.test(lower)
        ? "Аксессуары"
        : "any",
    excludeWords: ["kids toy", "sticker", "tattoo"],
  });
}

function normalize(c: SearchConfig): SearchConfig {
  return {
    keywords: c.keywords.slice(0, 6),
    minRating: Math.min(5, Math.max(0, c.minRating ?? 4)),
    minOrders: Math.max(0, c.minOrders ?? 0),
    maxPriceUsd: c.maxPriceUsd ?? null,
    category: c.category ?? "any",
    excludeWords: c.excludeWords ?? [],
  };
}

export type Classification = { christian: boolean; reason: string; confidence: number };

const CHRISTIAN_POS = [
  "cross", "christ", "christian", "jesus", "faith", "bible", "ichthys",
  "prayer", "gospel", "holy", "grace", "scripture", "psalm", "blessed",
];
const CHRISTIAN_NEG = ["gothic skull", "satan", "occult", "tarot", "zodiac", "buddha", "hindu"];

/** Классификатор: христианский ли товар. */
export async function classify(title: string): Promise<Classification> {
  if (config.llm.live) {
    try {
      const text = await anthropic(
        `Определи, является ли товар христианским/религиозно-христианским по названию.
Верни ТОЛЬКО JSON: {"christian": true|false, "reason": "<кратко по-русски>", "confidence": 0..1}.`,
        title,
        200
      );
      return extractJSON<Classification>(text);
    } catch (e) {
      console.warn("[llm] classify fallback:", (e as Error).message);
    }
  }
  const t = title.toLowerCase();
  if (CHRISTIAN_NEG.some((w) => t.includes(w)))
    return { christian: false, reason: "нехристианская символика", confidence: 0.8 };
  const hit = CHRISTIAN_POS.find((w) => t.includes(w));
  return hit
    ? { christian: true, reason: `совпадение по «${hit}»`, confidence: 0.7 }
    : { christian: false, reason: "нет христианских маркеров в названии", confidence: 0.6 };
}
