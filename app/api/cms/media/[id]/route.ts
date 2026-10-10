import { NextResponse } from "next/server"
import { unlink } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const asset = await prisma.mediaAsset.findUnique({ where: { id } })
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (asset.url.startsWith("/uploads/")) {
    try {
      await unlink(path.join(process.cwd(), "public", asset.url.replace(/^\//, "")))
    } catch {
      /* file may already be gone */
    }
  }

  await prisma.mediaAsset.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await req.json()
  const asset = await prisma.mediaAsset.update({ where: { id }, data })
  return NextResponse.json(asset)
}
