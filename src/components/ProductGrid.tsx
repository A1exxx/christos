"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function ProductGrid({
  id,
  eyebrow,
  title,
  products,
}: {
  id: string;
  eyebrow: string;
  title: string;
  products: Product[];
}) {
  return (
    <section id={id} className="mx-auto max-w-[1400px] scroll-mt-28 px-5 py-20 md:px-8 md:py-28">
      <div className="mb-10 flex flex-col gap-3 md:mb-14">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="font-display text-3xl md:text-5xl">{title}</h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 md:gap-x-7 md:gap-y-16"
      >
        {products.map((p) => (
          <motion.div key={p.id} variants={item}>
            <ProductCard product={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
