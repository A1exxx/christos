import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config, ROOT } from "./config.ts";
import { store } from "./store.ts";
import { runSearch } from "./search.ts";
import { processPhoto } from "./photos.ts";
import { publish } from "./publish.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = Fastify({ logger: false });

// статика админки
await app.register(fastifyStatic, {
  root: path.join(ROOT, "public"),
  prefix: "/",
});
// превью обработанных фото
await app.register(fastifyStatic, {
  root: config.storefrontPublicDir,
  prefix: "/sourced/",
  decorateReply: false,
});

app.get("/api/status", async () => ({
  cj: config.cj.live ? "live" : "mock",
  llm: config.llm.live ? "live" : "эвристика",
  ideogram: config.ideogram.live ? "live" : "mock",
  counts: {
    pending: store.byStatus("pending").length,
    approved: store.byStatus("approved").length,
    rejected: store.byStatus("rejected").length,
  },
}));

app.post("/api/search", async (req) => {
  const { prompt } = (req.body as { prompt?: string }) || {};
  if (!prompt || !prompt.trim()) return { error: "empty prompt" };
  return await runSearch(prompt.trim());
});

app.get("/api/queue", async (req) => {
  const status = (req.query as { status?: string }).status as
    | "pending"
    | "approved"
    | "rejected"
    | undefined;
  return status ? store.byStatus(status) : store.all();
});

app.post("/api/moderate", async (req) => {
  const { id, action } = (req.body as { id?: string; action?: string }) || {};
  if (!id || !action) return { error: "id and action required" };
  if (action === "reject") return store.update(id, { status: "rejected" });
  if (action === "approve") {
    const c = store.all().find((x) => x.id === id);
    if (!c) return { error: "not found" };
    try {
      const { local, cut } = await processPhoto(c.id, c.imageOriginal);
      return store.update(id, { status: "approved", imageLocal: local, imageCut: cut });
    } catch (e) {
      // одобряем даже если фото не обработалось — пометим оригиналом
      console.warn("[moderate] photo error:", (e as Error).message);
      return store.update(id, { status: "approved" });
    }
  }
  return { error: "unknown action" };
});

app.post("/api/publish", async () => publish());

app.listen({ port: config.port, host: "0.0.0.0" }).then(() => {
  console.log(`\n  Christos control-panel → http://localhost:${config.port}`);
  console.log(`  CJ:${config.cj.live ? "live" : "mock"}  LLM:${config.llm.live ? "live" : "эвристика"}  Ideogram:${config.ideogram.live ? "live" : "mock"}\n`);
});
