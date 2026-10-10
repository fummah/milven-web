import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/PageHero"
import { SectionHeading } from "@/components/SectionHeading"
import { InsightsGrid } from "@/components/InsightsGrid"
import { Reveal } from "@/components/motion/Reveal"
import { getPage, getPageMetadata, getInsights } from "@/lib/site"
import { formatDate } from "@/lib/utils"

const FALLBACK = {
  title: "Insights",
  description:
    "Thought leadership, executive briefings and practical resources for better decisions."
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getPageMetadata("insights", FALLBACK)
  return { title, description, alternates: { canonical: "/insights" } }
}

export default async function InsightsPage() {
  const [page, insights] = await Promise.all([getPage("insights"), getInsights()])
  const c = (page?.content || {}) as any
  const categories: string[] = c.categories || []

  const featured = insights.find((i) => i.featured) || insights[0]
  const rest = insights.filter((i) => i.id !== featured?.id)

  return (
    <main>
      <PageHero
        eyebrow={c.eyebrow || "Insights & Resources"}
        title={page?.heroTitle || "Insights"}
        text={page?.heroText}
        image={page?.heroImage}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
      />

      <section className="section">
        <div className="container-page">
          {featured && (
            <Reveal>
              <Link
                href={`/insights/${featured.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-navy-100/70 bg-white shadow-premium lg:grid-cols-2"
              >
                <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto">
                  {featured.image && (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <span className="eyebrow">
                    <span className="h-px w-8 bg-gold-500" />
                    Featured · {featured.category}
                  </span>
                  <h2 className="mt-4 text-balance text-3xl leading-tight text-navy-900 md:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-slate-500">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-sm text-slate-400">
                    <span>{formatDate(featured.publishedAt)}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{featured.readMinutes || 5} min read</span>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-600">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="mt-16">
            <SectionHeading
              eyebrow="All Insights"
              title="Executive thinking for better decisions."
            />
            <div className="mt-10">
              <InsightsGrid insights={rest as any} categories={categories} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
