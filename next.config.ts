import type { NextConfig } from "next";

// basePath задаётся при сборке для GitHub Pages (репозиторий-подпуть),
// в dev остаётся пустым.
const repo = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/^\/+/, "");
const basePath = repo ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export", // статический экспорт в out/ для GitHub Pages
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true, // Pages не запускает оптимизатор next/image
  },
};

export default nextConfig;
