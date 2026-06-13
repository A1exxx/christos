import type { NextConfig } from "next";

// Динамический режим (логин, корзина, заказы, админка). Статический экспорт
// под GitHub Pages отключён — хостинг настроим позже (Vercel/VPS).
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
