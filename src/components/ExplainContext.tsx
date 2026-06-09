"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ExplainContextValue = {
  /** true → показывать описания/состав; false → только фото, цена, размер */
  explain: boolean;
  toggle: () => void;
  ready: boolean;
};

const ExplainCtx = createContext<ExplainContextValue | null>(null);

const STORAGE_KEY = "christos.explain";

export function ExplainProvider({ children }: { children: ReactNode }) {
  // дефолт «без пояснений» — максимально лаконичная витрина
  const [explain, setExplain] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setExplain(saved === "1");
    } catch {
      /* приватный режим / SSR — оставляем дефолт */
    }
    setReady(true);
  }, []);

  const toggle = () => {
    setExplain((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* noop */
      }
      return next;
    });
  };

  return (
    <ExplainCtx.Provider value={{ explain, toggle, ready }}>
      {children}
    </ExplainCtx.Provider>
  );
}

export function useExplain() {
  const ctx = useContext(ExplainCtx);
  if (!ctx) throw new Error("useExplain must be used within ExplainProvider");
  return ctx;
}
