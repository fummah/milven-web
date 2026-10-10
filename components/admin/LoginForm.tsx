"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ from }: { from: string }) {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Login failed")
      router.replace(from || "/admin")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-20" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative flex min-h-full items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            <Image
              src="/images/brand/milven-logo-white.png"
              alt="Milven"
              width={180}
              height={37}
              className="h-9 w-auto"
            />
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
              <Lock className="h-3.5 w-3.5" />
              CMS Sign in
            </p>
            <h1 className="mt-3 text-3xl text-white">Administrator access</h1>
            <p className="mt-2 text-sm text-white/60">
              Sign in to manage the Milven website.
            </p>
          </div>

          <form
            onSubmit={submit}
            className="grid gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <div className="grid gap-2">
              <Label className="text-white/70">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@milven.co.zw"
                autoComplete="username"
                required
                className="border-white/15 bg-navy-900/60 text-white placeholder:text-white/30"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-white/70">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="border-white/15 bg-navy-900/60 text-white placeholder:text-white/30"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-white/40">
            Protected area. Authorised personnel only.
          </p>
        </div>
      </div>
    </div>
  )
}
