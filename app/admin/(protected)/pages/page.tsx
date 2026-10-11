import { prisma } from "@/lib/prisma"
import { PagesWorkspace } from "@/components/admin/PagesWorkspace"

export const dynamic = "force-dynamic"

export default async function AdminPages() {
  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } })
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Pages</h1>
        <p className="mt-2 text-sm text-slate-500">
          Edit hero content, SEO and structured sections for every page.
        </p>
      </div>
      <PagesWorkspace pages={pages as any} />
    </div>
  )
}
