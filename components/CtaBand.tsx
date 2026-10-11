"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/motion/Reveal"
import { track } from "@/lib/analytics"

export function CtaBand({
  title,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref
}: {
  title: string
  text?: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}) {
  return (
    <section className="section-sm">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-8 py-14 text-white md:px-16 md:py-16">
            <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-40" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="block h-px w-14 bg-gold-500" />
                <h2 className="mt-5 text-balance text-3xl leading-tight text-white md:text-4xl">
                  {title}
                </h2>
                {text && <p className="mt-4 text-lg text-white/70">{text}</p>}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="primary" size="lg">
                  <Link
                    href={primaryHref}
                    onClick={() => track("cta_click", { placement: "cta_band", href: primaryHref })}
                  >
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                {secondaryLabel && secondaryHref && (
                  <Button asChild variant="light" size="lg">
                    <Link href={secondaryHref}>{secondaryLabel}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
