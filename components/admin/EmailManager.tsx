"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Loader2,
  Save,
  PlugZap,
  Send,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface EmailConfigView {
  provider: string
  tenantId: string | null
  clientId: string | null
  senderEmail: string
  senderName: string
  recipients: string[]
  replyToBehaviour: string
  enabled: boolean
  acknowledgementsEnabled: boolean
  lastSuccessAt: string | null
  lastFailureAt: string | null
  lastError: string | null
  hasSecret: boolean
}

export interface EmailTemplateView {
  type: string
  subject: string
  htmlBody: string
  textBody: string
  enabled: boolean
}

export interface EmailLogView {
  id: string
  submissionRef: string | null
  templateType: string
  recipient: string
  status: string
  attempts: number
  lastError: string | null
  createdAt: string
}

const templateLabels: Record<string, string> = {
  contact_enquiry: "Contact Enquiry",
  training_enquiry: "Training Enquiry",
  visitor_acknowledgement: "Visitor Acknowledgement",
  quote_request: "Quote Request",
  consultation_request: "Consultation Request",
  test_email: "Test Email"
}

const statusStyles: Record<string, string> = {
  ACCEPTED: "bg-emerald-500/10 text-emerald-700",
  FAILED: "bg-red-500/10 text-red-700",
  PENDING: "bg-gold-500/15 text-gold-700"
}

function fmt(value: string | null) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short"
    })
  } catch {
    return value
  }
}

function Field({
  label,
  hint,
  children
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </label>
  )
}

