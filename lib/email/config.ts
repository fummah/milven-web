import { prisma } from "@/lib/prisma"
import { decryptSecret } from "@/lib/crypto"

export interface ResolvedEmailConfig {
  provider: string
  tenantId: string | null
  clientId: string | null
  clientSecret: string | null
  senderEmail: string
  senderName: string
  recipients: string[]
  replyToBehaviour: string
  enabled: boolean
  acknowledgementsEnabled: boolean
  lastSuccessAt: Date | null
  lastFailureAt: Date | null
  lastError: string | null
}

export function normalizeRecipients(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }
  if (typeof value === "string") {
    return value
      .split(/[,;\s]+/)
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}

export async function getEmailConfig(): Promise<ResolvedEmailConfig> {
  const row = await prisma.emailConfiguration.findUnique({ where: { id: "global" } })
  if (!row) {
    return {
      provider: "microsoft_graph",
      tenantId: null,
      clientId: null,
      clientSecret: null,
      senderEmail: "advisory@milven.co.zw",
      senderName: "Milven Consulting",
      recipients: [],
      replyToBehaviour: "visitor",
      enabled: false,
      acknowledgementsEnabled: false,
      lastSuccessAt: null,
      lastFailureAt: null,
      lastError: null
    }
  }
  return {
    provider: row.provider,
    tenantId: row.tenantId,
    clientId: row.clientId,
    clientSecret: decryptSecret(row.clientSecretEnc),
    senderEmail: row.senderEmail,
    senderName: row.senderName,
    recipients: normalizeRecipients(row.recipients),
    replyToBehaviour: row.replyToBehaviour,
    enabled: row.enabled,
    acknowledgementsEnabled: row.acknowledgementsEnabled,
    lastSuccessAt: row.lastSuccessAt,
    lastFailureAt: row.lastFailureAt,
    lastError: row.lastError
  }
}

/** Config for the browser/CMS — never includes the secret. */
export async function getPublicEmailConfig() {
  const cfg = await getEmailConfig()
  const { clientSecret, ...rest } = cfg
  return { ...rest, hasSecret: Boolean(clientSecret) }
}
