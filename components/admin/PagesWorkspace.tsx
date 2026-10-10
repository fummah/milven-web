"use client"

import * as React from "react"
import { PageEditor, type PageRecord } from "@/components/admin/PageEditor"
import { cn } from "@/lib/utils"

export function PagesWorkspace({ pages }: { pages: PageRecord[] }) {
  const [slug, setSlug] = React.useState(pages[0]?.slug || "")
  const selected = pages.find((p) => p.slug === slug)

  if (pages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-navy-200 p-16 text-center text-slate-500">
        No pages found. Run the seed to populate content.
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="grid gap-1">
          {pages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSlug(p.slug)}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors",
                slug === p.slug
                  ? "bg-navy-900 text-white"
                  : "text-navy-600 hover:bg-cream"
              )}
            >
              <span className="font-medium">{p.title}</span>
              {!p.published && (
                <span className="text-[0.6rem] uppercase tracking-wide text-gold-500">
                  draft
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>
      <div>
        {selected && <PageEditor key={selected.slug} page={selected} />}
      </div>
    </div>
  )
}
