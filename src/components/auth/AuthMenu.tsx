"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type User = { name: string; email: string } | null;

export function AuthMenu() {
  const [user, setUser] = useState<User>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const r = await fetch("/api/auth/me");
      const d = await r.json();
      setUser(d.user);
    } catch {}
  }
  useEffect(() => {
    refresh();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (r.ok) {
        await refresh();
        setOpen(false);
      }
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link href="/account" className="text-muted transition-colors hover:text-foreground">
          {user.name}
        </Link>
        <button onClick={logout} className="text-[12px] text-muted/70 hover:text-foreground" title="Выйти">
          выйти
        </button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-sm text-muted transition-colors hover:text-foreground">
        Войти
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[300] bg-foreground/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 z-[301] w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-7 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: "-46%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-2xl">Вход</h2>
              <p className="mt-1 text-[13px] text-muted">Войдите, чтобы оформлять заказы и записываться на события.</p>

              <button
                type="button"
                onClick={() => alert("Вход через Google подключим вместе с ключами. Пока используйте быстрый вход по email ниже.")}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm transition-colors hover:border-foreground"
              >
                <span aria-hidden>G</span> Войти через Google
              </button>
              <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-muted/60">
                <span className="h-px flex-1 bg-border" />или<span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={login} className="grid gap-3">
                <input
                  placeholder="Имя"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
                />
                <button disabled={busy} className="rounded-md bg-foreground py-2.5 text-sm text-background disabled:opacity-50">
                  {busy ? "Входим…" : "Продолжить"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
