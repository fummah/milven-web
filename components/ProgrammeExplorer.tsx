"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Programme } from "@/lib/content-types"

export function ProgrammeExplorer({ programmes }: { programmes: Programme[] }) {
  const categories = React.useMemo(() => {
    const set = Array.from(new Set(programmes.map((p) => p.category).filter(Boolean)))
    return ["All", ...set]
  }, [programmes])

  const [active, setActive] = React.useState("All")

  const filtered =
    active === "All" ? programmes : programmes.filter((p) => p.category === active)

  return (
    <div>
      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {categories.map((cat) => (
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

      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.title}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="group flex h-full flex-col rounded-2xl border border-navy-100/70 bg-white p-6 shadow-sm transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
                {p.category}
              </span>
              <h3 className="mt-3 font-serif text-xl leading-snug text-navy-900">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-slate-500">{p.text}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-navy-50 pt-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gold-500" />
                  {p.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gold-500" />
                  {p.format}
                </span>
              </div>
              <Link
                href={`/contact?service=Executive+Finance+Academy&programme=${encodeURIComponent(p.title)}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-600"
              >
                Enquire
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
