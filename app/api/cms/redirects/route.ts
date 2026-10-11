import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const items = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const data = await req.json()
  const item = await prisma.redirect.create({ data })
  return NextResponse.json(item)
}
