import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import crypto from "crypto"
import sharp from "sharp"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"

const MAX_SIZE = 8 * 1024 * 1024
const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"])

export async function GET() {
  const guard = await guardApi()
  if (guard) return guard
  const items = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const guard = await guardApi()
  if (guard) return guard
  const form = await req.formData()
  const file = form.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file supplied" }, { status: 400 })
  }

  if (!allowed.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image exceeds 8 MB" }, { status: 400 })
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`
  const uploadDir = path.join(process.cwd(), "public", "uploads")
  await mkdir(uploadDir, { recursive: true })
  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), bytes)

  let width: number | undefined
  let height: number | undefined
  try {
    const meta = await sharp(bytes).metadata()
    width = meta.width
    height = meta.height
  } catch {
    /* non-fatal */
  }

  const url = `/uploads/${filename}`
  const asset = await prisma.mediaAsset.create({
    data: {
      filename,
      url,
      alt: (form.get("alt") as string) || null,
      folder: (form.get("folder") as string) || "uploads",
      mime: file.type,
      size: file.size,
      width,
      height
    }
  })

  return NextResponse.json({ ok: true, url, asset })
}
