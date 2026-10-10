import { prisma } from "@/lib/prisma"
import { PagesWorkspace } from "@/components/admin/PagesWorkspace"

export const dynamic = "force-dynamic"

export default async function AdminAcademy() {
  const pages = await prisma.page.findMany({ where: { slug: "academy" } })
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Academy</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage programmes, delivery formats, categories and imagery.
        </p>
      </div>
      <PagesWorkspace pages={pages as any} />
    </div>
  )
}
