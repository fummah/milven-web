import Link from "next/link"
import {
  FileText,
  Newspaper,
  Mail,
  Images,
  ArrowUpRight
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { ChecklistCard } from "@/components/admin/ChecklistCard"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [pages, insights, contacts, media, newContacts, recentContacts, checklist] =
    await Promise.all([
      prisma.page.count(),
      prisma.insight.count(),
      prisma.contactSubmission.count(),
      prisma.mediaAsset.count(),
      prisma.contactSubmission.count({ where: { status: "NEW" } }),
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 6
      }),
      prisma.checklistItem.findMany({ orderBy: { order: "asc" } })
    ])

  const stats = [
    { label: "Pages", value: pages, href: "/admin/pages", icon: FileText },
    { label: "Insights", value: insights, href: "/admin/insights", icon: Newspaper },
    { label: "Media assets", value: media, href: "/admin/media", icon: Images },
    { label: "Enquiries", value: contacts, href: "/admin/contacts", icon: Mail }
  ]

  const quick = [
    { label: "Edit homepage", href: "/admin/pages" },
    { label: "Manage services", href: "/admin/services" },
    { label: "Academy programmes", href: "/admin/academy" },
    { label: "Site settings", href: "/admin/settings" }
  ]

  return (
    <div className="grid gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-label text-gold-600">
          Milven CMS
        </p>
        <h1 className="mt-2 text-4xl text-navy-900">Website Administration</h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Manage every section of the public website — content, media, programmes,
          industries, insights and enquiries.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-navy-200 transition-colors group-hover:text-gold-600" />
              </div>
              <div className="mt-5 font-serif text-4xl text-navy-900">{s.value}</div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-navy-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-navy-900">Recent enquiries</h2>
            <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-700">
              {newContacts} new
            </span>
          </div>
          <div className="mt-5 divide-y divide-navy-50">
            {recentContacts.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">
                No enquiries yet.
              </p>
            )}
            {recentContacts.map((c) => (
              <Link
                key={c.id}
                href="/admin/contacts"
                className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-cream/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy-900">
                    {c.name}
                    {c.organisation ? ` · ${c.organisation}` : ""}
                  </p>
                  <p className="truncate text-xs text-slate-400">{c.email}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block text-xs text-slate-400">
                    {formatDate(c.createdAt)}
                  </span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-gold-600">
                    {c.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-navy-900 p-6 text-white">
          <h2 className="font-serif text-2xl">Quick actions</h2>
          <div className="mt-5 grid gap-2">
            {quick.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {q.label}
                <ArrowUpRight className="h-4 w-4 text-gold-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ChecklistCard initial={checklist as any} />
    </div>
  )
}
