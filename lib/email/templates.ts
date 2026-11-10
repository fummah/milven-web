import { prisma } from "@/lib/prisma"

export type EmailTemplateType =
  | "contact_enquiry"
  | "training_enquiry"
  | "visitor_acknowledgement"
  | "quote_request"
  | "consultation_request"
  | "test_email"

export const TEMPLATE_TYPES: { type: EmailTemplateType; label: string }[] = [
  { type: "contact_enquiry", label: "Contact Enquiry Notification" },
  { type: "training_enquiry", label: "Training Enquiry Notification" },
  { type: "visitor_acknowledgement", label: "Visitor Acknowledgement" },
  { type: "quote_request", label: "Quote Request Notification" },
  { type: "consultation_request", label: "Consultation Request Notification" },
  { type: "test_email", label: "Test Email" }
]

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key: string) => {
    return key in vars ? vars[key] : ""
  })
}

const shell = (inner: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;color:#0D1B2A;max-width:600px;margin:0 auto">
  <div style="background:#0D1B2A;padding:20px 24px;border-radius:12px 12px 0 0">
    <span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:1px">MILVEN</span>
    <span style="color:#C89D1E;font-size:11px;letter-spacing:2px;margin-left:8px">CONSULTING SERVICES</span>
  </div>
  <div style="border:1px solid #E6E9EF;border-top:0;border-radius:0 0 12px 12px;padding:24px;background:#ffffff">
    ${inner}
  </div>
  <p style="color:#8a93a0;font-size:11px;margin-top:16px">Milven Consulting Services · advisory@milven.co.zw</p>
</div>`

const detailsTable = (rows: string) => `<table style="width:100%;border-collapse:collapse">${rows}</table>`

export const DEFAULT_TEMPLATES: Record<
  EmailTemplateType,
  { subject: string; htmlBody: string; textBody: string; enabled: boolean }
> = {
  contact_enquiry: {
    subject: "New Website Enquiry — Milven Consulting",
    htmlBody: shell(
      `<h2 style="margin:0 0 4px;font-size:20px">New Website Enquiry</h2>
       <p style="color:#4D5B6A;margin:0 0 18px">A new enquiry was received through the Milven Consulting website.</p>
       {{details}}
       <div style="margin-top:18px;padding:14px;background:#F7F5EF;border-radius:10px;white-space:pre-wrap">${"{{message}}"}</div>
       <p style="color:#8a93a0;font-size:12px;margin-top:18px">Date: {{date}}<br/>Source: Milven Consulting Website</p>`
    ),
    textBody:
      "New enquiry received through the Milven Consulting website.\n\n{{detailsText}}\n\nMessage:\n{{message}}\n\nDate: {{date}}\nSource: Milven Consulting Website",
    enabled: true
  },
  training_enquiry: {
    subject: "New Training Enquiry — Milven Consulting",
    htmlBody: shell(
      `<h2 style="margin:0 0 4px;font-size:20px">New Training Proposal Request</h2>
       <p style="color:#4D5B6A;margin:0 0 18px">A corporate training enquiry was submitted via the Milven website.</p>
       {{details}}
       <div style="margin-top:18px;padding:14px;background:#F7F5EF;border-radius:10px;white-space:pre-wrap">${"{{objectives}}"}</div>
       <p style="color:#8a93a0;font-size:12px;margin-top:18px">Date: {{date}}</p>`
    ),
    textBody:
      "New training proposal request.\n\n{{detailsText}}\n\nObjectives:\n{{objectives}}\n\nDate: {{date}}",
    enabled: true
  },
  visitor_acknowledgement: {
    subject: "Thank You for Contacting Milven Consulting",
    htmlBody: shell(
      `<h2 style="margin:0 0 8px;font-size:20px">Thank you for contacting Milven Consulting</h2>
       <p style="color:#4D5B6A;line-height:1.7">Thank you for contacting Milven Consulting.</p>
       <p style="color:#4D5B6A;line-height:1.7">We have received your enquiry and our team will review it. We will get back to you as soon as possible.</p>
       <p style="color:#4D5B6A;line-height:1.7;margin-top:20px">Kind regards,<br/>Milven Consulting</p>`
    ),
    textBody:
      "Thank you for contacting Milven Consulting.\n\nWe have received your enquiry and our team will review it. We will get back to you as soon as possible.\n\nKind regards,\nMilven Consulting",
    enabled: true
  },
  quote_request: {
    subject: "New Proposal Request — Milven Consulting",
    htmlBody: shell(
      `<h2 style="margin:0 0 4px;font-size:20px">New Proposal Request</h2>
       <p style="color:#4D5B6A;margin:0 0 18px">A formal proposal was requested through the Milven website.</p>
       {{details}}
       <div style="margin-top:18px;padding:14px;background:#F7F5EF;border-radius:10px;white-space:pre-wrap">${"{{message}}"}</div>`
    ),
    textBody: "New proposal request.\n\n{{detailsText}}\n\nMessage:\n{{message}}",
    enabled: true
  },
  consultation_request: {
    subject: "New Consultation Request — Milven Consulting",
    htmlBody: shell(
      `<h2 style="margin:0 0 4px;font-size:20px">New Consultation Request</h2>
       <p style="color:#4D5B6A;margin:0 0 18px">A consultation was requested through the Milven website.</p>
       {{details}}
       <div style="margin-top:18px;padding:14px;background:#F7F5EF;border-radius:10px;white-space:pre-wrap">${"{{message}}"}</div>`
    ),
    textBody: "New consultation request.\n\n{{detailsText}}\n\nMessage:\n{{message}}",
    enabled: true
  },
  test_email: {
    subject: "Milven Email Test",
    htmlBody: shell(
      `<h2 style="margin:0 0 8px;font-size:20px">Email configuration test</h2>
       <p style="color:#4D5B6A;line-height:1.7">This is a test email from the Milven Consulting website CMS.</p>
       <p style="color:#4D5B6A;line-height:1.7">If you received this, Microsoft Graph accepted the message.</p>`
    ),
    textBody:
      "This is a test email from the Milven Consulting website CMS. If you received this, Microsoft Graph accepted the message.",
    enabled: true
  }
}

export async function getTemplate(type: EmailTemplateType) {
  const row = await prisma.emailTemplate.findUnique({ where: { type } })
  if (row) {
    return {
      type: row.type as EmailTemplateType,
      subject: row.subject,
      htmlBody: row.htmlBody,
      textBody: row.textBody,
      enabled: row.enabled
    }
  }
  const def = DEFAULT_TEMPLATES[type]
  return { type, ...def }
}
