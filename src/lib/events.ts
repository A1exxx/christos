export type Event = {
  title: string;
  date: string; // человекочитаемо
  place: string;
  desc: string;
  registerUrl: string;
};

// Контакт церкви для записи (Telegram). Заменишь на форму/реальные данные.
export const EVENTS_CONTACT = "https://t.me/Church_of_Thailand";

/** Заглушки событий — замени на реальные афиши. */
export const events: Event[] = [
  {
    title: "Воскресное богослужение",
    date: "Каждое воскресенье · 10:00",
    place: "Пхукет · и онлайн-трансляция",
    desc: "Совместное поклонение, проповедь, молитва. Приходи как есть.",
    registerUrl: EVENTS_CONTACT,
  },
  {
    title: "Молитвенный вечер",
    date: "Каждую среду · 19:00",
    place: "Пхукет",
    desc: "Тихий вечер молитвы и общения в кругу верующих.",
    registerUrl: EVENTS_CONTACT,
  },
  {
    title: "Конференция «Свет миру»",
    date: "Дата уточняется",
    place: "Пхукет",
    desc: "Дни прославления, обучения и общения. Следи за анонсами.",
    registerUrl: EVENTS_CONTACT,
  },
];
