import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-gold opacity-30" />
      <div className="container-page relative py-24 text-center">
        <p className="eyebrow-light justify-center">Error 404</p>
        <h1 className="mx-auto mt-6 max-w-2xl text-5xl leading-tight text-white md:text-7xl">
          This page could not be found.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
          The page you are looking for may have been moved or no longer exists.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/">Return home</Link>
          </Button>
          <Button asChild variant="light" size="lg">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
