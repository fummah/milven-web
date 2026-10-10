"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Search } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

export interface InsightLite {
  id: string
  slug: string
  title: string
  excerpt: string | null
  category: string | null
  image: string | null
  readMinutes: number | null
  publishedAt: string | Date
}

export function InsightsGrid({
  insights,
  categories
}: {
  insights: InsightLite[]
  categories: string[]
}) {
  const [active, setActive] = React.useState("All")
  const [query, setQuery] = React.useState("")

  const filtered = insights.filter((i) => {
    const matchCat = active === "All" || i.category === active
    const matchQuery =
      query.trim() === "" ||
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      (i.excerpt || "").toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQuery
  })

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                active === cat
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-100 bg-white text-navy-600 hover:border-navy-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search insights..."
            className="h-11 w-full rounded-full border border-navy-100 bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-navy-200 p-16 text-center">
          <p className="font-serif text-2xl text-navy-800">No insights found</p>
          <p className="mt-2 text-sm text-slate-500">
            Try a different category or search term.
          </p>
        </div>
      ) : (
        <motion.div layout className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((i) => (
              <motion.div
                key={i.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/insights/${i.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100/70 bg-white shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-card-hover"
                >
                  {i.image && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={i.image}
                        alt={i.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
                      {i.category}
                    </p>
                    <h3 className="mt-3 text-xl leading-snug text-navy-900">
                      {i.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                      {i.excerpt}
                    </p>
                    <span className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                      {formatDate(i.publishedAt)}
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      {i.readMinutes || 5} min read
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
