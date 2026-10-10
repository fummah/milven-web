import Link from "next/link"
import Image from "next/image"
import { Icon } from "@/components/Icon"
import type { GlobalSettings } from "@/lib/content-types"

export function Footer({ settings }: { settings: GlobalSettings }) {
  const brand = settings?.brand
  const contact = settings?.contact
  const footer = settings?.footer
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-[0.4]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/5 blur-3xl" />

      <div className="container-page relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src={brand?.logoWhite || "/images/brand/milven-logo-white.png"}
              alt={brand?.name || "Milven"}
              width={170}
              height={35}
              className="h-9 w-auto"
            />
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
              {footer?.description || brand?.description}
            </p>
            <p className="mt-6 font-serif text-xl italic text-gold-400">
              {brand?.tagline}
            </p>
          </div>

          {footer?.columns?.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-label text-gold-400">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-label text-gold-400">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>
                  {(contact?.addressLines || []).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-gold-400" />
                <a href={`mailto:${contact?.email}`} className="hover:text-white">
                  {contact?.email}
                </a>
              </li>
            </ul>

            {footer?.socials?.length ? (
              <div className="mt-6 flex gap-2">
                {footer.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-400"
                  >
                    <Icon name={s.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 md:flex-row">
          <span>
            © {year} {brand?.name}. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            {footer?.legal?.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
