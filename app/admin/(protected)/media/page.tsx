import { prisma } from "@/lib/prisma"
import { MediaManager } from "@/components/admin/MediaManager"

export const dynamic = "force-dynamic"

export default async function AdminMedia() {
  const rows = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } })
  const initial = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString()
  }))

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Media Library</h1>
        <p className="mt-2 text-sm text-slate-500">
          Upload, search and manage images used across the website.
        </p>
      </div>
      <MediaManager initial={initial as any} />
    </div>
  )
}
