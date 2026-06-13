import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { config, ROOT } from "./config.ts";

const SOURCED = config.storefrontPublicDir; // ../public/products/sourced
const CUT_SCRIPT = path.join(ROOT, "scripts", "cut_one.py");

function ensure() {
  if (!fs.existsSync(SOURCED)) fs.mkdirSync(SOURCED, { recursive: true });
}

async function download(url: string, dest: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function runPython(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn("python", args, { cwd: ROOT });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err || `python exit ${code}`))));
  });
}

/**
 * Готовит фото товара для витрины: скачивает оригинал и вырезает фон.
 * Возвращает относительные пути для витрины (/products/sourced/...).
 */
export async function processPhoto(id: string, imageUrl: string): Promise<{ local: string; cut: string }> {
  ensure();
  const safe = id.replace(/[^a-z0-9_-]/gi, "_");
  const localAbs = path.join(SOURCED, `${safe}.png`);
  const cutAbs = path.join(SOURCED, `${safe}-cut.png`);

  await download(imageUrl, localAbs);
  try {
    await runPython([CUT_SCRIPT, localAbs, cutAbs]);
  } catch (e) {
    console.warn("[photos] cutout failed, using original:", (e as Error).message);
    fs.copyFileSync(localAbs, cutAbs);
  }
  return { local: `/products/sourced/${safe}.png`, cut: `/products/sourced/${safe}-cut.png` };
}