export function EmailManager({
  initialConfig,
  initialTemplates,
  initialLogs
}: {
  initialConfig: EmailConfigView
  initialTemplates: EmailTemplateView[]
  initialLogs: EmailLogView[]
}) {
  const [config, setConfig] = React.useState(initialConfig)
  const [tenantId, setTenantId] = React.useState(initialConfig.tenantId || "")
  const [clientId, setClientId] = React.useState(initialConfig.clientId || "")
  const [clientSecret, setClientSecret] = React.useState("")
  const [senderEmail, setSenderEmail] = React.useState(initialConfig.senderEmail)
  const [senderName, setSenderName] = React.useState(initialConfig.senderName)
  const [recipients, setRecipients] = React.useState(initialConfig.recipients.join("\n"))
  const [replyToBehaviour, setReplyToBehaviour] = React.useState(initialConfig.replyToBehaviour)
  const [enabled, setEnabled] = React.useState(initialConfig.enabled)
  const [acknowledgementsEnabled, setAcknowledgementsEnabled] = React.useState(
    initialConfig.acknowledgementsEnabled
  )
  const [saving, setSaving] = React.useState(false)
  const [testing, setTesting] = React.useState(false)
  const [testEmail, setTestEmail] = React.useState(initialConfig.recipients[0] || initialConfig.senderEmail)
  const [sendingTest, setSendingTest] = React.useState(false)

  const [templates, setTemplates] = React.useState(initialTemplates)
  const [activeType, setActiveType] = React.useState(initialTemplates[0]?.type || "contact_enquiry")
  const [savingTemplate, setSavingTemplate] = React.useState(false)

  const [logs, setLogs] = React.useState(initialLogs)
  const [refreshingLogs, setRefreshingLogs] = React.useState(false)
  const [retryingId, setRetryingId] = React.useState<string | null>(null)

  const activeTemplate = templates.find((t) => t.type === activeType)

  function applyConfig(next: EmailConfigView) {
    setConfig(next)
    setTenantId(next.tenantId || "")
    setClientId(next.clientId || "")
    setSenderEmail(next.senderEmail)
    setSenderName(next.senderName)
    setRecipients(next.recipients.join("\n"))
    setReplyToBehaviour(next.replyToBehaviour)
    setEnabled(next.enabled)
    setAcknowledgementsEnabled(next.acknowledgementsEnabled)
    setClientSecret("")
  }

  async function saveConfig() {
    setSaving(true)
    try {
      const res = await fetch("/api/cms/email/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          clientId,
          clientSecret,
          senderEmail,
          senderName,
          recipients: recipients.split(/[\n,;]+/).map((r) => r.trim()).filter(Boolean),
          replyToBehaviour,
          enabled,
          acknowledgementsEnabled
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      applyConfig(data)
      toast.success("Email configuration saved")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function testConnection() {
    setTesting(true)
    try {
      const res = await fetch("/api/cms/email/test-connection", { method: "POST" })
      const data = await res.json()
      if (data.ok) {
        toast.success("Microsoft Graph connection successful")
      } else {
        toast.error(data.error || "Connection failed")
      }
      await reloadConfig()
    } catch {
      toast.error("Connection test failed")
    } finally {
      setTesting(false)
    }
  }

  async function reloadConfig() {
    const res = await fetch("/api/cms/email/config")
    if (res.ok) applyConfig(await res.json())
  }

  async function sendTest() {
    setSendingTest(true)
    try {
      const res = await fetch("/api/cms/email/test-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail })
      })
      const data = await res.json()
      if (data.ok) toast.success(`Test email accepted by Microsoft Graph for ${data.to}`)
      else toast.error(data.error || "Test email failed")
      await refreshLogs()
    } catch {
      toast.error("Test email failed")
    } finally {
      setSendingTest(false)
    }
  }

  async function refreshLogs() {
    setRefreshingLogs(true)
    try {
      const res = await fetch("/api/cms/email/logs")
      if (res.ok) setLogs(await res.json())
    } finally {
      setRefreshingLogs(false)
    }
  }

  function updateTemplate(patch: Partial<EmailTemplateView>) {
    setTemplates((prev) =>
      prev.map((t) => (t.type === activeType ? { ...t, ...patch } : t))
    )
  }

  async function saveTemplate() {
    if (!activeTemplate) return
    setSavingTemplate(true)
    try {
      const res = await fetch("/api/cms/email/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeTemplate)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      toast.success("Template saved")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed")
    } finally {
      setSavingTemplate(false)
    }
  }

  async function retry(logId: string) {
    setRetryingId(logId)
    try {
      const res = await fetch(`/api/cms/email/logs/${logId}/retry`, { method: "POST" })
      const data = await res.json()
      if (data.ok) toast.success("Delivery retried")
      else toast.error(data.error || "Retry failed")
      await refreshLogs()
    } catch {
      toast.error("Retry failed")
    } finally {
      setRetryingId(null)
    }
  }

  const configured = Boolean(config.tenantId && config.clientId && config.hasSecret)

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sending</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-navy-900">
            {enabled ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <XCircle className="h-4 w-4 text-slate-400" />
            )}
            {enabled ? "Enabled" : "Disabled"}
          </p>
          <p className="mt-1 text-xs text-slate-400">{config.senderEmail}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Credentials</p>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-navy-900">
            {configured ? (
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-gold-600" />
            )}
            {config.hasSecret ? "Secret configured" : "No secret"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {configured ? "Microsoft Graph ready" : "Add Tenant, Client ID and secret"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last activity</p>
          <p className="mt-2 text-sm font-semibold text-navy-900">
            Success: {fmt(config.lastSuccessAt)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Failure: {fmt(config.lastFailureAt)}</p>
        </div>
      </div>

      {config.lastError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {config.lastError}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl text-navy-900">Microsoft 365 / Graph</h2>
            <p className="mt-1 text-sm text-slate-500">
              Application credentials are encrypted at rest. The client secret is never displayed.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testing}>
              {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
              Test connection
            </Button>
            <Button size="sm" onClick={saveConfig} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save configuration
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Directory (tenant) ID">
            <Input value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          </Field>
          <Field label="Application (client) ID">
            <Input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          </Field>
          <Field
            label="Client secret"
            hint={config.hasSecret ? "A secret is stored. Leave blank to keep it." : "Required for Microsoft Graph."}
          >
            <Input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder={config.hasSecret ? "•••••••••••••••• (configured)" : "Enter client secret"}
              autoComplete="new-password"
            />
          </Field>
          <Field label="Sender mailbox" hint="The Microsoft 365 mailbox used to send mail.">
            <Input type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="advisory@milven.co.zw" />
          </Field>
          <Field label="Sender display name">
            <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Milven Consulting" />
          </Field>
          <Field label="Reply-To behaviour">
            <select
              value={replyToBehaviour}
              onChange={(e) => setReplyToBehaviour(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
            >
              <option value="visitor">Reply to the visitor</option>
              <option value="sender">Use the sender mailbox</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Notification recipients" hint="One email per line. Defaults to the sender mailbox if empty.">
              <textarea
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
                placeholder={"advisory@milven.co.zw"}
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-navy-900">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4 accent-[#C89D1E]" />
            Enable Microsoft Graph email sending
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-navy-900">
            <input type="checkbox" checked={acknowledgementsEnabled} onChange={(e) => setAcknowledgementsEnabled(e.target.checked)} className="h-4 w-4 accent-[#C89D1E]" />
            Send visitor acknowledgement emails
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-3 rounded-xl bg-slate-50 p-4">
          <Field label="Test recipient">
            <Input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="w-72" />
          </Field>
          <Button variant="navy" size="sm" onClick={sendTest} disabled={sendingTest}>
            {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send test email
          </Button>
          <p className="text-xs text-slate-400">
            A 202 response means Microsoft Graph accepted the message, not confirmed delivery.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4">
          <h2 className="text-xl text-navy-900">Email templates</h2>
          <p className="mt-1 text-sm text-slate-500">
            Edit subjects and bodies. Use <code className="rounded bg-slate-100 px-1">{"{{name}}"}</code>,{" "}
            <code className="rounded bg-slate-100 px-1">{"{{details}}"}</code>,{" "}
            <code className="rounded bg-slate-100 px-1">{"{{message}}"}</code> and other form placeholders.
          </p>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.type}
              type="button"
              onClick={() => setActiveType(t.type)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                activeType === t.type
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-slate-200 text-slate-600 hover:border-navy-300"
              )}
            >
              {templateLabels[t.type] || t.type}
            </button>
          ))}
        </div>
        {activeTemplate ? (
          <div className="grid gap-4">
            <Field label="Subject">
              <Input value={activeTemplate.subject} onChange={(e) => updateTemplate({ subject: e.target.value })} />
            </Field>
            <Field label="HTML body">
              <textarea
                value={activeTemplate.htmlBody}
                onChange={(e) => updateTemplate({ htmlBody: e.target.value })}
                rows={12}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
              />
            </Field>
            <Field label="Plain-text body">
              <textarea
                value={activeTemplate.textBody}
                onChange={(e) => updateTemplate({ textBody: e.target.value })}
                rows={6}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-xs text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
              />
            </Field>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-3 text-sm text-navy-900">
                <input type="checkbox" checked={activeTemplate.enabled} onChange={(e) => updateTemplate({ enabled: e.target.checked })} className="h-4 w-4 accent-[#C89D1E]" />
                Template enabled
              </label>
              <Button size="sm" onClick={saveTemplate} disabled={savingTemplate}>
                {savingTemplate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save template
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl text-navy-900">Delivery logs</h2>
            <p className="mt-1 text-sm text-slate-500">Most recent 100 email delivery attempts.</p>
          </div>
          <Button variant="outline" size="sm" onClick={refreshLogs} disabled={refreshingLogs}>
            {refreshingLogs ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Recipient</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Attempts</th>
                <th className="py-2 pr-4">When</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No email deliveries yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-4 font-medium text-navy-900">
                      {templateLabels[log.templateType] || log.templateType}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{log.recipient}</td>
                    <td className="py-3 pr-4">
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", statusStyles[log.status] || "bg-slate-100 text-slate-600")}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{log.attempts}</td>
                    <td className="py-3 pr-4 text-slate-500">{fmt(log.createdAt)}</td>
                    <td className="py-3">
                      {log.status === "FAILED" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => retry(log.id)}
                          disabled={retryingId === log.id}
                        >
                          {retryingId === log.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                          Retry
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                      {log.lastError ? (
                        <p className="mt-1 max-w-xs text-xs text-red-600">{log.lastError}</p>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
