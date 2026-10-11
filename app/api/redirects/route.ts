import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const rows = await prisma.redirect.findMany()
    if (rows.length === 0) return NextResponse.json({})
    const map: Record<string, { to: string; permanent: boolean }> = {}
    for (const r of rows) map[r.from] = { to: r.to, permanent: r.permanent }
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({})
  }
}
