import { FadeIn } from "./FadeIn";
import type { Event } from "@/lib/events";
import { EventRegisterButton } from "./EventRegisterButton";

export function Events({ events }: { events: Event[] }) {
  return (
    <section
      id="sobytiya"
      className="scroll-mt-28 border-t border-border bg-surface"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <FadeIn>
          <span className="eyebrow">Приходи</span>
          <h2 className="font-display mt-3 text-3xl md:text-5xl">События</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            Богослужения, молитвенные вечера и встречи общины. Очно в Пхукете и
            онлайн.
          </p>
        </FadeIn>

        <div className="mt-10 divide-y divide-border border-t border-border md:mt-14">
          {events.map((e, i) => (
            <FadeIn as="div" key={e.title} delay={i * 0.05}>
              <div className="grid grid-cols-1 gap-3 py-7 md:grid-cols-[200px_1fr_auto] md:items-center md:gap-8 md:py-8">
                <span className="text-[13px] uppercase tracking-[0.1em] text-accent/90">
                  {e.date}
                </span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl">{e.title}</h3>
                  <p className="mt-1 text-[13px] text-muted">{e.place}</p>
                  <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">
                    {e.desc}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <EventRegisterButton event={e.title} />
                  <a
                    href={e.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-muted underline-offset-4 hover:text-foreground hover:underline"
                  >
                    или написать в Telegram
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
