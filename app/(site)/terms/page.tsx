import type { Metadata } from "next"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing the use of the Milven Consulting Services website.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true }
}

export default function TermsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        text="The terms that govern your use of this website."
        image="/images/contact/contact-hero.jpg"
        size="compact"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />
      <section className="section">
        <div className="container-page max-w-3xl">
          <div className="prose-milven">
            <p>
              The information on this website is provided for general information
              purposes only.
            </p>

            <h2>Professional advice</h2>
            <p>
              Website content does not constitute investment, legal, tax, audit,
              assurance or other regulated professional advice. Formal advisory
              relationships arise only through separately agreed engagement terms.
            </p>

            <h2>Intellectual property</h2>
            <p>
              All Milven branding, publications, graphics and website content remain
              the property of Milven Consulting Services or the relevant rights
              holder and may not be reproduced without permission.
            </p>

            <h2>Accuracy and availability</h2>
            <p>
              Milven aims to keep website information accurate and available but does
              not guarantee that all content will always be complete, current or
              uninterrupted.
            </p>

            <h2>External links</h2>
            <p>
              External links are provided for convenience only, and Milven is not
              responsible for third-party websites.
            </p>

            <h2>Contact</h2>
            <p>
              For enquiries, contact{" "}
              <a href="mailto:advisory@milven.co.zw">advisory@milven.co.zw</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
