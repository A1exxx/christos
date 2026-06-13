"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartContext";

const fmt = new Intl.NumberFormat("ru-RU");
const ease = [0.16, 1, 0.3, 1] as const;

export function CartDrawer() {
  const { items, total, open, setOpen, setQty, remove } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-foreground/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[201] flex h-dvh w-full max-w-md flex-col bg-background shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease }}
            role="dialog"
            aria-label="Корзина"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-xl">Сумка</h2>
              <button onClick={() => setOpen(false)} className="text-sm text-muted hover:text-foreground" aria-label="Закрыть">
                Закрыть
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-muted">Сумка пуста.</p>
                <button onClick={() => setOpen(false)} className="text-sm text-foreground underline-offset-4 hover:underline">
                  Вернуться к товарам
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((it) => (
                    <div key={`${it.id}-${it.size}`} className="flex gap-4 border-b border-border py-4 last:border-0">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-surface">
                        <Image src={it.image} alt={it.name} fill className="object-contain" sizes="80px" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <span className="font-display text-[15px] leading-tight">{it.name}</span>
                          <button onClick={() => remove(it.id, it.size)} className="text-[12px] text-muted hover:text-foreground">
                            ✕
                          </button>
                        </div>
                        {it.size && <span className="mt-0.5 text-[12px] text-muted">{it.size}</span>}
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <button onClick={() => setQty(it.id, it.size, it.qty - 1)} className="h-7 w-7 rounded border border-border hover:border-foreground">−</button>
                            <span className="w-6 text-center tabular-nums">{it.qty}</span>
                            <button onClick={() => setQty(it.id, it.size, it.qty + 1)} className="h-7 w-7 rounded border border-border hover:border-foreground">+</button>
                          </div>
                          <span className="text-sm tabular-nums text-muted">{fmt.format(it.price * it.qty)} ฿</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-muted">Итого</span>
                    <span className="font-display text-xl tabular-nums">{fmt.format(total)} ฿</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-md bg-foreground py-3.5 text-center text-sm text-background transition-transform active:scale-[0.99]"
                  >
                    Оформить заказ
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
