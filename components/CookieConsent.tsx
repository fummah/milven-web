"use client"

import * as React from "react"
import Script from "next/script"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const KEY = "milven-consent"

export function CookieConsent() {
  const [consent, setConsent] = React.useState<string | null>(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    try {
      setConsent(window.localStorage.getItem(KEY))
    } catch {
      setConsent("declined")
    }
    setReady(true)
  }, [])

  function decide(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(KEY, value)
    } catch {
      /* ignore */
    }
    setConsent(value)
  }

  return (
    <>
      {consent === "accepted" && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}

      {ready && consent === null && (
        <div className="fixed bottom-4 left-4 z-[90] max-w-sm rounded-2xl border border-navy-100 bg-white p-5 shadow-premium print:hidden">
          <p className="font-sans text-sm font-bold text-navy-900">
            Cookies &amp; privacy
          </p>
          <p className="mt-2 text-xs leading-6 text-slate-500">
            We use cookies to understand how the site is used and to improve it.
            You can accept or decline analytics cookies.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button size="sm" onClick={() => decide("accepted")}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => decide("declined")}>
              Decline
            </Button>
            <Link
              href="/privacy"
              className="ml-auto text-xs text-slate-500 hover:text-gold-600"
            >
              Privacy
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
