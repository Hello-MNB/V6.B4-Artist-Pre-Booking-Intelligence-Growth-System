// Post-build for the website embed (`npm run build:embed`):
// 1. Merge the app's public assets into the SITE's public root — the app
//    references some assets by absolute /assets/* paths (icon sprite, demo
//    photo URLs stored in the DB), which must resolve on the site origin.
// 2. Write physical directory indexes for the site's two CTA entry routes —
//    static-host-safe SPA fallbacks (the production host serves cleanUrls
//    directory indexes even where dynamic rewrites are unavailable).
import { cpSync, mkdirSync, copyFileSync } from 'node:fs'

cpSync('public/assets', 'website-next/public/assets', { recursive: true })
for (const route of ['login', 'signup']) {
  mkdirSync(`website-next/public/app/${route}`, { recursive: true })
  copyFileSync('website-next/public/app/index.html', `website-next/public/app/${route}/index.html`)
}
console.log('embed post-build: assets merged; login/signup fallbacks written')
