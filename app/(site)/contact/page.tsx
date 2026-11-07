import type { Metadata } from "next"
import { Mail, MapPin } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
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

export default async function ContactPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [page, settings] = await Promise.all([getPage("contact"), getSettings()])
  const c = (page?.content || {}) as any
  const s = settings || defaultSettings
  const contact = s.contact

  const sp = (await searchParams) || {}
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "")
  const service = get("service")
  const programme = get("programme")
  const industry = get("industry")
  const intent = get("intent")
  const message = programme
    ? `I would like more information about the "${programme}" programme.`
    : industry
      ? `I would like to discuss support for the ${industry} sector.`
      : intent === "proposal"
        ? "I would like to request a formal proposal."
        : ""

  return (
    <main className="bg-cream">
      <section className="py-10 md:py-16">
        <div className="container-page">
          <div className="grid overflow-hidden rounded-2xl border border-navy-100/70 bg-white shadow-premium lg:grid-cols-[0.85fr_1.55fr]">
            {/* Left: navy information panel */}
            <div className="relative bg-navy-950 p-8 text-white md:p-10">
              <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-20" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full border border-gold-500/15" />

              <div className="relative">
                <p className="eyebrow-light">
                  <span className="h-px w-6 bg-gold-500" />
                  {c.eyebrow || "Contact"}
                </p>
                <h1 className="mt-4 text-balance font-serif text-3xl leading-tight md:text-4xl">
                  {page?.heroTitle || "Start a Conversation with Milven."}
                </h1>
                <span className="mt-5 block h-px w-16 bg-gold-500" />

                <div className="mt-10">
                  <h2 className="font-serif text-2xl text-white">Our Office</h2>
                  <ul className="mt-5 space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-gold-400">
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
                    <li className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-gold-400">
                        <Mail className="h-4 w-4" />
                      </span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-white/75 hover:text-white"
                      >
                        {contact.email}
                      </a>
                    </li>
                  </ul>

                  {contact.responseNote ? (
                    <p className="mt-6 border-t border-white/10 pt-4 text-xs text-white/50">
                      {contact.responseNote}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right: enquiry form */}
            <div className="p-6 md:p-10">
              <h2 className="font-serif text-2xl text-navy-900">
                {c.formTitle || "Send an Enquiry"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tell us about your requirement and we will be in touch.
              </p>
              <div className="mt-6">
                <ContactForm prefill={{ service, message }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
