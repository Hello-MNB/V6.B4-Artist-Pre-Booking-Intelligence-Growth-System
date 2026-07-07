# GIGPROOF — Build Tasks (ordered; one task at a time)

> ⚠️ **ARCHITECTURE STATUS (added 2 Jul 2026 — READ FIRST):**
> Tasks 0–10 were **built to the ORG-FIRST architecture (v1.1, 28 Jun)**, NOT the current workspace model.
> Current canon (v3.5+) locks **person → workspace → role** as the FULL-BETA target. The built code is the **Gate-1 proof** — it runs the core loop (artist → evidence → claim → Passport → booker request → producer confirm) and is what we take to Yossi.
> The **workspace model · artist-agnostic taxonomy engine · active-discovery Radar · discovery_candidate/field_applicability tables** are **NOT built** — they are the FULL-BETA target (see entity map + DB structure), built AFTER Gate-1 validation.
> Do NOT assume any FULL-BETA feature exists because a task looks done. Tasks 0–10 = org-first Gate-1 build only.
>
> ⚠️ **VOCABULARY NOTE (added 7 Jul 2026):** this log predates canon v2.0 — completed entries below keep their as-built wording. Retired vocabulary: **"Mirror"** → Passport **Artist view**; **"booker"** → **booking manager** (אמרגן); the AI **"stub"** is now **demo/QA-only** — the claim pipeline is **fully automated** (Anthropic API); **single-Passport** framing → **multi-Act** (one Passport per Act; evidence per-Act, non-transferable).


## Legend
- ✅ Done · 🔄 In progress · ⬜ Not started
- After each task: `npm run build` must pass. Report to PM before next task.

---

## TASK 0 — Architecture Foundation ✅
- [x] CLAUDE.md + ARCHITECTURE.md co-located with code
- [x] `src/types.ts` — domain types (Artist, Claim, ProfileItem, EvidenceArtifact, AvailabilityRequest)
- [x] `src/tokens.ts` — design tokens (single source of visual truth)
- [x] `src/lib/ai/` — AiClaimProcessor interface + StubClaimProcessor + AnthropicClaimProcessor + factory
- [x] `supabase/migrations/001_initial_schema.sql` — versioned first migration
- [x] Every Supabase call inside `src/lib/db/` (no direct supabase imports in feature code)
- [x] Feature folder structure: `src/features/{auth,artist,evidence,passport,agency,booker,setup}/`
- [x] `server/index.js` uses AiClaimProcessor factory
- [x] `/api/passport/:id` server endpoint — physically cannot return score/exact-count/gaps/private values
- [x] `Passport.jsx` reads from `/api/passport/:id` (server-enforced firewall)

## TASK 1 — Auth & Onboarding ✅
- [x] Email + password signup with email confirmation handling
- [x] Google/Facebook OAuth buttons (requires Supabase dashboard config)
- [x] Forgot password + Reset password pages
- [x] Language toggle (Hebrew / English)
- [x] 6-step onboarding: identity → links → draw bands → experience → readiness → publish
- [x] Consent page (Amendment 13 direction)
- [x] Role selection: artist / agency / booker

## TASK 2 — Evidence Capture & AI Processing ✅
- [x] Path A: file upload to evidence bucket → evidence_artifact (ticket-export)
- [x] Path C: band picker + optional public URL → evidence_artifact (self-band / public-profile)
- [x] Path B: Connect OAuth (deferred — shown as disabled)
- [x] POST /api/process-evidence → AI stub labels each artifact → writes Claim rows
- [x] Evidence list + resulting claims with source labels

## TASK 3 — Mirror (Artist Private View) ✅
- [x] ArtistDashboard: summary, publish toggle, next-actions (no score)
- [x] ArtistReadiness: 4 axes with StatusChip (חזק/מתפתח/חסר-הוכחה/לא-ניתן-להעריך)
- [x] Claims list with source labels (מאומת/נתמך/מדווח עצמי)

## TASK 4 — Claim Review & Passport Approval ✅ (code-complete; happy-path pending live DB + real service_role key)
- [x] Claims review screen in Mirror: artist can flip claim visibility mirror-only ↔ passport-ok (`ClaimReview.jsx`)
- [x] Passport snapshot: on publish, server writes immutable `passport_versions` row (`POST /api/publish/:id`)
- [x] Server Passport endpoint reads from latest snapshot, not live claims (live build kept only as fallback)
- [x] Publish flow wired in `ArtistDashboard` (publish/unpublish + "refresh public profile" re-snapshot) and `Onboarding` (best-effort snapshot)
- Note: the public Passport + publish require a real `SUPABASE_SERVICE_ROLE_KEY` (server is the firewall). Verified: endpoints build, run, and degrade honestly when the key is absent.

