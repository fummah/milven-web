import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/Icon"
import { ServiceCard } from "@/components/ServiceCard"
import { CtaBand } from "@/components/CtaBand"
import { SectionHeading } from "@/components/SectionHeading"
import { Reveal, RevealStagger, StaggerItem } from "@/components/motion/Reveal"
import { HomeHero } from "@/components/home/HomeHero"
import { TrackedLink } from "@/components/TrackedLink"
import { ArrowBadge } from "@/components/ArrowBadge"
import { CountUp } from "@/components/CountUp"
import { getPage, getInsights, getSettings } from "@/lib/site"
import { defaultSettings } from "@/lib/defaults"
import { formatDate } from "@/lib/utils"

export default async function Home() {
  const [page, insights, settings] = await Promise.all([
    getPage("home"),
    getInsights(),
    getSettings()
  ])
  const content = (page?.content || {}) as any
  const s = settings || defaultSettings

  const metrics: { value: string; label: string }[] = content.heroMetrics || []
  const pillars: any[] = content.pillars || []
  const why = content.why || {}
  const challenges: any[] = content.challenges || []
  const process = content.process || {}
  const industries: any[] = content.industries || []
  const academy = content.academy || {}
  const finalCta = content.finalCta || {}

  const heroImages: string[] =
    Array.isArray(content.heroImages) && content.heroImages.length > 0
      ? content.heroImages
      : [
          page?.heroImage || "/images/home/hero-executive.jpg",
          "/images/home/hero.jpg",
          "/images/home/executive-meeting.jpg"
        ]

  return (
    <main>
      {/* HERO */}
      <HomeHero
        eyebrow={content.eyebrow || "African Advisory & Transformation"}
        title={
          page?.heroTitle ||
          "Better Decisions. Better Businesses. Better Leaders."
        }
        text={page?.heroText || ""}
        images={heroImages}
        primaryLabel={s.cta.primaryLabel}
        primaryHref={s.cta.primaryHref}
        secondaryLabel={s.cta.secondaryLabel}
        secondaryHref="/services"
      />

      {/* STATS BAND */}
      <section className="bg-navy-950 text-white">
        <div className="container-page">
          <RevealStagger className="grid grid-cols-2 gap-y-8 divide-white/10 py-10 sm:grid-cols-4 sm:divide-x">
            {metrics.map((m, i) => (
              <StaggerItem
                key={m.label}
                className="flex items-center justify-center gap-4 px-4"
              >
                <Icon
                  name={["badge-check", "users", "layers", "target"][i % 4]}
                  className="h-8 w-8 shrink-0 text-gold-400"
                />
                <div>
                  <div className="font-sans text-3xl font-bold text-gold-400">
                    <CountUp value={m.value} />
                  </div>
                  <div className="text-xs font-medium text-white/70">{m.label}</div>
                </div>
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* PILLARS */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="What We Do"
            title="Three capabilities. One integrated partner."
            text="We bring strategy, systems and financial intelligence together to help organisations decide better and execute with confidence."
          />
          <RevealStagger className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p: any) => (
              <StaggerItem key={p.title} className="h-full">
                <ServiceCard
                  title={p.title}
                  text={p.text}
                  href={p.href}
                  image={p.image}
                  icon={p.icon}
                  cta={p.cta}
                />
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* SIGNATURE */}
      {content.signature && (
        <section className="border-y border-navy-100 bg-cream">
          <div className="container-page py-14 md:py-16">
            <Reveal>
              <p className="eyebrow justify-center">The Milven Promise</p>
              <p className="mx-auto mt-5 max-w-4xl text-center font-serif text-2xl leading-snug text-navy-900 md:text-[2rem]">
                {content.signature}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* WHY MILVEN */}
      <section className="section bg-cream">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src={why.image || "/images/home/executive-meeting.jpg"}
                  alt="Milven advisors in an executive session"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden w-56 rounded-2xl bg-navy-900 p-6 text-white shadow-premium sm:block">
                <Icon name="badge-check" className="h-7 w-7 text-gold-400" />
                <p className="mt-3 font-serif text-lg leading-snug">
                  Senior-led advisory with an implementation focus.
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow={why.eyebrow || "Why Milven"}
              title={why.title || "Insight That Moves Businesses Forward."}
              text={why.text}
            />
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {(why.values || []).map((v: any) => (
                <div key={v.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-500/40 bg-white text-gold-600">
                    <Icon name={v.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-navy-900">{v.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHALLENGE NAVIGATOR */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Where to begin"
            title={content.challengesTitle || "What challenge are you navigating?"}
            text={content.challengesIntro}
          />
          <RevealStagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c: any) => (
              <StaggerItem key={c.title}>
                <TrackedLink
                  event="challenge_navigator_select"
                  params={{ challenge: c.title }}
                  href={c.href}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-navy-100/70 bg-white p-6 shadow-sm transition-all duration-400 ease-premium hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-card-hover"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-navy-900">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-navy-900">{c.title}</span>
                    <span className="mt-1 block text-sm text-slate-500">{c.text}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-navy-200 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-600" />
                </TrackedLink>
              </StaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="relative overflow-hidden bg-navy-900 py-20 text-white md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-30" />
        <div className="container-page relative">
          <SectionHeading
            light
            eyebrow={process.eyebrow || "How We Work"}
            title={process.title || "A disciplined method, from insight to impact."}
            className="max-w-3xl"
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3 lg:grid-cols-6">
            {(process.steps || []).map((step: any, i: number) => (
              <Reveal key={step.title} delay={i * 0.07}>
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 font-sans text-xl font-bold text-white backdrop-blur">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-white/60 to-white/10 lg:block" />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Industries"
              title={content.industriesTitle || "Deep sector perspective."}
              text={content.industriesIntro}
            />
            <Reveal>
              <Link
                href="/industries"
                className="link-underline text-sm font-semibold text-navy-800"
              >
                View all industries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.slice(0, 6).map((ind: any, i: number) => (
              <Reveal key={ind.name} delay={(i % 3) * 0.08}>
                <Link
                  href="/industries"
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={ind.image}
                    alt={ind.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-serif text-xl text-white">{ind.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{ind.text}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold-400">
                      Explore
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ACADEMY SPOTLIGHT */}
      <section className="section bg-cream">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={academy.eyebrow || "Executive Finance Academy"}
              title={academy.title || "Developing financially intelligent leaders."}
              text={academy.text}
            />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {(academy.points || []).map((p: string) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
                    <Icon name="badge-check" className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm leading-6 text-slate-600">{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Button asChild variant="navy" size="lg">
                <Link href="/academy">
                  {academy.cta || "Explore the Academy"}
                  <ArrowBadge />
                </Link>
              </Button>
            </div>
          </div>
          <Reveal direction="left">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-premium">
              <Image
                src={academy.image || "/images/home/academy.jpg"}
                alt="Executive finance training session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* INSIGHTS */}
      {insights.length > 0 && (
        <section className="section">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Insights"
                title="Latest executive thinking."
                text="Perspectives on strategy, finance, transformation and leadership."
              />
              <Reveal>
                <Link
                  href="/insights"
                  className="link-underline text-sm font-semibold text-navy-800"
                >
                  View all insights
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Reveal>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {insights.slice(0, 3).map((i: any, idx: number) => (
                <Reveal key={i.id} delay={idx * 0.08}>
                  <TrackedLink
                    event="insight_read"
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
                      <h3 className="mt-3 text-xl leading-snug text-navy-900">
                        {i.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                        {i.excerpt}
                      </p>
                      <span className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                        {formatDate(i.publishedAt)}
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        {i.readMinutes || 5} min read
                      </span>
                    </div>
                  </TrackedLink>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={finalCta.title || "Let's Build a Stronger, More Resilient Organisation."}
        text={finalCta.text}
        primaryLabel={finalCta.primaryLabel || s.cta.primaryLabel}
        primaryHref={finalCta.primaryHref || s.cta.primaryHref}
        secondaryLabel="Explore Our Services"
        secondaryHref="/services"
      />
    </main>
  )
}
