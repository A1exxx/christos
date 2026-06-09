import { CrossMark } from "./CrossMark";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <CrossMark className="h-5 w-auto text-foreground" />
              <span className="font-display text-lg tracking-[0.18em] pl-[0.18em]">
                CHRISTOS
              </span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              Христианские товары и услуги: одежда, аксессуары и честная помощь
              для верующих. Честно, как перед Богом.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Каталог"
              links={["Одежда", "Аксессуары", "Дизайн-студия", "Услуги"]}
            />
            <FooterCol
              title="Бренд"
              links={["О нас", "Материалы", "Доставка", "Возврат"]}
            />
            <FooterCol
              title="Связь"
              links={["Instagram", "Telegram", "Почта"]}
            />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} CHRISTOS</span>
          <span className="tracking-wide">Сделано с верою · Таиланд</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="eyebrow mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-[13px] text-muted transition-colors hover:text-foreground"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
