import crypto from "crypto"

/**
 * AES-256-GCM authenticated encryption for sensitive settings (e.g. the
 * Microsoft client secret). The key is derived from an environment secret and
 * is never stored in the database.
 */
function getKey(): Buffer {
  const raw =
    process.env.EMAIL_SECRET_KEY ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "milven-dev-email-secret-change-me"
  return crypto.createHash("sha256").update(raw).digest()
}

export function encryptSecret(plain: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv.toString("base64"), tag.toString("base64"), encrypted.toString("base64")].join(":")
}

export function decryptSecret(payload: string | null | undefined): string | null {
  if (!payload) return null
  try {
    const [ivB64, tagB64, encB64] = payload.split(":")
    const iv = Buffer.from(ivB64, "base64")
    const tag = Buffer.from(tagB64, "base64")
    const enc = Buffer.from(encB64, "base64")
    const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8")
  } catch {
    return null
  }
}
