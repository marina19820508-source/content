"use client";

import { useState } from "react";
import type { ContentItem, Metrics } from "@/lib/types";
import { Button, Field, inputClass } from "./ui";

const labels: Record<keyof Metrics, string> = { views: "Просмотры", reach: "Охват", reactions: "Реакции", comments: "Комментарии", saves: "Сохранения", reposts: "Репосты", clicks: "Переходы", materials: "Выдано материалов", followers: "Подписки", leads: "Заявки", sales: "Продажи" };
export function MetricsForm({ item, onSave, onCancel }: { item: ContentItem; onSave: (metrics: Metrics) => void; onCancel: () => void }) {
  const [metrics, setMetrics] = useState(item.metrics);
  return <form onSubmit={(e) => { e.preventDefault(); onSave(metrics); }}><div className="grid gap-4 sm:grid-cols-2">{(Object.keys(labels) as (keyof Metrics)[]).map((key) => <Field key={key} label={labels[key]}><input type="number" min="0" className={inputClass} value={metrics[key]} onChange={(e) => setMetrics({ ...metrics, [key]: Math.max(0, Number(e.target.value)) })}/></Field>)}</div><div className="mt-6 flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onCancel}>Отмена</Button><Button type="submit">Сохранить показатели</Button></div></form>;
}
