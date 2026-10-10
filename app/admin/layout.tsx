import type { Metadata } from "next"
import { AdminShellFrame } from "@/components/admin/AdminShellFrame"
import { getAdminSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Milven CMS",
  robots: { index: false, follow: false }
}

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()
  return <AdminShellFrame session={session}>{children}</AdminShellFrame>
}
