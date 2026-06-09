import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { FeatureSection } from "@/components/FeatureSection";
import { TrustBand } from "@/components/TrustBand";
import { Services } from "@/components/Services";
import { products } from "@/lib/products";

export default function Home() {
  const clothing = products.filter((p) => p.category === "Одежда");
  const accessories = products.filter((p) => p.category === "Аксессуары");

  return (
    <>
      <Hero />

      <ProductGrid
        id="odezhda"
        eyebrow="Коллекция"
        title="Одежда"
        products={clothing}
      />

      <FeatureSection
        id="studiya"
        eyebrow="Создай своё"
        title="Дизайн-студия"
        body="Опиши идею словами — и получи готовый принт на футболке или худи. Студия превращает текст в дизайн и сразу показывает, как он ляжет на вещь."
        cta="Попробовать студию"
        image="/products/studio.png"
      />

      <ProductGrid
        id="aksessuary"
        eyebrow="Коллекция"
        title="Аксессуары"
        products={accessories}
      />

      <TrustBand />

      <Services />
    </>
  );
}
