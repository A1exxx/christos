"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/products";
import { useExplain } from "./ExplainContext";
import { asset } from "@/lib/asset";
import { FRAMELESS, productImageSrc } from "@/lib/display";

const priceFmt = new Intl.NumberFormat("ru-RU");

export function ProductCard({ product }: { product: Product }) {
  const { explain } = useExplain();

  return (
    <motion.article
      className="group flex flex-col"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <a href="#" className="block cursor-pointer">
        {/* Фото */}
        <div
          className={`relative aspect-[4/5] w-full overflow-hidden ${
            FRAMELESS ? "" : "bg-surface"
          }`}
        >
          {product.limited && (
            <span className="absolute left-3 top-3 z-10 rounded-full border border-border bg-background/85 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-accent backdrop-blur-sm">
              Лимит
            </span>
          )}
          <motion.div
            className="relative h-full w-full"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.045 } }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={asset(productImageSrc(product.image))}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={FRAMELESS ? "object-contain" : "object-cover"}
            />
          </motion.div>
        </div>

        {/* Подпись */}
        <div className="flex items-baseline justify-between gap-3 pt-4">
          <h3 className="font-display text-base leading-tight">{product.name}</h3>
          <span className="shrink-0 text-sm tabular-nums text-muted">
            {priceFmt.format(product.price)} ฿
          </span>
        </div>

        {/* Пояснения — только в режиме «с пояснениями» */}
        <AnimatePresence initial={false}>
          {explain && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="pt-2 text-[13px] leading-relaxed text-muted">
                {product.description}
              </p>
              <p className="pt-1.5 text-[12px] text-muted/80">
                {product.material}
              </p>
              <p className="pt-2 text-[11px] uppercase tracking-[0.14em] text-muted/70">
                {product.sizes.join(" · ")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </a>
    </motion.article>
  );
}
