import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"

export async function GET() {
  const guard = await guardApi()
  if (guard) return guard
  const items = await prisma.checklistItem.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(items)
}
