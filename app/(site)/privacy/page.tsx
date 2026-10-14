import type { Metadata } from "next"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Milven Consulting Services handles personal information submitted through this website.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true }
}

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        text="How Milven Consulting Services handles personal information."
        image="/images/contact/contact-hero.jpg"
        size="compact"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />
      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="prose-milven">
            <p>
              Milven Consulting Services respects your privacy and handles personal
              information responsibly.
            </p>

            <h2>Information we collect</h2>
            <p>
              We may collect information you provide through website forms,
              enquiries, training requests or other interactions, including your
              name, organisation, email address, telephone number and enquiry
              details.
            </p>

            <h2>How we use information</h2>
            <p>
              We use this information to respond to enquiries, provide requested
              services, improve our website and maintain business relationships. We
              do not sell personal information.
            </p>

            <h2>Cookies and analytics</h2>
            <p>
              The website may use cookies and analytics tools to improve performance
              and user experience.
            </p>

            <h2>Security</h2>
            <p>
              Reasonable measures are taken to protect information from unauthorised
              access or misuse.
            </p>

            <h2>Contact</h2>
            <p>For privacy enquiries, contact:</p>
            <p>
              Milven Consulting Services
              <br />
              2nd Floor, Block A, Smatsatsa Office Park
              <br />
              Borrowdale
              <br />
              <a href="mailto:advisory@milven.co.zw">advisory@milven.co.zw</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
