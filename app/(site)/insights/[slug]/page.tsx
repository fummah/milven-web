import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { CtaBand } from "@/components/CtaBand"
import { Reveal } from "@/components/motion/Reveal"
import { getInsight, getRelatedInsights } from "@/lib/site"
import { siteUrl } from "@/lib/defaults"
import { formatDate, readingTime } from "@/lib/utils"

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = await getInsight(slug)
  if (!item) return { title: "Insight not found" }
  return {
    title: item.seoTitle || item.title,
    description: item.seoDesc || item.excerpt || undefined,
    alternates: { canonical: `/insights/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt || undefined,
      images: item.image ? [{ url: item.image }] : undefined,
      publishedTime: item.publishedAt.toISOString()
    }
  }
}

export default async function InsightPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await getInsight(slug)
  if (!item || !item.published) notFound()

  const related = await getRelatedInsights(item.slug, item.category, 3)
  const minutes = item.readMinutes || readingTime(item.body)

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.excerpt || undefined,
    image: item.image ? `${siteUrl}${item.image}` : undefined,
    datePublished: item.publishedAt.toISOString(),
    dateModified: item.updatedAt.toISOString(),
    author: { "@type": "Organization", name: item.author || "Milven Consulting Services" },
    publisher: {
      "@type": "Organization",
      name: "Milven Consulting Services",
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/brand/milven-logo.png` }
    },
    mainEntityOfPage: `${siteUrl}/insights/${item.slug}`
  }

  return (
    <main>
      <article>
        {/* HERO */}
        <section className="relative flex min-h-[56vh] items-end overflow-hidden bg-navy-950 text-white">
          {item.image && (
            <Image
              src={item.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/40" />
          <div className="container-page relative py-16">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold-400"
            >
              <ArrowLeft className="h-4 w-4" />
              All insights
            </Link>
            <p className="eyebrow-light mt-8">{item.category}</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl leading-[1.08] text-white md:text-6xl">
              {item.title}
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="font-medium text-white/80">
                {item.author || "Milven Advisory"}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>{formatDate(item.publishedAt)}</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>{minutes} min read</span>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="section">
          <div className="container-page grid gap-16 lg:grid-cols-[1fr_20rem]">
            <Reveal>
              <div
                className="prose-milven"
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
            </Reveal>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl border border-navy-100/70 bg-cream p-6">
                  <p className="eyebrow">Author</p>
                  <p className="mt-4 font-serif text-xl text-navy-900">
                    {item.author || "Milven Advisory"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.authorRole || "Milven Consulting Services"}
                  </p>
                </div>
                <div className="rounded-2xl bg-navy-900 p-6 text-white">
                  <p className="font-serif text-xl">Talk to an Advisor</p>
                  <p className="mt-2 text-sm text-white/70">
                    Discuss how these insights apply to your organisation.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-400"
                  >
                    Get in touch
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="section bg-cream">
            <div className="container-page">
              <h2 className="font-serif text-3xl text-navy-900">Related insights</h2>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {related.map((r, i) => (
                  <Reveal key={r.id} delay={i * 0.08}>
                    <Link
                      href={`/insights/${r.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100/70 bg-white shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-card-hover"
                    >
                      {r.image && (
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={r.image}
                            alt={r.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
                          {r.category}
                        </p>
                        <h3 className="mt-3 text-lg leading-snug text-navy-900">
                          {r.title}
                        </h3>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <CtaBand
        title="Let's discuss what this means for you."
        text="Speak to our advisory team about your strategy, finance or transformation priorities."
        primaryLabel="Talk to an Advisor"
        primaryHref="/contact"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
    </main>
  )
}
