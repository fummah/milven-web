import type { ResolvedEmailConfig } from "@/lib/email/config"

export interface GraphResult {
  ok: boolean
  status?: number
  error?: string
  attempts: number
  accepted?: boolean
}

interface TokenResult {
  token?: string
  error?: string
}

let tokenCache: { key: string; token: string; expiresAt: number } | null = null

const TOKEN_URL = (tenantId: string) =>
  `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`

export async function getGraphToken(cfg: ResolvedEmailConfig): Promise<TokenResult> {
  if (!cfg.tenantId || !cfg.clientId || !cfg.clientSecret) {
    return { error: "Microsoft 365 credentials are not fully configured." }
  }

  const key = `${cfg.tenantId}:${cfg.clientId}`
  if (tokenCache && tokenCache.key === key && Date.now() < tokenCache.expiresAt) {
    return { token: tokenCache.token }
  }

  try {
    const res = await fetch(TOKEN_URL(cfg.tenantId), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials"
      })
    })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok || !data.access_token) {
      const msg =
        (data.error_description as string) ||
        (data.error as string) ||
        `Token request failed (HTTP ${res.status})`
      return { error: String(msg) }
    }
    const expiresIn = Number(data.expires_in) || 3600
    tokenCache = {
      key,
      token: String(data.access_token),
      // refresh a minute before expiry
      expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000
    }
    return { token: String(data.access_token) }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Network error contacting Microsoft" }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendGraphMail(
  cfg: ResolvedEmailConfig,
  message: { to: string[]; subject: string; html: string; text: string; replyTo?: string }
): Promise<GraphResult> {
  if (!cfg.senderEmail) {
    return { ok: false, error: "Sender mailbox is not configured.", attempts: 0 }
  }
  if (message.to.length === 0) {
    return { ok: false, error: "No recipients configured.", attempts: 0 }
  }

  const payload = {
    message: {
      subject: message.subject,
      body: { contentType: "HTML", content: message.html },
      from: {
        emailAddress: {
          address: cfg.senderEmail,
          ...(cfg.senderName ? { name: cfg.senderName } : {})
        }
      },
      toRecipients: message.to.map((address) => ({ emailAddress: { address } })),
      ...(message.replyTo
        ? { replyTo: [{ emailAddress: { address: message.replyTo } }] }
        : {})
    },
    saveToSentItems: true
  }

  const maxAttempts = 3
  let lastError = "Unknown error"

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { token, error } = await getGraphToken(cfg)
    if (!token) {
      // Configuration/auth error — do not retry indefinitely.
      return { ok: false, error, attempts: attempt }
    }

    try {
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cfg.senderEmail)}/sendMail`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      )

      if (res.status === 202) {
        // 202 = accepted by Graph, not confirmed delivery.
        return { ok: true, status: 202, accepted: true, attempts: attempt }
      }

      const bodyText = await res.text().catch(() => "")
      lastError = `HTTP ${res.status}: ${bodyText.slice(0, 400)}`

      const transient = res.status === 429 || res.status >= 500
      if (!transient) {
        return { ok: false, status: res.status, error: lastError, attempts: attempt }
      }

      // Respect Retry-After if present, else exponential backoff.
      const retryAfter = Number(res.headers.get("retry-after"))
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 500 * 2 ** (attempt - 1)
      if (attempt < maxAttempts) await sleep(Math.min(wait, 4000))
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Network error sending mail"
      if (attempt < maxAttempts) await sleep(500 * 2 ** (attempt - 1))
    }
  }

  return { ok: false, error: lastError, attempts: maxAttempts }
}

export async function testGraphConnection(cfg: ResolvedEmailConfig): Promise<GraphResult> {
  const { token, error } = await getGraphToken(cfg)
  if (!token) return { ok: false, error, attempts: 1 }
  try {
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cfg.senderEmail)}?$select=id,mail,userPrincipalName`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (res.ok) return { ok: true, status: res.status, attempts: 1 }
    const bodyText = await res.text().catch(() => "")
    return {
      ok: false,
      status: res.status,
      error: `Sender mailbox check failed (HTTP ${res.status}): ${bodyText.slice(0, 300)}`,
      attempts: 1
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Network error", attempts: 1 }
  }
}
