import type { Metadata } from "next"
import Image from "next/image"
import { PrintButton } from "@/components/PrintButton"
import { Icon } from "@/components/Icon"
import { getPage, getSettings } from "@/lib/site"
import { defaultSettings } from "@/lib/defaults"

export const metadata: Metadata = {
  title: "Company Profile",
  description:
    "Milven Consulting Services company profile — advisory, business systems and executive capability.",
  alternates: { canonical: "/company-profile" }
}

export default async function CompanyProfilePage() {
  const [settings, about, home, academy] = await Promise.all([
    getSettings(),
    getPage("about"),
    getPage("home"),
    getPage("academy")
  ])
  const s = settings || defaultSettings
  const a = (about?.content || {}) as any
  const h = (home?.content || {}) as any
  const ac = (academy?.content || {}) as any

  const pillars: any[] = h.pillars || []
  const programmes: any[] = ac.programmes || []

  return (
    <main className="bg-white">
      {/* cover */}
      <section className="relative overflow-hidden bg-navy-950 text-white print:bg-white print:text-navy-950">
        <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-20 print:hidden" />
        <div className="container-page relative py-16 md:py-20">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <Image
              src={s.brand.logoWhite}
              alt={s.brand.name}
              width={200}
              height={41}
              className="h-10 w-auto print:hidden"
            />
            <Image
              src={s.brand.logo}
              alt={s.brand.name}
              width={200}
              height={41}
              className="hidden h-10 w-auto print:block"
            />
            <div className="print:hidden">
              <PrintButton />
            </div>
          </div>
          <p className="eyebrow-light mt-10 print:text-gold-600">Company Profile</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl leading-tight md:text-5xl">
            {s.brand.descriptor || s.brand.tagline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75 print:text-slate-600">
            {s.brand.description}
          </p>
        </div>
      </section>

      <div className="container-page max-w-4xl py-14 print:py-6">
        {/* about */}
        <section className="print:break-inside-avoid">
          <SectionTitle>About Milven</SectionTitle>
          <p className="prose-milven">{a.intro}</p>
        </section>

        {/* purpose / vision / mission */}
        <section className="mt-12 grid gap-6 md:grid-cols-3 print:break-inside-avoid">
          {[
            { t: "Purpose", v: a.purpose, i: "target" },
            { t: "Vision", v: a.vision, i: "compass" },
            { t: "Mission", v: a.mission, i: "rocket" }
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-navy-100 p-6 print:border-navy-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-gold-400 print:bg-cream print:text-gold-600">
                <Icon name={x.i} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-xl text-navy-900">{x.t}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{x.v}</p>
            </div>
          ))}
        </section>

        {/* services */}
        <section className="mt-14 print:break-before-page">
          <SectionTitle>Our Services</SectionTitle>
          <div className="mt-6 space-y-6">
            {pillars.map((p) => (
              <div key={p.title} className="rounded-2xl border border-navy-100 p-6 print:break-inside-avoid">
                <h3 className="font-serif text-xl text-navy-900">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* approach */}
        <section className="mt-14 print:break-inside-avoid">
          <SectionTitle>Our Approach</SectionTitle>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {(h.process?.steps || []).map((step: any, i: number) => (
              <li key={step.title} className="flex gap-3 rounded-xl border border-navy-100 p-4">
                <span className="font-serif text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-semibold text-navy-900">{step.title}</span>
                  <span className="text-sm text-slate-600">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* academy */}
        <section className="mt-14 print:break-before-page">
          <SectionTitle>Milven Executive Finance Academy</SectionTitle>
          <p className="prose-milven">{ac.intro}</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {programmes.map((p) => (
              <div key={p.title} className="rounded-xl border border-navy-100 px-4 py-3 text-sm text-navy-800">
                {p.title}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            CTA: Request a Corporate Training Proposal — {s.contact.email}
          </p>
        </section>

        {/* industries */}
        <section className="mt-14 print:break-inside-avoid">
          <SectionTitle>Industries We Serve</SectionTitle>
          <div className="mt-6 flex flex-wrap gap-2">
            {(h.industries || []).map((ind: any) => (
              <span key={ind.name} className="rounded-full border border-navy-100 px-4 py-1.5 text-sm text-navy-700">
                {ind.name}
              </span>
            ))}
          </div>
        </section>

        {/* contact */}
        <section className="mt-14 rounded-2xl bg-navy-950 p-8 text-white print:bg-cream print:text-navy-900">
          <h2 className="font-serif text-2xl">Contact</h2>
          <p className="mt-4 text-sm text-white/80 print:text-slate-700">
            {s.contact.addressLines.join(", ")}
          </p>
          <p className="mt-2 text-sm text-white/80 print:text-slate-700">
            Email: {s.contact.email}
          </p>
          <p className="mt-4 text-xs text-white/50 print:text-slate-500">
            Telephone and website domain pending confirmation. This profile contains no
            client-identifying or unapproved claims.
          </p>
        </section>

        <div className="mt-10 flex justify-center print:hidden">
          <PrintButton label="Download / Print Company Profile" />
        </div>
      </div>
    </main>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <span className="block h-px w-12 bg-gold-500" />
      <h2 className="mt-4 font-serif text-2xl text-navy-900 md:text-3xl">{children}</h2>
    </div>
  )
}
