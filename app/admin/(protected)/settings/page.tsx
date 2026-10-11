import { getSettings } from "@/lib/site"
import { SettingsEditor } from "@/components/admin/SettingsEditor"

export const dynamic = "force-dynamic"

export default async function AdminSettings() {
  const settings = await getSettings()
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl text-navy-900">Site Settings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Global brand, contact, navigation, footer and SEO defaults.
        </p>
      </div>
      <SettingsEditor initial={settings} />
    </div>
  )
}
