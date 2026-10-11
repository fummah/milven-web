import { prisma } from "@/lib/prisma"
import type { GlobalSettings } from "@/lib/content-types"
import { defaultSettings } from "@/lib/defaults"
import { seedPages, seedInsights } from "@/prisma/seed-content"

export async function getSettings(): Promise<GlobalSettings> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: "global" } })
    if (row?.data) return row.data as unknown as GlobalSettings
  } catch {
    /* fall through */
  }
  return defaultSettings
}

function fallbackPage(slug: string) {
  const p = seedPages[slug]
  if (!p) return null
  return {
    id: `seed-${slug}`,
    slug,
    title: p.title,
    seoTitle: p.seoTitle ?? null,
    seoDesc: p.seoDesc ?? null,
    heroTitle: p.heroTitle ?? null,
    heroText: p.heroText ?? null,
    heroImage: p.heroImage ?? null,
    content: p.content,
    published: true,
    createdAt: new Date(0),
    updatedAt: new Date(0)
  }
}

export async function getPage(slug: string) {
  try {
    const page = await prisma.page.findUnique({ where: { slug } })
    if (page) return page
  } catch {
    /* fall through to default content */
  }
  return fallbackPage(slug)
}

export async function getPages() {
  try {
    return await prisma.page.findMany({ orderBy: { title: "asc" } })
  } catch {
    return []
  }
}

function fallbackInsights() {
  const now = Date.now()
  return seedInsights.map((i, idx) => ({
    id: `seed-${i.slug}`,
    slug: i.slug,
    title: i.title,
    excerpt: i.excerpt ?? null,
    body: i.body,
    category: i.category ?? null,
    image: i.image ?? null,
    author: i.author ?? null,
    authorRole: i.authorRole ?? null,
    readMinutes: i.readMinutes ?? null,
    featured: Boolean(i.featured),
    published: true,
    publishedAt: new Date(now - idx * 86400000),
    seoTitle: null as string | null,
    seoDesc: null as string | null,
    createdAt: new Date(now),
    updatedAt: new Date(now)
  }))
}

export async function getInsights() {
  try {
    const rows = await prisma.insight.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }]
    })
    if (rows.length > 0) return rows
  } catch {
    /* fall through */
  }
  return fallbackInsights()
}

export async function getInsight(slug: string) {
  try {
    const item = await prisma.insight.findUnique({ where: { slug } })
    if (item) return item
  } catch {
    /* fall through */
  }
  return fallbackInsights().find((i) => i.slug === slug) ?? null
}

export async function getRelatedInsights(
  slug: string,
  category?: string | null,
  take = 3
) {
  try {
    const rows = await prisma.insight.findMany({
      where: {
        published: true,
        slug: { not: slug },
        ...(category ? { category } : {})
      },
      orderBy: { publishedAt: "desc" },
      take
    })
    if (rows.length > 0) return rows
  } catch {
    /* fall through */
  }
  return fallbackInsights()
    .filter((i) => i.slug !== slug && (!category || i.category === category))
    .slice(0, take)
}

export async function getPageMetadata(
  slug: string,
  fallback: { title: string; description: string }
) {
  const page = await getPage(slug)
  const settings = await getSettings()
  return {
    title: page?.seoTitle || fallback.title,
    description: page?.seoDesc || fallback.description,
    settings,
    page
  }
}

export async function getCaseStudies() {
  try {
    return await prisma.caseStudy.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }]
    })
  } catch {
    return []
  }
}

export async function getCaseStudy(slug: string) {
  try {
    return await prisma.caseStudy.findUnique({ where: { slug } })
  } catch {
    return null
  }
}

export async function getTeamMembers() {
  try {
    return await prisma.teamMember.findMany({
      where: { published: true },
      orderBy: { order: "asc" }
    })
  } catch {
    return []
  }
}
