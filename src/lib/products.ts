export type Product = {
  id: string;
  name: string;
  category: "Одежда" | "Аксессуары";
  price: number; // THB — условные
  collection: string;
  description: string;
  material: string;
  /** путь к фото в /public/products */
  image: string;
  sizes: string[];
  limited?: boolean;
};

/**
 * Каталог-витрина (Фаза 0). Фото сгенерированы в едином стиле
 * (warm off-white фон, мягкий свет) — прототип нашего фото-пайплайна.
 * Лежат в /public/products. Цены условные.
 */
export const products: Product[] = [
  {
    id: "tee-grace",
    name: "Футболка «Grace»",
    category: "Одежда",
    price: 1290,
    collection: "Essentials",
    description:
      "Базовая футболка прямого кроя с тиснёным крестом на груди. Плотный хлопок, держит форму после стирок.",
    material: "100% органический хлопок, 220 г/м²",
    image: "/products/grace.png",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "hoodie-lux",
    name: "Худи «Lux Mundi»",
    category: "Одежда",
    price: 2790,
    collection: "Essentials",
    description:
      "Тяжёлое худи свободной посадки с тональной вышивкой-крестом на груди. Мягкий начёс изнутри.",
    material: "80% хлопок, 20% полиэстер, 400 г/м²",
    image: "/products/hoodie.png",
    sizes: ["S", "M", "L", "XL"],
    limited: true,
  },
  {
    id: "tee-ichthys",
    name: "Футболка «Ichthys»",
    category: "Одежда",
    price: 1290,
    collection: "Symbols",
    description:
      "Раннехристианский символ рыбы, тонкая линия на груди. Спокойный oversize.",
    material: "100% хлопок пенье, 190 г/м²",
    image: "/products/ichthys.png",
    sizes: ["S", "M", "L"],
  },
  {
    id: "sweat-pax",
    name: "Свитшот «Pax»",
    category: "Одежда",
    price: 2290,
    collection: "Essentials",
    description:
      "Свитшот пастельного тона с мелкой вышивкой-крестом на манжете. Универсальная посадка.",
    material: "70% хлопок, 30% полиэстер, 320 г/м²",
    image: "/products/pax.png",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "tee-lumen",
    name: "Футболка «Lumen»",
    category: "Одежда",
    price: 1390,
    collection: "Symbols",
    description:
      "Светлая футболка, чистый минимализм. Маленький крест у горловины сзади.",
    material: "100% хлопок, 200 г/м²",
    image: "/products/lumen.png",
    sizes: ["S", "M", "L", "XL"],
    limited: true,
  },
  {
    id: "sweat-agnus",
    name: "Свитшот «Agnus»",
    category: "Одежда",
    price: 2390,
    collection: "Essentials",
    description:
      "Тёплый песочный свитшот с лаконичным крестом на груди. Плотное полотно, мягкая фактура.",
    material: "100% хлопок, 340 г/м²",
    image: "/products/sol.png",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "cap-crux",
    name: "Кепка «Crux»",
    category: "Аксессуары",
    price: 990,
    collection: "Symbols",
    description:
      "Кепка с вышитым крестом спереди. Регулируемый ремешок, неструктурированная тулья.",
    material: "Хлопковый твил",
    image: "/products/cap.png",
    sizes: ["One size"],
  },
  {
    id: "tote-verse",
    name: "Шоппер «Verse»",
    category: "Аксессуары",
    price: 790,
    collection: "Essentials",
    description:
      "Плотный холщовый шоппер с минималистичным крестом. Длинные ручки, держит форму.",
    material: "Холщовая ткань, 340 г/м²",
    image: "/products/tote.png",
    sizes: ["One size"],
  },
  {
    id: "bracelet-faith",
    name: "Браслет «Faith»",
    category: "Аксессуары",
    price: 690,
    collection: "Symbols",
    description:
      "Плетёный браслет со стальным крестом. Регулируемый размер, носится каждый день.",
    material: "Вощёный шнур, нержавеющая сталь",
    image: "/products/bracelet.png",
    sizes: ["One size"],
  },
  {
    id: "pendant-lux",
    name: "Кулон «Lux»",
    category: "Аксессуары",
    price: 1190,
    collection: "Symbols",
    description:
      "Тонкий серебристый крест на изящной цепочке. Лаконичная форма на каждый день.",
    material: "Нержавеющая сталь, гипоаллергенное покрытие",
    image: "/products/pendant.png",
    sizes: ["One size"],
    limited: true,
  },
];

export const collections = ["Essentials", "Symbols"] as const;
