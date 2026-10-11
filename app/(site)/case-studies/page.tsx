import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/PageHero"
import { CtaBand } from "@/components/CtaBand"
import { SectionHeading } from "@/components/SectionHeading"
import { Reveal } from "@/components/motion/Reveal"
import { Icon } from "@/components/Icon"
import { getCaseStudies } from "@/lib/site"

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Selected engagements illustrating how Milven helps organisations improve decisions, systems and performance. Published with client approval.",
  alternates: { canonical: "/case-studies" }
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()

  return (
    <main>
      <PageHero
        eyebrow="Case Studies"
        title="Selected Engagements"
        text="How Milven helps organisations make better decisions, build better systems and improve performance. Published with client permission."
        image="/images/insights/strategy.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Case Studies" }]}
      />

      <section className="section">
        <div className="container-page">
          {caseStudies.length > 0 ? (
            <>
              <SectionHeading
                eyebrow="Our Work"
                title="Engagements and outcomes."
                text="Each case study follows a consistent framework: challenge, approach, solution and outcome."
              />
              <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {caseStudies.map((cs, i) => (
                  <Reveal key={cs.id} delay={i * 0.06}>
                    <Link
                      href={`/case-studies/${cs.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100/70 bg-white shadow-card transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:shadow-card-hover"
                    >
                      {cs.image && (
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={cs.image}
                            alt={cs.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gold-600">
                          {cs.sector || "Case Study"}
                        </p>
                        <h3 className="mt-3 text-xl leading-snug text-navy-900">
                          {cs.title}
                        </h3>
                        <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                          {cs.summary}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-600">
                          Read case study
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <Reveal>
              <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-navy-200 bg-cream/60 p-12 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                  <Icon name="file-text" className="h-6 w-6" />
                </span>
                <h2 className="mt-6 font-serif text-3xl text-navy-900">
                  Case studies coming soon
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-slate-500">
                  Milven publishes case studies only with client permission or in
                  appropriately anonymised form. As engagements are approved for
                  publication, they will appear here.
                </p>
                <div className="mt-8 flex justify-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex h-11 items-center rounded-xl bg-gold-500 px-5 text-sm font-semibold text-navy-900"
                  >
                    Discuss your challenge
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex h-11 items-center rounded-xl border border-navy-200 px-5 text-sm font-semibold text-navy-800"
                  >
                    Explore our services
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <CtaBand
        title="Let's discuss your challenge."
        text="Speak to our team about how we can help your organisation."
        primaryLabel="Talk to an Advisor"
        primaryHref="/contact"
      />
    </main>
  )
}
