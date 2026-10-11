import type { Metadata } from "next"
import Link from "next/link"
import { PageHero } from "@/components/PageHero"
import { CtaBand } from "@/components/CtaBand"
import { SectionHeading } from "@/components/SectionHeading"
import { Icon } from "@/components/Icon"
import { Reveal } from "@/components/motion/Reveal"

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Executive briefings, white papers, toolkits and templates from Milven Consulting Services.",
  alternates: { canonical: "/resources" }
}

const CATEGORIES = [
  { title: "Executive Briefings", text: "Concise briefings on management and board decisions.", icon: "presentation" },
  { title: "White Papers", text: "In-depth perspectives on strategy, finance and systems.", icon: "file-text" },
  { title: "Toolkits & Templates", text: "Practical frameworks for planning, reporting and controls.", icon: "clipboard-list" },
  { title: "Guides", text: "Step-by-step guides for common business challenges.", icon: "book-open" }
]

export default function ResourcesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Knowledge"
        title="Resources"
        text="Executive briefings, white papers, toolkits and guides to support better decisions."
        image="/images/insights/leadership.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
      />

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Resource Library"
            title="Practical resources for executives."
            text="We publish resources as they are approved. In the meantime, explore our executive insights."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-navy-100/70 bg-white p-7 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-navy-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{c.text}</p>
                  <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Coming soon
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-14 rounded-3xl border border-dashed border-navy-200 bg-cream/60 p-10 text-center">
              <Icon name="sparkles" className="mx-auto h-6 w-6 text-gold-500" />
              <p className="mt-4 font-serif text-2xl text-navy-800">
                Resources will be published here
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                New briefings, white papers and toolkits are added as they are
                approved. Browse our latest executive insights in the meantime.
              </p>
              <Link
                href="/insights"
                className="mt-7 inline-flex h-11 items-center rounded-xl bg-navy-900 px-6 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Read our insights
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Looking for something specific?"
        text="Speak to our team about the frameworks and tools relevant to your organisation."
        primaryLabel="Talk to an Advisor"
        primaryHref="/contact"
      />
    </main>
  )
}
