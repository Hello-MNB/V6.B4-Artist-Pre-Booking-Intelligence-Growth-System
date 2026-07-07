import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: false,
  // The real app (Vite SPA) is built into public/app by the website build
  // (see package.json "build"). These afterFiles rewrites give it SPA deep
  // links: real files (public/app/assets/*) are served first; any /app route
  // WITHOUT a dot falls back to the SPA shell.
  async rewrites() {
    return [
      { source: '/app', destination: '/app/index.html' },
      { source: '/app/:path((?!.*\\.).*)', destination: '/app/index.html' },
    ]
  },
}

export default nextConfig
