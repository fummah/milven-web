import type { FieldSchema } from "@/components/admin/SchemaForm"

const cta: FieldSchema = {
  key: "cta",
  label: "Final CTA",
  type: "group",
  fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "text", label: "Text", type: "textarea", rows: 2 },
    { key: "primaryLabel", label: "Button label", type: "text" },
    { key: "primaryHref", label: "Button link", type: "text" }
  ]
}

const pillar: FieldSchema = {
  key: "pillars",
  label: "Service Cards",
  type: "list",
  itemLabel: "Card",
  fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "text", label: "Description", type: "textarea", rows: 2 },
    { key: "href", label: "Link", type: "text" },
    { key: "image", label: "Image", type: "image" },
    { key: "icon", label: "Icon key", type: "text" }
  ]
}

const iconCardList = (key: string, label: string, itemLabel = "Item"): FieldSchema => ({
  key,
  label,
  type: "list",
  itemLabel,
  fields: [
    { key: "title", label: "Title", type: "text" },
    { key: "text", label: "Description", type: "textarea", rows: 2 },
    { key: "icon", label: "Icon key", type: "text" }
  ]
})

export const contentSchemas: Record<string, FieldSchema[]> = {
  home: [
    { key: "eyebrow", label: "Hero eyebrow", type: "text" },
    {
      key: "heroImages",
      label: "Hero background images (rotates through each)",
      type: "tags"
    },
    {
      key: "heroMetrics",
      label: "Credibility Metrics",
      type: "list",
      itemLabel: "Metric",
      fields: [
        { key: "value", label: "Value", type: "text" },
        { key: "label", label: "Label", type: "text" }
      ]
    },
    pillar,
    { key: "trustLine", label: "Trust line", type: "text" },
    {
      key: "why",
      label: "Why Milven",
      type: "group",
      fields: [
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "image", label: "Image", type: "image" },
        iconCardList("values", "Value cards", "Value")
      ]
    },
    { key: "challengesTitle", label: "Challenges title", type: "text" },
    { key: "challengesIntro", label: "Challenges intro", type: "textarea", rows: 2 },
    {
      key: "challenges",
      label: "Challenge Navigator",
      type: "list",
      itemLabel: "Challenge",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Description", type: "text" },
        { key: "href", label: "Link", type: "text" },
        { key: "icon", label: "Icon key", type: "text" }
      ]
    },
    {
      key: "process",
      label: "How We Work",
      type: "group",
      fields: [
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title", label: "Title", type: "text" },
        {
          key: "steps",
          label: "Steps",
          type: "list",
          itemLabel: "Step",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "text", label: "Description", type: "textarea", rows: 2 }
          ]
        }
      ]
    },
    { key: "industriesTitle", label: "Industries title", type: "text" },
    { key: "industriesIntro", label: "Industries intro", type: "textarea", rows: 2 },
    {
      key: "industries",
      label: "Industries",
      type: "list",
      itemLabel: "Industry",
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "text", label: "Description", type: "text" },
        { key: "image", label: "Image", type: "image" }
      ]
    },
    {
      key: "academy",
      label: "Academy Spotlight",
      type: "group",
      fields: [
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "image", label: "Image", type: "image" },
        { key: "cta", label: "Button label", type: "text" },
        { key: "points", label: "Bullet points", type: "tags" }
      ]
    },
    cta
  ],

  services: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "intro", label: "Intro", type: "textarea" },
    pillar,
    {
      key: "addValue",
      label: "How We Add Value",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        iconCardList("items", "Value items", "Value")
      ]
    },
    cta
  ],

  about: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "intro", label: "Corporate introduction", type: "textarea" },
    { key: "purpose", label: "Purpose", type: "textarea", rows: 2 },
    { key: "vision", label: "Vision", type: "textarea", rows: 2 },
    { key: "mission", label: "Mission", type: "textarea", rows: 2 },
    iconCardList("values", "Values", "Value"),
    {
      key: "approach",
      label: "Approach",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea" },
        {
          key: "points",
          label: "Points",
          type: "list",
          itemLabel: "Point",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "text", label: "Text", type: "textarea", rows: 2 }
          ]
        }
      ]
    },
    {
      key: "differentiators",
      label: "Differentiators",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        iconCardList("items", "Items", "Item")
      ]
    },
    {
      key: "story",
      label: "Our Story",
      type: "group",
      fields: [
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "image", label: "Image", type: "image" }
      ]
    },
    cta
  ],

  "strategy-financial-advisory": [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    {
      key: "overview",
      label: "Overview",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea" }
      ]
    },
    {
      key: "outcomes",
      label: "Key Outcomes",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "items", label: "Outcomes", type: "tags" }
      ]
    },
    {
      key: "clusters",
      label: "Service Clusters",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        iconCardList("items", "Clusters", "Cluster")
      ]
    },
    {
      key: "approach",
      label: "Approach",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        {
          key: "steps",
          label: "Steps",
          type: "list",
          itemLabel: "Step",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "text", label: "Text", type: "textarea", rows: 2 }
          ]
        }
      ]
    },
    { ...cta, key: "cta", label: "CTA" }
  ],

  "business-systems-transformation": [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    {
      key: "overview",
      label: "Overview",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea" }
      ]
    },
    {
      key: "clusters",
      label: "Service Clusters",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        iconCardList("items", "Clusters", "Cluster")
      ]
    },
    {
      key: "process",
      label: "Implementation Process",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        {
          key: "steps",
          label: "Steps",
          type: "list",
          itemLabel: "Step",
          fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "text", label: "Text", type: "textarea", rows: 2 }
          ]
        }
      ]
    },
    {
      key: "dashboard",
      label: "Dashboard Section",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "image", label: "Image", type: "image" }
      ]
    },
    { ...cta, key: "cta", label: "CTA" }
  ],

  academy: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "intro", label: "Intro", type: "textarea" },
    {
      key: "formats",
      label: "Delivery Formats",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        iconCardList("items", "Formats", "Format")
      ]
    },
    {
      key: "programmes",
      label: "Programmes",
      type: "list",
      itemLabel: "Programme",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Description", type: "textarea", rows: 2 },
        { key: "category", label: "Category", type: "text" },
        { key: "duration", label: "Duration", type: "text" },
        { key: "format", label: "Format", type: "text" },
        { key: "image", label: "Image", type: "image" }
      ]
    },
    { key: "testimonialsIntro", label: "Testimonials note", type: "textarea", rows: 2 },
    {
      key: "enquiry",
      label: "Enquiry",
      type: "group",
      fields: [
        { key: "title", label: "Title", type: "text" },
        { key: "text", label: "Text", type: "textarea" }
      ]
    },
    { ...cta, key: "cta", label: "CTA" }
  ],

  industries: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "intro", label: "Intro", type: "textarea" },
    {
      key: "industries",
      label: "Industries",
      type: "list",
      itemLabel: "Industry",
      fields: [
        { key: "name", label: "Name", type: "text" },
        { key: "text", label: "Description", type: "text" },
        { key: "image", label: "Image", type: "image" }
      ]
    },
    cta
  ],

  contact: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "formTitle", label: "Form title", type: "text" },
    { key: "enquiryTypes", label: "Enquiry types", type: "tags" },
    { key: "contactMethods", label: "Contact methods", type: "tags" }
  ],

  insights: [
    { key: "eyebrow", label: "Eyebrow", type: "text" },
    { key: "categories", label: "Categories", type: "tags" }
  ]
}
