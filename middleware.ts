import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySession } from "@/lib/auth-edge"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // The login page itself is always reachable.
  if (pathname === "/admin/login") return NextResponse.next()

  const token = req.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySession(token)

  if (session) return NextResponse.next()

  // Protect CMS write APIs with a JSON 401 rather than a redirect.
  if (pathname.startsWith("/api/cms")) {
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
  matcher: ["/admin/:path*", "/api/cms/:path*"]
}
