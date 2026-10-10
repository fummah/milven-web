import { prisma } from "@/lib/prisma"
import type { GlobalSettings } from "@/lib/content-types"
import { defaultSettings } from "@/lib/defaults"

export async function getSettings(): Promise<GlobalSettings> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: "global" } })
    if (!row?.data) return defaultSettings
    return row.data as unknown as GlobalSettings
  } catch {
    return defaultSettings
  }
}

export async function getPage(slug: string) {
  try {
    return await prisma.page.findUnique({ where: { slug } })
  } catch {
    return null
  }
}

export async function getPages() {
  try {
    return await prisma.page.findMany({ orderBy: { title: "asc" } })
  } catch {
    return []
  }
}

export async function getInsights() {
  try {
    return await prisma.insight.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }]
    })
  } catch {
    return []
  }
}

export async function getInsight(slug: string) {
  try {
    return await prisma.insight.findUnique({ where: { slug } })
  } catch {
    return null
  }
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

export async function getRelatedInsights(slug: string, category?: string | null, take = 3) {
  try {
    return await prisma.insight.findMany({
      where: {
        published: true,
        slug: { not: slug },
        ...(category ? { category } : {})
      },
      orderBy: { publishedAt: "desc" },
      take
    })
  } catch {
    return []
  }
}
