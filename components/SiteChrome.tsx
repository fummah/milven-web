"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

/**
 * Renders the public marketing chrome (top banner, header, footer) for the
 * public website. Admin/CMS routes render only their own application shell.
 */
export function SiteChrome({
  topBanner,
  header,
  footer,
  children
}: {
  topBanner: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>
  }

  return (
    <>
      {topBanner}
      {header}
      {children}
      {footer}
    </>
  )
}
