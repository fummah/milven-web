"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

export function SectionTabs({
  items
}: {
  items: { label: string; href: string }[]
}) {
  const reduce = useReducedMotion()
  const [active, setActive] = React.useState(items[0]?.href ?? "")

  React.useEffect(() => {
    const ids = items.map((i) => i.href.replace("#", ""))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  function go(e: React.MouseEvent, href: string) {
    e.preventDefault()
    document
      .getElementById(href.replace("#", ""))
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
    setActive(href)
  }

  return (
    <div className="sticky top-16 z-30 border-b border-navy-100/70 bg-white/85 backdrop-blur-lg">
      <div className="container-page scrollbar-none overflow-x-auto py-3">
        <nav className="inline-flex gap-1 rounded-full border border-navy-100 bg-cream/80 p-1 shadow-sm">
          {items.map((item) => {
            const isActive = active === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                  isActive ? "text-white" : "text-navy-600 hover:text-navy-900"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="section-tab-active"
                    className="absolute inset-0 rounded-full bg-navy-900 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
