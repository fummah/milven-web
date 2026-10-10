import type { Metadata } from "next"
import { PageHero } from "@/components/PageHero"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of the Milven Consulting Services website.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true }
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
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            These terms are a placeholder. Final approved legal copy should be
            reviewed and published before launch.
          </div>
          <div className="prose-milven mt-8">
            <p>
              The information on this website is provided for general purposes
              only and does not constitute professional advice. Formal advice is
              provided only under a signed engagement agreement.
            </p>
            <h2>Use of this website</h2>
            <p>
              You agree to use this website lawfully and not to misuse its
              content or functionality.
            </p>
            <h2>Intellectual property</h2>
            <p>
              All content, branding and materials on this website belong to
              Milven Consulting Services unless otherwise stated.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
