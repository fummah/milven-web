import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const q = searchParams.get("q")?.trim()

  const items = await prisma.contactSubmission.findMany({
    where: {
      ...(status && status !== "ALL" ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { organisation: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { message: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(items)
}
