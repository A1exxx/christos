import Image from "next/image";
import { FadeIn } from "./FadeIn";
import { asset } from "@/lib/asset";

/**
 * Тизер раздела (напр. Дизайн-студия): зиг-заг текст + изображение.
 * Reverse — меняет стороны местами.
 */
export function FeatureSection({
  id,
  eyebrow,
  title,
  body,
  cta,
  image,
  reverse = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  image: string;
  reverse?: boolean;
}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1400px] scroll-mt-28 px-5 py-20 md:px-8 md:py-28"
    >
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <FadeIn className={reverse ? "md:order-2" : ""}>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="font-display mt-3 text-3xl md:text-5xl">{title}</h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            {body}
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
          >
            {cta}
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </FadeIn>

        <FadeIn delay={0.1} className={reverse ? "md:order-1" : ""}>
          <div className="relative aspect-[5/4] w-full overflow-hidden rounded-lg bg-surface">
            <Image
              src={asset(image)}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
