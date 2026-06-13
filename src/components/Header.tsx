"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CrossMark } from "./CrossMark";
import { useExplain } from "./ExplainContext";
import { CartButton } from "./cart/CartButton";
import { AuthMenu } from "./auth/AuthMenu";

const NAV = [
  { label: "Одежда", href: "#odezhda" },
  { label: "Аксессуары", href: "#aksessuary" },
  { label: "Услуги", href: "#uslugi" },
  { label: "Курсы", href: "#kursy" },
  { label: "События", href: "#sobytiya" },
];

function ExplainToggle() {
  const { explain, toggle, ready } = useExplain();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={explain}
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
      title="Переключить режим витрины: лаконично или с пояснениями"
    >
      <span
        className={`relative h-3.5 w-6 rounded-full transition-colors ${
          explain ? "bg-foreground" : "bg-border"
        }`}
      >
        <motion.span
          className="absolute top-0.5 h-2.5 w-2.5 rounded-full bg-surface"
          animate={{ left: explain ? 13 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          style={{ left: 2 }}
        />
      </span>
      <span className="hidden sm:inline">
        {ready && explain ? "С пояснениями" : "Лаконично"}
      </span>
    </button>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-background"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 md:px-8">
        {/* Лого: крест + словесный знак */}
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <motion.span
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            <CrossMark className="h-6 w-auto text-foreground" />
          </motion.span>
          <span className="font-display text-xl tracking-[0.18em] pl-[0.18em]">
            CHRISTOS
          </span>
        </a>

        {/* Навигация — десктоп */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm text-muted transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Правый блок */}
        <div className="flex items-center gap-3">
          <ExplainToggle />
          <AuthMenu />
          <CartButton />
        </div>
      </div>

      {/* Навигация — мобайл */}
      <nav className="flex items-center justify-center gap-6 overflow-x-auto border-t border-border px-5 py-2.5 md:hidden">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-[13px] text-muted transition-colors hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