## TASK 5 — Public Passport (full build) ✅
- [x] Hero: photo, stage_name, one_line, verified chip, CTA above fold + sticky bottom
- [x] Proof of Draw block: bands + source label (NO exact number, NO score)
- [x] Track record: profile_items with source labels
- [x] Readiness chips: genre / set_length / regions / invoice
- [x] Firewall line at bottom
- [x] Reads from /api/passport/:id server endpoint (server-enforced) — `Passport.jsx` fetches the endpoint; now also returns the `published` flag so the page renders

## TASK 6 — Availability Request & Agency Inbox ✅
- [x] Availability request form (no login required)
- [x] Request confirmation page
- [x] Agency dashboard: roster list with StatusChip, add artist
- [x] Agency requests inbox: status management (new → replied → closed)

## TASK 7 — Supabase Setup & End-to-End Test ⬜
- [ ] User runs schema.sql (or migration 001) in Supabase SQL Editor
- [ ] User adds service_role key + Anthropic key to .env.local
- [ ] End-to-end test: signup → consent → onboarding → evidence → AI → passport → request → agency inbox

## TASK 8 — Polish & Mobile QA ⬜
- [ ] Test all screens at 375px (iPhone SE)
- [ ] Tap targets ≥ 44px everywhere
- [ ] RTL rendering correct on all screens
- [ ] LTR (English) rendering correct on all screens
- [ ] Sticky CTAs visible above fold on mobile

## TASK 9 — Deploy 🔄 (config prepped; deploy pending Maria's Vercel account)
- [x] `server/` becomes a Vercel serverless function — `api/index.js` re-exports the Express app; `server/index.js` skips `listen()` when `VERCEL=1` (local dev unchanged, verified)
- [x] `vercel.json` — `vite build` → `dist`, `/api/*` → serverless fn, SPA fallback to `index.html`
- [x] Server runtime deps (express/cors/dotenv/@anthropic-ai/sdk) moved to `dependencies` so Vercel installs them
- [ ] Vercel project connected to repo (needs Maria's Vercel account)
- [ ] Env vars set in Vercel dashboard (VITE_SUPABASE_*, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_*)
- [ ] Custom domain connected
- [ ] Production smoke test — verify `vercel.json` routing on first deploy

## TASK 10 — Operator/Admin user type + QA hardening ✅ (code-complete; live verify pending DB)
- [x] New `operator` role: `types.ts`, schema CHECK widened, migration `003_operator_admin.sql` + folded into `apply_to_supabase.sql`
- [x] Operator oversight RLS: platform-wide READ + targeted moderation UPDATE via `is_operator()` (SECURITY DEFINER)
- [x] `AdminDashboard` — stats, all-artists list with publish toggle, all requests, recent claims (firewall-safe: bands/statuses/provenance only, no scores)
- [x] `RoleHome` routes operator → `/admin`; `UserTypeSelect` exposes operator (internal; assign server-side in prod)
- [x] **`RequireRole` guards** on every role's routes (fixes: any logged-in user could open another role's screens)
- [x] **P0 fix:** `Loading` referenced an out-of-scope `T` → crashed every authenticated route on first paint. Now uses `useLang()`. Runtime-verified: login renders, console clean.
- [x] **Bug fix:** `/api/passport/:id` payload now includes `published` (Passport page would otherwise always render "not found")
- [x] **Honest server:** placeholder env values (`PASTE_…`) treated as unset → truthful `/api/health`
- [x] i18n QA: hardcoded Hebrew replaced with `T()` across auth/booker/agency/admin/artist-home/passport; he⇄en parity 227/227 (verified by script)
- [x] Edge-states: try/catch + `ErrorState` on agency dashboard, requests inbox, admin loads
- [x] Runtime smoke test (Vite preview): login renders RTL, EN toggle flips to LTR, no console errors

## TASK 11 — P0 Blockers: password toggle + chip tap-targets + demo gate ⬜
*(Source: BT-01, BT-02, BT-03 — must all ship together; they are tightly coupled)*
- [ ] BT-01: Add password show/hide 👁 toggle to `Signup.jsx` and `ResetPassword.jsx` (P0 — mobile UX blocker)
- [ ] BT-02: Set `chip` CSS class default to `min-h-[44px]` in `index.css` / `tokens.ts`; remove `min-h-[36px]` + `min-h-[40px]` from `org/Members.jsx` and `admin/AdminDashboard.jsx`
- [ ] BT-03: Gate demo persona switcher in `auth/Login.jsx` behind `import.meta.env.VITE_DEMO === 'true'`; remove from production build

