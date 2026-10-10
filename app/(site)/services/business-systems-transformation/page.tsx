import type { Metadata } from "next"
import Image from "next/image"
import { PageHero } from "@/components/PageHero"
import { CtaBand } from "@/components/CtaBand"
import { SectionHeading } from "@/components/SectionHeading"
import { Icon } from "@/components/Icon"
import { Reveal, RevealStagger, StaggerItem } from "@/components/motion/Reveal"
import { getPage, getPageMetadata } from "@/lib/site"

const FALLBACK = {
  title: "Business Systems & Transformation",
  description:
    "Milven helps organisations redesign processes and implement systems that enhance visibility, control, efficiency and scalability."
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getPageMetadata(
    "business-systems-transformation",
    FALLBACK
  )
  return {
    title,
    description,
    alternates: { canonical: "/services/business-systems-transformation" }
  }
}

const subnav = [
  { label: "Overview", href: "#overview" },
  { label: "What We Do", href: "#services" },
  { label: "Implementation", href: "#process" },
  { label: "Contact", href: "#cta" }
]

export default async function SystemsPage() {
  const page = await getPage("business-systems-transformation")
  const c = (page?.content || {}) as any

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Business Systems & Transformation",
    provider: { "@type": "ProfessionalService", name: "Milven Consulting Services" },
    description: FALLBACK.description
  }

  return (
    <main>
      <PageHero
        eyebrow={c.eyebrow || "Business Systems & Transformation"}
        title={page?.heroTitle || "Building Smarter, More Efficient Businesses."}
        text={page?.heroText}
        image={page?.heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Business Systems & Transformation" }
        ]}
      />

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

      <section id="overview" className="section scroll-mt-32">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading
              eyebrow={c.overview?.title || "Overview"}
              title="Visibility, control and scalability."
              text={c.overview?.text}
            />
          </div>
          <Reveal direction="left">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-premium">
              <Image
                src={c.dashboard?.image || "/images/services/dashboard.jpg"}
                alt={c.dashboard?.title || "Business dashboard"}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="services" className="section scroll-mt-32 bg-cream">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="What We Do"
            title={c.clusters?.title || "Our Services Include"}
            text="From systems selection to full implementation, we connect technology to business outcomes."
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

      {/* IMPLEMENTATION PROCESS */}
      <section id="process" className="relative scroll-mt-32 overflow-hidden bg-navy-900 py-20 text-white md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-30" />
        <div className="container-page relative">
          <SectionHeading
            light
            eyebrow="Implementation"
            title={c.process?.title || "Our Implementation Method"}
            text="A proven sequence that reduces risk and accelerates value."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3 lg:grid-cols-6">
            {(c.process?.steps || []).map((step: any, i: number) => (
              <Reveal key={step.title} delay={i * 0.07}>
                <div>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 font-sans text-xl font-bold text-white backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD SPLIT */}
      <section className="section">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-premium">
              <Image
                src="/images/services/digital-transformation.jpg"
                alt="Digital transformation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Outcomes"
              title={c.dashboard?.title || "Visibility, control and insight."}
              text={c.dashboard?.text}
            />
          </div>
        </div>
      </section>

      <div id="cta" className="scroll-mt-32">
        <CtaBand
          title={c.cta?.title || "Transform How Your Business Runs."}
          text={c.cta?.text}
          primaryLabel={c.cta?.primaryLabel || "Get In Touch"}
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
