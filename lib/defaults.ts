import type { GlobalSettings } from "@/lib/content-types"

export const defaultSettings: GlobalSettings = {
  brand: {
    name: "Milven Consulting Services",
    shortName: "Milven",
    tagline: "Better Decisions. Better Businesses. Better Leaders.",
    descriptor: "Strategy. Transformation. Executive Capability.",
    description:
      "An African advisory firm combining strategy, finance, business transformation and executive development.",
    logo: "/images/brand/milven-logo.png",
    logoWhite: "/images/brand/milven-logo-white.png"
  },
  contact: {
    email: "advisory@milven.co.zw",
    addressLines: ["2nd Floor, Block A", "Smatsatsa Office Park", "Borrowdale"],
    responseNote: "",
    mapQuery: "Smatsatsa Office Park, Borrowdale, Harare"
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Services",
      href: "/services",
      children: [
        {
          label: "Strategy & Financial Advisory",
          href: "/services/strategy-financial-advisory",
          text: "Sharper decisions. Stronger performance."
        },
        {
          label: "Business Systems & Transformation",
          href: "/services/business-systems-transformation",
          text: "Smarter systems. Scalable businesses."
        }
      ]
    },
    { label: "Industries", href: "/industries" },
    { label: "Executive Finance Academy", href: "/academy" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" }
  ],
  footer: {
    description:
      "Milven Consulting Services is a professional advisory and business transformation firm helping organisations strengthen strategy, financial performance, business systems and executive capability.",
    columns: [
      {
        title: "Services",
        links: [
          { label: "Strategy & Financial Advisory", href: "/services/strategy-financial-advisory" },
          { label: "Business Systems & Transformation", href: "/services/business-systems-transformation" },
          { label: "Executive Finance Academy", href: "/academy" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Industries", href: "/industries" },
          { label: "Insights", href: "/insights" },
          { label: "Resources", href: "/resources" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Company Profile", href: "/company-profile" },
          { label: "Contact", href: "/contact" }
        ]
      }
    ],
    socials: [],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Sitemap", href: "/sitemap.xml" }
    ]
  },
  cta: {
    primaryLabel: "Talk to an Advisor",
    primaryHref: "/contact",
    secondaryLabel: "Explore Our Services",
    secondaryHref: "/services"
  },
  seo: {
    defaultTitle: "Milven Consulting Services",
    defaultDescription:
      "Strategy, financial advisory, business transformation and executive development for ambitious organisations across Africa."
  }
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
