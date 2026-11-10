import { cookies } from "next/headers"
import { AdminShellFrame } from "@/components/admin/AdminShellFrame"
import { LoginForm } from "@/components/admin/LoginForm"
import { getAdminSession } from "@/lib/auth"
import { SESSION_COOKIE } from "@/lib/auth-edge"

export const dynamic = "force-dynamic"

export default async function ProtectedAdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  // Not authenticated: render the sign-in screen instead of the requested
  // admin page. The protected page and its data are never rendered.
  if (!session) {
    const store = await cookies()
    const expired = Boolean(store.get(SESSION_COOKIE)?.value)
    return <LoginForm from="/admin" expired={expired} />
  }

  return <AdminShellFrame session={session}>{children}</AdminShellFrame>
}
