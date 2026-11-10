import type { ResolvedEmailConfig } from "@/lib/email/config"

export interface GraphResult {
  ok: boolean
  status?: number
  /** Concise, safe message suitable for the CMS UI. */
  error?: string
  /** Safe classification, e.g. PERMISSION_DENIED, TOKEN, NETWORK. */
  code?: string
  /** Short technical summary (status + Graph code + request id) for logs. */
  technical?: string
  /** Full technical detail — server logs only, never returned to the browser. */
  detail?: string
  attempts: number
  accepted?: boolean
}

export interface GraphConnectionResult {
  ok: boolean
  status?: number
  error?: string
  code?: string
  detail?: string
  tokenAcquired: boolean
  graphAudience: boolean
  hasMailSend: boolean
  attempts: number
}

interface TokenResult {
  token?: string
  error?: string
  detail?: string
  claims?: Record<string, unknown>
}

const GRAPH_RESOURCE_IDS = new Set([
  "https://graph.microsoft.com",
  "https://graph.microsoft.com/",
  "00000003-0000-0000-c000-000000000000"
])

let tokenCache:
  | { key: string; token: string; expiresAt: number; claims: Record<string, unknown> }
  | null = null

const TOKEN_URL = (tenantId: string) =>
  `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`

export function clearGraphTokenCache() {
  tokenCache = null
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1]
    if (!part) return null
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as Record<string, unknown>
  } catch {
    return null
  }
}

function tokenErrorMessage(code?: string) {
  switch (code) {
    case "invalid_client":
      return "Microsoft rejected the application credentials (client ID or secret)."
    case "unauthorized_client":
      return "The application is not authorised for this tenant. An administrator must grant consent."
    case "consent_required":
      return "Administrator consent is required before this application can send email."
    case "invalid_scope":
      return "The Microsoft Graph permission scope is not configured correctly."
    case "invalid_request":
      return "The Microsoft sign-in request was rejected. Check the tenant ID."
    default:
      return "Could not obtain a Microsoft Graph token. Check the tenant ID, client ID and secret."
  }
}

export async function getGraphToken(
  cfg: ResolvedEmailConfig,
  options: { forceRefresh?: boolean } = {}
): Promise<TokenResult> {
  if (!cfg.tenantId || !cfg.clientId || !cfg.clientSecret) {
    return { error: "Microsoft 365 credentials are not fully configured." }
  }

  const key = `${cfg.tenantId}:${cfg.clientId}`
  if (!options.forceRefresh && tokenCache && tokenCache.key === key && Date.now() < tokenCache.expiresAt) {
    return { token: tokenCache.token, claims: tokenCache.claims }
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
      const errorCode = typeof data.error === "string" ? data.error : undefined
      const rawDetail = String(data.error_description || data.error || "")
      // Full AADSTS detail stays on the server for administrator diagnosis.
      console.error("[email/graph] token request failed", {
        status: res.status,
        error: errorCode,
        detail: rawDetail.slice(0, 600)
      })
      return {
        error: tokenErrorMessage(errorCode),
        detail: `Token request failed (HTTP ${res.status})${errorCode ? ` · ${errorCode}` : ""}`
      }
    }

    const token = String(data.access_token)
    const expiresIn = Number(data.expires_in) || 3600
    const claims = decodeJwtPayload(token) || {}
    tokenCache = {
      key,
      token,
      claims,
      // refresh a minute before expiry
      expiresAt: Date.now() + Math.max(60, expiresIn - 60) * 1000
    }
    return { token, claims }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Network error contacting Microsoft"
    console.error("[email/graph] token request network error", { detail })
    return {
      error: "Unable to reach Microsoft sign-in. Check the server's network connection.",
      detail: "Token request network error"
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface ParsedGraphError {
  code?: string
  message?: string
  requestId?: string
  clientRequestId?: string
}

function parseGraphError(bodyText: string, res: Response): ParsedGraphError {
  let parsed: ParsedGraphError = {}
  try {
    const json = JSON.parse(bodyText) as {
      error?: {
        code?: string
        message?: string
        innerError?: Record<string, unknown>
      }
    }
    const inner = json.error?.innerError
    parsed = {
      code: json.error?.code,
      message: json.error?.message,
      requestId: inner
        ? String(inner["request-id"] || inner["requestId"] || "")
        : undefined,
      clientRequestId: inner ? String(inner["client-request-id"] || "") : undefined
    }
  } catch {
    // Non-JSON error body.
  }
  return {
    code: parsed.code,
    message: parsed.message,
    requestId:
      parsed.requestId ||
      res.headers.get("request-id") ||
      res.headers.get("x-ms-request-id") ||
      undefined,
    clientRequestId:
      parsed.clientRequestId || res.headers.get("client-request-id") || undefined
  }
}

function sendErrorMessage(status: number, hasMailSend: boolean) {
  if (status === 403) {
    return hasMailSend
      ? "Microsoft Graph accepted the app's Mail.Send permission but denied this sender mailbox. The mailbox is outside the Exchange Online application access policy or application RBAC scope."
      : "Microsoft Graph denied the send request because the Mail.Send application permission is not present. Grant Mail.Send with admin consent, then try again."
  }
  if (status === 401) {
    return "Microsoft Graph rejected the access token. Re-test the connection or check the app credentials."
  }
  if (status === 404) {
    return "The sender mailbox could not be found in this Microsoft 365 tenant."
  }
  if (status === 400) {
    return "Microsoft Graph rejected the message. Check the sender mailbox and recipient addresses."
  }
  if (status === 429) {
    return "Microsoft Graph is throttling requests. Please try again shortly."
  }
  if (status >= 500) {
    return "Microsoft Graph is temporarily unavailable. Please try again shortly."
  }
  return `Microsoft Graph rejected the request (HTTP ${status}).`
}

function sendErrorCode(status: number, hasMailSend: boolean) {
  if (status === 403) return hasMailSend ? "MAILBOX_SCOPE" : "PERMISSION_DENIED"
  if (status === 401) return "TOKEN_REJECTED"
  if (status === 404) return "MAILBOX_NOT_FOUND"
  if (status === 429) return "THROTTLED"
  if (status >= 500) return "UPSTREAM_ERROR"
  return "REQUEST_REJECTED"
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
  let lastCode: string | undefined
  let lastTechnical: string | undefined
  let lastDetail: string | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const tokenResult = await getGraphToken(cfg)
    if (!tokenResult.token) {
      return {
        ok: false,
        error: tokenResult.error,
        code: "TOKEN",
        technical: tokenResult.detail,
        detail: tokenResult.detail,
        attempts: attempt
      }
    }

    try {
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cfg.senderEmail)}/sendMail`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenResult.token}`,
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
      const graph = parseGraphError(bodyText, res)
      const claims = tokenResult.claims || {}
      const roles = Array.isArray(claims.roles) ? claims.roles.map(String) : []
      const tokenHasMailSend =
        roles.includes("Mail.Send") || roles.includes("Mail.Send.Shared")
      lastCode = sendErrorCode(res.status, tokenHasMailSend)
      lastError = sendErrorMessage(res.status, tokenHasMailSend)
      lastTechnical = `HTTP ${res.status}${graph.code ? ` · ${graph.code}` : ""}${
        graph.requestId ? ` · request-id ${graph.requestId}` : ""
      }`
      lastDetail = graph.message

      console.error("[email/graph] sendMail failed", {
        status: res.status,
        graphCode: graph.code,
        requestId: graph.requestId,
        clientRequestId: graph.clientRequestId,
        attempts: attempt,
        sender: cfg.senderEmail,
        message: graph.message?.slice(0, 300)
      })

      // A stale cached token can be rejected; refresh once and retry.
      if (res.status === 401) {
        clearGraphTokenCache()
        if (attempt < maxAttempts) continue
      }

      const transient = res.status === 429 || res.status >= 500
      if (!transient) {
        return {
          ok: false,
          status: res.status,
          error: lastError,
          code: lastCode,
          technical: lastTechnical,
          detail: lastDetail,
          attempts: attempt
        }
      }

      // Respect Retry-After if present, else exponential backoff.
      const retryAfter = Number(res.headers.get("retry-after"))
      const wait =
        Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : 500 * 2 ** (attempt - 1)
      if (attempt < maxAttempts) await sleep(Math.min(wait, 4000))
    } catch (error) {
      lastError = "Unable to reach Microsoft Graph. Check the server's network connection."
      lastCode = "NETWORK"
      lastTechnical = "Network error contacting Microsoft Graph"
      lastDetail = error instanceof Error ? error.message : undefined
      console.error("[email/graph] sendMail network error", { detail: lastDetail })
      if (attempt < maxAttempts) await sleep(500 * 2 ** (attempt - 1))
    }
  }

  return {
    ok: false,
    error: lastError,
    code: lastCode,
    technical: lastTechnical,
    detail: lastDetail,
    attempts: maxAttempts
  }
}

