/**
 * Lightweight analytics helper.
 *
 * Sends events to Google Analytics (gtag) when NEXT_PUBLIC_GA_ID is configured,
 * and always pushes to `window.dataLayer` so other tags (GTM, etc.) can consume
 * them. Safe to call from any client component; no-ops on the server.
 */
export type AnalyticsEvent =
  | "talk_to_advisor_click"
  | "cta_click"
  | "contact_form_submit"
  | "training_proposal_submit"
  | "company_profile_download"
  | "email_click"
  | "phone_click"
  | "social_click"
  | "insight_read"
  | "challenge_navigator_select"
  | "service_card_click"

export function track(event: AnalyticsEvent | string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", event, params || {})
    }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event, ...params })
  } catch {
    /* ignore */
  }
}
