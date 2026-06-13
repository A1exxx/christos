"use client";

export function AdminLogout() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        location.reload();
      }}
      className="text-[13px] text-muted hover:text-foreground"
    >
      Выйти
    </button>
  );
}
