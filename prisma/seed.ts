import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import {
  seedGlobalSettings,
  seedPages,
  seedInsights
} from "../lib/seed-content"

const prisma = new PrismaClient()

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "advisory@milven.co.zw")
    .toLowerCase()
    .trim()
  const password = process.env.ADMIN_PASSWORD || "MilvenAdmin#2026"
  const name = process.env.ADMIN_NAME || "Milven Administrator"

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    if (existing.name !== name) {
      await prisma.adminUser.update({ where: { email }, data: { name } })
    }
    console.log(`Admin user already exists: ${email}`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.adminUser.create({
    data: { email, name, passwordHash, role: "ADMIN" }
  })
  console.log(`Admin user created: ${email}`)
  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      `Default admin password in use: ${password}  (set ADMIN_PASSWORD to change)`
    )
  }
}

async function main() {
  await seedAdmin()

  await prisma.siteSetting.upsert({
    where: { id: "global" },
    update: { data: seedGlobalSettings as any },
    create: { id: "global", data: seedGlobalSettings as any }
  })

  for (const [slug, page] of Object.entries(seedPages)) {
    const { content, ...rest } = page
    await prisma.page.upsert({
      where: { slug },
      update: { ...rest, content },
      create: { slug, ...rest, content }
    })
  }

  for (const item of seedInsights) {
    const { slug, ...data } = item
    await prisma.insight.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data }
    })
  }

  console.log(`Seed complete: ${Object.keys(seedPages).length} pages, ${seedInsights.length} insights.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => prisma.$disconnect())
