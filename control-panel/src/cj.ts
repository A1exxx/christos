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
  const base: Array<Omit<RawProduct, "image">> = [
    { id: "mock-cross-tee-01", title: "Minimalist Cross Print Cotton T-Shirt Christian Faith", price: 6.8, currency: "USD", rating: 4.8, orders: 1240 },
    { id: "mock-cross-neck-02", title: "Stainless Steel Cross Pendant Necklace Christian", price: 3.2, currency: "USD", rating: 4.7, orders: 3100 },
    { id: "mock-faith-hoodie-03", title: "Faith Over Fear Embroidered Hoodie Unisex", price: 14.5, currency: "USD", rating: 4.6, orders: 540 },
    { id: "mock-ichthys-cap-04", title: "Ichthys Fish Embroidered Dad Hat Christian Cap", price: 5.1, currency: "USD", rating: 4.5, orders: 870 },
    { id: "mock-bracelet-05", title: "Braided Leather Cross Charm Bracelet Adjustable", price: 2.4, currency: "USD", rating: 4.4, orders: 2050 },
    { id: "mock-bibleverse-06", title: "Bible Verse Psalm Minimalist Tote Bag Canvas", price: 4.0, currency: "USD", rating: 4.6, orders: 410 },
    { id: "mock-grace-sweat-07", title: "Grace Lettering Oversized Sweatshirt Beige", price: 13.2, currency: "USD", rating: 4.7, orders: 320 },
    { id: "mock-cross-ring-08", title: "Titanium Cross Ring Minimalist Christian Jewelry", price: 2.9, currency: "USD", rating: 4.3, orders: 1500 },
    // нерелевантные — классификатор должен отсеять:
    { id: "mock-zodiac-09", title: "Zodiac Constellation Pendant Astrology Necklace", price: 3.5, currency: "USD", rating: 4.5, orders: 990 },
    { id: "mock-skull-10", title: "Gothic Skull Print Oversized Streetwear Tee", price: 7.7, currency: "USD", rating: 4.4, orders: 760 },
  ];
  // для mock используем наши реальные сгенерированные фото (на Pages), чтобы демо было осмысленным
  const PAGES = "https://a1exxx.github.io/christos/products";
  const imgMap: Record<string, string> = {
    "mock-cross-tee-01": `${PAGES}/grace.png`,
    "mock-cross-neck-02": `${PAGES}/pendant.png`,
    "mock-faith-hoodie-03": `${PAGES}/hoodie.png`,
    "mock-ichthys-cap-04": `${PAGES}/cap.png`,
    "mock-bracelet-05": `${PAGES}/bracelet.png`,
    "mock-bibleverse-06": `${PAGES}/tote.png`,
    "mock-grace-sweat-07": `${PAGES}/pax.png`,
    "mock-cross-ring-08": `${PAGES}/sol.png`,
  };
  return base
    .filter((p) => (cfg.maxPriceUsd ? p.price <= cfg.maxPriceUsd : true))
    .filter((p) => (p.rating ?? 5) >= cfg.minRating)
    .filter((p) => (p.orders ?? 0) >= cfg.minOrders)
    .map((p) => ({ ...p, image: imgMap[p.id] || `https://picsum.photos/seed/${p.id}/640/800` }));
}
