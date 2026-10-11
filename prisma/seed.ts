import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import {
  seedGlobalSettings,
  seedPages,
  seedInsights
} from "./seed-content"

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

async function seedChecklist() {
  const items = [
    { key: "domain", label: "Final website domain", detail: "Confirm the production domain and set NEXT_PUBLIC_SITE_URL.", order: 1 },
    { key: "telephone", label: "Telephone number", detail: "Provide the confirmed phone number to display.", order: 2 },
    { key: "bios", label: "Team / leadership biographies", detail: "Approved names, roles, photos and biographies.", order: 3 },
    { key: "photography", label: "Approved professional photography", detail: "Replace licensed stock imagery with approved photography.", order: 4 },
    { key: "socials", label: "Social media profile URLs", detail: "Confirm official LinkedIn / X / Facebook URLs.", order: 5 },
    { key: "proof", label: "Approved logos, testimonials & case studies", detail: "Written permission required before publishing.", order: 6 },
    { key: "legal", label: "Final Privacy & Terms wording", detail: "Approved legal copy for /privacy and /terms.", order: 7 },
    { key: "crm", label: "CRM / marketing automation platform", detail: "Set CRM_WEBHOOK_URL once the platform is chosen.", order: 8 }
  ]
  for (const it of items) {
    await prisma.checklistItem.upsert({
      where: { key: it.key },
      update: { label: it.label, detail: it.detail, order: it.order },
      create: it
    })
  }
}

async function main() {
  await seedAdmin()
  await seedChecklist()

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
