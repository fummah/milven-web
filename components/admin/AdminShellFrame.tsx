"use client"

import { usePathname } from "next/navigation"
import { AdminNav, AdminBrand, ViewSiteLink } from "@/components/admin/AdminNav"
import { LogoutButton } from "@/components/admin/LogoutButton"
import type { SessionPayload } from "@/lib/auth-edge"

export function AdminShellFrame({
  session,
  children
}: {
  session: SessionPayload | null
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
          <div className="flex h-full flex-col gap-8 bg-navy-950 p-6">
            <AdminBrand />
            <AdminNav />
            <div className="mt-auto grid gap-3">
              {session && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[0.65rem] uppercase tracking-wide text-white/40">
                    Signed in
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-white">
                    {session.name || "Administrator"}
                  </p>
                  <p className="truncate text-xs text-white/50">{session.email}</p>
                </div>
              )}
              <LogoutButton />
              <ViewSiteLink />
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
