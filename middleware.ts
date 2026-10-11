import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySession } from "@/lib/auth-edge"

let redirectCache: { at: number; map: Record<string, { to: string; permanent: boolean }> } = {
  at: 0,
  map: {}
}

async function getRedirects(req: NextRequest) {
  if (Date.now() - redirectCache.at < 30_000) return redirectCache.map
  try {
    const res = await fetch(new URL("/api/redirects", req.url), { cache: "no-store" })
    if (res.ok) {
      redirectCache = { at: Date.now(), map: await res.json() }
    }
  } catch {
    /* ignore */
  }
  return redirectCache.map
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // The login page is always reachable.
  if (pathname === "/admin/login" || pathname === "/login") {
    return NextResponse.next()
  }

  // 1) CMS-managed redirects (public paths only)
  if (!pathname.startsWith("/api")) {
    const redirects = await getRedirects(req)
    const hit = redirects[pathname]
    if (hit) {
      return NextResponse.redirect(
        new URL(hit.to, req.url),
        hit.permanent ? 308 : 307
      )
    }
  }

  // 2) Admin / CMS protection
  const isAdmin = pathname.startsWith("/admin")
  const isCms = pathname.startsWith("/api/cms")
  if (!isAdmin && !isCms) return NextResponse.next()

  const token = req.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySession(token)
  if (session) return NextResponse.next()

  if (isCms) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" }
    })
  }

  const url = req.nextUrl.clone()
  url.pathname = "/admin/login"
  url.searchParams.set("from", pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|icon-192.png|icon-512.png|images/|uploads/|api/).*)",
    "/api/cms/:path*"
  ]
}
