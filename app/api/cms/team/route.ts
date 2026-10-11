import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const items = await prisma.teamMember.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const data = await req.json()
  const item = await prisma.teamMember.create({ data })
  return NextResponse.json(item)
}
