"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function LogoutButton({
  collapsed = false,
  className
}: {
  collapsed?: boolean
  className?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  async function logout() {
    setLoading(true)
    await fetch("/api/auth/logout", { method: "POST" })
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      title={collapsed ? "Sign out" : undefined}
      aria-label="Sign out"
      className={cn(
        "flex items-center rounded-xl border border-cms-border text-sm font-medium text-cms-text transition-colors hover:bg-cms-active hover:text-cms-navy disabled:opacity-50",
        collapsed ? "justify-center px-0 py-2.5" : "gap-2 px-3 py-2.5",
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4 text-cms-muted" />
      )}
      {!collapsed && <span>{loading ? "Signing out..." : "Sign out"}</span>}
    </button>
  )
}
