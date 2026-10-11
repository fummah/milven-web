"use client"

import * as React from "react"
import { toast } from "sonner"
import { CheckCircle2, AlertCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn, formatDate } from "@/lib/utils"

export interface TrainingRecord {
  id: string
  programme?: string | null
  organisation: string
  contactName: string
  email: string
  telephone?: string | null
  delegateCount?: string | null
  seniority?: string | null
  preferredDates?: string | null
  location?: string | null
  deliveryMode?: string | null
  objectives: string
  status: string
  emailed?: boolean
  emailError?: string | null
  notes?: string | null
  createdAt: string
}

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "ARCHIVED"]
const statusStyles: Record<string, string> = {
  NEW: "bg-gold-500/15 text-gold-700",
  CONTACTED: "bg-blue-500/10 text-blue-700",
  QUALIFIED: "bg-emerald-500/10 text-emerald-700",
  CLOSED: "bg-slate-500/10 text-slate-600",
  ARCHIVED: "bg-slate-200 text-slate-500"
}

export function TrainingManager({ initial }: { initial: TrainingRecord[] }) {
  const [items, setItems] = React.useState(initial)
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState("ALL")
  const [selectedId, setSelectedId] = React.useState<string | null>(initial[0]?.id ?? null)
  const [notes, setNotes] = React.useState(initial[0]?.notes || "")

  const filtered = items.filter((c) => {
    const q = query.toLowerCase()
    return (
      (filter === "ALL" || c.status === filter) &&
      (q === "" ||
        c.contactName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.organisation.toLowerCase().includes(q))
    )
  })
  const selected = items.find((i) => i.id === selectedId) || null

  React.useEffect(() => {
    setNotes(selected?.notes || "")
  }, [selectedId, selected?.notes])

  async function updateStatus(id: string, status: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    const res = await fetch(`/api/cms/training/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
    res.ok ? toast.success(`Status: ${status}`) : toast.error("Update failed")
  }

  async function saveNotes() {
    if (!selected) return
    const res = await fetch(`/api/cms/training/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes })
    })
    if (res.ok) {
      setItems((prev) => prev.map((i) => (i.id === selected.id ? { ...i, notes } : i)))
      toast.success("Notes saved")
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="grid gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search requests..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["ALL", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === s ? "border-navy-900 bg-navy-900 text-white" : "border-navy-100 text-navy-600 hover:border-navy-300"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="grid gap-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all",
                selectedId === c.id ? "border-gold-500 bg-white shadow-sm" : "border-navy-100 bg-white hover:border-navy-300"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-navy-900">{c.organisation}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase", statusStyles[c.status] || statusStyles.NEW)}>
                  {c.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {c.contactName} · {formatDate(c.createdAt)}
              </p>
              <p className="mt-2 line-clamp-1 text-xs text-slate-500">{c.programme || "Customised programme"}</p>
            </button>
          ))}
          {filtered.length === 0 && <p className="py-12 text-center text-sm text-slate-400">No requests.</p>}
        </div>
      </div>

      <div>
        {!selected ? (
          <div className="rounded-2xl border border-dashed border-navy-200 p-16 text-center text-slate-500">
            Select a request to view details.
          </div>
        ) : (
          <div className="rounded-2xl border border-navy-100 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-navy-900">{selected.organisation}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.contactName} · {selected.email}
                </p>
                <span className={cn("mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase", selected.emailed ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700")}>
                  {selected.emailed ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {selected.emailed ? "Email sent" : "Email not sent"}
                </span>
              </div>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="h-10 rounded-xl border border-navy-100 px-3 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Programme", selected.programme || "—"],
                ["Telephone", selected.telephone || "—"],
                ["Delegates", selected.delegateCount || "—"],
                ["Seniority", selected.seniority || "—"],
                ["Preferred dates", selected.preferredDates || "—"],
                ["Location", selected.location || "—"],
                ["Delivery mode", selected.deliveryMode || "—"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-navy-50 bg-cream/50 p-3">
                  <p className="text-[0.65rem] uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="text-sm text-navy-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Learning objectives</p>
              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-cream p-4 text-sm leading-7 text-slate-700">
                {selected.objectives}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Internal notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 min-h-24 w-full rounded-xl border border-navy-100 p-4 text-sm outline-none focus:border-gold-500"
                placeholder="Add internal notes..."
              />
              <button onClick={saveNotes} className="mt-3 rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-800">
                Save notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
