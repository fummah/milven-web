"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUp,
  MessageSquareText,
  Send,
  X,
  Loader2,
  CheckCircle2,
  Mail
} from "lucide-react"
import { toast } from "sonner"
import { track } from "@/lib/analytics"

export function ChatWidget() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({ name: "", email: "", message: "" })
  const started = React.useRef(false)

  const start = () => {
    if (started.current) return
    started.current = true
    track("form_start", { form: "chat_widget" })
  }

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (pathname?.startsWith("/admin")) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          service: "General Enquiry",
          preferredMethod: "Email",
          honeypot: ""
        })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Could not send your message")
      setSent(true)
      setForm({ name: "", email: "", message: "" })
      track("contact_form_submit", { source: "chat_widget" })
      toast.success("Message sent", {
        description: "A member of the Milven team will be in touch shortly."
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-12 right-4 z-[80] flex flex-col items-end gap-3 print:hidden sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(21rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-premium"
          >
            <div className="relative flex items-start justify-between gap-3 bg-navy-950 px-5 py-4 text-white">
              <div>
                <p className="font-sans text-base font-bold">Quick enquiry</p>
                <p className="mt-0.5 text-xs text-white/60">
                  We usually reply within one business day.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <span className="pointer-events-none absolute inset-0 bg-grid-gold opacity-[0.15]" />
            </div>

            {sent ? (
              <div className="p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <p className="mt-4 font-sans text-lg font-bold text-navy-900">
                  Thank you
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Your message has been received.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-5 text-sm font-semibold text-gold-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                onFocusCapture={start}
                onPointerDownCapture={start}
                className="grid gap-3 p-5"
              >
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                  value=""
                  readOnly
                />
                <div className="grid gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-navy-700">
                    Name
                  </label>
                  <input
                    required
                    minLength={2}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="h-11 rounded-xl border border-navy-100 px-3.5 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-navy-700">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@company.com"
                    className="h-11 rounded-xl border border-navy-100 px-3.5 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-navy-700">
                    Message
                  </label>
                  <textarea
                    required
                    minLength={10}
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="How can we help?"
                    className="resize-none rounded-xl border border-navy-100 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-gold-400 to-gold-500 text-sm font-semibold text-navy-900 shadow-gold transition-all hover:from-gold-300 hover:to-gold-400 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {loading ? "Sending..." : "Send message"}
                </button>
                <a
                  href="mailto:advisory@milven.co.zw"
                  className="flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-gold-600"
                >
                  <Mail className="h-3.5 w-3.5" />
                  advisory@milven.co.zw
                </a>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {scrolled ? (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-white shadow-premium ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-navy-800"
        >
          <ArrowUp className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Open chat"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-gold-400 to-gold-500 text-navy-900 shadow-gold transition-all duration-300 hover:-translate-y-1"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/40" />
          <MessageSquareText className="relative h-6 w-6" />
        </button>
      )}
    </div>
  )
}
