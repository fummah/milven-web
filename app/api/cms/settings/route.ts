import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const row = await prisma.siteSetting.findUnique({ where: { id: "global" } })
  return NextResponse.json(row?.data ?? {})
}

export async function PUT(req: Request) {
  const data = await req.json()
  const row = await prisma.siteSetting.upsert({
    where: { id: "global" },
    update: { data },
    create: { id: "global", data }
  })
  return NextResponse.json(row)
}
