"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Menu, MessageSquareText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowBadge } from "@/components/ArrowBadge"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { track } from "@/lib/analytics"
import type { GlobalSettings } from "@/lib/content-types"

export function Header({ settings }: { settings: GlobalSettings }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  React.useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const brand = settings?.brand

  function handleEnter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenDropdown(label)
  }
  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 ease-premium print:hidden",
        scrolled
          ? "border-navy-100/80 bg-white/90 shadow-[0_10px_30px_-18px_rgba(6,23,46,0.35)] backdrop-blur-xl"
          : "border-transparent bg-white"
      )}
    >
      <div
        className={cn(
          "container-page flex items-center justify-between transition-all duration-300 ease-premium",
          scrolled ? "h-16" : "h-20"
        )}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label={brand?.name || "Milven"}>
          <Image
            src={brand?.logo || "/images/brand/milven-logo.png"}
            alt={brand?.name || "Milven Consulting Services"}
            width={180}
            height={37}
            priority
            className={cn(
              "w-auto transition-all duration-300",
              scrolled ? "h-10" : "h-11"
            )}
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {settings?.nav?.map((item) => {
            const active = isActive(item.href)
            const hasChildren = item.children && item.children.length > 0
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasChildren && handleEnter(item.label)}
                onMouseLeave={handleLeave}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1 rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors",
                    active ? "text-navy-900" : "text-navy-500 hover:text-navy-900"
                  )}
                >
                  {item.label}
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        openDropdown === item.label && "rotate-180"
                      )}
                    />
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {hasChildren && openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3"
                    >
                      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 shadow-premium">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-cream"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                            <span>
                              <span className="block text-sm font-semibold text-navy-900 group-hover:text-gold-700">
                                {child.label}
                              </span>
                              {child.text && (
                                <span className="mt-0.5 block text-xs text-slate-500">
                                  {child.text}
                                </span>
                              )}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            asChild
            variant="primary"
            size="default"
            className="gap-2.5 border border-gold-600/50 pl-4 pr-5 shadow-gold ring-1 ring-inset ring-white/30 hover:ring-white/50"
          >
            <Link
              href={settings?.cta?.primaryHref || "/contact"}
              onClick={() => track("talk_to_advisor_click", { placement: "header" })}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900/10">
                <MessageSquareText className="h-3.5 w-3.5" />
              </span>
              {settings?.cta?.primaryLabel || "Talk to an Advisor"}
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-100 text-navy-800 transition-colors hover:bg-navy-50"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-navy-900">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Link href="/" className="flex items-center">
                <Image
                  src={brand?.logoWhite || "/images/brand/milven-logo-white.png"}
                  alt={brand?.name || "Milven"}
                  width={180}
                  height={37}
                  className="h-10 w-auto"
                />
              </Link>
              <nav className="mt-8 flex flex-col gap-1 overflow-y-auto" aria-label="Mobile">
                {settings?.nav?.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-xl px-3 py-3 font-serif text-xl transition-colors",
                        isActive(item.href)
                          ? "text-gold-400"
                          : "text-white hover:bg-white/10"
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="mb-1 ml-3 flex flex-col border-l border-white/10 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="rounded-lg px-2 py-2 text-sm text-white/70 hover:text-white"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-6 border-t border-white/10 pt-6">
                <Button asChild variant="primary" size="lg" className="w-full">
                  <Link href={settings?.cta?.primaryHref || "/contact"}>
                    <MessageSquareText className="h-4 w-4" />
                    {settings?.cta?.primaryLabel || "Talk to an Advisor"}
                    <ArrowBadge />
                  </Link>
                </Button>
                <a
                  href={`mailto:${settings?.contact?.email}`}
                  className="mt-4 block text-center text-sm text-white/70"
                >
                  {settings?.contact?.email}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
