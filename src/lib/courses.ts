export type Course = {
  title: string;
  desc: string;
  lessons: number;
  group: string;
  url: string;
};

/**
 * Курсы Библейского Университета Жизни (bible-life.academy) — академия церкви
 * (пастор Михаил, Пхукет). Бесплатные. Клик ведёт трафик на курс.
 */
export const COURSES_HOME = "https://www.bible-life.academy";
export const COURSES_REGISTER = "https://www.bible-life.academy/account/registration/new";

export const courses: Course[] = [
  {
    title: "Курс «Старт»",
    desc: "Вводный курс для новообращённых и ищущих — первые шаги в вере.",
    lessons: 42,
    group: "Духовный рост",
    url: "https://www.bible-life.academy/c192617d-d418-45d0-b66c-c4b1adf64342",
  },
  {
    title: "Школа молитвы",
    desc: "Молитва как духовное оружие: три направления, практика.",
    lessons: 116,
    group: "Духовный рост",
    url: "https://www.bible-life.academy/e4d5f920-04c9-41d6-8733-9a93b8177af0",
  },
  {
    title: "Крещение Духом Святым",
    desc: "Библейское крещение Духом, дары и помазание.",
    lessons: 61,
    group: "Духовный рост",
    url: "https://www.bible-life.academy/af7d1564-b918-429a-8fcd-b13b8fcafda7",
  },
  {
    title: "Божья воля о семье",
    desc: "Основы брака, воспитание детей, восстановление отношений.",
    lessons: 84,
    group: "Семья",
    url: "https://www.bible-life.academy/3f7990ec-1d34-4de7-b235-81073b08856b",
  },
  {
    title: "Путь к счастливой жизни",
    desc: "Разбор Нагорной проповеди Христа — принципы блаженства.",
    lessons: 35,
    group: "Библия",
    url: "https://www.bible-life.academy/e93a00fd-bff0-4063-a662-159668a8146a",
  },
  {
    title: "Школа исцеления",
    desc: "Библейские основы исцеления и здоровья.",
    lessons: 120,
    group: "Духовный рост",
    url: "https://www.bible-life.academy/5197eb6c-c12b-44f8-8356-c64cd908b292",
  },
  {
    title: "Библейская экономика",
    desc: "От нужды к процветанию: труд, десятина, принципы накопления.",
    lessons: 80,
    group: "Финансы",
    url: "https://www.bible-life.academy/97db1247-04d5-4b60-bd32-50db37af5813",
  },
  {
    title: "История Христианства",
    desc: "От первых апостолов до наших дней.",
    lessons: 77,
    group: "Библия",
    url: "https://www.bible-life.academy/dbdd5790-b449-41a0-a41c-d069eb473761",
  },
];
