import type { Metadata } from "next"
import Image from "next/image"
import { PageHero } from "@/components/PageHero"
import { CtaBand } from "@/components/CtaBand"
import { SectionHeading } from "@/components/SectionHeading"
import { Icon } from "@/components/Icon"
import { Reveal, RevealStagger, StaggerItem } from "@/components/motion/Reveal"
import { getPage, getPageMetadata } from "@/lib/site"

const FALLBACK = {
  title: "About Milven",
  description:
    "A professional advisory and business transformation firm helping organisations strengthen strategy, financial performance, business systems and executive capability."
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getPageMetadata("about", FALLBACK)
  return { title, description, alternates: { canonical: "/about" } }
}

export default async function AboutPage() {
  const page = await getPage("about")
  const c = (page?.content || {}) as any
  const approach = c.approach || {}
  const differentiators = c.differentiators || {}
  const story = c.story || {}

  const pvm = [
    { title: "Our Purpose", text: c.purpose, icon: "target" },
    { title: "Our Vision", text: c.vision, icon: "compass" },
    { title: "Our Mission", text: c.mission, icon: "rocket" }
  ]

  return (
    <main>
      <PageHero
        eyebrow={c.eyebrow || "About Milven"}
        title={page?.heroTitle || "Advising Leaders. Transforming Businesses. Building Capability."}
        text={page?.heroText}
        image={page?.heroImage}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* INTRO */}
      <section className="section">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Who We Are"
              title="A trusted African advisory partner."
              text={c.intro}
            />
          </div>
          <Reveal direction="left">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-premium">
              <Image
                src={c.story?.image || "/images/about/leadership-session.jpg"}
                alt="Milven leadership session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* PURPOSE / VISION / MISSION */}
      <section className="section bg-navy-900 text-white">
        <div className="container-page">
          <SectionHeading
            light
            align="center"
            eyebrow="What Drives Us"
            title="Purpose. Vision. Mission."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {pvm.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-colors hover:border-gold-500/40">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500 text-navy-900">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl text-white">{p.title}</h3>
                  <p className="mt-3 leading-8 text-white/70">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Values"
            title="The principles behind every engagement."
          />
          <RevealStagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(c.values || []).map((v: any) => (
              <StaggerItem key={v.title} className="h-full">
                <div className="flex h-full gap-4 rounded-2xl border border-navy-100/70 bg-white p-6 shadow-sm transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-card-hover">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-500/40 text-gold-600">
                    <Icon name={v.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-navy-900">{v.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{v.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* APPROACH + DIFFERENTIATORS */}
      <section className="section bg-cream">
        <div className="container-page grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="How We Work"
              title={approach.title || "Our Approach"}
              text={approach.text}
            />
            <div className="mt-8 space-y-5">
              {(approach.points || []).map((p: any, i: number) => (
                <Reveal key={p.title} delay={i * 0.06}>
                  <div className="flex gap-4 border-l-2 border-gold-500/40 pl-5">
                    <div>
                      <h3 className="font-serif text-lg text-navy-900">{p.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{p.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Our Difference"
              title={differentiators.title || "What Sets Us Apart"}
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {(differentiators.items || []).map((d: any, i: number) => (
                <Reveal key={d.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-navy-100/70 bg-white p-6 shadow-sm">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                      <Icon name={d.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-serif text-lg text-navy-900">{d.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{d.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-premium">
                <Image
                  src={story.image || "/images/about/about-hero.jpg"}
                  alt={story.title || "Milven"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-navy-950/20" />
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow={story.eyebrow || "Our Story"}
              title={story.title || "What drives us."}
              text={story.text}
            />
          </div>
        </div>
      </section>

      {c.finalCta && (
        <CtaBand
          title={c.finalCta.title}
          text={c.finalCta.text}
          primaryLabel={c.finalCta.primaryLabel}
          primaryHref={c.finalCta.primaryHref}
        />
      )}
    </main>
  )
}
