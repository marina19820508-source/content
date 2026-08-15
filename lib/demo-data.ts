import type { AppData, ContentItem, Metrics } from "./types";

const metrics = (values: Partial<Metrics> = {}): Metrics => ({ views: 0, reach: 0, reactions: 0, comments: 0, saves: 0, reposts: 0, clicks: 0, materials: 0, followers: 0, leads: 0, sales: 0, ...values });
const iso = (offset: number) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };

export const emptyMetrics = () => metrics();
export const demoData: AppData = {
  platforms: [
    { id: "instagram", name: "Instagram", color: "#e84b88" }, { id: "vk", name: "VK", color: "#2787f5" },
    { id: "telegram", name: "Telegram", color: "#2aabee" }, { id: "max", name: "MAX", color: "#7755ee" },
  ],
  settings: {
    contentBalance: { "Полезный": 35, "Экспертный": 25, "Вовлекающий": 20, "Личный": 10, "Продающий": 10 },
    weekStartsMonday: true, timezone: "Asia/Amman", notifications: true,
    categories: ["Английский для детей", "Ошибки родителей", "Разбор учебников", "Полезные слова", "Грамматика", "Чтение", "Фрагменты занятий", "Результаты учеников", "Отзывы", "Личный контент преподавателя", "Бесплатные материалы", "Набор в группы", "Продажа занятий", "Курсы и интенсивы"],
    formats: ["Reels", "Клип", "Короткое видео", "Пост", "Карусель", "Stories", "Опрос", "Рассылка", "Статья", "Файл или памятка"],
  },
  items: [
    {
      id: "content-1", title: "Почему ребёнок знает слова, но не говорит", idea: "Показать разницу между пассивным и активным словарём", audience: "Родители детей 8–11 лет", category: "Ошибки родителей", type: "Экспертный", goal: "Переходы", funnelStage: "Привлечение внимания", date: iso(0), time: "18:30", status: "Запланировано", priority: "Высокий", deadline: iso(0), notes: "Добавить пример из урока", createdAt: iso(-10),
      variants: [{ id: "v1", platformId: "instagram", format: "Reels", hook: "Он знает 200 слов — почему молчит?", title: "Почему ребёнок знает слова, но не говорит", text: "Три причины, которые вижу на занятиях…", cta: "Напишите СЛОВА — пришлю упражнение", keyword: "СЛОВА", visualUrl: "", publishedUrl: "", publishDate: iso(0), status: "Запланировано" }, { id: "v2", platformId: "telegram", format: "Пост", hook: "Пассивный словарь — это нормально", title: "Как перевести слова в речь", text: "Небольшой план для родителей…", cta: "Сохраните памятку", keyword: "", visualUrl: "", publishedUrl: "", publishDate: iso(1), status: "Готово" }],
      metrics: metrics({ views: 12400, reach: 9100, reactions: 680, comments: 94, saves: 430, reposts: 85, clicks: 260, materials: 140, followers: 93, leads: 17, sales: 3 }),
    },
    {
      id: "content-2", title: "Нужна ли ребёнку английская транскрипция?", idea: "Разобрать пользу и ограничения транскрипции", audience: "Родители детей 8–11 лет", category: "Чтение", type: "Полезный", goal: "Сохранения", funnelStage: "Доверие", date: iso(2), time: "12:00", status: "Нужен визуал", priority: "Средний", deadline: iso(1), notes: "7 слайдов", createdAt: iso(-7),
      variants: [{ id: "v3", platformId: "vk", format: "Карусель", hook: "Транскрипция помогает — но не всегда", title: "Нужна ли транскрипция?", text: "Разбор на примерах", cta: "Сохраните, чтобы не потерять", keyword: "", visualUrl: "", publishedUrl: "", publishDate: iso(2), status: "Нужен визуал" }], metrics: metrics({ views: 7300, reach: 5900, reactions: 351, comments: 44, saves: 289, reposts: 54, clicks: 120, followers: 45, leads: 6 }),
    },
    {
      id: "content-3", title: "Почему ругают Spotlight 2", idea: "Честный разбор учебника", audience: "Родители и преподаватели", category: "Разбор учебников", type: "Вовлекающий", goal: "Комментарии", funnelStage: "Знакомство", date: iso(-4), time: "17:00", status: "Опубликовано", priority: "Средний", deadline: iso(-4), notes: "Собрать мнения", createdAt: iso(-15),
      variants: [{ id: "v4", platformId: "telegram", format: "Пост", hook: "Spotlight не так плох, как о нём говорят", title: "Почему ругают Spotlight 2", text: "Честно разбираю сильные и слабые стороны", cta: "А как вам учебник?", keyword: "", visualUrl: "", publishedUrl: "https://example.com", publishDate: iso(-4), status: "Опубликовано" }], metrics: metrics({ views: 18600, reach: 14200, reactions: 920, comments: 183, saves: 371, reposts: 142, clicks: 410, followers: 127, leads: 23, sales: 5 }),
    },
    {
      id: "content-4", title: "50 слов перед школой", idea: "Бесплатный словарик для повторения", audience: "Родители будущих третьеклассников", category: "Бесплатные материалы", type: "Продающий", goal: "Выдача бесплатного материала", funnelStage: "Получение бесплатного материала", date: iso(5), time: "10:00", status: "Пишу текст", priority: "Высокий", deadline: iso(3), notes: "PDF готов", createdAt: iso(-3), variants: [], metrics: metrics({ views: 5400, reach: 4400, reactions: 260, comments: 61, saves: 310, reposts: 48, clicks: 380, materials: 291, followers: 88, leads: 34, sales: 7 }),
    },
  ] as ContentItem[],
  ideas: [
    { id: "idea-1", title: "5 игр в дороге", topic: "Летнее повторение", description: "Серия простых словесных игр без распечаток", hook: "Пять игр вместо мультиков в машине", audience: "Родители детей 8–10 лет", category: "Английский для детей", format: "Карусель", platforms: ["instagram", "vk"], goal: "Сохранения", seasonality: "Лето", notes: "Можно сделать серию", sourceUrl: "", createdAt: iso(-2) },
    { id: "idea-2", title: "Как понять, что есть прогресс", topic: "Результаты обучения", description: "Чек-лист наблюдаемых признаков", hook: "Оценка — не единственный показатель", audience: "Родители", category: "Результаты учеников", format: "Пост", platforms: ["telegram"], goal: "Доверие", seasonality: "Всегда", notes: "", sourceUrl: "", createdAt: iso(-1) },
  ],
  funnels: [{ id: "funnel-1", name: "Набор в мини-группу", goal: "Заявка на занятия", itemIds: ["content-1", "content-4"], clicks: 640, materials: 431, leads: 51 }],
};
