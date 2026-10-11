"use client"

import * as React from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Loader2, Plus, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MediaPicker } from "@/components/admin/MediaPicker"
import { cn } from "@/lib/utils"

export interface TeamRecord {
  id: string
  name: string
  role?: string | null
  bio?: string | null
  image?: string | null
  linkedin?: string | null
  order: number
  published: boolean
}

export function TeamManager({ initial }: { initial: TeamRecord[] }) {
  const [items, setItems] = React.useState(initial)
  const [selectedId, setSelectedId] = React.useState<string | null>(initial[0]?.id ?? null)
  const [saving, setSaving] = React.useState(false)
  const selected = items.find((i) => i.id === selectedId) || null

  function update(patch: Partial<TeamRecord>) {
    setItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, ...patch } : i)))
  }

  async function save() {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/cms/team/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected)
      })
      if (!res.ok) throw new Error("Save failed")
      toast.success("Team member saved")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function createNew() {
    const res = await fetch("/api/cms/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New team member", published: false })
    })
    if (!res.ok) return toast.error("Could not create")
    const created = await res.json()
    setItems((prev) => [...prev, created])
    setSelectedId(created.id)
    toast.success("Created")
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this team member?")) return
    const res = await fetch(`/api/cms/team/${id}`, { method: "DELETE" })
    if (!res.ok) return toast.error("Delete failed")
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (selectedId === id) setSelectedId(null)
    toast.success("Deleted")
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Button onClick={createNew} className="w-full">
          <Plus className="h-4 w-4" /> Add team member
        </Button>
        <div className="mt-4 grid gap-1">
          {items.map((i) => (
            <button
              key={i.id}
              onClick={() => setSelectedId(i.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                selectedId === i.id ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-cream"
              )}
            >
              {i.image ? (
                <Image src={i.image} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="h-8 w-8 rounded-full bg-navy-200" />
              )}
              <span className="min-w-0">
                <span className="block truncate font-medium">{i.name}</span>
                <span className={cn("block truncate text-[0.65rem]", selectedId === i.id ? "text-white/50" : "text-slate-400")}>
                  {i.published ? "Published" : "Hidden"}
                </span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div>
        {!selected ? (
          <div className="rounded-2xl border border-dashed border-navy-200 p-16 text-center text-slate-500">
            Select a team member or add one.
          </div>
        ) : (
          <div className="grid gap-5 rounded-2xl border border-navy-100 bg-white p-6">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => update({ published: !selected.published })} className="flex items-center gap-3">
                <span className={cn("relative h-6 w-11 rounded-full", selected.published ? "bg-gold-500" : "bg-navy-200")}>
                  <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", selected.published ? "left-[1.4rem]" : "left-0.5")} />
                </span>
                <span className="text-sm font-medium text-navy-800">
                  {selected.published ? "Published" : "Hidden"}
                </span>
              </button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => remove(selected.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <Button onClick={save} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Profile photo</Label>
              <MediaPicker value={selected.image} onChange={(url) => update({ image: url })} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={selected.name} onChange={(e) => update({ name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Role / title</Label>
                <Input value={selected.role || ""} onChange={(e) => update({ role: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Biography</Label>
              <Textarea rows={4} value={selected.bio || ""} onChange={(e) => update({ bio: e.target.value })} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>LinkedIn URL</Label>
                <Input value={selected.linkedin || ""} onChange={(e) => update({ linkedin: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Order</Label>
                <Input type="number" value={selected.order} onChange={(e) => update({ order: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
