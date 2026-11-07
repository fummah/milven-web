import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * Compact navy page header for interior pages.
 * A shallow navy strip directly beneath the navigation: optional gold label +
 * divider and a white serif page title, with content-driven height (no
 * viewport-height or oversized photo hero).
 */
export function PageHero({
  eyebrow,
  title,
  text,
  breadcrumbs,
  children
}: {
  eyebrow?: string
  title: string
  text?: string | null
  /** Kept for API compatibility with existing callers; not used (no photo hero). */
  image?: string | null
  breadcrumbs?: { label: string; href?: string }[]
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  size?: "default" | "large" | "compact"
  children?: React.ReactNode
}) {
  const norm = (s?: string) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
  const t = norm(title)
  const e = norm(eyebrow)
  const showLabel = Boolean(eyebrow) && e !== "" && !t.includes(e) && !e.includes(t)

  return (
    <section className="border-b border-white/10 bg-navy-950 text-white">
      <div className="container-page py-4 md:py-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex flex-wrap items-center gap-2 text-[0.7rem] text-white/45"
          >
            {breadcrumbs.map((b, i) => (
              <span key={b.label} className="flex items-center gap-2">
                {b.href ? (
                  <Link href={b.href} className="hover:text-gold-400">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-white/70">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && (
                  <span className="text-gold-500/60">/</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {showLabel && (
          <div className="mb-2">
            <p className="eyebrow-light">
              <span className="h-px w-6 bg-gold-500" />
              {eyebrow}
            </p>
            <span className="mt-2 block h-px w-14 bg-gold-500/70" />
          </div>
        )}

        <h1 className={cn("text-balance font-serif text-3xl leading-tight text-white md:text-4xl")}>
          {title}
        </h1>

        {text && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
            {text}
          </p>
        )}

        {children}
      </div>
    </section>
  )
}
