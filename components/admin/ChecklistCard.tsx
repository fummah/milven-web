"use client"

import * as React from "react"
import { toast } from "sonner"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChecklistRecord {
  id: string
  key: string
  label: string
  detail?: string | null
  done: boolean
}

export function ChecklistCard({ initial }: { initial: ChecklistRecord[] }) {
  const [items, setItems] = React.useState(initial)

  const done = items.filter((i) => i.done).length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0

  async function toggle(item: ChecklistRecord) {
    const next = !item.done
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, done: next } : i)))
    const res = await fetch(`/api/cms/checklist/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: next })
    })
    if (!res.ok) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, done: !next } : i)))
      toast.error("Could not update")
    }
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-navy-900">
          Awaiting client confirmation
        </h2>
        <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-700">
          {done}/{items.length} confirmed
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-500">
        Items the client (Milven) must supply or approve before launch. These are
        intentionally not invented.
      </p>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-navy-100">
        <div
          className="h-full rounded-full bg-gold-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-5 grid gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                item.done
                  ? "border-emerald-200 bg-emerald-50/60"
                  : "border-navy-100 hover:border-navy-200"
              )}
            >
              {item.done ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
              )}
              <span>
                <span
                  className={cn(
                    "block text-sm font-medium",
                    item.done ? "text-emerald-900 line-through" : "text-navy-900"
                  )}
                >
                  {item.label}
                </span>
                {item.detail && (
                  <span className="mt-0.5 block text-xs text-slate-500">{item.detail}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
