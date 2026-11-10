"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FieldErrors {
  email?: string
  password?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function safeTarget(from: string) {
  return from && from.startsWith("/admin") && !from.startsWith("//") ? from : "/admin"
}

export function LoginForm({
  from,
  expired = false
}: {
  from: string
  expired?: boolean
}) {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [error, setError] = React.useState("")
  const [notice, setNotice] = React.useState(
    expired ? "Your session has expired. Please sign in again." : ""
  )
  const [loading, setLoading] = React.useState(false)
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (loading) return

    setError("")
    setNotice("")

    const nextErrors: FieldErrors = {}
    if (!email.trim()) {
      nextErrors.email = "Enter your email address."
    } else if (!EMAIL_RE.test(email.trim())) {
      nextErrors.email = "Enter a valid email address."
    }
    if (!password) {
      nextErrors.password = "Enter your password."
    }

    setFieldErrors(nextErrors)
    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }
    if (nextErrors.password) {
      passwordRef.current?.focus()
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      })

      if (res.status === 401) {
        setError("The email or password is incorrect.")
        passwordRef.current?.focus()
        return
      }
      if (!res.ok) {
        setError("We couldn't sign you in right now. Please try again.")
        return
      }

      router.replace(safeTarget(from))
      router.refresh()
    } catch {
      setError("Unable to reach the server. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cms-bg px-4 py-10 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-navy-100/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-gold-200/40 blur-3xl"
      />

      <div className="relative w-full max-w-[460px]">
        <div className="rounded-3xl border border-cms-border bg-cms-surface p-6 shadow-card sm:p-8">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/images/brand/milven-logo.png"
              alt="Milven Consulting"
              width={241}
              height={100}
              priority
              className="h-11 w-auto"
            />
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-cms-border bg-cms-bg px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-cms-muted">
              <Lock className="h-3 w-3 text-gold-600" />
              Milven CMS
            </span>
            <h1 className="mt-4 font-serif text-3xl text-cms-navy">Welcome back.</h1>
            <p className="mt-2 text-sm text-cms-muted">
              Sign in to manage the Milven website.
            </p>
          </div>

          <form onSubmit={submit} noValidate className="mt-7 grid gap-5">
            {notice && (
              <p
                role="status"
                className="rounded-xl border border-gold-200 bg-gold-50 px-3.5 py-2.5 text-sm text-gold-800"
              >
                {notice}
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="grid gap-1.5">
              <label htmlFor="cms-email" className="text-sm font-medium text-cms-navy">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cms-muted" />
                <Input
                  id="cms-email"
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError("")
                    setFieldErrors((previous) => ({ ...previous, email: undefined }))
                  }}
                  placeholder="you@milven.co.zw"
                  autoComplete="username"
                  inputMode="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "cms-email-error" : undefined}
                  disabled={loading}
                  className={cn(
                    "h-12 border-cms-border bg-white pl-10 text-cms-text placeholder:text-slate-400",
                    fieldErrors.email &&
                      "!border-red-300 focus-visible:!border-red-400 focus-visible:!ring-red-200"
                  )}
                />
              </div>
              {fieldErrors.email && (
                <p id="cms-email-error" className="text-xs text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="cms-password" className="text-sm font-medium text-cms-navy">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cms-muted" />
                <Input
                  id="cms-password"
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError("")
                    setFieldErrors((previous) => ({ ...previous, password: undefined }))
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "cms-password-error" : undefined}
                  disabled={loading}
                  className={cn(
                    "h-12 border-cms-border bg-white pl-10 pr-11 text-cms-text placeholder:text-slate-400",
                    fieldErrors.password &&
                      "!border-red-300 focus-visible:!border-red-400 focus-visible:!ring-red-200"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  disabled={loading}
                  className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-cms-muted transition-colors hover:bg-cms-active hover:text-cms-navy disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="cms-password-error" className="text-xs text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="cms"
              disabled={loading}
              className="h-12 w-full rounded-xl text-[0.95rem]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-cms-muted">
            Protected area. Authorised personnel only.
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-cms-muted">
          © {new Date().getFullYear()} Milven Consulting Services
        </p>
      </div>
    </div>
  )
}
