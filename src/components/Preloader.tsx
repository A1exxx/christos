"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CrossMark } from "./CrossMark";

/**
 * Прелоадер: мягкое «облачко» с крестом при первой загрузке.
 * Уходит плавным fade'ом через ~1.2с. Уважает prefers-reduced-motion.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setDone(true), reduce ? 350 : 1200);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          <motion.div
            className="relative flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* облачко */}
            <div className="relative">
              <svg
                viewBox="0 0 120 70"
                className="w-32 h-auto text-border"
                style={
                  reduce
                    ? undefined
                    : { animation: "cloud-drift 4s ease-in-out infinite" }
                }
              >
                <path
                  d="M30 55c-11 0-20-8.5-20-19s9-19 20-19c2 0 4 .3 6 .9C40 9.5 49 3 60 3c14 0 25 10.7 25 24 0 .7 0 1.4-.1 2.1 1.6-.7 3.3-1.1 5.1-1.1 8.8 0 16 7.2 16 16s-7.2 16-16 16H30z"
                  fill="currentColor"
                  fillOpacity="0.5"
                  style={
                    reduce
                      ? undefined
                      : { animation: "cloud-fade 2.4s ease-in-out infinite" }
                  }
                />
              </svg>
              {/* крест внутри облачка */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pb-1"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <CrossMark className="h-7 w-auto text-foreground" />
              </motion.div>
            </div>
            <span className="font-display text-sm tracking-[0.35em] text-muted uppercase pl-[0.35em]">
              Christos
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
