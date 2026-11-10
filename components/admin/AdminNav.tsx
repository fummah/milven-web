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
  MailCheck,
  Settings,
  FolderKanban,
  Users,
  ClipboardList,
  Share2,
  ExternalLink,
  type LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }]
  },
  {
    label: "Content",
    items: [
      { label: "Website Pages", href: "/admin/pages", icon: FileText },
      { label: "Services", href: "/admin/services", icon: Compass },
      { label: "Academy", href: "/admin/academy", icon: GraduationCap },
      { label: "Industries", href: "/admin/industries", icon: Building2 },
      { label: "Insights", href: "/admin/insights", icon: Newspaper },
      { label: "Case Studies", href: "/admin/case-studies", icon: FolderKanban },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Media Library", href: "/admin/media", icon: Images }
    ]
  },
  {
    label: "Enquiries",
    items: [
      { label: "Contacts", href: "/admin/contacts", icon: Mail },
      { label: "Academy Enquiries", href: "/admin/training", icon: ClipboardList },
      { label: "Email Configuration", href: "/admin/email", icon: MailCheck }
    ]
  },
  {
    label: "System",
    items: [
      { label: "Redirects", href: "/admin/redirects", icon: Share2 },
      { label: "Site Settings", href: "/admin/settings", icon: Settings }
    ]
  }
]

export function AdminNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-5" aria-label="CMS navigation">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          {collapsed ? (
            <div className="mx-3 mb-1 h-px bg-cms-border" aria-hidden />
          ) : (
            <p className="px-3 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cms-muted">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center rounded-xl text-sm font-medium transition-colors",
                  collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                  active
                    ? "bg-cms-active text-cms-navy"
                    : "text-cms-text hover:bg-cms-active/60 hover:text-cms-navy"
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold-500",
                      collapsed && "left-1"
                    )}
                  />
                )}
                <Icon
                  className={cn(
                    "h-[1.15rem] w-[1.15rem] shrink-0",
                    active
                      ? "text-cms-navy"
                      : "text-cms-muted group-hover:text-cms-navy"
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

export function AdminBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/admin"
      aria-label="Milven CMS dashboard"
      className={cn("flex items-center gap-3", collapsed && "justify-center")}
    >
      <Image
        src={collapsed ? "/icon.png" : "/images/brand/milven-logo.png"}
        alt="Milven Consulting"
        width={collapsed ? 40 : 241}
        height={collapsed ? 40 : 100}
        priority
        className={cn("w-auto", collapsed ? "h-8 rounded-md object-contain" : "h-9")}
      />
      {!collapsed && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-sm font-semibold tracking-[0.12em] text-cms-navy">
            MILVEN CMS
          </span>
          <span className="truncate text-[0.7rem] text-cms-muted">
            Website Administration
          </span>
        </span>
      )}
    </Link>
  )
}

export function ViewSiteLink({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/"
      target="_blank"
      title={collapsed ? "View website" : undefined}
      aria-label="View website"
      className={cn(
        "flex items-center rounded-xl border border-cms-border text-sm font-medium text-cms-text transition-colors hover:bg-cms-active hover:text-cms-navy",
        collapsed ? "justify-center px-0 py-2.5" : "gap-2 px-3 py-2.5"
      )}
    >
      <ExternalLink className="h-4 w-4 text-cms-muted" />
      {!collapsed && <span>View website</span>}
    </Link>
  )
}
