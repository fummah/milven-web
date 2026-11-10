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

  await prisma.emailConfiguration
    .update({
      where: { id: "global" },
      data: result.ok
        ? { lastSuccessAt: new Date(), lastError: null }
        : { lastFailureAt: new Date(), lastError: (result.error || "").slice(0, 500) }
    })
    .catch(() => undefined)

  return NextResponse.json(result)
}
