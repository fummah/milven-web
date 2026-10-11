import { prisma } from "@/lib/prisma"
import { PagesWorkspace } from "@/components/admin/PagesWorkspace"

export const dynamic = "force-dynamic"

const SLUGS = ["services", "strategy-financial-advisory", "business-systems-transformation"]

export default async function AdminServices() {
  const pages = await prisma.page.findMany({
    where: { slug: { in: SLUGS } },
    orderBy: { title: "asc" }
  })
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Services</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage the services overview and both service detail pages.
        </p>
      </div>
      <PagesWorkspace pages={pages as any} />
    </div>
  )
}
