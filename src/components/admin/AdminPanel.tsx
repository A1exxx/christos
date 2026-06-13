"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Field = { k: string; l: string; type?: "number" | "textarea" | "select" | "bool" | "list"; options?: string[] };
type Item = Record<string, any>;

const SCHEMAS: Record<string, { label: string; primary: string; fields: Field[] }> = {
  products: {
    label: "Товары",
    primary: "name",
    fields: [
      { k: "name", l: "Название" },
      { k: "price", l: "Цена (฿)", type: "number" },
      { k: "category", l: "Категория", type: "select", options: ["Одежда", "Аксессуары"] },
      { k: "image", l: "Фото (URL или /products/...)" },
      { k: "sizes", l: "Размеры (через запятую)", type: "list" },
      { k: "collection", l: "Коллекция" },
      { k: "description", l: "Описание", type: "textarea" },
      { k: "material", l: "Состав" },
      { k: "limited", l: "Лимитная серия", type: "bool" },
    ],
  },
  services: {
    label: "Услуги",
    primary: "name",
    fields: [
      { k: "name", l: "Название" },
      { k: "tagline", l: "Подзаголовок" },
      { k: "price", l: "Цена (текст)" },
      { k: "description", l: "Описание", type: "textarea" },
      { k: "note", l: "Уточнение (необязательно)", type: "textarea" },
    ],
  },
  events: {
    label: "События",
    primary: "title",
    fields: [
      { k: "title", l: "Название" },
      { k: "date", l: "Дата/время" },
      { k: "place", l: "Место" },
      { k: "desc", l: "Описание", type: "textarea" },
      { k: "registerUrl", l: "Ссылка (Telegram/форма)" },
    ],
  },
  courses: {
    label: "Курсы",
    primary: "title",
    fields: [
      { k: "title", l: "Название" },
      { k: "group", l: "Категория" },
      { k: "lessons", l: "Уроков", type: "number" },
      { k: "url", l: "Ссылка на курс" },
      { k: "desc", l: "Описание", type: "textarea" },
    ],
  },
};

const TYPES = ["products", "services", "events", "courses"] as const;

export function AdminPanel({ panelUrl }: { panelUrl: string }) {
  const [tab, setTab] = useState<string>("products");
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null); // null = нет формы; {} = новый

  const isEngine = tab === "engine";
  const schema = SCHEMAS[tab];

  const load = useCallback(async (t: string) => {
    if (t === "engine") return;
    const r = await fetch(`/api/admin/content?type=${t}`);
    const d = await r.json();
    setItems(d.items || []);
  }, []);

  useEffect(() => {
    load(tab);
    setEditing(null);
  }, [tab, load]);

  function startNew() {
    const blank: Item = {};
    schema.fields.forEach((f) => (blank[f.k] = f.type === "bool" ? false : f.type === "list" ? "" : ""));
    setEditing(blank);
  }
  function startEdit(it: Item) {
    const e: Item = { ...it };
    schema.fields.forEach((f) => {
      if (f.type === "list" && Array.isArray(e[f.k])) e[f.k] = e[f.k].join(", ");
    });
    setEditing(e);
  }

  async function save() {
    if (!editing) return;
    const payload: Item = { ...editing };
    schema.fields.forEach((f) => {
      if (f.type === "number") payload[f.k] = Number(payload[f.k]) || 0;
      if (f.type === "list") payload[f.k] = String(payload[f.k] || "").split(",").map((s) => s.trim()).filter(Boolean);
      if (f.type === "bool") payload[f.k] = Boolean(payload[f.k]);
    });
    if (payload.id) {
      await fetch("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ type: tab, id: payload.id, patch: payload }) });
    } else {
      await fetch("/api/admin/content", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ type: tab, item: payload }) });
    }
    setEditing(null);
    load(tab);
  }
  async function del(id: string) {
    if (!confirm("Удалить эту позицию?")) return;
    await fetch(`/api/admin/content?type=${tab}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    load(tab);
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background text-foreground">
      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border px-5 py-3">
        <span className="font-display tracking-[0.18em]">CHRISTOS · АДМИН</span>
        <nav className="flex flex-wrap gap-1">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md px-3 py-1.5 text-sm ${tab === t ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}>
              {SCHEMAS[t].label}
            </button>
          ))}
          <button onClick={() => setTab("engine")} className={`rounded-md px-3 py-1.5 text-sm ${isEngine ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}>
            Движок (парсер · дизайн)
          </button>
        </nav>
        <div className="ml-auto flex items-center gap-4 text-[13px]">
          <Link href="/" className="text-muted hover:text-foreground">← на сайт</Link>
          <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); location.reload(); }} className="text-muted hover:text-foreground">Выйти</button>
        </div>
      </header>

      {isEngine ? (
        <iframe src={panelUrl} className="flex-1 w-full border-0" title="Движок" />
      ) : (
        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 flex items-center justify-between">
              <h1 className="font-display text-2xl">{schema.label}</h1>
              {!editing && (
                <button onClick={startNew} className="rounded-md bg-foreground px-4 py-2 text-sm text-background">+ Добавить</button>
              )}
            </div>

            {editing && (
              <div className="mb-6 rounded-lg border border-border bg-surface p-5">
                <h2 className="mb-4 font-display text-lg">{editing.id ? "Редактирование" : "Новая позиция"}</h2>
                <div className="grid gap-3">
                  {schema.fields.map((f) => (
                    <label key={f.k} className="grid gap-1">
                      <span className="text-[12px] text-muted">{f.l}</span>
                      {f.type === "textarea" ? (
                        <textarea rows={2} value={editing[f.k] ?? ""} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground" />
                      ) : f.type === "select" ? (
                        <select value={editing[f.k] ?? ""} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                          <option value="">—</option>
                          {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : f.type === "bool" ? (
                        <input type="checkbox" checked={!!editing[f.k]} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.checked })} className="h-4 w-4" />
                      ) : (
                        <input type={f.type === "number" ? "number" : "text"} value={editing[f.k] ?? ""} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground" />
                      )}
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={save} className="rounded-md bg-foreground px-5 py-2 text-sm text-background">Сохранить</button>
                  <button onClick={() => setEditing(null)} className="rounded-md border border-border px-5 py-2 text-sm">Отмена</button>
                </div>
              </div>
            )}

            <div className="divide-y divide-border rounded-lg border border-border bg-surface">
              {items.length === 0 && <p className="p-5 text-sm text-muted">Пусто. Нажми «Добавить».</p>}
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-display">{it[schema.primary] || it.id}</p>
                    <p className="truncate text-[12px] text-muted">
                      {tab === "products" && `${it.price} ฿ · ${it.category || "—"}`}
                      {tab === "services" && it.tagline}
                      {tab === "events" && `${it.date} · ${it.place}`}
                      {tab === "courses" && `${it.group} · ${it.lessons || "?"} уроков`}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => startEdit(it)} className="rounded-md border border-border px-3 py-1.5 text-[13px] hover:border-foreground">Изменить</button>
                    <button onClick={() => del(it.id)} className="rounded-md border border-border px-3 py-1.5 text-[13px] text-red-600 hover:border-red-400">Удалить</button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[12px] text-muted">
              Изменения сразу попадают на сайт (витрина читает этот контент). Для товаров из парсера и дизайн-студии — вкладка «Движок».
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
