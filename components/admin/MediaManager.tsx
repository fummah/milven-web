"use client"

import * as React from "react"
import { toast } from "sonner"
import { Upload, Trash2, Search, Pencil, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MediaItem {
  id: string
  url: string
  filename: string
  alt?: string | null
  width?: number | null
  height?: number | null
  size?: number | null
  mime?: string | null
  createdAt: string
}

export function MediaManager({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = React.useState(initial)
  const [query, setQuery] = React.useState("")
  const [uploading, setUploading] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [altDraft, setAltDraft] = React.useState("")

  async function load() {
    const res = await fetch("/api/cms/media")
    if (res.ok) setItems(await res.json())
  }

  async function upload(files: FileList) {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/cms/media", { method: "POST", body: fd })
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          throw new Error(d.error || "Upload failed")
        }
      }
      toast.success("Upload complete")
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this image?")) return
    const res = await fetch(`/api/cms/media/${id}`, { method: "DELETE" })
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success("Image deleted")
    }
  }

  async function saveAlt(id: string) {
    const res = await fetch(`/api/cms/media/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: altDraft })
    })
    if (res.ok) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, alt: altDraft } : i)))
      setEditingId(null)
      toast.success("Alt text saved")
    }
  }

  const filtered = items.filter((i) =>
    (i.filename + (i.alt || "")).toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media..."
            className="pl-9"
          />
        </div>
        <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload images"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && upload(e.target.files)}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm"
          >
            <div className="relative aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt || ""} className="h-full w-full object-cover" />
            </div>
            <div className="p-3">
              {editingId === item.id ? (
                <div className="flex gap-1">
                  <Input
                    value={altDraft}
                    onChange={(e) => setAltDraft(e.target.value)}
                    placeholder="Alt text"
                    className="h-8 text-xs"
                  />
                  <Button size="icon" className="h-8 w-8" onClick={() => saveAlt(item.id)}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <p className="truncate text-xs text-slate-600">
                  {item.alt || <span className="text-slate-400">No alt text</span>}
                </p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[0.65rem] text-slate-400">
                  {item.width && item.height ? `${item.width}×${item.height}` : ""}
                  {item.size ? ` · ${Math.round(item.size / 1024)}kb` : ""}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingId(item.id)
                      setAltDraft(item.alt || "")
                    }}
                    className="text-slate-400 hover:text-navy-800"
                    aria-label="Edit alt text"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-slate-400 hover:text-red-500"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-16 text-center text-sm text-slate-400">
            No media found.
          </p>
        )}
      </div>
    </div>
  )
}
