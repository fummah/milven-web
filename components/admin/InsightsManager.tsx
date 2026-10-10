"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Save, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MediaPicker } from "@/components/admin/MediaPicker"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { cn, slugify } from "@/lib/utils"

export interface InsightRecord {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  body: string
  category?: string | null
  image?: string | null
  author?: string | null
  authorRole?: string | null
  readMinutes?: number | null
  featured: boolean
  published: boolean
  publishedAt: string
  seoTitle?: string | null
  seoDesc?: string | null
}

const CATEGORIES = [
  "Strategy",
  "Finance",
  "Business Transformation",
  "Technology",
  "Leadership",
  "Corporate Performance",
  "African Business",
  "Executive Education"
]

export function InsightsManager({ initial }: { initial: InsightRecord[] }) {
  const [items, setItems] = React.useState<InsightRecord[]>(initial)
  const [selectedId, setSelectedId] = React.useState<string | null>(
    initial[0]?.id ?? null
  )
  const [saving, setSaving] = React.useState(false)
  const selected = items.find((i) => i.id === selectedId) || null

  function update(patch: Partial<InsightRecord>) {
    setItems((prev) =>
      prev.map((i) => (i.id === selectedId ? { ...i, ...patch } : i))
    )
  }

  async function save() {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/cms/insights/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selected,
          readMinutes: selected.readMinutes ? Number(selected.readMinutes) : null,
          publishedAt: new Date(selected.publishedAt).toISOString()
        })
      })
      if (!res.ok) throw new Error("Save failed")
      toast.success("Insight saved")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function createNew() {
    const payload = {
      title: "Untitled insight",
      slug: `untitled-${Date.now()}`,
      body: "<p>Start writing your insight here.</p>",
      excerpt: "",
      category: "Strategy",
      author: "Milven Advisory",
      authorRole: "Milven Consulting Services",
      readMinutes: 5,
      featured: false,
      published: false,
      publishedAt: new Date().toISOString()
    }
    const res = await fetch("/api/cms/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      toast.error("Could not create insight")
      return
    }
    const created = await res.json()
    setItems((prev) => [created, ...prev])
    setSelectedId(created.id)
    toast.success("Draft created")
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this insight? This cannot be undone.")) return
    const res = await fetch(`/api/cms/insights/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("Delete failed")
      return
    }
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (selectedId === id) setSelectedId(null)
    toast.success("Insight deleted")
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Button onClick={createNew} className="w-full">
          <Plus className="h-4 w-4" /> New insight
        </Button>
        <div className="mt-4 grid gap-1">
          {items.map((i) => (
            <button
              key={i.id}
              onClick={() => setSelectedId(i.id)}
              className={cn(
                "rounded-xl px-4 py-3 text-left text-sm transition-colors",
                selectedId === i.id
                  ? "bg-navy-900 text-white"
                  : "text-navy-600 hover:bg-cream"
              )}
            >
              <span className="flex items-center gap-2 font-medium">
                {i.featured && <Star className="h-3 w-3 text-gold-500" />}
                <span className="line-clamp-2">{i.title}</span>
              </span>
              <span
                className={cn(
                  "mt-1 block text-[0.65rem] uppercase tracking-wide",
                  selectedId === i.id ? "text-white/50" : "text-slate-400"
                )}
              >
                {i.published ? "Published" : "Draft"} · {i.category}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div>
        {!selected ? (
          <div className="rounded-2xl border border-dashed border-navy-200 p-16 text-center text-slate-500">
            Select an insight or create a new one.
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-navy-100 bg-white p-5">
              <div className="flex flex-wrap items-center gap-4">
                <Toggle
                  label="Published"
                  checked={selected.published}
                  onChange={(v) => update({ published: v })}
                />
                <Toggle
                  label="Featured"
                  checked={selected.featured}
                  onChange={(v) => update({ featured: v })}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => remove(selected.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <Button onClick={save} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </Button>
              </div>
            </div>

            <div className="grid gap-5 rounded-2xl border border-navy-100 bg-white p-6">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={selected.title}
                  onChange={(e) =>
                    update({
                      title: e.target.value,
                      slug: selected.slug.startsWith("untitled")
                        ? slugify(e.target.value)
                        : selected.slug
                    })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Slug</Label>
                  <Input
                    value={selected.slug}
                    onChange={(e) => update({ slug: slugify(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <select
                    className="h-12 w-full rounded-xl border border-navy-100 bg-white px-4 text-sm"
                    value={selected.category || ""}
                    onChange={(e) => update({ category: e.target.value })}
                  >
                    <option value="">Uncategorised</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Excerpt</Label>
                <Textarea
                  rows={2}
                  value={selected.excerpt || ""}
                  onChange={(e) => update({ excerpt: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Featured image</Label>
                <MediaPicker
                  value={selected.image}
                  onChange={(url) => update({ image: url })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Author</Label>
                  <Input
                    value={selected.author || ""}
                    onChange={(e) => update({ author: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Author role</Label>
                  <Input
                    value={selected.authorRole || ""}
                    onChange={(e) => update({ authorRole: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Read minutes</Label>
                  <Input
                    type="number"
                    value={selected.readMinutes ?? ""}
                    onChange={(e) =>
                      update({ readMinutes: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>SEO title</Label>
                  <Input
                    value={selected.seoTitle || ""}
                    onChange={(e) => update({ seoTitle: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>SEO description</Label>
                  <Input
                    value={selected.seoDesc || ""}
                    onChange={(e) => update({ seoDesc: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Publish date</Label>
                  <Input
                    type="date"
                    value={selected.publishedAt.slice(0, 10)}
                    onChange={(e) =>
                      update({
                        publishedAt: new Date(e.target.value).toISOString()
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Body</Label>
                <RichTextEditor
                  value={selected.body}
                  onChange={(html) => update({ body: html })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-gold-500" : "bg-navy-200"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[1.4rem]" : "left-0.5"
          )}
        />
      </span>
      <span className="text-sm font-medium text-navy-800">{label}</span>
    </button>
  )
}
