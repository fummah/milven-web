import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"

export async function GET() {
  const guard = await guardApi()
  if (guard) return guard

  const logs = await prisma.emailDeliveryLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  })
  return NextResponse.json(logs)
}
