import "./globals.css"
import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { Toaster } from "sonner"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { TopBanner } from "@/components/TopBanner"
import { ChatWidget } from "@/components/ChatWidget"
import { SmoothScroll } from "@/components/SmoothScroll"
import { getSettings } from "@/lib/site"
import { siteUrl, defaultSettings } from "@/lib/defaults"

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap"
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => defaultSettings)
  const title = settings?.seo?.defaultTitle || defaultSettings.seo.defaultTitle
  const description =
    settings?.seo?.defaultDescription || defaultSettings.seo.defaultDescription
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings?.brand?.shortName || "Milven"}`
    },
    description,
    keywords: [
      "Milven Consulting Services",
      "business strategy Africa",
      "financial advisory Zimbabwe",
      "business transformation",
      "executive finance training",
      "ERP implementation",
      "management consulting Harare"
    ],
    openGraph: {
      type: "website",
      siteName: settings?.brand?.name || defaultSettings.brand.name,
      title,
      description,
      url: siteUrl
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
    robots: { index: true, follow: true }
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings().catch(() => defaultSettings)

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings?.brand?.name || defaultSettings.brand.name,
    description: settings?.brand?.description || defaultSettings.brand.description,
    url: siteUrl,
    email: settings?.contact?.email || defaultSettings.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: (settings?.contact?.addressLines || defaultSettings.contact.addressLines).join(", "),
      addressLocality: "Borrowdale, Harare",
      addressCountry: "ZW"
    },
    areaServed: "Africa",
    slogan: settings?.brand?.tagline || defaultSettings.brand.tagline
  }

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-white">
        <SmoothScroll />
        <TopBanner settings={settings} />
        <Header settings={settings} />
        {children}
        <Footer settings={settings} />
        <ChatWidget />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "0.9rem",
              border: "1px solid #E6E9EF"
            }
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </body>
    </html>
  )
}
