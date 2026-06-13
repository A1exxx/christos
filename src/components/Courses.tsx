import { FadeIn } from "./FadeIn";
import { COURSES_HOME, type Course } from "@/lib/courses";

export function Courses({ courses }: { courses: Course[] }) {
  return (
    <section
      id="kursy"
      className="scroll-mt-28 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <FadeIn>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Обучение · бесплатно</span>
              <h2 className="font-display mt-3 text-3xl md:text-5xl">Курсы</h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                Библейский Университет Жизни — десятки бесплатных курсов о вере,
                семье, молитве и призвании.
              </p>
            </div>
            <a
              href={COURSES_HOME}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-sm transition-colors hover:border-foreground"
            >
              Все курсы
              <span aria-hidden>&rarr;</span>
            </a>
          </div>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4 md:mt-14">
          {courses.map((c, i) => (
            <FadeIn as="div" key={c.url} delay={(i % 4) * 0.05}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col bg-surface p-6 transition-colors hover:bg-background"
              >
                <span className="text-[11px] uppercase tracking-[0.14em] text-accent/90">
                  {c.group}
                </span>
                <h3 className="font-display mt-2 text-lg leading-tight">{c.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{c.desc}</p>
                <div className="mt-auto flex items-center justify-between pt-5 text-[12px] text-muted">
                  <span className="tabular-nums">{c.lessons} уроков</span>
                  <span className="text-foreground transition-transform group-hover:translate-x-0.5">
                    Перейти &rarr;
                  </span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
