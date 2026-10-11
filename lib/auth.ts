import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { SESSION_COOKIE, verifySession } from "@/lib/auth-edge"

export async function verifyAdminCredentials(email: string, password: string) {
  const normalised = email.toLowerCase().trim()
  const user = await prisma.adminUser.findUnique({ where: { email: normalised } })
  if (!user) return null
  const ok = await bcrypt.compare(password, user.passwordHash)
  return ok ? user : null
}

export async function getAdminSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  return await verifySession(token)
}

/** Page-level guard: redirects unauthenticated visitors to the CMS login. */
export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")
  return session
}

/** API-level guard: returns a 401 response when unauthenticated, else null. */
export async function guardApi(): Promise<NextResponse | null> {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}
