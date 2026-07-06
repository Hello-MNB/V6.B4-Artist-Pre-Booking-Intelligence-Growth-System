# GIGPROOF Marketing Site — Deploy Guide

**Project:** `gigproof.co` — Next.js static export  
**Repo:** `C:\Users\user\GIGPROOF` (GitHub)  
**Root directory for this Vercel project:** `website-next/`  
**NOT the existing Vercel project** — that is `app.gigproof.co` (Vite, repo root)

---

## Pre-deploy checklist (all verified ✓)

- [x] `next.config.ts` → `output: 'export'`, `trailingSlash: false`, `images.unoptimized: true`
- [x] `vercel.json` in `website-next/` — build command, output dir, headers, cleanUrls
- [x] TSC zero errors
- [x] No `netlify.toml` anywhere
- [x] No `console.log` in source
- [x] Firewall: zero violations
- [x] `public/og/og-default.png` — exists (1200×630)
- [x] `public/llms.txt` — exists
- [x] `app/robots.ts` + `app/sitemap.ts` — exist
- [x] `app/favicon.ico` — exists
- [x] Default Next.js boilerplate SVGs removed from `public/`
- [x] Stale `i18n/` directory removed (superseded by `messages/`)
- [x] `website-next/.gitignore` covers `.next/`, `out/`, `*.tsbuildinfo`, `.env*`
- [ ] OG image: `og-default.svg` must also be committed (source), `og-default.png` is the runtime asset

---

## Step 1: Push to GitHub

```bash
cd C:\Users\user\GIGPROOF
git add website-next/
git status   # verify only website-next/ changes
git commit -m "feat: marketing site v1 — Next.js static export, phases 0-13"
git push origin main
```

**IMPORTANT:** Do NOT commit `.env.local`, `.next/`, `out/`, `node_modules/` — all covered by `.gitignore`.

---

## Step 2: Create new Vercel project for gigproof.co

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import from GitHub → select the GIGPROOF repo
3. **Root Directory** → set to `website-next/` ← CRITICAL
4. Framework: Next.js (auto-detected)
5. Build Command: `npm run build` (default — do not override)
6. Output Directory: `out` (auto-detected from next.config.ts export)
7. Node.js version: 20.x
8. Environment variables: **none needed** (marketing site has no Supabase/API keys)
9. Click Deploy

---

## Step 3: Add domain

After first deploy succeeds:
1. Project Settings → Domains
2. Add `gigproof.co` and `www.gigproof.co`
3. Set DNS at registrar:
   - `gigproof.co` → Vercel A record (or CNAME to `cname.vercel-dns.com`)
   - `www.gigproof.co` → CNAME to `cname.vercel-dns.com`
4. Set `www.gigproof.co` to redirect → `gigproof.co` (in Vercel domain settings)

---

## Step 4: Verify deploy

After deploy + DNS propagation:

```
https://gigproof.co/              → homepage
https://gigproof.co/passport/demo → FIRST CHECK — buyer-facing demo
https://gigproof.co/artists
https://gigproof.co/bookers
https://gigproof.co/producers
https://gigproof.co/how-it-works
https://gigproof.co/methodology
https://gigproof.co/pricing
https://gigproof.co/radar
https://gigproof.co/faq
https://gigproof.co/contact
https://gigproof.co/llms.txt     → plain text ✓
https://gigproof.co/sitemap.xml  → XML ✓
https://gigproof.co/robots.txt   → plain text ✓
https://gigproof.co/og/og-default.png → 1200×630 image ✓
```

WhatsApp test (390px): send `gigproof.co/passport/demo` link — verify OG card renders, page is readable on mobile.

---

## Existing Vercel project — DO NOT TOUCH

- Project: `app.gigproof.co`  
- Config: repo root `vercel.json` → `vite build` → `dist/`  
- This is the React+Vite app — separate deploy, separate project  

---

## Post-deploy (Phase 14)

- Submit `gigproof.co/sitemap.xml` to Google Search Console
- Verify JSON-LD renders in Rich Results Test
- Check Core Web Vitals in Vercel Analytics
- Verify HE locale toggle works client-side
