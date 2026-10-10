import { Resend } from "resend"

export interface ContactEmailInput {
  name: string
  email: string
  organisation?: string
  role?: string
  telephone?: string
  service?: string
  message: string
  preferredMethod?: string
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY)
}

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

/**
 * Sends a website enquiry to the configured Milven inbox via Resend.
 * Gracefully no-ops (returns false) when email is not configured, so the
 * enquiry is still recorded in the database.
 */
export async function sendContactEmail(input: ContactEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn(
      "[mail] RESEND_API_KEY is not set — email skipped, enquiry saved to database."
    )
    return false
  }

  const from =
    process.env.CONTACT_FROM_EMAIL || "Milven Website <onboarding@resend.dev>"
  const to = process.env.CONTACT_TO_EMAIL || "advisory@milven.co.zw"

  const rows: [string, string][] = [
    ["Name", input.name],
    ["Email", input.email],
    ["Organisation", input.organisation || "—"],
    ["Position / Role", input.role || "—"],
    ["Telephone", input.telephone || "—"],
    ["Service of interest", input.service || "—"],
    ["Preferred contact", input.preferredMethod || "—"],
    ["Received", new Date().toUTCString()]
  ]

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    input.message
  ].join("\n")

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#0A2342;max-width:600px">
      <h2 style="margin:0 0 4px">New website enquiry</h2>
      <p style="margin:0 0 20px;color:#4D5B6A">A new enquiry was submitted via the Milven website.</p>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #EEF1F5;color:#4D5B6A;width:38%">${label}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #EEF1F5;font-weight:600">${escape(
              value
            )}</td>
          </tr>`
          )
          .join("")}
      </table>
      <div style="margin-top:20px;padding:16px;background:#F7F5EF;border-radius:10px;white-space:pre-wrap">${escape(
        input.message
      )}</div>
      <p style="margin-top:20px;color:#4D5B6A;font-size:12px">
        Reply directly to this email to contact ${escape(input.name)}.
      </p>
    </div>
  `

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: input.email,
      subject: `New Milven enquiry — ${input.name}${
        input.organisation ? ` (${input.organisation})` : ""
      }`,
      text,
      html
    })
    if (error) {
      console.error("[mail] Resend returned an error:", error)
      return false
    }
    return true
  } catch (error) {
    console.error("[mail] Failed to send enquiry email:", error)
    return false
  }
}
