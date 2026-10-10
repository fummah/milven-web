"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream px-6">
      <div className="max-w-lg text-center">
        <p className="eyebrow justify-center">Something went wrong</p>
        <h1 className="mt-5 font-serif text-4xl text-navy-900">
          We hit an unexpected error.
        </h1>
        <p className="mt-4 text-slate-500">
          Please try again. If the problem persists, contact
          advisory@milven.co.zw.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
