"use client";

import { motion } from "framer-motion";
import { CrossMark } from "./CrossMark";

// появление после прелоадера (~1.2с)
const base = 1.15;
const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[88dvh] max-w-[1400px] flex-col items-center justify-center px-5 py-24 text-center md:px-8"
    >
      {/* мягкое тёплое световое пятно для глубины */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 38%, rgba(161,98,7,0.045), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: base, duration: 0.9, ease }}
      >
        <CrossMark className="mx-auto h-20 w-auto text-foreground md:h-24" strokeWidth={1.1} />
      </motion.div>

      <motion.span
        className="eyebrow mt-8 block"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: base + 0.15, duration: 0.7, ease }}
      >
        Христианские товары и услуги
      </motion.span>

      <motion.h1
        className="font-display mt-4 max-w-3xl text-5xl md:text-7xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: base + 0.25, duration: 0.8, ease }}
      >
        Вера в каждой детали
      </motion.h1>

      <motion.p
        className="mt-6 max-w-md text-[15px] leading-relaxed text-muted"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: base + 0.35, duration: 0.8, ease }}
      >
        Одежда, аксессуары и честные услуги для верующих. Чистые формы,
        благородные материалы, слово, которому можно верить.
      </motion.p>

      <motion.a
        href="#odezhda"
        className="mt-10 inline-flex items-center justify-center rounded-md bg-foreground px-7 py-3.5 text-sm tracking-wide text-background transition-transform duration-200 active:scale-[0.98]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: base + 0.45, duration: 0.8, ease }}
      >
        Смотреть коллекцию
      </motion.a>

      {/* индикатор скролла */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: base + 0.8, duration: 1 }}
      >
        <motion.div
          className="h-10 w-px bg-border"
          animate={{ scaleY: [0.4, 1, 0.4], originY: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
