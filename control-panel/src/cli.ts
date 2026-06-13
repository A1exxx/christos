import { runSearch } from "./search.ts";

const prompt = process.argv.slice(2).join(" ") || "христианские футболки с крестом, минимализм, рейтинг 4.5+";
console.log("Поиск по промпту:", prompt);
const r = await runSearch(prompt);
console.log(JSON.stringify({ ...r, samples: r.samples.map((s) => `${s.title} [${s.category}]`) }, null, 2));
