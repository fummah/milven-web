import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendContactEmail } from "@/lib/mail"
import { notifyEnquiry, sendAcknowledgement } from "@/lib/email/service"
import { forwardToCrm } from "@/lib/crm"
import { contactSchema } from "@/lib/validations"

async function verifyTurnstile(token?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token })
      }
    )
    const data = await res.json()
    return Boolean(data.success)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const data = parsed.data

  // Honeypot: silently accept and discard bot submissions.
  if (data.honeypot) {
    return NextResponse.json({ ok: true })
  }

  const turnstileOk = await verifyTurnstile(data.turnstileToken)
  if (!turnstileOk) {
    return NextResponse.json({ error: "Spam verification failed" }, { status: 400 })
  }

  const saved = await prisma.contactSubmission.create({
    data: {
      name: data.name,
      organisation: data.organisation || null,
      role: data.role || null,
      email: data.email,
      telephone: data.telephone || null,
      service: data.service || null,
      message: data.message,
      preferredMethod: data.preferredMethod || null
    }
  })

  let emailed = false
  let emailError: string | null = null
  try {
    const result = await notifyEnquiry({
      type: "contact_enquiry",
      submissionRef: `contact:${saved.id}`,
      visitorEmail: data.email,
      vars: {
        name: data.name,
        email: data.email,
        phone: data.telephone || "",
        organisation: data.organisation || "",
        service: data.service || "",
        preferredMethod: data.preferredMethod || "",
        message: data.message,
        date: new Date().toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short"
        }),
        source: "Milven Consulting Website"
      },
      details: [
        ["Name", data.name],
        ["Email", data.email],
        ["Phone", data.telephone || ""],
        ["Organisation", data.organisation || ""],
        ["Role", data.role || ""],
        ["Service", data.service || ""],
        ["Preferred contact", data.preferredMethod || ""]
      ]
    })

    if (result.ok) {
      emailed = true
    } else if (result.skipped && process.env.RESEND_API_KEY) {
      // Fallback to the legacy Resend pipeline when Graph is not enabled.
      emailed = await sendContactEmail({
        name: data.name,
        email: data.email,
        organisation: data.organisation || undefined,
        role: data.role || undefined,
        telephone: data.telephone || undefined,
        service: data.service || undefined,
        message: data.message,
        preferredMethod: data.preferredMethod || undefined
      })
      if (!emailed) emailError = "Email not sent (delivery failed)"
    } else {
      emailError = result.error || "Email not sent (configuration missing or delivery failed)"
    }

    if (emailed) {
      await sendAcknowledgement({
        submissionRef: `contact:${saved.id}`,
        to: data.email,
        vars: { name: data.name }
      }).catch(() => undefined)
    }
  } catch (error) {
    emailError = error instanceof Error ? error.message : "Unknown email error"
    console.error("Contact email failed (submission saved):", error)
  }

  if (emailed || emailError) {
    await prisma.contactSubmission
      .update({
        where: { id: saved.id },
        data: { emailed, emailError }
      })
      .catch(() => undefined)
  }

  await forwardToCrm("contact", {
    name: data.name,
    email: data.email,
    organisation: data.organisation,
    role: data.role,
    telephone: data.telephone,
    service: data.service,
    preferredMethod: data.preferredMethod,
    message: data.message
  })

  return NextResponse.json({ ok: true, id: saved.id, emailed })
}
