import crypto from "node:crypto";
import { cookies } from "next/headers";

export type User = { name: string; email: string };

const SECRET = process.env.AUTH_SECRET || "christos-local-dev-secret-change-in-prod";
const COOKIE = "christos_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 дней

function b64url(s: string) {
  return Buffer.from(s).toString("base64url");
}
function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function makeToken(user: User): string {
  const payload = b64url(JSON.stringify({ ...user, iat: Date.now() }));
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): User | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (sign(payload) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return { name: data.name, email: data.email };
  } catch {
    return null;
  }
}

/** Текущий пользователь (server component / route handler). */
export async function getUser(): Promise<User | null> {
  const c = await cookies();
  return verifyToken(c.get(COOKIE)?.value);
}

export const SESSION_COOKIE = COOKIE;
export const SESSION_MAX_AGE = MAX_AGE;

// --- Админ-сессия (вход в панель управления) ---
const ADMIN_COOKIE = "christos_admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "christos";

export function adminToken(): string {
  return sign("admin");
}
export function checkAdminPassword(pw: string): boolean {
  return pw === ADMIN_PASSWORD;
}
export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === adminToken();
}
export { ADMIN_COOKIE };