## TASK 12 — Auth / Settings UX fixes ⬜
*(Source: BT-04–08)*
- [ ] BT-04: `auth/Settings.jsx` — replace hardcoded consent list with dynamic `listConsents(user.id)` call
- [ ] BT-05: `auth/Settings.jsx` — move `logEvent(EVENTS.SETTINGS_OPENED)` into `useEffect(()=>{…},[])`
- [ ] BT-06: Add `dir="auto"` to display-name `<input>` in `auth/Settings.jsx` and `artist/Onboarding.jsx` StepIdentity
- [ ] BT-07: `auth/UserTypeSelect.jsx` — confirm selected-card ring/highlight renders on tap (fix if not visible)
- [ ] BT-08: `auth/ConsentLegal.jsx` — confirm each `<label>` wraps its `<input type="checkbox">` for ≥44px tap target

## TASK 13 — Artist flow UX fixes ⬜
*(Source: BT-09–17)*
- [ ] BT-09: `artist/Onboarding.jsx` — add step name labels to ProgressBar (e.g. "2 · לינקים") via i18n
- [ ] BT-10: `artist/Onboarding.jsx` — show "Saved ✓" tick after auto-save on blur (StepIdentity, StepReadiness)
- [ ] BT-11: `artist/Onboarding.jsx` StepReadiness — show accepted file-type hint text on rider upload field
- [ ] BT-12: `artist/ArtistDashboard.jsx` — persist dismissed suggestions to `localStorage` (key: `gigproof.dismissedSuggestions`)
- [ ] BT-13: `artist/ClaimReview.jsx` — make "Apply to Passport" banner a sticky footer action bar when page is dirty
- [ ] BT-14: `artist/ClaimReview.jsx` — show magic link expiry date next to copy button; persist `{ link, expiresAt }` to `localStorage`
- [ ] BT-15: `evidence/EvidenceCapture.jsx` — Path B "Connect account": replace chip with BottomSheet explainer stub (what it means, coming when)
- [ ] BT-16: `evidence/EvidenceCapture.jsx` — after AI processing: show inline outcome ("X claims created — Review in Claims →")
- [ ] BT-17: `artist/OfferPayment.jsx` — pending state: show "Marked as paid on [date]" + support contact line; add i18n keys

## TASK 14 — Booking-manager flow UX fixes ⬜
*(Source: BT-18–23)*
- [ ] BT-18: `passport/Passport.jsx` — add one-line intro above ActionLadder rungs ("Let the artist know your interest without committing"); add i18n keys
- [ ] BT-19: `passport/Passport.jsx` — add `<LanguageToggle>` to public Passport page header
- [ ] BT-20: `passport/AvailabilityRequest.jsx` — add descriptive hint labels to capacity_band + budget_band selects (e.g. "עד 100 אנשים"); add i18n keys
- [ ] BT-21: `passport/AvailabilityRequest.jsx` — add per-field `<ErrorNote>` on validation failure (replace HTML5 browser popups)
- [ ] BT-22: `passport/RequestConfirmation.jsx` — add "Copy contact info" fallback button for users without WhatsApp
- [ ] BT-23: `booker/BookerHome.jsx` (folder rename pending) — add helper copy: "No link? Ask the artist for their GIGPROOF link, then paste it here"

## TASK 15 — Producer flow UX fixes ⬜
*(Source: BT-24–27)*
- [ ] BT-24: `producer/ProducerHome.jsx` — add copy: "Have a confirmation link? Click it directly from the email you received"
- [ ] BT-25: `producer/ProducerConfirm.jsx` — after "wrong_person" selection: show "Thank you — no further action needed"
- [ ] BT-26: `producer/ProducerConfirm.jsx` — show link expiry date on page (requires adding `expiresAt` to `/api/confirm/:token` response)
- [ ] BT-27: `producer/ProducerConfirm.jsx` — verify 4 answer buttons are stacked vertically with `min-h-[44px]` on mobile (not inline)

## TASK 16 — Agency flow UX fixes ⬜
*(Source: BT-28–31)*
- [ ] BT-28: `agency/AgencyDashboard.jsx` — show toast after `upsertArtist()` success: "Artist added — share their login link"; add i18n keys
- [ ] BT-29: `agency/AgencyRequestsInbox.jsx` — make request rows tappable; expand to BottomSheet with full request detail (date, location, bands, message)
- [ ] BT-30: `agency/AgencyRequestsInbox.jsx` — add BottomSheet confirmation before `markReplied` / `markClosed`
- [ ] BT-31: `agency/RadarFeed.jsx` — replace "Rule ID" filter with plain-language labels mapped from `T.radar.ruleLabel` (R1–R8)

