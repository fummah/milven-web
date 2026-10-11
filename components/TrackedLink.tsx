"use client"

import Link from "next/link"
import { track, type AnalyticsEvent } from "@/lib/analytics"

export function TrackedLink({
  href,
  event = "cta_click",
  params,
  className,
  children
}: {
  href: string
  event?: AnalyticsEvent | string
  params?: Record<string, unknown>
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(event, { href, ...params })}
    >
      {children}
    </Link>
  )
}
