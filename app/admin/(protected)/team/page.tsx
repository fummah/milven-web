import { prisma } from "@/lib/prisma"
import { TeamManager } from "@/components/admin/TeamManager"

export const dynamic = "force-dynamic"

export default async function AdminTeam() {
  const rows = await prisma.teamMember.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Team</h1>
        <p className="mt-2 text-sm text-slate-500">
          Leadership profiles appear on the About page once published. Add biographies
          only once approved.
        </p>
      </div>
      <TeamManager initial={rows as any} />
    </div>
  )
}
