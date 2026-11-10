import { NextResponse } from "next/server"
import { guardApi } from "@/lib/auth"
import { getEmailConfig } from "@/lib/email/config"
import { sendTestEmail } from "@/lib/email/service"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  const guard = await guardApi()
  if (guard) return guard

  const body = await req.json().catch(() => ({}))
  const cfg = await getEmailConfig()
  const to = String(body?.to || "").trim() || cfg.recipients[0] || cfg.senderEmail

  if (!EMAIL_RE.test(to)) {
    return NextResponse.json({ error: "Enter a valid test recipient email." }, { status: 400 })
  }

  const result = await sendTestEmail(to)
  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    error: result.error,
    code: result.code,
    accepted: result.accepted,
    attempts: result.attempts,
    to
  })
}
