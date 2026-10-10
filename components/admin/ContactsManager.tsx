"use client"

import * as React from "react"
import { toast } from "sonner"
import { Search, Mail, Building2, Phone, CheckCircle2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn, formatDate } from "@/lib/utils"

export interface ContactRecord {
  id: string
  name: string
  organisation?: string | null
  role?: string | null
  email: string
  telephone?: string | null
  service?: string | null
  message: string
  preferredMethod?: string | null
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

export function ContactsManager({ initial }: { initial: ContactRecord[] }) {
  const [items, setItems] = React.useState(initial)
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState("ALL")
  const [selectedId, setSelectedId] = React.useState<string | null>(
    initial[0]?.id ?? null
  )
  const [notes, setNotes] = React.useState(initial[0]?.notes || "")

  const filtered = items.filter((c) => {
    const matchFilter = filter === "ALL" || c.status === filter
    const q = query.toLowerCase()
    const matchQuery =
      q === "" ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.organisation || "").toLowerCase().includes(q)
    return matchFilter && matchQuery
  })

  const selected = items.find((i) => i.id === selectedId) || null

  React.useEffect(() => {
    setNotes(selected?.notes || "")
  }, [selectedId, selected?.notes])

  async function updateStatus(id: string, status: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    const res = await fetch(`/api/cms/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
    if (res.ok) toast.success(`Status updated to ${status}`)
    else toast.error("Could not update status")
  }

  async function saveNotes() {
    if (!selected) return
    const res = await fetch(`/api/cms/contacts/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes })
    })
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => (i.id === selected.id ? { ...i, notes } : i))
      )
      toast.success("Notes saved")
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="grid gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search enquiries..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["ALL", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === s
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-100 text-navy-600 hover:border-navy-300"
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
                selectedId === c.id
                  ? "border-gold-500 bg-white shadow-sm"
                  : "border-navy-100 bg-white hover:border-navy-300"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-navy-900">{c.name}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide",
                    statusStyles[c.status] || statusStyles.NEW
                  )}
                >
                  {c.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {c.organisation || "No organisation"} · {formatDate(c.createdAt)}
              </p>
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">{c.message}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-400">
              No enquiries match.
            </p>
          )}
        </div>
      </div>

      <div>
        {!selected ? (
          <div className="rounded-2xl border border-dashed border-navy-200 p-16 text-center text-slate-500">
            Select an enquiry to view details.
          </div>
        ) : (
          <div className="rounded-2xl border border-navy-100 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-navy-900">{selected.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.role ? `${selected.role} · ` : ""}
                  {selected.organisation || "No organisation"}
                </p>
                {selected.emailed ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Email sent
                  </span>
                ) : (
                  <span
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-700"
                    title={selected.emailError || undefined}
                  >
                    <AlertCircle className="h-3 w-3" />
                    Email not sent
                  </span>
                )}
              </div>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="h-10 rounded-xl border border-navy-100 px-3 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {!selected.emailed && selected.emailError && (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
                The enquiry is saved, but email delivery reported: {selected.emailError}
              </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Info icon={<Mail className="h-4 w-4" />} label="Email" value={selected.email} href={`mailto:${selected.email}`} />
              <Info icon={<Phone className="h-4 w-4" />} label="Telephone" value={selected.telephone || "—"} />
              <Info icon={<Building2 className="h-4 w-4" />} label="Service" value={selected.service || "—"} />
              <Info icon={<Mail className="h-4 w-4" />} label="Preferred method" value={selected.preferredMethod || "—"} />
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Message
              </p>
              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-cream p-4 text-sm leading-7 text-slate-700">
                {selected.message}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Internal notes
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 min-h-24 w-full rounded-xl border border-navy-100 p-4 text-sm outline-none focus:border-gold-500"
                placeholder="Add internal notes about this enquiry..."
              />
              <button
                onClick={saveNotes}
                className="mt-3 rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Save notes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Info({
  icon,
  label,
  value,
  href
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-navy-50 bg-cream/50 p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gold-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[0.65rem] uppercase tracking-wide text-slate-400">{label}</p>
        {href ? (
          <a href={href} className="truncate text-sm text-navy-800 hover:text-gold-600">
            {value}
          </a>
        ) : (
          <p className="truncate text-sm text-navy-800">{value}</p>
        )}
      </div>
    </div>
  )
}
