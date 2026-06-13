"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

const fmt = new Intl.NumberFormat("ru-RU");

export default function CheckoutPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [orderId, setOrderId] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, size: i.size })),
          total,
          contact: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrderId(data.id);
      setState("done");
      clear();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center md:py-36">
        <h1 className="font-display text-4xl">Спасибо!</h1>
        <p className="mt-4 text-muted">
          Заказ <b className="text-foreground">{orderId}</b> принят. Мы свяжемся с вами для
          подтверждения и оплаты.
        </p>
        <Link href="/" className="mt-8 inline-block rounded-md bg-foreground px-7 py-3.5 text-sm text-background">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-8 md:py-24">
      <Link href="/" className="text-sm text-muted hover:text-foreground">&larr; Назад</Link>
      <h1 className="font-display mt-4 text-4xl md:text-5xl">Оформление заказа</h1>

      {items.length === 0 ? (
        <p className="mt-10 text-muted">Сумка пуста. <Link href="/" className="text-foreground underline-offset-4 hover:underline">Вернуться к товарам</Link>.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.8fr]">
          {/* Форма */}
          <form onSubmit={submit} className="order-2 lg:order-1">
            <h2 className="eyebrow">Контакты</h2>
            <div className="mt-5 grid gap-4">
              <Field label="Имя" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Телефон / WhatsApp" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="Email (необязательно)" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <label className="grid gap-1.5">
                <span className="text-[13px] text-muted">Комментарий к заказу</span>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
                />
              </label>
            </div>
            {state === "error" && <p className="mt-3 text-sm text-red-600">Не удалось отправить. Попробуйте ещё раз.</p>}
            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-6 w-full rounded-md bg-foreground py-3.5 text-sm text-background transition-transform active:scale-[0.99] disabled:opacity-50"
            >
              {state === "sending" ? "Отправляем…" : "Оформить заказ"}
            </button>
            <p className="mt-3 text-center text-[12px] text-muted">
              Оплата подключается позже — сейчас мы свяжемся с вами для подтверждения.
            </p>
          </form>

          {/* Сводка */}
          <aside className="order-1 lg:order-2">
            <h2 className="eyebrow">Заказ</h2>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {items.map((it) => (
                <div key={`${it.id}-${it.size}`} className="flex gap-3 py-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-surface">
                    <Image src={it.image} alt={it.name} fill className="object-contain" sizes="64px" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-display text-[14px] leading-tight">{it.name}</span>
                    {it.size && <span className="text-[12px] text-muted">{it.size}</span>}
                    <div className="mt-auto flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => setQty(it.id, it.size, it.qty - 1)} className="h-6 w-6 rounded border border-border">−</button>
                        <span className="w-5 text-center tabular-nums">{it.qty}</span>
                        <button type="button" onClick={() => setQty(it.id, it.size, it.qty + 1)} className="h-6 w-6 rounded border border-border">+</button>
                        <button type="button" onClick={() => remove(it.id, it.size)} className="ml-2 text-[12px] text-muted hover:text-foreground">удалить</button>
                      </div>
                      <span className="tabular-nums text-muted">{fmt.format(it.price * it.qty)} ฿</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-muted">Итого</span>
              <span className="font-display text-2xl tabular-nums">{fmt.format(total)} ฿</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[13px] text-muted">{label}{required && " *"}</span>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
      />
    </label>
  );
}
