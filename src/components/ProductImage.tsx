import { CrossMark } from "./CrossMark";

/**
 * Самодостаточный плейсхолдер изображения товара (без сети).
 * Тёплый stone-дуотон + водяной крест. Лёгкая вариация тона по seed,
 * чтобы тайлы не были одинаковыми. Заменяется реальными фото на Фазе 2
 * (после фото-пайплайна rembg/BiRefNet → единый стиль).
 */
function hashSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

export function ProductImage({
  seed,
  alt,
}: {
  seed: string;
  alt: string;
}) {
  const h = hashSeed(seed);
  const hue = 28 + (h % 18); // тёплый диапазон (бежево-песочный)
  const angle = 145 + (h % 40);
  const top = `hsl(${hue} 14% ${94 - (h % 4)}%)`;
  const bottom = `hsl(${hue} 12% ${86 - (h % 6)}%)`;

  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(${angle}deg, ${top}, ${bottom})`,
      }}
    >
      {/* мягкий световой блик */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 18%, rgba(255,255,255,0.5), transparent 55%)",
        }}
      />
      {/* водяной крест */}
      <CrossMark
        className="relative h-2/5 w-auto text-foreground/8"
        strokeWidth={0.9}
      />
    </div>
  );
}
