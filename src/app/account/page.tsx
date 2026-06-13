import Link from "next/link";
import { getUser } from "@/lib/session";
import { ordersFor, registrationsFor } from "@/lib/store.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fmt = new Intl.NumberFormat("ru-RU");
const dateFmt = (ts: number) =>
  new Date(ts).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

export default async function AccountPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center md:py-36">
        <h1 className="font-display text-4xl">Личный кабинет</h1>
        <p className="mt-4 text-muted">
          Войдите (кнопка «Войти» в шапке), чтобы видеть свои заказы и записи на события.
        </p>
        <Link href="/" className="mt-8 inline-block rounded-md bg-foreground px-7 py-3.5 text-sm text-background">
          На главную
        </Link>
      </div>
    );
  }

  const orders = ordersFor(user.email);
  const regs = registrationsFor(user.email);

  return (
    <div className="mx-auto max-w-[900px] px-5 py-16 md:px-8 md:py-24">
      <span className="eyebrow">Личный кабинет</span>
      <h1 className="font-display mt-3 text-4xl md:text-5xl">{user.name}</h1>
      <p className="mt-2 text-[14px] text-muted">{user.email}</p>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Мои заказы</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-muted">Заказов пока нет. <Link href="/" className="text-foreground underline-offset-4 hover:underline">К товарам</Link></p>
        ) : (
          <div className="mt-5 divide-y divide-border border-y border-border">
            {orders.map((o) => (
              <div key={o.id} className="py-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-lg">{o.id}</span>
                  <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-muted">
                    {o.status === "new" ? "Принят" : o.status}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-muted">{dateFmt(o.createdAt)}</p>
                <p className="mt-2 text-[14px] text-muted">
                  {o.items.map((i) => `${i.name}${i.size ? ` (${i.size})` : ""} ×${i.qty}`).join(", ")}
                </p>
                <p className="mt-1 text-[15px]"><b className="tabular-nums">{fmt.format(o.total)} ฿</b></p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl">Мои события</h2>
        {regs.length === 0 ? (
          <p className="mt-4 text-muted">Вы пока никуда не записаны. <Link href="/#sobytiya" className="text-foreground underline-offset-4 hover:underline">К событиям</Link></p>
        ) : (
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {regs.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-4">
                <span className="font-display text-lg">{r.event}</span>
                <span className="text-[13px] text-muted">{dateFmt(r.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
