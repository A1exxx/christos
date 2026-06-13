"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number; // THB
  image: string;
  size?: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, size: string | undefined, qty: number) => void;
  remove: (id: string, size?: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "christos.cart";
const lineKey = (id: string, size?: string) => `${id}::${size ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setItems(JSON.parse(s));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartCtx["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const k = lineKey(item.id, item.size);
      const i = prev.findIndex((x) => lineKey(x.id, x.size) === k);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
    setOpen(true);
  };
  const setQty: CartCtx["setQty"] = (id, size, qty) =>
    setItems((prev) =>
      prev
        .map((x) => (lineKey(x.id, x.size) === lineKey(id, size) ? { ...x, qty } : x))
        .filter((x) => x.qty > 0)
    );
  const remove: CartCtx["remove"] = (id, size) =>
    setItems((prev) => prev.filter((x) => lineKey(x.id, x.size) !== lineKey(id, size)));
  const clear = () => setItems([]);

  const count = items.reduce((s, x) => s + x.qty, 0);
  const total = items.reduce((s, x) => s + x.qty * x.price, 0);

  return (
    <Ctx.Provider value={{ items, count, total, open, setOpen, add, setQty, remove, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
