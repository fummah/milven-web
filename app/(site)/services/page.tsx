import type { Metadata } from "next"
import { PageHero } from "@/components/PageHero"
import { ServiceCard } from "@/components/ServiceCard"
import { CtaBand } from "@/components/CtaBand"
import { SectionHeading } from "@/components/SectionHeading"
import { Icon } from "@/components/Icon"
import { RevealStagger, StaggerItem, Reveal } from "@/components/motion/Reveal"
import { getPage, getPageMetadata } from "@/lib/site"

const FALLBACK = {
  title: "Services",
  description:
    "Integrated advisory, systems and capability solutions designed for real-world impact."
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getPageMetadata("services", FALLBACK)
  return { title, description, alternates: { canonical: "/services" } }
}

export default async function ServicesPage() {
  const page = await getPage("services")
  const content = (page?.content || {}) as any
  const addValue = content.addValue || {}

  return (
    <main>
      <PageHero
        eyebrow={content.eyebrow || "What We Do"}
        title={page?.heroTitle || "Our Services"}
        text={page?.heroText}
        image={page?.heroImage}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Integrated Capability"
            title="Advice that moves from insight to execution."
            text={content.intro}
          />
          <RevealStagger className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {(content.pillars || []).map((p: any) => (
              <StaggerItem key={p.title} className="h-full">
                <ServiceCard
                  title={p.title}
                  text={p.text}
                  href={p.href}
                  image={p.image}
                  icon={p.icon}
                />
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Our Difference"
            title={addValue.title || "How We Add Value"}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(addValue.items || []).map((item: any, i: number) => (
              <Reveal key={item.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-navy-100/70 bg-white p-7 shadow-sm transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-card-hover">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-navy-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {content.finalCta && (
        <CtaBand
          title={content.finalCta.title}
          text={content.finalCta.text}
          primaryLabel={content.finalCta.primaryLabel}
          primaryHref={content.finalCta.primaryHref}
        />
      )}
    </main>
  )
}
