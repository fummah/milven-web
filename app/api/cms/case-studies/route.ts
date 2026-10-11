import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const items = await prisma.caseStudy.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }]
  })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const data = await req.json()
  const item = await prisma.caseStudy.create({ data })
  return NextResponse.json(item)
}
