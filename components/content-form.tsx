"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { emptyMetrics } from "@/lib/demo-data";
import { CONTENT_TYPES, STATUSES, type AppData, type ContentItem, type Variant } from "@/lib/types";
import { uid } from "@/lib/utils";
import { Button, Field, inputClass } from "./ui";

const today = () => new Date().toISOString().slice(0, 10);

export function ContentForm({ data, initial, initialDate, onSave, onCancel }: { data: AppData; initial?: ContentItem; initialDate?: string; onSave: (item: ContentItem) => void; onCancel: () => void }) {
  const [item, setItem] = useState<ContentItem>(initial ? structuredClone(initial) : {
    id: uid("content"), title: "", idea: "", audience: "Родители детей 8–11 лет", category: data.settings.categories[0] ?? "Без рубрики", type: "Полезный", goal: "Охват", funnelStage: "Привлечение внимания", date: initialDate ?? today(), time: "18:00", status: "Идея", priority: "Средний", deadline: initialDate ?? today(), notes: "", variants: [], metrics: emptyMetrics(), createdAt: today(),
  });
  const patch = <K extends keyof ContentItem>(key: K, value: ContentItem[K]) => setItem((x) => ({ ...x, [key]: value }));
  const addVariant = () => patch("variants", [...item.variants, { id: uid("variant"), platformId: data.platforms[0]?.id ?? "", format: data.settings.formats[0] ?? "Пост", hook: "", title: item.title, text: "", cta: "", keyword: "", visualUrl: "", publishedUrl: "", publishDate: item.date, status: item.status }]);
  const setVariant = (id: string, values: Partial<Variant>) => patch("variants", item.variants.map((v) => v.id === id ? { ...v, ...values } : v));
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (!item.title.trim()) return; onSave(item); };

  return <form onSubmit={submit} className="grid gap-6">
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Название"><input autoFocus required className={inputClass} value={item.title} onChange={(e) => patch("title", e.target.value)} placeholder="О чём публикация?"/></Field>
      <Field label="Основная идея"><input className={inputClass} value={item.idea} onChange={(e) => patch("idea", e.target.value)} placeholder="Что должен понять читатель?"/></Field>
      <Field label="Аудитория"><input className={inputClass} value={item.audience} onChange={(e) => patch("audience", e.target.value)}/></Field>
      <Field label="Рубрика"><select className={inputClass} value={item.category} onChange={(e) => patch("category", e.target.value)}>{data.settings.categories.map((x) => <option key={x}>{x}</option>)}</select></Field>
      <Field label="Тип контента"><select className={inputClass} value={item.type} onChange={(e) => patch("type", e.target.value as ContentItem["type"])}>{CONTENT_TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
      <Field label="Цель"><input className={inputClass} value={item.goal} onChange={(e) => patch("goal", e.target.value)}/></Field>
      <Field label="Этап воронки"><select className={inputClass} value={item.funnelStage} onChange={(e) => patch("funnelStage", e.target.value)}>{["Привлечение внимания", "Знакомство", "Доверие", "Получение бесплатного материала", "Прогрев", "Предложение", "Заявка", "Продажа"].map((x) => <option key={x}>{x}</option>)}</select></Field>
      <Field label="Статус"><select className={inputClass} value={item.status} onChange={(e) => patch("status", e.target.value as ContentItem["status"])}>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select></Field>
      <Field label="Дата"><input type="date" className={inputClass} value={item.date} onChange={(e) => patch("date", e.target.value)}/></Field>
      <Field label="Время"><input type="time" className={inputClass} value={item.time} onChange={(e) => patch("time", e.target.value)}/></Field>
      <Field label="Приоритет"><select className={inputClass} value={item.priority} onChange={(e) => patch("priority", e.target.value as ContentItem["priority"])}>{["Низкий", "Средний", "Высокий"].map((x) => <option key={x}>{x}</option>)}</select></Field>
      <Field label="Дедлайн"><input type="date" className={inputClass} value={item.deadline} onChange={(e) => patch("deadline", e.target.value)}/></Field>
      <div className="sm:col-span-2"><Field label="Заметки"><textarea className={`${inputClass} min-h-24`} value={item.notes} onChange={(e) => patch("notes", e.target.value)}/></Field></div>
    </div>

    <div>
      <div className="mb-3 flex items-center justify-between"><div><h3 className="font-black">Версии для соцсетей</h3><p className="text-sm text-stone-500">Адаптируйте одну идею под разные площадки.</p></div><Button type="button" variant="secondary" onClick={addVariant}><Plus size={16}/> Версия</Button></div>
      <div className="grid gap-3">{item.variants.map((v, index) => <div key={v.id} className="rounded-2xl border border-orange-100 bg-white p-4">
        <div className="mb-3 flex items-center justify-between"><strong className="text-sm">Версия {index + 1}</strong><button type="button" onClick={() => patch("variants", item.variants.filter((x) => x.id !== v.id))} className="text-stone-400 hover:text-red-600" aria-label="Удалить версию"><Trash2 size={17}/></button></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Площадка"><select className={inputClass} value={v.platformId} onChange={(e) => setVariant(v.id, { platformId: e.target.value })}>{data.platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <Field label="Формат"><select className={inputClass} value={v.format} onChange={(e) => setVariant(v.id, { format: e.target.value })}>{data.settings.formats.map((x) => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Хук"><input className={inputClass} value={v.hook} onChange={(e) => setVariant(v.id, { hook: e.target.value })}/></Field>
          <Field label="Заголовок"><input className={inputClass} value={v.title} onChange={(e) => setVariant(v.id, { title: e.target.value })}/></Field>
          <div className="sm:col-span-2"><Field label="Текст или сценарий"><textarea className={`${inputClass} min-h-20`} value={v.text} onChange={(e) => setVariant(v.id, { text: e.target.value })}/></Field></div>
          <Field label="Призыв к действию"><input className={inputClass} value={v.cta} onChange={(e) => setVariant(v.id, { cta: e.target.value })}/></Field>
          <Field label="Кодовое слово"><input className={inputClass} value={v.keyword} onChange={(e) => setVariant(v.id, { keyword: e.target.value })}/></Field>
          <Field label="Ссылка на визуал"><input type="url" className={inputClass} value={v.visualUrl} onChange={(e) => setVariant(v.id, { visualUrl: e.target.value })}/></Field>
          <Field label="Ссылка на публикацию"><input type="url" className={inputClass} value={v.publishedUrl} onChange={(e) => setVariant(v.id, { publishedUrl: e.target.value })}/></Field>
        </div>
      </div>)}</div>
    </div>
    <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onCancel}>Отмена</Button><Button type="submit">Сохранить материал</Button></div>
  </form>;
}
