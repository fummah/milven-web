import { prisma } from "@/lib/prisma"
import { getPublicEmailConfig } from "@/lib/email/config"
import { getTemplate, TEMPLATE_TYPES } from "@/lib/email/templates"
import { EmailManager } from "@/components/admin/EmailManager"

export const dynamic = "force-dynamic"

export default async function AdminEmail() {
  const config = await getPublicEmailConfig()
  const templates = await Promise.all(TEMPLATE_TYPES.map((t) => getTemplate(t.type)))
  const logs = await prisma.emailDeliveryLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  })

  const configView = {
    ...config,
    lastSuccessAt: config.lastSuccessAt ? config.lastSuccessAt.toISOString() : null,
    lastFailureAt: config.lastFailureAt ? config.lastFailureAt.toISOString() : null
  }

  const logView = logs.map((log) => ({
    id: log.id,
    submissionRef: log.submissionRef,
    templateType: log.templateType,
    recipient: log.recipient,
    status: log.status,
    attempts: log.attempts,
    lastError: log.lastError,
    createdAt: log.createdAt.toISOString()
  }))

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Email Configuration</h1>
        <p className="mt-2 text-sm text-slate-500">
          Microsoft 365 delivery, templates, acknowledgements and delivery logs.
        </p>
      </div>
      <EmailManager
        initialConfig={configView}
        initialTemplates={templates}
        initialLogs={logView}
      />
    </div>
  )
}
