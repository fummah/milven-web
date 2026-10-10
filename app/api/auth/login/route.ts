import { NextResponse } from "next/server"
import { z } from "zod"
import { verifyAdminCredentials } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth-edge"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email and password" },
      { status: 400 }
    )
  }

  const { email, password } = parsed.data
  const user = await verifyAdminCredentials(email, password)
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const token = await signSession({
    sub: user.id,
    email: user.email,
    name: user.name || undefined
  })

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE
  })
  return res
}
