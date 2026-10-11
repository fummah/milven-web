"use client"

import * as React from "react"
import { toast } from "sonner"
import { Upload, Trash2, ImageIcon, Search, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface MediaItem {
  id: string
  url: string
  filename: string
  alt?: string | null
  width?: number | null
  height?: number | null
  size?: number | null
}

export function MediaPicker({
  value,
  onChange,
  label = "Image"
}: {
  value?: string | null
  onChange: (url: string) => void
  label?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<MediaItem[]>([])
  const [query, setQuery] = React.useState("")
  const [uploading, setUploading] = React.useState(false)

  const load = React.useCallback(async () => {
    const res = await fetch("/api/cms/media")
    if (res.ok) setItems(await res.json())
  }, [])

  React.useEffect(() => {
    if (open) load()
  }, [open, load])

  async function upload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/cms/media", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      toast.success("Image uploaded")
      await load()
      onChange(data.url)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/cms/media/${id}`, { method: "DELETE" })
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success("Image deleted")
    }
  }

  const filtered = items.filter((i) =>
    (i.filename + (i.alt || "")).toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="grid gap-3">
      {value ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-navy-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-dashed border-navy-200 bg-cream text-slate-400">
          <ImageIcon className="h-6 w-6" />
        </div>
      )}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          {value ? "Replace" : "Select"} image
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{label} library</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search images..."
                className="h-10 pl-9"
              />
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-cream">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              />
            </label>
          </div>

          <div className="grid max-h-[50vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
            {filtered.map((item) => (
              <div key={item.id} className="group relative">
                <button
                  type="button"
                  onClick={() => {
                    onChange(item.url)
                    setOpen(false)
                  }}
                  className={cn(
                    "relative block aspect-[4/3] w-full overflow-hidden rounded-lg border-2",
                    value === item.url ? "border-gold-500" : "border-transparent"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.alt || ""} className="h-full w-full object-cover" />
                  {value === item.url && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-navy-900">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
                <div className="mt-1 flex items-center justify-between gap-1">
                  <span className="truncate text-[0.65rem] text-slate-400">
                    {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                    {item.size ? `${Math.round(item.size / 1024)}kb` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="text-slate-400 hover:text-red-500"
                    aria-label="Delete image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-slate-400">
                No images yet. Upload one to get started.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
