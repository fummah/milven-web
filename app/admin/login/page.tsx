import type { Metadata } from "next"
import { LoginForm } from "@/components/admin/LoginForm"

export const metadata: Metadata = {
  title: "CMS Sign in",
  robots: { index: false, follow: false }
}

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams
  return <LoginForm from={from || "/admin"} />
}
