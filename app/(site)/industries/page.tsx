import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/PageHero"
import { CtaBand } from "@/components/CtaBand"
import { SectionHeading } from "@/components/SectionHeading"
import { Reveal } from "@/components/motion/Reveal"
import { getPage, getPageMetadata } from "@/lib/site"

const FALLBACK = {
  title: "Industries",
  description: "Cross-sector experience and commercial perspective across African markets."
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getPageMetadata("industries", FALLBACK)
  return { title, description, alternates: { canonical: "/industries" } }
}

export default async function IndustriesPage() {
  const page = await getPage("industries")
  const c = (page?.content || {}) as any
  const industries: any[] = c.industries || []

  return (
    <main>
      <PageHero
        eyebrow={c.eyebrow || "Industries We Serve"}
        title={page?.heroTitle || "We Serve Diverse Industries"}
        text={page?.heroText}
        image={page?.heroImage}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
      />

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Sector Perspective"
            title="Understanding your sector."
            text={c.intro}
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind: any, i: number) => (
              <Reveal key={ind.name} delay={(i % 3) * 0.08}>
                <Link
                  href={`/contact?service=General+Enquiry&industry=${encodeURIComponent(ind.name)}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-card"
                >
                  <Image
                    src={ind.image}
                    alt={ind.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-transparent transition-opacity duration-500 group-hover:from-navy-950/95" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-serif text-xl text-white">{ind.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{ind.text}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold-400">
                      Discuss your sector
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page pb-8">
        <p className="mx-auto max-w-3xl border-t border-navy-100 pt-8 text-center text-xs leading-6 text-slate-400">
          Milven provides management, financial and business-systems advisory
          services. We do not provide statutory audit, assurance or regulated
          investment services.
        </p>
      </div>

      {c.cta && (
        <CtaBand
          title={c.cta.title}
          text={c.cta.text}
          primaryLabel={c.cta.primaryLabel}
          primaryHref={c.cta.primaryHref}
        />
      )}
    </main>
  )
}
