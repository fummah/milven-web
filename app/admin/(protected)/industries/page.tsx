import { prisma } from "@/lib/prisma"
import { PagesWorkspace } from "@/components/admin/PagesWorkspace"

export const dynamic = "force-dynamic"

export default async function AdminIndustries() {
  const pages = await prisma.page.findMany({ where: { slug: "industries" } })
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Industries</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage sectors, descriptions and imagery.
        </p>
      </div>
      <PagesWorkspace pages={pages as any} />
    </div>
  )
}
