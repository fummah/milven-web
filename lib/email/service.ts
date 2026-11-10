import { prisma } from "@/lib/prisma"
import { getEmailConfig } from "@/lib/email/config"
import { sendGraphMail } from "@/lib/email/graph"
import {
  getTemplate,
  renderTemplate,
  escapeHtml,
  type EmailTemplateType
} from "@/lib/email/templates"

export interface SendResult {
  ok: boolean
  skipped?: boolean
  status?: number
  error?: string
  code?: string
  accepted?: boolean
  attempts?: number
}

function buildDetails(rows: [string, string][]) {
  const present = rows.filter(([, v]) => v && v.trim())
  const html = `<table style="width:100%;border-collapse:collapse">${present
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #EEF1F5;color:#4D5B6A;width:38%">${escapeHtml(
          k
        )}</td><td style="padding:8px 12px;border-bottom:1px solid #EEF1F5;font-weight:600">${escapeHtml(
          v
        )}</td></tr>`
    )
    .join("")}</table>`
  const text = present.map(([k, v]) => `${k}: ${v}`).join("\n")
  return { html, text }
}

export async function sendTemplateEmail(opts: {
  type: EmailTemplateType
  to: string[]
  vars: Record<string, string>
  details?: [string, string][]
  replyTo?: string
  submissionRef?: string
  bypassEnabled?: boolean
}): Promise<SendResult> {
  const cfg = await getEmailConfig()

  if (!opts.bypassEnabled && !cfg.enabled) {
    return { ok: false, skipped: true, error: "Email sending is disabled" }
  }
  if (!opts.to.length) {
    return { ok: false, error: "No recipients configured" }
  }
  if (!cfg.tenantId || !cfg.clientId || !cfg.clientSecret) {
    return { ok: false, error: "Microsoft 365 credentials are not configured" }
  }

  const template = await getTemplate(opts.type)
  if (!template.enabled) {
    return { ok: false, skipped: true, error: "Template is disabled" }
  }

  // Idempotency: don't resend an already-accepted notification for the same submission.
  if (opts.submissionRef) {
    const existing = await prisma.emailDeliveryLog.findFirst({
      where: {
        submissionRef: opts.submissionRef,
        templateType: opts.type,
        status: "ACCEPTED"
      }
    })
    if (existing) return { ok: true, skipped: true, status: 202 }
  }

  const details = opts.details ? buildDetails(opts.details) : { html: "", text: "" }
  const htmlVars: Record<string, string> = Object.fromEntries(
    Object.entries(opts.vars).map(([k, v]) => [k, escapeHtml(v)])
  )
  htmlVars.details = details.html
  htmlVars.detailsText = escapeHtml(details.text)
  const textVars: Record<string, string> = {
    ...opts.vars,
    details: details.text,
    detailsText: details.text
  }

  const subject = renderTemplate(template.subject, textVars)
  const html = renderTemplate(template.htmlBody, htmlVars)
  const text = renderTemplate(template.textBody, textVars)

  const log = await prisma.emailDeliveryLog.create({
    data: {
      submissionRef: opts.submissionRef || null,
      templateType: opts.type,
      recipient: opts.to.join(", "),
      status: "PENDING"
    }
  })

  const result = await sendGraphMail(cfg, {
    to: opts.to,
    subject,
    html,
    text,
    replyTo: opts.replyTo
  })

  await prisma.emailDeliveryLog
    .update({
      where: { id: log.id },
      data: {
        status: result.ok ? "ACCEPTED" : "FAILED",
        attempts: result.attempts,
        // Technical summary (HTTP status, Graph code, request id) for admins.
        lastError: result.ok ? null : (result.technical || result.error || "").slice(0, 500)
      }
    })
    .catch(() => undefined)

  await prisma.emailConfiguration
    .update({
      where: { id: "global" },
      data: result.ok
        ? { lastSuccessAt: new Date(), lastError: null }
        : { lastFailureAt: new Date(), lastError: (result.error || "").slice(0, 500) }
    })
    .catch(() => undefined)

  return {
    ok: result.ok,
    status: result.status,
    error: result.error,
    code: result.code,
    accepted: result.accepted,
    attempts: result.attempts
  }
}

export async function notifyEnquiry(opts: {
  type: EmailTemplateType
  submissionRef: string
  vars: Record<string, string>
  details: [string, string][]
  visitorEmail?: string
}): Promise<SendResult> {
  const cfg = await getEmailConfig()
  const to = cfg.recipients.length ? cfg.recipients : [cfg.senderEmail]
  const replyTo = cfg.replyToBehaviour === "visitor" ? opts.visitorEmail : undefined
  return sendTemplateEmail({
    type: opts.type,
    to,
    vars: opts.vars,
    details: opts.details,
    replyTo,
    submissionRef: opts.submissionRef
  })
}

export async function sendAcknowledgement(opts: {
  submissionRef: string
  to: string
  vars: Record<string, string>
}): Promise<SendResult> {
  const cfg = await getEmailConfig()
  if (!cfg.acknowledgementsEnabled) return { ok: false, skipped: true }
  return sendTemplateEmail({
    type: "visitor_acknowledgement",
    to: [opts.to],
    vars: opts.vars,
    submissionRef: `${opts.submissionRef}:ack`
  })
}

export async function sendTestEmail(to: string): Promise<SendResult> {
  return sendTemplateEmail({ type: "test_email", to: [to], vars: {}, bypassEnabled: true })
}
