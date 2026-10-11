/* Reset (or create) an administrator password.
 *
 * Usage:
 *   node scripts/reset-admin-password.cjs <email> <new-password>
 *   ADMIN_EMAIL=you@x.com ADMIN_PASSWORD=secret node scripts/reset-admin-password.cjs
 */
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL || "advisory@milven.co.zw")
    .toLowerCase()
    .trim()
  const password = process.argv[3] || process.env.ADMIN_PASSWORD

  if (!password) {
    console.error(
      "ERROR: provide a password.\n  node scripts/reset-admin-password.cjs <email> <password>"
    )
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      name: process.env.ADMIN_NAME || "Milven Administrator",
      role: "ADMIN"
    }
  })

  console.log(`Admin password set for ${user.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
