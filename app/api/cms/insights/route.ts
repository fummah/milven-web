import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const items = await prisma.insight.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const data = await req.json()
  const item = await prisma.insight.create({ data })
  return NextResponse.json(item)
}
