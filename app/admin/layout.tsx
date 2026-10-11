import type { Metadata } from "next"
import { AdminShellFrame } from "@/components/admin/AdminShellFrame"
import { LoginForm } from "@/components/admin/LoginForm"
import { getAdminSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Milven CMS",
  robots: { index: false, follow: false }
}

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  // Not authenticated: render the sign-in screen *instead of* the requested
  // admin page. The protected page and its data are never rendered.
  if (!session) {
    return <LoginForm from="/admin" />
  }

  return <AdminShellFrame session={session}>{children}</AdminShellFrame>
}
