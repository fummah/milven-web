"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ExternalLink, Loader2, Save } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MediaPicker } from "@/components/admin/MediaPicker"
import { SchemaForm } from "@/components/admin/SchemaForm"
import { contentSchemas } from "@/components/admin/page-schemas"

export interface PageRecord {
  id: string
  slug: string
  title: string
  seoTitle?: string | null
  seoDesc?: string | null
  heroTitle?: string | null
  heroText?: string | null
  heroImage?: string | null
  content: any
  published: boolean
}

export function PageEditor({ page }: { page: PageRecord }) {
  const [record, setRecord] = React.useState<PageRecord>(page)
  const [saving, setSaving] = React.useState(false)
  const schema = contentSchemas[page.slug]

  function set<K extends keyof PageRecord>(key: K, value: PageRecord[K]) {
    setRecord((r) => ({ ...r, [key]: value }))
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/cms/pages/${record.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: record.title,
          seoTitle: record.seoTitle || null,
          seoDesc: record.seoDesc || null,
          heroTitle: record.heroTitle || null,
          heroText: record.heroText || null,
          heroImage: record.heroImage || null,
          content: record.content,
          published: record.published
        })
      })
      if (!res.ok) throw new Error("Save failed")
      toast.success("Page saved", { description: `/${record.slug}` })
      const fresh = await res.json()
      setRecord((r) => ({ ...r, ...fresh }))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const publicUrl = page.slug === "home" ? "/" : `/${page.slug}`

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="grid gap-6">
        <Accordion type="multiple" defaultValue={["basic", "hero", "content"]} className="grid gap-4">
          <AccordionItem value="basic" className="rounded-2xl border border-navy-100 bg-white px-5">
            <AccordionTrigger>Basic information</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label>Page title</Label>
                  <Input value={record.title} onChange={(e) => set("title", e.target.value)} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>SEO title</Label>
                    <Input
                      value={record.seoTitle || ""}
                      onChange={(e) => set("seoTitle", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>SEO description</Label>
                    <Input
                      value={record.seoDesc || ""}
                      onChange={(e) => set("seoDesc", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hero" className="rounded-2xl border border-navy-100 bg-white px-5">
            <AccordionTrigger>Hero section</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label>Hero title</Label>
                  <Textarea
                    rows={2}
                    value={record.heroTitle || ""}
                    onChange={(e) => set("heroTitle", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Hero text</Label>
                  <Textarea
                    value={record.heroText || ""}
                    onChange={(e) => set("heroText", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Hero image</Label>
                  <MediaPicker
                    value={record.heroImage}
                    onChange={(url) => set("heroImage", url)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="content" className="rounded-2xl border border-navy-100 bg-white px-5">
            <AccordionTrigger>Page content</AccordionTrigger>
            <AccordionContent>
              {schema ? (
                <SchemaForm
                  schema={schema}
                  value={record.content}
                  onChange={(val) => set("content", val)}
                />
              ) : (
                <div className="grid gap-2">
                  <p className="text-sm text-slate-500">
                    No structured editor is defined for this page. Edit the content as JSON.
                  </p>
                  <Textarea
                    className="min-h-[320px] font-mono text-xs"
                    value={JSON.stringify(record.content, null, 2)}
                    onChange={(e) => {
                      try {
                        set("content", JSON.parse(e.target.value))
                      } catch {
                        /* ignore until valid */
                      }
                    }}
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="grid gap-4 rounded-2xl border border-navy-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-800">Status</span>
            <button
              type="button"
              onClick={() => set("published", !record.published)}
              className={[
                "relative h-6 w-11 rounded-full transition-colors",
                record.published ? "bg-gold-500" : "bg-navy-200"
              ].join(" ")}
              aria-pressed={record.published}
            >
              <span
                className={[
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                  record.published ? "left-[1.4rem]" : "left-0.5"
                ].join(" ")}
              />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            {record.published ? "Published — visible on the public site." : "Draft — hidden from the public site."}
          </p>

          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save page
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href={publicUrl} target="_blank">
              <ExternalLink className="h-4 w-4" />
              Preview page
            </Link>
          </Button>
        </div>
      </aside>
    </div>
  )
}
