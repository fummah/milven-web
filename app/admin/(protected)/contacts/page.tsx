import { prisma } from "@/lib/prisma"
import { ContactsManager } from "@/components/admin/ContactsManager"
import { MailWarning, MailCheck } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminContacts() {
  const rows = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" }
  })
  const initial = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString()
  }))

  const emailConfigured = Boolean(process.env.RESEND_API_KEY)
  const inbox = process.env.CONTACT_TO_EMAIL || "advisory@milven.co.zw"

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
            Email delivery is active. New enquiries are emailed to{" "}
            <strong>{inbox}</strong> and saved here.
          </span>
        ) : (
          <span>
            Email delivery is not configured yet. Enquiries are still saved here.
            Add <strong>RESEND_API_KEY</strong>, <strong>CONTACT_FROM_EMAIL</strong>{" "}
            and <strong>CONTACT_TO_EMAIL</strong> to your environment to email
            enquiries to <strong>{inbox}</strong>.
          </span>
        )}
      </div>

      <ContactsManager initial={initial as any} />
    </div>
  )
}
