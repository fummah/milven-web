"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Compass,
  GraduationCap,
  Building2,
  Newspaper,
  Images,
  Mail,
  Settings,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Services", href: "/admin/services", icon: Compass },
  { label: "Academy", href: "/admin/academy", icon: GraduationCap },
  { label: "Industries", href: "/admin/industries", icon: Building2 },
  { label: "Insights", href: "/admin/insights", icon: Newspaper },
  { label: "Media", href: "/admin/media", icon: Images },
  { label: "Contacts", href: "/admin/contacts", icon: Mail },
  { label: "Site Settings", href: "/admin/settings", icon: Settings }
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className={cn("h-4 w-4", active && "text-gold-400")} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminBrand() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/brand/milven-logo-white.png"
        alt="Milven"
        width={130}
        height={27}
        className="h-7 w-auto"
      />
      <span className="rounded-full border border-gold-500/40 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-gold-400">
        CMS
      </span>
    </div>
  )
}

export function ViewSiteLink() {
  return (
    <Link
      href="/"
      target="_blank"
      className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
    >
      <ExternalLink className="h-4 w-4" />
      View website
    </Link>
  )
}
