import Link from "next/link";
import { isAdmin } from "@/lib/session";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminLogout } from "@/components/admin/AdminLogout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL || "http://localhost:4317";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminGate />;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border bg-background px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="font-display tracking-[0.18em]">CHRISTOS · АДМИН</span>
          <Link href="/" className="text-[13px] text-muted hover:text-foreground">← на сайт</Link>
        </div>
        <AdminLogout />
      </div>
      <iframe src={PANEL_URL} className="flex-1 w-full border-0" title="Панель управления" />
    </div>
  );
}
