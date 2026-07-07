# GIGPROOF App — Private Preview Deploy (Vercel)

> ⚠️ **POLICY CHANGE — 8 Jul 2026 (founder decision, explicit):** public signup is
> now OPEN before the legal gate, served by the **embed path**: the website project
> builds the app into `/app` (see `website-next/package.json` "build",
> `vite.config.js` mode `embed`, `next.config.ts` rewrites, `lib/app-url.ts`).
> `gigproof-website.vercel.app/app` = the real app, signup included, on every push.
> Accepted residual risks: DRAFT consent texts live · signups auto-confirm ·
> anon-insert spam surfaces (tracker #7). Counsel + SEC-01 are now MORE urgent.
> The package BELOW remains the plan for the dedicated `gigproof-app` project and
> the `app.gigproof.co` domain day.

**Original policy (locked 7 Jul 2026, superseded for signup on 8 Jul):** the app
deploys to a **private preview URL only**. `app.gigproof.co` is NOT attached until
the legal gate is green (counsel sign-off on the Amendment-13 consent architecture
+ SEC-01).

---

## One-time setup (~10 minutes, in the Vercel dashboard)

The repo already hosts the marketing-site project, so Vercel knows the GitHub repo.
This adds a SECOND project for the app itself.

1. Go to **vercel.com → Add New… → Project**.
2. **Import** the repo `Hello-MNB/V6.B4-Artist-Pre-Booking-Intelligence-Growth-System`
   (it will appear in the list — it's the same repo the website project uses).
3. On the configure screen:
   - **Project Name:** `gigproof-app`
   - **Root Directory:** leave as the repo root (`./`) — ⚠ do NOT set `website-next`
     (that's the other project). The app's `vercel.json` at the root takes over.
   - **Framework Preset:** Vite (auto-detected).
4. **Environment Variables** — add these two (they are the *publishable* client
   values; they ship inside every browser bundle by design, so they are safe here):

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://qexfndiyallwqhhzeerd.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_rEoMmflkjGIoAEUFBab_IA_c6k4tgOu` |

   ⚠ Do **NOT** add `SUPABASE_SERVICE_ROLE_KEY` or `ANTHROPIC_API_KEY` yet.
   The preview runs the no-secret pilot posture (anon + RLS only). Server keys
   arrive only when the automated AI pipeline goes live — a separate, deliberate step.
5. Click **Deploy**. You'll get a URL like `https://gigproof-app-xxxx.vercel.app`.

## Make it actually private (2 minutes)

6. In the new project: **Settings → Deployment Protection →**
   enable **Vercel Authentication** for **All Deployments**.
   Result: only someone logged into YOUR Vercel account (or team members you
   invite) can open the URL. Strangers get a Vercel login wall — no signups,
   no data, no exposure.

## What NOT to do (until legal is green)

- ❌ Do not add the `app.gigproof.co` domain to this project.
- ❌ Do not disable Deployment Protection.
- ❌ Do not add server secrets.
- ✅ The marketing site keeps pointing at `app.gigproof.co` (it simply won't
  resolve yet — that's fine and intentional).

## Smoke test after deploy (5 minutes, together)

- `/login` renders in the CODEX identity (paper background, stamp button).
- Sign up with a **test email only** (e.g. `gigproof.qa.*@gmail.com`) →
  role select → consent → onboarding goal step → evidence.
- I then verify the created rows against the live DB and delete the QA user.

## The flip — day the legal gate turns green (2 minutes + DNS)

1. Project **Settings → Domains → Add** `app.gigproof.co`.
2. At the domain registrar: add a **CNAME** record `app` → `cname.vercel-dns.com`.
3. **Settings → Deployment Protection → disable** (open to the public).
4. Tell Claude: the marketing-site nav then gets its two one-line refinements
   (`GET STARTED` → `/signup`, `LOGIN` → `/login`) — already prepared.

---
*Maintained by Claude Code · see SEVERITY-TRACKER.md #1 for the legal-gate status.*
