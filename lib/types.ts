export const STATUSES = ["Идея", "Пишу текст", "Нужен визуал", "Готово", "Запланировано", "Опубликовано", "Использовать повторно"] as const;
export type Status = (typeof STATUSES)[number];
export const CONTENT_TYPES = ["Полезный", "Экспертный", "Вовлекающий", "Личный", "Продающий"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];
export type Platform = { id: string; name: string; color: string };
export type Variant = {
  id: string; platformId: string; format: string; hook: string; title: string; text: string;
  cta: string; keyword: string; visualUrl: string; publishedUrl: string; publishDate: string; status: Status;
};
export type Metrics = {
  views: number; reach: number; reactions: number; comments: number; saves: number; reposts: number;
  clicks: number; materials: number; followers: number; leads: number; sales: number;
};
export type ContentItem = {
  id: string; title: string; idea: string; audience: string; category: string; type: ContentType;
  goal: string; funnelStage: string; date: string; time: string; status: Status; priority: "Низкий" | "Средний" | "Высокий";
  deadline: string; notes: string; variants: Variant[]; metrics: Metrics; createdAt: string;
};
export type Idea = {
  id: string; title: string; topic: string; description: string; hook: string; audience: string; category: string;
  format: string; platforms: string[]; goal: string; seasonality: string; notes: string; sourceUrl: string; createdAt: string;
};
export type Funnel = { id: string; name: string; goal: string; itemIds: string[]; clicks: number; materials: number; leads: number };
export type Settings = {
  contentBalance: Record<ContentType, number>; weekStartsMonday: boolean; timezone: string; notifications: boolean;
  categories: string[]; formats: string[];
};
export type AppData = { platforms: Platform[]; items: ContentItem[]; ideas: Idea[]; funnels: Funnel[]; settings: Settings };
