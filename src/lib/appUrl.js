// Absolute-URL builder for links that leave the app (share links, producer
// confirmation links, emails). T-34 (owner hit 17 Jul): building from
// `window.location.origin` alone LOSES the /app base on the website embed —
// every shared Passport link and producer magic link pointed at the site's
// 404. ALWAYS build outbound links through this helper, never by hand.
// BASE_URL: '/' standalone (app.lock.show) · '/app/' embedded (lock.show/app).
const APP_BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export function appUrl(path) {
  return `${window.location.origin}${APP_BASE}${path.startsWith('/') ? path : `/${path}`}`
}