/**
 * Validates OAuth connectivity without touching directory endpoints.
 *
 * We intentionally do NOT call GET /users/{email}: with only the Mail.Send
 * application permission that endpoint returns 403 Authorization_RequestDenied
 * and would require unnecessary User.Read.All permissions. Actual send
 * authorisation is verified explicitly by Send Test Email (POST sendMail).
 */
export async function testGraphConnection(
  cfg: ResolvedEmailConfig
): Promise<GraphConnectionResult> {
  const tokenResult = await getGraphToken(cfg, { forceRefresh: true })

  if (!tokenResult.token) {
    return {
      ok: false,
      error: tokenResult.error,
      code: "TOKEN",
      detail: tokenResult.detail,
      tokenAcquired: false,
      graphAudience: false,
      hasMailSend: false,
      attempts: 1
    }
  }

  const claims = tokenResult.claims || {}
  const audience = String(claims.aud || "")
  const graphAudience = GRAPH_RESOURCE_IDS.has(audience)
  const roles = Array.isArray(claims.roles) ? claims.roles.map(String) : []
  const hasMailSend = roles.includes("Mail.Send") || roles.includes("Mail.Send.Shared")

  if (!graphAudience) {
    return {
      ok: false,
      status: 200,
      error:
        "The access token was issued for a different resource. Check that the Microsoft Graph .default scope is requested.",
      code: "AUDIENCE",
      detail: `Unexpected token audience: ${audience || "(none)"}`,
      tokenAcquired: true,
      graphAudience: false,
      hasMailSend: false,
      attempts: 1
    }
  }

  if (!hasMailSend) {
    return {
      ok: false,
      status: 200,
      error:
        "Connected to Microsoft Graph, but the Mail.Send application role is not present. Grant Mail.Send with admin consent, then test again.",
      code: "PERMISSION",
      detail: `Token roles: ${roles.join(", ") || "(none)"}`,
      tokenAcquired: true,
      graphAudience: true,
      hasMailSend: false,
      attempts: 1
    }
  }

  return {
    ok: true,
    status: 200,
    tokenAcquired: true,
    graphAudience: true,
    hasMailSend: true,
    attempts: 1
  }
}
