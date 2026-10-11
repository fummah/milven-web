import { SectionHeading } from "@/components/SectionHeading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

export function FaqSection({
  items,
  eyebrow = "FAQ",
  title = "Frequently asked questions",
  text,
  id = "faq"
}: {
  items?: { q: string; a: string }[]
  eyebrow?: string
  title?: string
  text?: string
  id?: string
}) {
  if (!items || items.length === 0) return null

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a }
    }))
  }

  return (
    <section id={id} className="section scroll-mt-24">
      <div className="container-page max-w-3xl">
        <SectionHeading align="center" eyebrow={eyebrow} title={title} text={text} />
        <Accordion type="single" collapsible className="mt-10">
          {items.map((item, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </section>
  )
}
