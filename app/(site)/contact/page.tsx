import type { Metadata } from "next"
import { Suspense } from "react"
import { Mail, MapPin, Clock } from "lucide-react"
import { PageHero } from "@/components/PageHero"
import { ContactForm } from "@/components/ContactForm"
import { Reveal } from "@/components/motion/Reveal"
import { getPage, getPageMetadata, getSettings } from "@/lib/site"
import { defaultSettings } from "@/lib/defaults"

const FALLBACK = {
  title: "Contact Milven",
  description: "Have a strategic, financial or transformation challenge? Speak to Milven."
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = await getPageMetadata("contact", FALLBACK)
  return { title, description, alternates: { canonical: "/contact" } }
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage("contact"), getSettings()])
  const c = (page?.content || {}) as any
  const s = settings || defaultSettings
  const contact = s.contact

  return (
    <main>
      <PageHero
        eyebrow={c.eyebrow || "Contact"}
        title={page?.heroTitle || "Start a Conversation with Milven."}
        text={page?.heroText}
        image={page?.heroImage}
        size="compact"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="section">
        <div className="container-page grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div>
              <p className="eyebrow">
                <span className="h-px w-8 bg-gold-500" />
                {c.formTitle || "Send an Enquiry"}
              </p>
              <h2 className="mt-4 text-3xl text-navy-900 md:text-4xl">
                Tell us how we can help.
              </h2>
              <div className="mt-9">
                <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-cream" />}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <aside className="space-y-6">
              <div className="rounded-2xl bg-navy-900 p-8 text-white">
                <h3 className="font-serif text-2xl">Our Office</h3>
                <ul className="mt-6 space-y-5 text-sm">
                  <li className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-gold-400">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="text-white/75">
                      {contact.addressLines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-gold-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <a href={`mailto:${contact.email}`} className="text-white/75 hover:text-white">
                      {contact.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-gold-400">
                      <Clock className="h-4 w-4" />
                    </span>
                    <span className="text-white/75">
                      Monday – Friday, 08:00 – 17:00 (CAT)
                    </span>
                  </li>
                </ul>
                <p className="mt-6 border-t border-white/10 pt-6 text-xs text-white/50">
                  {contact.responseNote}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-navy-100/70 bg-cream">
                <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-60" />
                <div className="relative flex aspect-[4/3] flex-col items-center justify-center p-8 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-serif text-xl text-navy-900">
                    {contact.mapQuery}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                    Map placeholder
                  </p>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
