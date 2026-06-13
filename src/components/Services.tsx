import Image from "next/image";
import { FadeIn } from "./FadeIn";
import type { Service } from "@/lib/services";
import { asset } from "@/lib/asset";

export function Services({ services }: { services: Service[] }) {
  return (
    <section
      id="uslugi"
      className="scroll-mt-28 border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Левая колонка — вводная + фото */}
          <FadeIn className="lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">Не только одежда</span>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">Услуги</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              Честная помощь среди верующих. Спокойно, бережно и без лукавства —
              так, как хотелось бы самим.
            </p>
            <div className="relative mt-8 aspect-[5/4] w-full overflow-hidden rounded-lg bg-background">
              <Image
                src={asset("/products/services.png")}
                alt="Тёплый разговор и поддержка"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

          {/* Правая колонка — список услуг */}
          <div className="divide-y divide-border border-t border-border">
            {services.map((s, i) => (
              <FadeIn as="div" key={s.id} delay={i * 0.05}>
                <div className="group py-7 md:py-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl md:text-2xl">{s.name}</h3>
                    <span className="shrink-0 text-[13px] tabular-nums text-muted">
                      {s.price}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] uppercase tracking-[0.12em] text-accent/90">
                    {s.tagline}
                  </p>
                  <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
                    {s.description}
                  </p>
                  {s.note && (
                    <p className="mt-3 max-w-xl border-t border-border pt-3 text-[13px] leading-relaxed text-foreground/70">
                      {s.note}
                    </p>
                  )}
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-foreground transition-colors hover:text-accent"
                  >
                    Записаться
                    <span aria-hidden>&rarr;</span>
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
