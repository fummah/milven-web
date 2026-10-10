import { cookies } from "next/headers"
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
