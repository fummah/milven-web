/**
 * Forwards a lead to an external CRM / marketing automation platform.
 * Configure with CRM_WEBHOOK_URL (e.g. a Zapier/Make/HubSpot inbound webhook).
 * No-ops when unset, so the platform can be added without code changes.
 */
export async function forwardToCrm(type: string, payload: Record<string, unknown>) {
  const url = process.env.CRM_WEBHOOK_URL
  if (!url) return false
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, source: "milven-website", ...payload })
    })
    if (!res.ok) {
      console.error(`[crm] webhook responded ${res.status}`)
      return false
    }
    return true
  } catch (error) {
    console.error("[crm] webhook failed:", error)
    return false
  }
}
