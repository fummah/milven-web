import { prisma } from "@/lib/prisma"
import { ContactsManager } from "@/components/admin/ContactsManager"
import { getEmailConfig } from "@/lib/email/config"
import { MailWarning, MailCheck } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminContacts() {
  const rows = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" }
  })
  const initial = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString()
  }))

  const cfg = await getEmailConfig()
  const graphActive = cfg.enabled && Boolean(cfg.tenantId && cfg.clientId && cfg.clientSecret)
  const emailConfigured = graphActive || Boolean(process.env.RESEND_API_KEY)
  const inbox = cfg.recipients[0] || process.env.CONTACT_TO_EMAIL || "advisory@milven.co.zw"
  const channel = graphActive ? "Microsoft 365 (Graph)" : "Resend"

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Contacts</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review website enquiries, update their status and keep internal notes.
        </p>
      </div>

      <div
        className={
          emailConfigured
            ? "flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
            : "flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        }
      >
        {emailConfigured ? (
          <MailCheck className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <MailWarning className="mt-0.5 h-5 w-5 shrink-0" />
        )}
        {emailConfigured ? (
          <span>
            Email delivery is active via <strong>{channel}</strong>. New enquiries are emailed to{" "}
            <strong>{inbox}</strong> and saved here.
          </span>
        ) : (
          <span>
            Email delivery is not configured yet. Enquiries are still saved here.
            Configure Microsoft 365 in{" "}
            <Link href="/admin/email" className="font-semibold underline">
              Email Configuration
            </Link>{" "}
            (or set <strong>RESEND_API_KEY</strong>) to email enquiries to{" "}
            <strong>{inbox}</strong>.
          </span>
        )}
      </div>

      <ContactsManager initial={initial as any} />
    </div>
  )
}
