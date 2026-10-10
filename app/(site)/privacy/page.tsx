import type { Metadata } from "next"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Milven Consulting Services handles personal information.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true }
}

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        text="How Milven Consulting Services collects, uses and protects information."
        image="/images/contact/contact-hero.jpg"
        size="compact"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />
      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            This policy is a placeholder. Final approved legal copy should be
            reviewed and published before launch.
          </div>
          <div className="prose-milven mt-8">
            <p>
              Milven Consulting Services respects your privacy. Information
              submitted through this website is used solely to respond to your
              enquiry and to provide the services you request.
            </p>
            <h2>Information we collect</h2>
            <p>
              We collect the details you provide through our enquiry form,
              including your name, organisation, contact details and the nature
              of your enquiry.
            </p>
            <h2>How we use information</h2>
            <p>
              Your information is used to respond to enquiries, deliver
              engagements and maintain our professional records. We treat all
              information confidentially.
            </p>
            <h2>Contact</h2>
            <p>
              For any privacy-related questions, contact advisory@milven.co.zw.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
