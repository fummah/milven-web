"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SchemaForm, type FieldSchema } from "@/components/admin/SchemaForm"

const linkFields: FieldSchema[] = [
  { key: "label", label: "Label", type: "text" },
  { key: "href", label: "Link", type: "text" }
]

const settingsSchema: FieldSchema[] = [
  {
    key: "brand",
    label: "Brand",
    type: "group",
    fields: [
      { key: "name", label: "Full name", type: "text" },
      { key: "shortName", label: "Short name", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "logo", label: "Logo (dark)", type: "image" },
      { key: "logoWhite", label: "Logo (white)", type: "image" }
    ]
  },
  {
    key: "contact",
    label: "Contact details",
    type: "group",
    fields: [
      { key: "email", label: "Email", type: "text" },
      { key: "addressLines", label: "Address lines", type: "tags" },
      { key: "responseNote", label: "Response note", type: "textarea", rows: 2 },
      { key: "mapQuery", label: "Map query", type: "text" }
    ]
  },
  {
    key: "nav",
    label: "Navigation",
    type: "list",
    itemLabel: "Nav item",
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "href", label: "Link", type: "text" },
      {
        key: "children",
        label: "Dropdown items",
        type: "list",
        itemLabel: "Child",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "Link", type: "text" },
          { key: "text", label: "Description", type: "text" }
        ]
      }
    ]
  },
  {
    key: "footer",
    label: "Footer",
    type: "group",
    fields: [
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "columns",
        label: "Columns",
        type: "list",
        itemLabel: "Column",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "links", label: "Links", type: "list", itemLabel: "Link", fields: linkFields }
        ]
      },
      {
        key: "socials",
        label: "Social links",
        type: "list",
        itemLabel: "Social",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "Link", type: "text" },
          { key: "icon", label: "Icon key (linkedin/twitter/facebook)", type: "text" }
        ]
      },
      { key: "legal", label: "Legal links", type: "list", itemLabel: "Link", fields: linkFields }
    ]
  },
  {
    key: "cta",
    label: "Primary CTAs",
    type: "group",
    fields: [
      { key: "primaryLabel", label: "Primary label", type: "text" },
      { key: "primaryHref", label: "Primary link", type: "text" },
      { key: "secondaryLabel", label: "Secondary label", type: "text" },
      { key: "secondaryHref", label: "Secondary link", type: "text" }
    ]
  },
  {
    key: "seo",
    label: "SEO defaults",
    type: "group",
    fields: [
      { key: "defaultTitle", label: "Default title", type: "text" },
      { key: "defaultDescription", label: "Default description", type: "textarea" }
    ]
  }
]

export function SettingsEditor({ initial }: { initial: any }) {
  const [data, setData] = React.useState<any>(initial)
  const [saving, setSaving] = React.useState(false)

  async function save() {
    setSaving(true)
    try {
      const res = await fetch("/api/cms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Save failed")
      toast.success("Site settings saved")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-navy-100 bg-white p-6">
        <SchemaForm schema={settingsSchema} value={data} onChange={setData} />
      </div>
      <div className="sticky bottom-6 flex justify-end">
        <Button onClick={save} disabled={saving} size="lg" className="shadow-premium">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save settings
        </Button>
      </div>
    </div>
  )
}
