import { prisma } from "@/lib/prisma"
import { InsightsManager } from "@/components/admin/InsightsManager"

export const dynamic = "force-dynamic"

export default async function AdminInsights() {
  const rows = await prisma.insight.findMany({ orderBy: { createdAt: "desc" } })
  const initial = rows.map((r) => ({
    ...r,
    publishedAt: r.publishedAt.toISOString()
  }))

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Insights</h1>
        <p className="mt-2 text-sm text-slate-500">
          Create and publish articles with a rich-text editor, imagery and SEO fields.
        </p>
      </div>
      <InsightsManager initial={initial as any} />
    </div>
  )
}
