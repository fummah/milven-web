import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"

export async function GET() {
  const guard = await guardApi()
  if (guard) return guard
  const items = await prisma.insight.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const guard = await guardApi()
  if (guard) return guard
  const data = await req.json()
  const item = await prisma.insight.create({ data })
  return NextResponse.json(item)
}
