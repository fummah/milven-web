import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params
  const page = await prisma.page.findUnique({where:{slug}})
  return NextResponse.json(page)
}

export async function PUT(req:Request,{params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params
  const data = await req.json()
  const page = await prisma.page.update({where:{slug},data})
  return NextResponse.json(page)
}