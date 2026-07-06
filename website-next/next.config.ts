import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export', // SSG for marketing pages
  trailingSlash: false,
  images: {
    unoptimized: true, // required for static export
  },
}

export default nextConfig
