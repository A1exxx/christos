import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { FeatureSection } from "@/components/FeatureSection";
import { TrustBand } from "@/components/TrustBand";
import { Services } from "@/components/Services";
import { Courses } from "@/components/Courses";
import { Events } from "@/components/Events";
import { readContent } from "@/lib/content.server";
import type { Product } from "@/lib/products";
import type { Service } from "@/lib/services";
import type { Event } from "@/lib/events";
import type { Course } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = readContent<Product>("products");
  const services = readContent<Service>("services");
  const events = readContent<Event>("events");
  const courses = readContent<Course>("courses");

  const clothing = products.filter((p) => p.category === "Одежда");
  const accessories = products.filter((p) => p.category === "Аксессуары");

  return (
    <>
      <Hero />

      <ProductGrid id="odezhda" eyebrow="Коллекция" title="Одежда" products={clothing} />

      <FeatureSection
        id="studiya"
        eyebrow="Создай своё"
        title="Дизайн-студия"
        body="Опиши идею словами — и получи готовый принт на футболке или худи. Студия превращает текст в дизайн и сразу показывает, как он ляжет на вещь."
        cta="Попробовать студию"
        image="/products/studio.png"
      />

      <ProductGrid id="aksessuary" eyebrow="Коллекция" title="Аксессуары" products={accessories} />

      <TrustBand />

      <Services services={services} />

      <Courses courses={courses} />

      <Events events={events} />
    </>
  );
}
