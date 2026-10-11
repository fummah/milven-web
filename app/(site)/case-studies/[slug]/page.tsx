import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { CtaBand } from "@/components/CtaBand"
import { Reveal } from "@/components/motion/Reveal"
import { getCaseStudy } from "@/lib/site"
import { siteUrl } from "@/lib/defaults"

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cs = await getCaseStudy(slug)
  if (!cs) return { title: "Case study not found" }
  return {
    title: cs.seoTitle || cs.title,
    description: cs.seoDesc || cs.summary || undefined,
    alternates: { canonical: `/case-studies/${cs.slug}` },
    openGraph: {
      title: cs.title,
      description: cs.summary || undefined,
      images: cs.image ? [{ url: cs.image }] : undefined
    }
  }
}

const SECTIONS: { key: "challenge" | "approach" | "solution" | "outcome"; label: string }[] = [
  { key: "challenge", label: "The Challenge" },
  { key: "approach", label: "Milven Approach" },
  { key: "solution", label: "The Solution" },
  { key: "outcome", label: "The Outcome" }
]

export default async function CaseStudyPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cs = await getCaseStudy(slug)
  if (!cs || !cs.published) notFound()

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.summary || undefined,
    image: cs.image ? `${siteUrl}${cs.image}` : undefined,
    author: { "@type": "Organization", name: "Milven Consulting Services" },
    publisher: { "@type": "Organization", name: "Milven Consulting Services" }
  }

  return (
    <main>
      <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-navy-950 text-white">
        {cs.image && (
          <Image src={cs.image} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/40" />
        <div className="container-page relative py-16">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-gold-400"
          >
            <ArrowLeft className="h-4 w-4" />
            All case studies
          </Link>
          <p className="eyebrow-light mt-8">
            {cs.sector || "Case Study"}
            {cs.client ? ` · ${cs.client}` : ""}
          </p>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl leading-[1.08] text-white md:text-5xl">
            {cs.title}
          </h1>
          {cs.summary && (
            <p className="mt-5 max-w-2xl text-lg text-white/75">{cs.summary}</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-12">
            {SECTIONS.filter((s) => cs[s.key]).map((s) => (
              <Reveal key={s.key}>
                <div>
                  <span className="block h-px w-14 bg-gold-500" />
                  <h2 className="mt-4 font-serif text-2xl text-navy-900 md:text-3xl">
                    {s.label}
                  </h2>
                  <div className="prose-milven mt-4 whitespace-pre-wrap">
                    {cs[s.key]}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl bg-navy-900 p-6 text-white">
              <p className="font-serif text-xl">Discuss a similar challenge</p>
              <p className="mt-2 text-sm text-white/70">
                Speak to our team about how we can help your organisation.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-400"
              >
                Talk to an Advisor →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand
        title="Have a similar challenge?"
        text="Start a conversation with Milven."
        primaryLabel="Talk to an Advisor"
        primaryHref="/contact"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </main>
  )
}
