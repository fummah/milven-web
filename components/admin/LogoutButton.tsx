"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function LogoutButton() {
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
      onClick={logout}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Signing out..." : "Sign out"}
    </button>
  )
}
