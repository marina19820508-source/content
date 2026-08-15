"use client";

import { AlertTriangle, Check, X } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({ children, className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  const styles = { primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm", secondary: "bg-white text-ink border border-orange-100 hover:bg-orange-50", ghost: "bg-transparent text-stone-600 hover:bg-white/70", danger: "bg-red-50 text-red-700 hover:bg-red-100" };
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[1.5rem] border border-orange-100/80 bg-white p-5 shadow-soft ${className}`}>{children}</section>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="grid gap-1.5 text-sm font-semibold text-stone-700"><span>{label}</span>{children}{hint && <span className="text-xs font-normal text-stone-400">{hint}</span>}</label>;
}

export const inputClass = "min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-stone-400 focus:border-orange-400 focus:outline-none";

export function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/30 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className={`max-h-[94vh] w-full overflow-y-auto rounded-t-[1.75rem] bg-cream p-5 shadow-2xl sm:rounded-[1.75rem] sm:p-7 ${wide ? "max-w-5xl" : "max-w-2xl"}`}>
      <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h2><button onClick={onClose} className="rounded-full p-2 text-stone-500 hover:bg-white" aria-label="Закрыть"><X size={21}/></button></div>
      {children}
    </div>
  </div>;
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-xl"><Check size={17} className="text-orange-400"/>{message}<button onClick={onClose} aria-label="Закрыть" className="ml-2"><X size={16}/></button></div>;
}

export function Confirm({ title, text, onConfirm, onClose }: { title: string; text: string; onConfirm: () => void; onClose: () => void }) {
  return <Modal title={title} onClose={onClose}><div className="flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800"><AlertTriangle className="shrink-0" size={20}/><p>{text}</p></div><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={onClose}>Отмена</Button><Button variant="danger" onClick={onConfirm}>Удалить</Button></div></Modal>;
}

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="grid place-items-center rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 px-6 py-12 text-center"><div><p className="font-bold">{title}</p><p className="mt-1 max-w-sm text-sm text-stone-500">{text}</p>{action && <div className="mt-4">{action}</div>}</div></div>;
}
