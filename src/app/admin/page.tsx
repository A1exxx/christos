import { isAdmin } from "@/lib/session";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL || "http://localhost:4317";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminGate />;
  return <AdminPanel panelUrl={PANEL_URL} />;
}
