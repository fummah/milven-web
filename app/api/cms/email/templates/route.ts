import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"
import { getTemplate, TEMPLATE_TYPES, type EmailTemplateType } from "@/lib/email/templates"

export async function GET() {
  const guard = await guardApi()
  if (guard) return guard
  const templates = await Promise.all(TEMPLATE_TYPES.map((t) => getTemplate(t.type)))
  return NextResponse.json(templates)
}

export async function PUT(req: Request) {
  const guard = await guardApi()
  if (guard) return guard

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const type = String(body.type || "") as EmailTemplateType
  if (!TEMPLATE_TYPES.some((t) => t.type === type)) {
    return NextResponse.json({ error: "Unknown template type" }, { status: 400 })
  }

  const subject = String(body.subject || "").trim()
  const htmlBody = String(body.htmlBody || "")
  const textBody = String(body.textBody || "")
  if (!subject) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 })
  }

  const row = await prisma.emailTemplate.upsert({
    where: { type },
    update: { subject, htmlBody, textBody, enabled: Boolean(body.enabled) },
    create: { type, subject, htmlBody, textBody, enabled: Boolean(body.enabled) }
  })

  return NextResponse.json(row)
}
