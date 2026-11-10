"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react"
import { AdminNav, AdminBrand, ViewSiteLink } from "@/components/admin/AdminNav"
import { LogoutButton } from "@/components/admin/LogoutButton"
import type { SessionPayload } from "@/lib/auth-edge"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "milven_cms_sidebar_collapsed"

export function AdminShellFrame({
  session,
  children
}: {
  session: SessionPayload | null
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1")
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, [])

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (!mobileOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  function toggleCollapsed() {
    setCollapsed((previous) => {
      const next = !previous
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
      } catch {
        // ignore storage errors
      }
      return next
    })
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  function renderSidebar(mobile: boolean) {
    const isCollapsed = collapsed && !mobile
    return (
      <div className="flex h-full flex-col bg-cms-surface">
        <div
          className={cn(
            "flex items-center border-b border-cms-border",
            isCollapsed ? "justify-center px-2 py-4" : "justify-between gap-3 px-4 py-4"
          )}
        >
          <AdminBrand collapsed={isCollapsed} />
          {mobile ? (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-cms-muted transition-colors hover:bg-cms-active hover:text-cms-navy"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-cms-muted transition-colors hover:bg-cms-active hover:text-cms-navy",
                isCollapsed && "hidden"
              )}
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
          <AdminNav collapsed={isCollapsed} />
        </div>

        <div
          className={cn(
            "grid gap-2 border-t border-cms-border p-3",
            isCollapsed && "justify-items-center"
          )}
        >
          {session && !isCollapsed && (
            <div className="rounded-xl border border-cms-border bg-cms-bg p-3">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-cms-muted">
                Signed in
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-cms-navy">
                {session.name || "Administrator"}
              </p>
              <p className="truncate text-xs text-cms-muted">{session.email}</p>
            </div>
          )}
          <LogoutButton collapsed={isCollapsed} className="w-full" />
          <ViewSiteLink collapsed={isCollapsed} />
          {!mobile &&
            (isCollapsed ? (
              <button
                type="button"
                onClick={toggleCollapsed}
                title="Expand sidebar"
                aria-label="Expand sidebar"
                className="mt-1 flex w-full items-center justify-center rounded-xl px-0 py-2 text-cms-muted transition-colors hover:bg-cms-active hover:text-cms-navy"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-cms-muted transition-colors hover:bg-cms-active hover:text-cms-navy"
              >
                <PanelLeftClose className="h-4 w-4" />
                Collapse sidebar
              </button>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cms-bg text-cms-text">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-cms-border bg-cms-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-cms-text transition-colors hover:bg-cms-active hover:text-cms-navy"
        >
          <Menu className="h-5 w-5" />
        </button>
        <AdminBrand />
      </header>

      <div className="flex">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 border-r border-cms-border bg-cms-surface transition-[width] duration-200 ease-premium lg:block",
            collapsed ? "w-[76px]" : "w-[260px]"
          )}
        >
          {renderSidebar(false)}
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8 lg:p-10">{children}</main>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="CMS navigation"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 animate-in bg-navy-950/40 backdrop-blur-sm fade-in duration-200"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-in border-r border-cms-border bg-cms-surface shadow-premium slide-in-from-left duration-200">
            {renderSidebar(true)}
          </aside>
        </div>
      )}
    </div>
  )
}
