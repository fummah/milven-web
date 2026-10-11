import { prisma } from "@/lib/prisma"
import { TrainingManager } from "@/components/admin/TrainingManager"

export const dynamic = "force-dynamic"

export default async function AdminTraining() {
  const rows = await prisma.trainingEnquiry.findMany({
    orderBy: { createdAt: "desc" }
  })
  const initial = rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Academy Enquiries</h1>
        <p className="mt-2 text-sm text-slate-500">
          Corporate training proposal requests from the Academy page.
        </p>
      </div>
      <TrainingManager initial={initial as any} />
    </div>
  )
}
