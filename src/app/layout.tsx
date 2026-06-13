import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { ExplainProvider } from "@/components/ExplainContext";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Preloader } from "@/components/Preloader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CHRISTOS — христианские товары и услуги",
  description:
    "Христианский магазин: одежда, аксессуары и честные услуги для верующих. Чистые формы, благородные материалы, слово, которому можно верить.",
  openGraph: {
    title: "CHRISTOS",
    description: "Христианские товары и услуги. Честно, как перед Богом.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${bodoni.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ExplainProvider>
          <CartProvider>
            <Preloader />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </ExplainProvider>
      </body>
    </html>
  );
}
