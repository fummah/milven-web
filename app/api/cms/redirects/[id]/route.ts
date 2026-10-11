import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await guardApi()
  if (guard) return guard
  const { id } = await params
  await prisma.redirect.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
