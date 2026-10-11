import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { guardApi } from "@/lib/auth"

export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}) {
  const guard = await guardApi()
  if (guard) return guard
  const {slug} = await params
  const page = await prisma.page.findUnique({where:{slug}})
  return NextResponse.json(page)
}

export async function PUT(req:Request,{params}:{params:Promise<{slug:string}>}) {
  const guard = await guardApi()
  if (guard) return guard
  const {slug} = await params
  const data = await req.json()
  const page = await prisma.page.update({where:{slug},data})
  return NextResponse.json(page)
}