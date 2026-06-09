import { FadeIn } from "./FadeIn";
import { CrossMark } from "./CrossMark";

/**
 * Манифест честности — смысловой акцент сайта.
 * «Среди верующих не принято обманывать».
 */
export function TrustBand() {
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto max-w-3xl px-5 py-24 text-center md:py-32">
        <FadeIn>
          <CrossMark className="mx-auto h-9 w-auto text-accent" strokeWidth={1.2} />
          <span className="eyebrow mt-7 block">Наше слово</span>
          <h2 className="font-display mt-4 text-3xl leading-tight md:text-5xl">
            Честно, как перед Богом
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-muted">
            Среди верующих не принято обманывать. Каждая вещь и каждая услуга —
            без лукавства: с заботой, вниманием и гарантией доброго, честного
            отношения. Вы получаете именно то, что обещано.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
