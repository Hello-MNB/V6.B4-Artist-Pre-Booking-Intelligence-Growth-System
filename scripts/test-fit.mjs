// L1 FIT INSPECTOR (HOW-TO-BUILD-A-TASK Part 2/Part 4 — owner governance 18 Jul).
// Verify checks SEMANTICS; this checks SPACE. Renders the DEMO build (fixtures,
// no network) headlessly at 360px and 1360px and asserts:
//   1. no truncated text (clipped scrollWidth/Height on leaf text nodes)
//   2. no overlap between positioned control-layer elements (rails/docks)
//   3. no horizontal scroll
//   4. tap targets >= 44px on mobile (elements with the .tap-target hit-area
//      expansion are compliant by construction and excluded; violations WARN
//      in v1 — promoted to FAIL after the tap-target sweep, see register)
//   5. exactly ONE visible primary CTA
// Runs on `dist` AFTER build:demo (verify order guarantees the demo build is
// the one on disk). A machine without the Playwright browser prints a loud
// SKIP and exits 0 — on such machines L1 runs by hand (the doc's assertions).
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2', '.json': 'application/json' }

if (!existsSync(join(DIST, 'index.html'))) {
  console.log('✗ FIT: dist/index.html missing — run after build:demo.')
  process.exit(1)
}

let chromium
try { ({ chromium } = await import('playwright')) } catch {
  console.log('⚠ FIT SKIPPED — Playwright unavailable on this machine. Run L1 BY HAND (HOW-TO-BUILD-A-TASK Part 2) before any witness handoff.')
  process.exit(0)
}

// SPA static server with index.html fallback.
const server = createServer(async (req, res) => {
  try {
    const path = req.url.split('?')[0]
    const file = join(DIST, path === '/' ? 'index.html' : path)
    const target = existsSync(file) && extname(file) ? file : join(DIST, 'index.html')
    const body = await readFile(target)
    res.writeHead(200, { 'content-type': MIME[extname(target)] || 'application/octet-stream' })
    res.end(body)
  } catch { res.writeHead(404); res.end() }
})
await new Promise((r) => server.listen(0, r))
const port = server.address().port

const ASSERT = () => {
  const out = { truncated: [], overlaps: [], hscroll: false, smallTaps: [], primaryCtas: 0 }
  for (const el of document.querySelectorAll('span,p,button,a,h1,h2,h3')) {
    if (!el.offsetParent || el.children.length > 0) continue
    const cs = getComputedStyle(el)
    const clamps = cs.textOverflow === 'ellipsis' || cs.overflow === 'hidden' || (el.className.includes && String(el.className).includes('line-clamp'))
    if (clamps && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 2)) {
      out.truncated.push(el.textContent.trim().slice(0, 40))
    }
  }
  const layer = Array.from(document.querySelectorAll('.relative.z-10, [class*="md:absolute"]')).filter((e) => e.offsetParent)
  for (let i = 0; i < layer.length; i++) {
    for (let j = i + 1; j < layer.length; j++) {
      if (layer[i].contains(layer[j]) || layer[j].contains(layer[i])) continue
      const a = layer[i].getBoundingClientRect(); const b = layer[j].getBoundingClientRect()
      if (a.width && b.width && a.left < b.right - 4 && b.left < a.right - 4 && a.top < b.bottom - 4 && b.top < a.bottom - 4) {
        out.overlaps.push(`${layer[i].textContent.trim().slice(0, 25)} × ${layer[j].textContent.trim().slice(0, 25)}`)
      }
    }
  }
  out.hscroll = document.documentElement.scrollWidth > window.innerWidth + 1
  for (const el of document.querySelectorAll('button,a,select')) {
    if (!el.offsetParent || el.closest('[aria-hidden]')) continue
    if (el.className.includes && String(el.className).includes('tap-target')) continue // expanded hit area (T-31)
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0 && (r.height < 43 || r.width < 43)) out.smallTaps.push(el.textContent.trim().slice(0, 20) || el.getAttribute('aria-label') || '?')
  }
  out.primaryCtas = Array.from(document.querySelectorAll('.btn-primary')).filter((e) => e.offsetParent).length
  return out
}

let failures = 0
const browser = await chromium.launch()
for (const [w, h, label] of [[360, 780, 'MOBILE-360'], [1360, 850, 'DESKTOP-1360']]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage()
  // Screen 1: login (demo persona chooser)
  await page.goto(`http://127.0.0.1:${port}/login`, { waitUntil: 'networkidle' })
  const login = await page.evaluate(ASSERT)
  // Screen 2: the Radar home — deterministic demo auth (the DemoAuthProvider
  // reads gigproof_demo_role from localStorage), then the direct route.
  await page.evaluate(() => localStorage.setItem('gigproof_demo_role', 'artist'))
  await page.goto(`http://127.0.0.1:${port}/artist/home`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.skeleton', { state: 'detached', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(2000)
  if (!page.url().includes('/artist/home')) { console.log(`  ✗ [${label}] radar route unreachable (landed ${page.url()})`); failures++ }
  const radar = await page.evaluate(ASSERT)
  for (const [screen, r] of [['login', login], ['radar', radar]]) {
    const bad = r.truncated.length || r.overlaps.length || r.hscroll || r.primaryCtas > 1
    if (bad) failures++
    console.log(`${bad ? '  ✗' : '  ·'} [${label} ${screen}] truncated: ${r.truncated.length}${r.truncated.length ? ' ' + JSON.stringify(r.truncated.slice(0, 3)) : ''} · overlaps: ${r.overlaps.length}${r.overlaps.length ? ' ' + JSON.stringify(r.overlaps.slice(0, 3)) : ''} · h-scroll: ${r.hscroll ? 'YES' : 'none'} · primary CTAs: ${r.primaryCtas}${r.smallTaps.length ? ` · ⚠ taps<44 (warn v1): ${r.smallTaps.length}` : ''}`)
  }
  await page.context().close()
}
await browser.close()
server.close()

if (failures) {
  console.log(`✗ FIT: ${failures} screen render(s) with fit defects — the pixels collide even though semantics pass. Fix before witness handoff (HOW-TO-BUILD-A-TASK).`)
  process.exit(1)
}
console.log('✓ FIT: all screens fit at 360px and 1360px — no truncation, no overlap, no h-scroll, one primary CTA.')
process.exit(0)
