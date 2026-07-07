import { NextRequest, NextResponse } from 'next/server'

// SPA fallback for the embedded app (public/app). Vercel's router drops the
// DYNAMIC afterFiles rewrite from next.config.ts (the exact '/app' rule
// survives, '/app/:path*' does not — verified 8 Jul 2026; `next start`
// honors both). The proxy (Next 16 name for middleware) runs before routing
// on every platform, so the fallback lives here. Paths with a file extension
// fall through to the filesystem so /app/assets/* keep serving as real files.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/app' || (pathname.startsWith('/app/') && !/\.[^/]+$/.test(pathname))) {
    return NextResponse.rewrite(new URL('/app/index.html', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/app', '/app/:path*'] }
