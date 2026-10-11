import { prisma } from "@/lib/prisma"
import { RedirectsManager } from "@/components/admin/RedirectsManager"

export const dynamic = "force-dynamic"

export default async function AdminRedirects() {
  const rows = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } })
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Redirects</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage 301/307 redirects for renamed or moved pages. Applied at the edge by
          the middleware (cached ~30s).
        </p>
      </div>
      <RedirectsManager initial={rows as any} />
    </div>
  )
}
