import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"
import { getEmailConfig } from "@/lib/email/config"
import { testGraphConnection } from "@/lib/email/graph"

export async function POST() {
  const guard = await guardApi()
  if (guard) return guard

  const cfg = await getEmailConfig()
  const result = await testGraphConnection(cfg)

  if (result.detail) {
    console.error("[email/test-connection]", result.detail)
  }

  await prisma.emailConfiguration
    .update({
      where: { id: "global" },
      data: result.ok
        ? { lastSuccessAt: new Date(), lastError: null }
        : { lastFailureAt: new Date(), lastError: (result.error || "").slice(0, 500) }
    })
    .catch(() => undefined)

  // Only safe, concise fields reach the browser.
  return NextResponse.json({
    ok: result.ok,
    status: result.status,
    error: result.error,
    code: result.code,
    tokenAcquired: result.tokenAcquired,
    graphAudience: result.graphAudience,
    hasMailSend: result.hasMailSend,
    attempts: result.attempts
  })
}
