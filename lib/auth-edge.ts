import { SignJWT, jwtVerify } from "jose"

export const SESSION_COOKIE = "milven_admin"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

function getSecret() {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "milven-dev-secret-change-me"
  return new TextEncoder().encode(secret)
}

export interface SessionPayload {
  sub: string
  email: string
  name?: string
}

export async function signSession(payload: SessionPayload) {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())
}

export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (!payload.sub || !payload.email) return null
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: payload.name ? String(payload.name) : undefined
    }
  } catch {
    return null
  }
}
