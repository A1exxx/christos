import { config } from "./config.ts";
import type { SearchConfig } from "./llm.ts";

export type RawProduct = {
  id: string;
  title: string;
  price: number;
  currency: string;
  rating?: number;
  orders?: number;
  image: string;
  url?: string;
};

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";
let tokenCache: { token: string; exp: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.exp > Date.now()) return tokenCache.token;
  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: config.cj.email, apiKey: config.cj.apiKey }),
  });
  if (!res.ok) throw new Error(`CJ auth ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { data?: { accessToken: string } };
  const token = data.data?.accessToken;
  if (!token) throw new Error("CJ auth: no accessToken");
  tokenCache = { token, exp: Date.now() + 13 * 24 * 3600_000 }; // ~13 дней
  return token;
}

async function cjSearch(keyword: string, token: string): Promise<RawProduct[]> {
  const url = new URL(`${CJ_BASE}/product/list`);
  url.searchParams.set("pageNum", "1");
  url.searchParams.set("pageSize", "20");
  url.searchParams.set("productNameEn", keyword);
  const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
  if (!res.ok) throw new Error(`CJ search ${res.status}`);
  const data = (await res.json()) as {
    data?: { list?: Array<Record<string, unknown>> };
  };
  const list = data.data?.list ?? [];
  return list.map((p) => ({
    id: String(p.pid ?? p.productSku ?? p.productId ?? cryptoRandom()),
    title: String(p.productNameEn ?? p.productName ?? "Untitled"),
    price: Number(p.sellPrice ?? p.price ?? 0),
    currency: "USD",
    rating: p.listedNum ? undefined : undefined,
    orders: Number(p.listedNum ?? 0) || undefined,
    image: String(p.productImage ?? (Array.isArray(p.productImageSet) ? p.productImageSet[0] : "")),
    url: p.productUrl ? String(p.productUrl) : undefined,
  }));
}

function cryptoRandom() {
  return Math.random().toString(36).slice(2, 10);
}

/** Поиск по конфигу: реальный CJ или mock. */
export async function searchCJ(cfg: SearchConfig): Promise<{ products: RawProduct[]; mode: "live" | "mock" }> {
  if (config.cj.live) {
    try {
      const token = await getToken();
      const seen = new Set<string>();
      const out: RawProduct[] = [];
      for (const kw of cfg.keywords) {
        for (const p of await cjSearch(kw, token)) {
          if (!seen.has(p.id)) {
            seen.add(p.id);
            out.push(p);
          }
        }
      }
      return { products: out, mode: "live" };
    } catch (e) {
      console.warn("[cj] live failed, fallback to mock:", (e as Error).message);
    }
  }
  return { products: mockProducts(cfg), mode: "mock" };
}

/** Mock: правдоподобные кандидаты (с парой нерелевантных — проверить классификатор). */
function mockProducts(cfg: SearchConfig): RawProduct[] {
  // каждое название ТОЧНО соответствует своему фото (наши сгенерированные фото на Pages)
  const PAGES = "https://a1exxx.github.io/christos/products";
  const base: Array<Omit<RawProduct, "image"> & { img: string }> = [
    { id: "mock-grace", title: "Minimalist Cross Print Cotton T-Shirt — White", price: 6.8, currency: "USD", rating: 4.8, orders: 1240, img: "grace.png" },
    { id: "mock-lumen", title: "Lumen Light Grey Christian T-Shirt", price: 6.4, currency: "USD", rating: 4.7, orders: 980, img: "lumen.png" },
    { id: "mock-ichthys", title: "Ichthys Fish Symbol Cotton T-Shirt — Sand", price: 6.9, currency: "USD", rating: 4.6, orders: 1110, img: "ichthys.png" },
    { id: "mock-hoodie", title: "Faith Cross Embroidered Hoodie — Charcoal", price: 14.5, currency: "USD", rating: 4.7, orders: 540, img: "hoodie.png" },
    { id: "mock-pax", title: "Pax Cream Sweatshirt with Embroidered Cross", price: 12.2, currency: "USD", rating: 4.6, orders: 470, img: "pax.png" },
    { id: "mock-sol", title: "Agnus Sand Crewneck Sweatshirt — Cross", price: 12.9, currency: "USD", rating: 4.5, orders: 360, img: "sol.png" },
    { id: "mock-cap", title: "Cross Embroidered Dad Cap — Beige", price: 5.1, currency: "USD", rating: 4.6, orders: 870, img: "cap.png" },
    { id: "mock-tote", title: "Bible Verse Canvas Tote Bag — Natural", price: 4.0, currency: "USD", rating: 4.6, orders: 410, img: "tote.png" },
    { id: "mock-bracelet", title: "Braided Cord Cross Charm Bracelet", price: 2.4, currency: "USD", rating: 4.7, orders: 2050, img: "bracelet.png" },
    { id: "mock-pendant", title: "Silver Cross Pendant Necklace — Minimalist", price: 3.2, currency: "USD", rating: 4.8, orders: 3100, img: "pendant.png" },
    // нерелевантные — классификатор должен отсеять (фото-заглушка, в очередь не попадут):
    { id: "mock-zodiac", title: "Zodiac Constellation Astrology Pendant Necklace", price: 3.5, currency: "USD", rating: 4.5, orders: 990, img: "" },
    { id: "mock-skull", title: "Gothic Skull Print Oversized Streetwear Tee", price: 7.7, currency: "USD", rating: 4.6, orders: 760, img: "" },
  ];
  return base
    .filter((p) => (cfg.maxPriceUsd ? p.price <= cfg.maxPriceUsd : true))
    .filter((p) => (p.rating ?? 5) >= cfg.minRating)
    .filter((p) => (p.orders ?? 0) >= cfg.minOrders)
    .map(({ img, ...p }) => ({
      ...p,
      image: img ? `${PAGES}/${img}` : `https://picsum.photos/seed/${p.id}/640/800`,
    }));
}
