import type { Metadata } from "next"
import { LoginForm } from "@/components/admin/LoginForm"

export const metadata: Metadata = {
  title: "CMS Sign in",
  robots: { index: false, follow: false }
}

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ from?: string; expired?: string }>
}) {
  const { from, expired } = await searchParams
  return <LoginForm from={from || "/admin"} expired={expired === "1"} />
}