## TASK 17 — Org screens fixes ⬜
*(Source: BT-32–36)*
- [ ] BT-32: `org/OrgSettings.jsx` — on org delete: `await signOut()` before `window.location.href = '/'`
- [ ] BT-33: `org/UpgradePlan.jsx` — add "Pricing on request — contact us" copy below upgrade CTA; add i18n keys
- [ ] BT-34: `org/Billing.jsx` — disable `addSeats` button OR reroute to "Contact us to add seats" (email link); do not silently increment counter
- [ ] BT-35: `org/Billing.jsx` — add support contact line ("Questions about your plan? [email]"); add i18n keys
- [ ] BT-36: PM decision required — is O3 a planned standalone screen? If yes: scaffold route + empty component. If no: remove from spec.

## TASK 18 — Admin / Operator improvements ⬜
*(Source: BT-37–40)*
- [ ] BT-37: `admin/AdminDashboard.jsx` — replace delete confirm `fixed` overlay with `<BottomSheet>` (consistent with rest of app)
- [ ] BT-38: `admin/AdminDashboard.jsx` — add section anchor links at top of page (Payments · Upgrades · Artists · Requests · Claims · Consents · Audit)
- [ ] BT-39: `admin/AdminDashboard.jsx` — add pagination to all lists: show first 50, "Load more" button
- [ ] BT-40: `admin/AdminDashboard.jsx` — fix stat grid: change `grid-cols-3` to `grid-cols-2 sm:grid-cols-3` (5 cards, no orphan on mobile)

## TASK 19 — RTL / Hebrew corrections ⬜
*(Source: BT-41–50 — Screen Audit Phase 2)*
- [ ] BT-41: `lib/i18n/he.js` — replace ASCII `"` with gershayim `״` (U+05F4) in ALL `ע"י` occurrences (methodLabel, radar.ruleLabel.R5)
- [ ] BT-42: `lib/i18n/he.js` — fix `evidence.connectNote`: remove EN "ticketing" + "Phase 2" → Hebrew equivalents
- [ ] BT-43: `lib/i18n/he.js` + `artist/OfferPayment.jsx` — reorder `offer.payMethods` for RTL; wrap "Bit" in `<span dir="ltr">`
- [ ] BT-44: Add `<bdi>` wrappers to all numbers in HE strings: A8 price range, seat fractions (Members/Billing), age in days (RADAR R1/R7)
- [ ] BT-45: `components/ui.jsx` (SocialAuthButtons) — wrap "Google" / "Facebook" in `<span dir="ltr" lang="en">`
- [ ] BT-46: `agency/RadarFeed.jsx`, `org/UpgradePlan.jsx`, `org/Billing.jsx` — wrap "RADAR" in `<span dir="ltr">` in JSX
- [ ] BT-47: `artist/Onboarding.jsx` ProgressBar — set `dir="ltr"` on `<progress>` element so fill goes right→left in RTL
- [ ] BT-48: All nav chevron icons — add `rtl:scale-x-[-1]` Tailwind class to flip direction in RTL (Onboarding, Settings, Org screens)
- [ ] BT-49: Band value chips in `evidence/EvidenceCapture.jsx` + `artist/Onboarding.jsx` StepDraw — wrap display values in `<span dir="ltr">`
- [ ] BT-50: `auth/Signup.jsx` — wrap `{email}` in `<bdi>` inside `confirmBody()` interpolation

## TASK 20 — Localization stubs (RU · DE · AR) ⬜
*(Source: BT-51–55 — requires native-speaker review before merge; stubs only)*
- [ ] BT-51: Create `src/lib/i18n/ru.js` from terminology table (SCREEN-AUDIT-PHASE2-4.md §3-A); flag: native RU review required before merge
- [ ] BT-52: Create `src/lib/i18n/de.js` from terminology table; flag: native DE review required; the buyer term ("booking manager") stays EN in DE
- [ ] BT-53: Create `src/lib/i18n/ar.js` from terminology table; AR = RTL; apply same bidi rules as HE; flag: native AR review required
- [ ] BT-54: `context/LangContext.jsx` — add RU/DE/AR to `dicts`; set `dir="rtl"` when AR is active
- [ ] BT-55: `components/ui.jsx` LanguageToggle — add RU / DE / AR options

---
*Each task = one PM review checkpoint. Do not combine tasks.*
