"use client";

import { useCart } from "./CartContext";

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="text-sm text-muted transition-colors hover:text-foreground"
    >
      Сумка <span className="tabular-nums">({count})</span>
    </button>
  );
}
