import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardApi()
  if (guard) return guard
  const { id } = await params
  const data = await req.json()
  const item = await prisma.caseStudy.update({ where: { id }, data })
  return NextResponse.json(item)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardApi()
  if (guard) return guard
  const { id } = await params
  await prisma.caseStudy.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
