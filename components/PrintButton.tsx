"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { track } from "@/lib/analytics"

export function PrintButton({
  label = "Download Company Profile (PDF)"
}: {
  label?: string
}) {
  return (
    <Button
      size="lg"
      onClick={() => {
        track("company_profile_download", { label })
        window.print()
      }}
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  )
}
