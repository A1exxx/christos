import { promptToSearch, classify, type SearchConfig } from "./llm.ts";
import { searchCJ } from "./cj.ts";
import { store, type Candidate } from "./store.ts";

function inferCategory(title: string): Candidate["category"] {
  const t = title.toLowerCase();
  if (/\b(necklace|bracelet|ring|cap|hat|beanie|bag|tote|pendant|earrings?|keychain|charm|wristband)\b/.test(t))
    return "Аксессуары";
  if (/\b(t-?shirt|tee|hoodie|sweatshirt|sweater|shirt|jacket|joggers|pants|dress|longsleeve|crewneck)\b/.test(t))
    return "Одежда";
  return "Другое";
}

/** Прогон поиска: промпт → конфиг → CJ → классификация. БЕЗ записи в очередь. */
async function gather(prompt: string) {
  const cfg: SearchConfig = await promptToSearch(prompt);
  const { products, mode } = await searchCJ(cfg);
  const candidates: Candidate[] = [];
  let rejected = 0;
  for (const p of products) {
    const cls = await classify(p.title);
    if (!cls.christian) {
      rejected++;
      continue;
    }
    const inferred = inferCategory(p.title);
    candidates.push({
      id: `${p.id}`,
      source: "cj",
      title: p.title,
      price: p.price,
      currency: p.currency,
      rating: p.rating,
      orders: p.orders,
      category: inferred !== "Другое" ? inferred : cfg.category !== "any" ? cfg.category : "Другое",
      imageOriginal: p.image,
      url: p.url,
      status: "pending",
      classification: cls,
      searchPrompt: prompt,
      createdAt: Date.now(),
    });
  }
  return { cfg, mode, found: products.length, candidates, rejected };
}

export type PreviewResult = {
  prompt: string;
  searchConfig: SearchConfig;
  mode: "live" | "mock";
  found: number;
  christian: number;
  samples: Candidate[];
};

/** Ступень 1 — одобрение направления: приносим несколько примеров, НЕ кладём в очередь. */
export async function previewSearch(prompt: string, limit = 3): Promise<PreviewResult> {
  const { cfg, mode, found, candidates } = await gather(prompt);
  return { prompt, searchConfig: cfg, mode, found, christian: candidates.length, samples: candidates.slice(0, limit) };
}

export type SearchResult = PreviewResult & { added: number; rejected: number };

/** Ступень 2 — направление одобрено: полный прогон, всё христианское в очередь модерации. */
export async function runSearch(prompt: string): Promise<SearchResult> {
  const { cfg, mode, found, candidates, rejected } = await gather(prompt);
  const added = store.addMany(candidates);
  const result: SearchResult = {
    prompt,
    searchConfig: cfg,
    mode,
    found,
    christian: candidates.length,
    samples: candidates.slice(0, 5),
    added,
    rejected,
  };
  store.logSearch({ prompt, mode, found, christian: candidates.length, added, rejected, at: Date.now() });
  return result;
}
