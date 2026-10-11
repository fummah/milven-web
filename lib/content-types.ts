export type IconKey = string

export interface Metric {
  value: string
  label: string
}

export interface Pillar {
  title: string
  text: string
  href: string
  image: string
  icon: IconKey
}

export interface ValueCard {
  title: string
  text: string
  icon: IconKey
}

export interface Challenge {
  title: string
  text: string
  href: string
  icon: IconKey
}

export interface ProcessStep {
  title: string
  text: string
}

export interface IndustryCard {
  name: string
  text: string
  image: string
}

export interface Cluster {
  title: string
  text: string
  icon: IconKey
}

export interface Programme {
  title: string
  text: string
  category: string
  duration: string
  format: string
  image?: string
}

export interface GlobalSettings {
  brand: {
    name: string
    shortName: string
    tagline: string
    descriptor?: string
    description: string
    logo: string
    logoWhite: string
  }
  contact: {
    email: string
    addressLines: string[]
    responseNote: string
    mapQuery: string
  }
  nav: { label: string; href: string; children?: { label: string; href: string; text?: string }[] }[]
  footer: {
    description: string
    columns: { title: string; links: { label: string; href: string }[] }[]
    socials: { label: string; href: string; icon: IconKey }[]
    legal: { label: string; href: string }[]
  }
  cta: {
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    secondaryHref: string
  }
  seo: {
    defaultTitle: string
    defaultDescription: string
  }
}
