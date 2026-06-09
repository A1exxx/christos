/**
 * Префикс basePath к путям публичных ассетов.
 * Нужно потому, что с `images.unoptimized` next/image НЕ добавляет basePath
 * к src сам. В dev basePath пустой; на GitHub Pages — /<repo>.
 */
export function asset(path: string): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const bp = raw ? `/${raw.replace(/^\/+/, "")}` : "";
  return `${bp}${path}`;
}
