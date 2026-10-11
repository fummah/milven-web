import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { siteUrl } from "@/lib/defaults"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/services/strategy-financial-advisory",
    "/services/business-systems-transformation",
    "/industries",
    "/academy",
    "/insights",
    "/resources",
    "/case-studies",
    "/company-profile",
    "/contact",
    "/privacy",
    "/terms"
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7
  }))

  let insights: MetadataRoute.Sitemap = []
  try {
    const rows = await prisma.insight.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true }
    })
    insights = rows.map((r) => ({
      url: `${siteUrl}/insights/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  } catch {
    /* database unavailable at build time */
  }

  let caseStudies: MetadataRoute.Sitemap = []
  try {
    const rows = await prisma.caseStudy.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true }
    })
    caseStudies = rows.map((r) => ({
      url: `${siteUrl}/case-studies/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  } catch {
    /* database unavailable at build time */
  }

  return [...staticRoutes, ...insights, ...caseStudies]
}
