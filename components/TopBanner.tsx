import { Icon } from "@/components/Icon"
import type { GlobalSettings } from "@/lib/content-types"

export function TopBanner({ settings }: { settings: GlobalSettings }) {
  const items = [
    { icon: "compass", text: "Strategy • Finance • Transformation" },
    {
      icon: "users",
      text: "Advisory and business transformation across industries"
    },
    {
      icon: "trending-up",
      text:
        settings?.brand?.tagline ||
        "Better Decisions • Better Businesses • Better Leaders"
    },
    {
      icon: "graduation-cap",
      text: "Executive Finance Academy — developing financially intelligent leaders"
    }
  ]

  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <div key={`${item.text}-${i}`} className="flex items-center">
          <span className="mx-7 flex items-center gap-2.5">
            <Icon name={item.icon} className="h-4 w-4 shrink-0 text-gold-400" />
            <span className="whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/85">
              {item.text}
            </span>
          </span>
          <span className="h-5 w-px bg-white/15" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="marquee-wrap relative overflow-hidden border-b border-white/10 bg-navy-950 text-white">
      <div className="marquee-track flex w-max animate-marquee items-center py-2">
        <Row />
        <Row hidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-navy-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-navy-950 to-transparent" />
    </div>
  )
}
