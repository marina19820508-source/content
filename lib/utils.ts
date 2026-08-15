import type { AppData, ContentItem } from "./types";

export const uid = (prefix = "id") => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
export const formatNumber = (n: number) => new Intl.NumberFormat("ru-RU").format(n);
export const engagement = (item: ContentItem) => item.metrics.reach ? ((item.metrics.reactions + item.metrics.comments + item.metrics.saves + item.metrics.reposts) / item.metrics.reach) * 100 : 0;
export const leadConversion = (item: ContentItem) => item.metrics.clicks ? (item.metrics.leads / item.metrics.clicks) * 100 : 0;
export const platformById = (data: AppData, id: string) => data.platforms.find((p) => p.id === id);
export const download = (filename: string, text: string, type: string) => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
};
export const csv = (rows: (string | number)[][]) => rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
