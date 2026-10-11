"use client"

import * as React from "react"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RedirectRecord {
  id: string
  from: string
  to: string
  permanent: boolean
}

export function RedirectsManager({ initial }: { initial: RedirectRecord[] }) {
  const [items, setItems] = React.useState(initial)
  const [from, setFrom] = React.useState("")
  const [to, setTo] = React.useState("")
  const [permanent, setPermanent] = React.useState(true)

  async function add() {
    if (!from.trim() || !to.trim()) return toast.error("Enter both paths")
    const cleanFrom = from.startsWith("/") ? from : `/${from}`
    const res = await fetch("/api/cms/redirects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: cleanFrom, to, permanent })
    })
    if (!res.ok) return toast.error("Could not add redirect")
    const created = await res.json()
    setItems((prev) => [created, ...prev])
    setFrom("")
    setTo("")
    toast.success("Redirect added")
  }

  async function remove(id: string) {
    const res = await fetch(`/api/cms/redirects/${id}`, { method: "DELETE" })
    if (!res.ok) return toast.error("Delete failed")
    setItems((prev) => prev.filter((i) => i.id !== id))
    toast.success("Deleted")
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 rounded-2xl border border-navy-100 bg-white p-5 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-navy-700">From path</label>
          <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="/old-page" />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-navy-700">To path</label>
          <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="/services" />
        </div>
        <label className="flex items-center gap-2 pb-3 text-sm text-navy-700">
          <input type="checkbox" checked={permanent} onChange={(e) => setPermanent(e.target.checked)} />
          Permanent (301)
        </label>
        <Button onClick={add}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream/60">
            <tr>
              <th className="p-4 font-medium text-navy-700">From</th>
              <th className="p-4 font-medium text-navy-700">To</th>
              <th className="p-4 font-medium text-navy-700">Type</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t border-navy-50">
                <td className="p-4 font-mono text-xs text-navy-800">{r.from}</td>
                <td className="p-4 font-mono text-xs text-navy-800">{r.to}</td>
                <td className="p-4 text-xs text-slate-500">{r.permanent ? "301" : "307"}</td>
                <td className="p-4 text-right">
                  <button onClick={() => remove(r.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400">
                  No redirects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
