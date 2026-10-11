import { prisma } from "@/lib/prisma"
import { CaseStudiesManager } from "@/components/admin/CaseStudiesManager"

export const dynamic = "force-dynamic"

export default async function AdminCaseStudies() {
  const rows = await prisma.caseStudy.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }]
  })
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Case Studies</h1>
        <p className="mt-2 text-sm text-slate-500">
          Publish engagement case studies using the challenge / approach / solution / outcome framework.
          Publish only with client permission.
        </p>
      </div>
      <CaseStudiesManager initial={rows as any} />
    </div>
  )
}
