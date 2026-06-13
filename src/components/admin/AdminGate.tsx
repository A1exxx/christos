"use client";

import { useState } from "react";

export function AdminGate() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (r.ok) location.reload();
    else setErr(true);
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-sm flex-col justify-center px-5">
      <h1 className="font-display text-3xl">Панель управления</h1>
      <p className="mt-2 text-[14px] text-muted">Вход для администратора.</p>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <input
          type="password"
          autoFocus
          placeholder="Пароль"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="rounded-md border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-foreground"
        />
        {err && <p className="text-sm text-red-600">Неверный пароль.</p>}
        <button disabled={busy} className="rounded-md bg-foreground py-3 text-sm text-background disabled:opacity-50">
          {busy ? "Входим…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
