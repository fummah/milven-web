import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"
import { getPublicEmailConfig, normalizeRecipients } from "@/lib/email/config"
import { clearGraphTokenCache } from "@/lib/email/graph"
import { encryptSecret } from "@/lib/crypto"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET() {
  const guard = await guardApi()
  if (guard) return guard
  return NextResponse.json(await getPublicEmailConfig())
}

export async function PUT(req: Request) {
  const guard = await guardApi()
  if (guard) return guard

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const senderEmail = String(body.senderEmail || "").trim()
  if (!EMAIL_RE.test(senderEmail)) {
    return NextResponse.json({ error: "A valid sender email is required." }, { status: 400 })
  }

  const recipients = normalizeRecipients(body.recipients)
  const invalid = recipients.filter((r) => !EMAIL_RE.test(r))
  if (invalid.length) {
    return NextResponse.json(
      { error: `Invalid recipient address: ${invalid.join(", ")}` },
      { status: 400 }
    )
  }

  const data: Record<string, unknown> = {
    tenantId: body.tenantId ? String(body.tenantId).trim() : null,
    clientId: body.clientId ? String(body.clientId).trim() : null,
    senderEmail,
    senderName: String(body.senderName || "Milven Consulting").trim(),
    recipients,
    replyToBehaviour: body.replyToBehaviour === "sender" ? "sender" : "visitor",
    enabled: Boolean(body.enabled),
    acknowledgementsEnabled: Boolean(body.acknowledgementsEnabled)
  }

  // Only replace the secret when a new value is supplied; never expose it.
  if (typeof body.clientSecret === "string" && body.clientSecret.trim()) {
    data.clientSecretEnc = encryptSecret(body.clientSecret.trim())
  }
  if (body.clearSecret === true) {
    data.clientSecretEnc = null
  }

  await prisma.emailConfiguration.upsert({
    where: { id: "global" },
    update: data as any,
    create: { id: "global", ...data } as any
  })

  // Credentials may have changed; discard any cached Graph token.
  clearGraphTokenCache()

  return NextResponse.json(await getPublicEmailConfig())
}
