"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/Icon"
import { HeroBackground } from "@/components/HeroBackground"

const lineGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  }
}

export function HomeHero({
  eyebrow,
  title,
  text,
  images,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  cardTitle = "Three integrated capabilities",
  cardSubtitle = "Advisory · Systems · Academy"
}: {
  eyebrow: string
  title: string
  text: string
  images: string[]
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  cardTitle?: string
  cardSubtitle?: string
}) {
  const reduce = useReducedMotion()
  const slides = React.useMemo(() => images.filter(Boolean), [images])
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (reduce || slides.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6800)
    return () => clearInterval(id)
  }, [reduce, slides.length])

  const lines = React.useMemo(
    () =>
      (title.match(/[^.!?]+[.!?]?/g) || [title])
        .map((s) => s.trim())
        .filter(Boolean),
    [title]
  )

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-dots opacity-70 lg:w-[52%]" />

      {/* desktop diagonal image */}
      <div className="absolute inset-y-0 right-0 hidden w-[56%] lg:block">
        <div
          className="absolute inset-0 bg-gradient-to-b from-gold-400 to-gold-600"
          style={{ clipPath: "polygon(16% 0, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 2% 100%)" }}
        >
          <HeroBackground images={slides} index={index} onSelect={setIndex} showDots />
          <div className="absolute inset-0 bg-navy-950/25" />
        </div>
      </div>

      <div className="container-page relative w-full">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="py-12 lg:py-20 lg:pr-8">
            <div>
              <p className="eyebrow mb-6">
                <span className="h-px w-8 bg-gold-500" />
                {eyebrow}
              </p>

              <motion.h1
                variants={lineGroup}
                initial={reduce ? false : "hidden"}
                animate="show"
                className="text-balance font-sans text-4xl font-extrabold leading-[1.05] tracking-tight text-navy-900 sm:text-5xl lg:text-[3.5rem]"
              >
                {lines.map((line, i) => {
                  const isLast = i === lines.length - 1
                  const base = isLast ? line.replace(/\.$/, "") : line
                  return (
                    <motion.span key={`${line}-${i}`} variants={item} className="block">
                      {isLast ? (
                        <span className="relative inline-block">
                          {base}
                          <span className="text-gold-500">.</span>
                          {reduce ? (
                            <span className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gold-500" />
                          ) : (
                            <motion.span
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                              style={{ originX: 0 }}
                              className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
                            />
                          )}
                        </span>
                      ) : (
                        base
                      )}
                    </motion.span>
                  )
                })}
              </motion.h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                {text}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={secondaryHref}>
                    {secondaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* mobile image */}
          <div className="relative pb-8 lg:hidden">
            <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
              <HeroBackground images={slides} index={reduce ? 0 : index % slides.length} showDots={false} />
              <div className="absolute inset-0 bg-navy-950/25" />
            </div>
          </div>
        </div>
      </div>

      {/* floating card */}
      <div className="absolute bottom-10 left-1/2 z-20 hidden w-auto rounded-2xl bg-white p-5 shadow-premium lg:block lg:left-[42%]">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-gold-600 ring-1 ring-gold-500/30">
            <Icon name="layers" className="h-6 w-6" />
          </span>
          <div>
            <p className="whitespace-nowrap font-sans text-lg font-bold leading-tight text-navy-900">
              {cardTitle}
            </p>
            <p className="whitespace-nowrap text-sm text-slate-500">{cardSubtitle}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
