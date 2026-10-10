import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageHero } from "@/components/PageHero"
import { CtaBand } from "@/components/CtaBand"
import { SectionHeading } from "@/components/SectionHeading"
import { Icon } from "@/components/Icon"
import { Reveal, RevealStagger, StaggerItem } from "@/components/motion/Reveal"
import { getPage, getPageMetadata, getInsights } from "@/lib/site"
import { formatDate } from "@/lib/utils"

const FALLBACK = {
  title: "Strategy & Financial Advisory",
  description:
    "Milven helps leadership teams strengthen business strategy, financial planning and enterprise performance."
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getPageMetadata(
    "strategy-financial-advisory",
    FALLBACK
  )
  return { title, description, alternates: { canonical: "/services/strategy-financial-advisory" } }
}

const subnav = [
  { label: "Overview", href: "#overview" },
  { label: "What We Do", href: "#services" },
  { label: "Our Approach", href: "#approach" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#cta" }
]

export default async function AdvisoryPage() {
  const [page, insights] = await Promise.all([
    getPage("strategy-financial-advisory"),
    getInsights()
  ])
  const c = (page?.content || {}) as any
  const related = insights.slice(0, 3)

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Strategy & Financial Advisory",
    provider: { "@type": "ProfessionalService", name: "Milven Consulting Services" },
    description: FALLBACK.description
  }

  return (
    <main>
      <PageHero
        eyebrow={c.eyebrow || "Strategy & Financial Advisory"}
        title={page?.heroTitle || "Turning Financial Insight Into Better Business Decisions."}
        text={page?.heroText}
        image={page?.heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Strategy & Financial Advisory" }
        ]}
      />

      {/* STICKY SUBNAV */}
      <div className="sticky top-16 z-30 border-b border-navy-100/70 bg-white/90 backdrop-blur-lg">
        <div className="container-page scrollbar-none flex gap-1 overflow-x-auto py-3">
          {subnav.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-navy-500 transition-colors hover:bg-cream hover:text-navy-900"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      <section id="overview" className="section scroll-mt-32">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading
              eyebrow={c.overview?.title || "Overview"}
              title="Clarity for the decisions that matter most."
              text={c.overview?.text}
            />
            <div className="mt-9">
              <h3 className="eyebrow">Key Outcomes</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {(c.outcomes?.items || []).map((o: string) => (
                  <li key={o} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
                      <Icon name="badge-check" className="h-3.5 w-3.5" />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Reveal direction="left">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-premium">
              <Image
                src="/images/services/financial-analysis.jpg"
                alt="Financial analysis and advisory"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLUSTERS */}
      <section id="services" className="section scroll-mt-32 bg-cream">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="What We Do"
            title={c.clusters?.title || "Our Services Include"}
            text="A comprehensive advisory toolkit covering strategy, finance, performance and governance."
          />
          <RevealStagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(c.clusters?.items || []).map((item: any) => (
              <StaggerItem key={item.title} className="h-full">
                <div className="group h-full rounded-2xl border border-navy-100/70 bg-white p-7 shadow-sm transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-navy-900">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-navy-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{item.text}</p>
                </div>
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* APPROACH */}
      <section id="approach" className="section scroll-mt-32">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Approach"
            title={c.approach?.title || "Our Approach"}
            text="A clear, disciplined path from analysis to action."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(c.approach?.steps || []).map((step: any, i: number) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-navy-100/70 bg-white p-7 shadow-sm">
                  <span className="font-serif text-3xl text-gold-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-serif text-xl text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED INSIGHTS */}
      {related.length > 0 && (
        <section id="insights" className="section scroll-mt-32 bg-cream">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Insights" title="Related thinking." />
              <Link
                href="/insights"
                className="link-underline text-sm font-semibold text-navy-800"
              >
                View all insights
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {related.map((i: any, idx: number) => (
                <Reveal key={i.id} delay={idx * 0.08}>
                  <Link
                    href={`/insights/${i.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100/70 bg-white shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-card-hover"
                  >
                    {i.image && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={i.image}
                          alt={i.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
                        {i.category}
                      </p>
                      <h3 className="mt-3 text-xl leading-snug text-navy-900">{i.title}</h3>
                      <span className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        {formatDate(i.publishedAt)}
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        {i.readMinutes || 5} min read
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <div id="cta" className="scroll-mt-32">
        <CtaBand
          title={c.cta?.title || "Let's Discuss Your Strategy and Financial Needs."}
          text={c.cta?.text}
          primaryLabel={c.cta?.primaryLabel || "Book a Consultation"}
          primaryHref={c.cta?.primaryHref || "/contact"}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
    </main>
  )
}
