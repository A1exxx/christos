import { promptToSearch, classify } from "./llm.ts";
import { searchCJ } from "./cj.ts";
import { store, type Candidate } from "./store.ts";

function inferCategory(title: string): Candidate["category"] {
  const t = title.toLowerCase();
  // аксессуары проверяем первыми: точные слова с границами
  if (/\b(necklace|bracelet|ring|cap|hat|beanie|bag|tote|pendant|earrings?|keychain|charm|wristband)\b/.test(t))
    return "Аксессуары";
  if (/\b(t-?shirt|tee|hoodie|sweatshirt|sweater|shirt|jacket|joggers|pants|dress|longsleeve|crewneck)\b/.test(t))
    return "Одежда";
  return "Другое";
}

export type SearchResult = {
  prompt: string;
  searchConfig: unknown;
  mode: "live" | "mock";
  found: number;
  christian: number;
  added: number;
  rejected: number;
  sample: Candidate[];
};

/**
 * Полный цикл: промпт → поисковый конфиг → поиск CJ → классификация →
 * добавление христианских в очередь модерации (нерелевантные отсекаются).
 */
export async function runSearch(prompt: string): Promise<SearchResult> {
  const cfg = await promptToSearch(prompt);
  const { products, mode } = await searchCJ(cfg);

  const candidates: Candidate[] = [];
  let rejected = 0;

  for (const p of products) {
    const cls = await classify(p.title);
    if (!cls.christian) {
      rejected++;
      continue;
    }
    candidates.push({
      id: `${p.id}`,
      source: "cj",
      title: p.title,
      price: p.price,
      currency: p.currency,
      rating: p.rating,
      orders: p.orders,
      category: (() => {
        const inferred = inferCategory(p.title);
        if (inferred !== "Другое") return inferred;
        return cfg.category !== "any" ? cfg.category : "Другое";
      })(),
      imageOriginal: p.image,
      url: p.url,
      status: "pending",
      classification: cls,
      searchPrompt: prompt,
      createdAt: Date.now(),
    });
  }

  const added = store.addMany(candidates);
  const result: SearchResult = {
    prompt,
    searchConfig: cfg,
    mode,
    found: products.length,
    christian: candidates.length,
    added,
    rejected,
    sample: candidates.slice(0, 5),
  };
  store.logSearch({ ...result, sample: undefined, at: Date.now() });
  return result;
}
