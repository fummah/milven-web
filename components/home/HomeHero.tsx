"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/Icon"
import { ArrowBadge } from "@/components/ArrowBadge"
import { HeroBackground } from "@/components/HeroBackground"
import { cn } from "@/lib/utils"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
}
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

function HeroUnderline() {
  return (
    <svg
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-underline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B9852F" />
          <stop offset="45%" stopColor="#D9AE5F" />
          <stop offset="100%" stopColor="#C89A45" />
        </linearGradient>
      </defs>
      <path
        d="M1.5 6.4 C 44 1.8, 108 0.9, 168 2.7 C 224 4.4, 261 5.9, 298.5 4.1 C 264 9.6, 209 11.3, 150 10.7 C 92 10.1, 42 9.6, 1.5 6.4 Z"
        fill="url(#hero-underline)"
      />
    </svg>
  )
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
  const total = slides.length

  React.useEffect(() => {
    if (reduce || total < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 6800)
    return () => clearInterval(id)
  }, [reduce, total])

  // Split the headline into whole sentences so each renders on its own line.
  const lines = React.useMemo(
    () =>
      (title.match(/[^.!?]+[.!?]?/g) || [title])
        .map((s) => s.trim())
        .filter(Boolean),
    [title]
  )

  const go = (dir: number) => setIndex((i) => ((i + dir) % total + total) % total)

  return (
    <>
      {/* ================= MOBILE ================= */}
      <section className="relative flex min-h-[calc(100svh-7.5rem)] flex-col overflow-hidden bg-cream lg:hidden">
        {/* sliders image as the hero background (mobile only) */}
        <HeroBackground
          images={slides}
          index={reduce ? 0 : index % total}
          showDots={false}
          imgClassName="object-[72%_center]"
        />
        {/* readable overlays: cream on the left, soft cream toward the bottom */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/85 to-cream/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        {/* subtle gold arc, top-right */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border-2 border-gold-400/50" />

        <div className="container-page relative z-10 flex flex-1 flex-col pb-6 pt-8">
          <p className="eyebrow mb-4">
            <span className="h-px w-6 bg-gold-500" />
            {eyebrow}
          </p>

          <h1 className="font-serif text-[1.85rem] leading-[1.08] text-navy-900">
            {lines.map((line, i) => {
              const isLast = i === lines.length - 1
              const base = isLast ? line.replace(/\.$/, "") : line
              return (
                <span key={`${line}-${i}`} className="block whitespace-nowrap">
                  {isLast ? (
                    <span className="relative inline-block">
                      {base}
                      <span className="text-gold-500">.</span>
                      <span className="pointer-events-none absolute -bottom-1 left-0 h-2.5 w-full">
                        <HeroUnderline />
                      </span>
                    </span>
                  ) : (
                    base
                  )}
                </span>
              )
            })}
          </h1>

          <p className="mt-5 max-w-[78%] text-[0.95rem] leading-7 text-slate-700">
            {text}
          </p>

          <div className="mt-auto pt-8">
            {/* mobile slider controls */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 bg-white text-navy-900 shadow-sm transition-colors hover:bg-cream"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      i === (reduce ? 0 : index % total)
                        ? "w-2.5 bg-gold-500"
                        : "w-2.5 bg-navy-200 hover:bg-navy-300"
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 bg-white text-navy-900 shadow-sm transition-colors hover:bg-cream"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* CTAs — always visible on the landing view */}
            <div className="mt-6 space-y-3">
              <Button asChild size="lg" className="w-full justify-between">
                <Link href={primaryHref}>
                  <span>{primaryLabel}</span>
                  <ArrowBadge />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full justify-between">
                <Link href={secondaryHref}>
                  <span>{secondaryLabel}</span>
                  <ArrowBadge />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DESKTOP (unchanged) ================= */}
      <section className="relative hidden overflow-hidden bg-cream lg:flex lg:min-h-[calc(100vh-7.5rem)] lg:items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[52%] bg-dots opacity-70" />

        <div className="absolute inset-y-0 right-0 w-[56%]">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
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
          </motion.div>
        </div>

        <div className="container-page relative w-full">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="py-20 pr-8">
              <motion.div
                variants={container}
                initial={reduce ? false : "hidden"}
                animate="show"
              >
                <motion.p variants={item} className="eyebrow mb-6">
                  <span className="h-px w-8 bg-gold-500" />
                  {eyebrow}
                </motion.p>

                <motion.h1
                  variants={lineGroup}
                  className="text-balance font-sans text-5xl font-extrabold leading-[1.05] tracking-tight text-navy-900 lg:text-[3.5rem]"
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
                              <span className="pointer-events-none absolute -bottom-2.5 left-0 h-3 w-full">
                                <HeroUnderline />
                              </span>
                            ) : (
                              <motion.span
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                                style={{ originX: 0 }}
                                className="pointer-events-none absolute -bottom-2.5 left-0 h-3 w-full"
                              >
                                <HeroUnderline />
                              </motion.span>
                            )}
                          </span>
                        ) : (
                          base
                        )}
                      </motion.span>
                    )
                  })}
                </motion.h1>

                <motion.p
                  variants={item}
                  className="mt-6 max-w-xl text-lg leading-8 text-slate-600"
                >
                  {text}
                </motion.p>

                <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href={primaryHref}>
                      {primaryLabel}
                      <ArrowBadge />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={secondaryHref}>
                      {secondaryLabel}
                      <ArrowBadge />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
          className="absolute bottom-10 left-[42%] z-20 w-auto rounded-2xl bg-white p-5 shadow-premium"
        >
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
        </motion.div>
      </section>
    </>
  )
}
