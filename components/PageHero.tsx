import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowBadge } from "@/components/ArrowBadge"
import { Reveal } from "@/components/motion/Reveal"
import { cn } from "@/lib/utils"

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  breadcrumbs,
  primary,
  secondary,
  size = "default",
  children
}: {
  eyebrow?: string
  title: string
  text?: string | null
  image?: string | null
  breadcrumbs?: { label: string; href?: string }[]
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  size?: "default" | "large" | "compact"
  children?: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden bg-navy-950 text-white",
        size === "large"
          ? "min-h-[88vh]"
          : size === "compact"
            ? "min-h-[50vh]"
            : "min-h-[68vh]"
      )}
    >
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="animate-hero-in object-cover object-center opacity-90"
        />
      )}

      {/* left diagonal veil with gold + white hairline edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(104deg, rgba(6,23,46,0.90) 0%, rgba(6,23,46,0.78) 36%, rgba(255,255,255,0.14) 36.4%, rgba(6,23,46,0.62) 36.8%, rgba(6,23,46,0.52) 42%, rgba(217,174,95,0.65) 42.4%, rgba(10,35,66,0.22) 42.9%, rgba(6,23,46,0) 64%)"
        }}
      />

      {/* bottom-left corner facet with hairline */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(72deg, rgba(6,23,46,0.66) 0%, rgba(6,23,46,0.42) 22%, rgba(217,174,95,0.42) 22.4%, rgba(6,23,46,0.16) 22.9%, rgba(6,23,46,0) 40%)"
        }}
      />

      {/* depth + top-right vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-navy-950/35 to-transparent" />

      <div className="container-page relative py-24 md:py-32">
        <div className="max-w-3xl">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/50">
              {breadcrumbs.map((b, i) => (
                <span key={b.label} className="flex items-center gap-2">
                  {b.href ? (
                    <Link href={b.href} className="hover:text-gold-400">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="text-white/80">{b.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <span className="text-gold-500/60">/</span>}
                </span>
              ))}
            </nav>
          )}

          {eyebrow && (
            <Reveal>
              <p className="eyebrow-light mb-5">
                <span className="h-px w-8 bg-gold-500" />
                {eyebrow}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.05}>
            <h1 className="text-balance text-4xl leading-[1.05] text-white sm:text-5xl md:text-[4.25rem]">
              {title}
            </h1>
          </Reveal>

          {text && (
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">{text}</p>
            </Reveal>
          )}

          {(primary || secondary) && (
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap gap-3">
                {primary && (
                  <Button asChild variant="primary" size="lg">
                    <Link href={primary.href}>
                      {primary.label}
                      <ArrowBadge />
                    </Link>
                  </Button>
                )}
                {secondary && (
                  <Button asChild variant="light" size="lg">
                    <Link href={secondary.href}>{secondary.label}</Link>
                  </Button>
                )}
              </div>
            </Reveal>
          )}

          {children}
        </div>
      </div>
    </section>
  )
}
