import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { PageHero } from "@/components/PageHero"
import { CtaBand } from "@/components/CtaBand"
import { SectionHeading } from "@/components/SectionHeading"
import { Icon } from "@/components/Icon"
import { ProgrammeExplorer } from "@/components/ProgrammeExplorer"
import { Reveal, RevealStagger, StaggerItem } from "@/components/motion/Reveal"
import { getPage, getPageMetadata } from "@/lib/site"
import type { Programme } from "@/lib/content-types"

const FALLBACK = {
  title: "Milven Executive Finance Academy",
  description:
    "Practical, high-impact executive finance programmes for boards, executives, managers and finance teams."
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getPageMetadata("academy", FALLBACK)
  return { title, description, alternates: { canonical: "/academy" } }
}

export default async function AcademyPage() {
  const page = await getPage("academy")
  const c = (page?.content || {}) as any
  const formats = c.formats || {}
  const programmes: Programme[] = c.programmes || []
  const featured = programmes.filter((p) => p.image).slice(0, 3)

  return (
    <main>
      <PageHero
        eyebrow={c.eyebrow || "Executive Education"}
        title={page?.heroTitle || "Milven Executive Finance Academy"}
        text={page?.heroText}
        image={page?.heroImage}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Executive Finance Academy" }]}
      />

      {/* INTRO */}
      <section className="section">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Practical. Applied. Executive."
              title="Financial intelligence that changes decisions."
              text={c.intro}
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Led by experienced practitioners",
                "Built around real decisions",
                "In-house or open programmes",
                "Customised to your context"
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
                    <Icon name="badge-check" className="h-3.5 w-3.5" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <Reveal direction="left">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-premium">
              <Image
                src="/images/academy/executive-training.jpg"
                alt="Executive training"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* DELIVERY FORMATS */}
      <section className="section bg-cream">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Delivery"
            title={formats.title || "Delivery Formats"}
            text="Choose the format that fits your team, objectives and calendar."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(formats.items || []).map((f: any, i: number) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-navy-100/70 bg-white p-7 shadow-sm transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-card-hover">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                    <Icon name={f.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-navy-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROGRAMMES */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container-page">
            <SectionHeading
              eyebrow="Featured"
              title="Featured programmes."
              text="A selection of our most requested executive programmes."
            />
            <div className="mt-14 grid gap-7 md:grid-cols-3">
              {featured.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100/70 bg-white shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-card-hover">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.image!}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                      <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900">
                        {p.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-xl leading-snug text-navy-900">
                        {p.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-7 text-slate-500">
                        {p.text}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-navy-50 pt-4">
                        <span className="text-xs text-slate-500">
                          {p.duration} · {p.format}
                        </span>
                        <Link
                          href={`/contact?service=Executive+Finance+Academy&programme=${encodeURIComponent(p.title)}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-gold-600"
                        >
                          View programme
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ALL PROGRAMMES */}
      <section className="section bg-cream">
        <div className="container-page">
          <SectionHeading
            eyebrow="Programme Portfolio"
            title="Explore all programmes."
            text="Filter by discipline to find the right programme for your team."
          />
          <div className="mt-12">
            <ProgrammeExplorer programmes={programmes} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS PLACEHOLDER */}
      <section className="section-sm">
        <div className="container-page">
          <Reveal>
            <div className="rounded-3xl border border-dashed border-navy-200 bg-cream/60 p-10 text-center">
              <Icon name="sparkles" className="mx-auto h-6 w-6 text-gold-500" />
              <p className="mt-4 font-serif text-2xl text-navy-800">
                Participant and corporate testimonials
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                {c.testimonialsIntro ||
                  "Approved testimonials will be published here once confirmed."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ENQUIRY CTA */}
      <CtaBand
        title={c.cta?.title || "Invest in Your Leadership."}
        text={c.enquiry?.text || c.cta?.text}
        primaryLabel={c.cta?.primaryLabel || "Request a Corporate Training Proposal"}
        primaryHref={c.cta?.primaryHref || "/contact?service=Executive+Finance+Academy"}
      />
    </main>
  )
}
