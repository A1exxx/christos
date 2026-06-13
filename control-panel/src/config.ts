import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");
export const DATA_DIR = path.join(ROOT, "data");

// Лёгкий парсер .env (без зависимостей)
function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
loadEnv();

export const config = {
  port: Number(process.env.PORT || 4317),
  cj: {
    email: process.env.CJ_EMAIL || "",
    apiKey: process.env.CJ_API_KEY || "",
    get live() {
      return Boolean(this.email && this.apiKey);
    },
  },
  llm: {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    model: process.env.LLM_MODEL || "claude-haiku-4-5-20251001",
    get live() {
      return Boolean(this.apiKey);
    },
  },
  ideogram: {
    apiKey: process.env.IDEOGRAM_API_KEY || "",
    get live() {
      return Boolean(this.apiKey);
    },
  },
  storefrontCatalog: path.resolve(
    ROOT,
    process.env.STOREFRONT_CATALOG || "../src/lib/catalog.generated.json"
  ),
  storefrontPublicDir: path.resolve(ROOT, "../public/products/sourced"),
};

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
