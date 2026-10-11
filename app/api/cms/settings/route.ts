import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"

export async function GET() {
  const guard = await guardApi()
  if (guard) return guard
  const row = await prisma.siteSetting.findUnique({ where: { id: "global" } })
  return NextResponse.json(row?.data ?? {})
}

export async function PUT(req: Request) {
  const guard = await guardApi()
  if (guard) return guard
  const data = await req.json()
  const row = await prisma.siteSetting.upsert({
    where: { id: "global" },
    update: { data },
    create: { id: "global", data }
  })
  return NextResponse.json(row)
}
