"use client";

import { useState } from "react";

export function EventRegisterButton({ event }: { event: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "auth">("idle");

  async function register() {
    setState("busy");
    const r = await fetch("/api/events/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event }),
    });
    if (r.status === 401) {
      setState("auth");
      return;
    }
    setState(r.ok ? "done" : "idle");
  }

  if (state === "done")
    return (
      <span className="inline-flex w-fit items-center justify-center rounded-md border border-border px-6 py-3 text-sm text-muted md:w-auto">
        ✓ Вы записаны
      </span>
    );

  return (
    <button
      type="button"
      onClick={register}
      disabled={state === "busy"}
      className="inline-flex w-fit items-center justify-center rounded-md bg-foreground px-6 py-3 text-sm text-background transition-transform active:scale-[0.98] disabled:opacity-50 md:w-auto"
    >
      {state === "busy" ? "…" : state === "auth" ? "Войдите, чтобы записаться" : "Записаться"}
    </button>
  );
}
