# LOCK — TASK REGISTER

**Owned and updated by the build agent (Claude). The owner never maintains this file.**
_Created 17 Jul 2026 from the real, witnessed state of the product — not from plans._

## The rules this register obeys (owner directive, 17 Jul 2026)

1. Every task has a permanent number (T-01, T-02…) — never reused, never renumbered.
2. Every task cites its spec section in `docs/LOCK-PRODUCT-SPECIFICATION.md`. No section → not a task.
3. Every task carries the 8-point status. **DONE only when all 8 are ✅:**
   - **CODE** — built; `npm run verify` green (all 10 inspectors).
   - **MOBILE** — §10.2 @ 390px: one job per view · bottom nav · bottom sheets not new pages · exactly one primary CTA · no h-scroll · 44px targets · fits one viewport.
   - **DESKTOP** — §10.3 @ 1360px: one nav · no duplicated titles · identity chrome = 2 elements · one primary CTA (inspector holds it) · no h-scroll · zero console errors.
   - **LEXICON** — §4 glossary EN+HE exact · §4.4 method labels exact · §6 law 4 no technical/internal language.
   - **INTERACT** — §10.4: every editable field through all 7 states (empty · typing · invalid · saved · undo · loading · error-retry), tested with empty/long/Hebrew/URL/invalid.
   - **NAV** — §10.6: forward AND backward path · no dead-ends · deep-link honored.
   - **A11Y** — §10.5 contrast ≥4.5:1 (prefer 7:1), approved AA pairs only · §10.7 prefers-reduced-motion · keyboard works.
   - **FIREWALL** — §10.1: inspectors pass; no score/percentile/rank/%-as-grade/gauge/prediction/exact-headcount/follower-count/leaderboard/position/firewall-narration. Draw = bands. Reaction-to-artist = method-safe text.
4. **MOBILE and DESKTOP can only be ✅ when a human has looked.** Not the agent. Until then: ⚠️ unwitnessed + who must look.
5. §6 law 2: mobile is the DEFAULT, designed separately — two checks, never one.
6. Never mark DONE what was not witnessed running.
7. Every task names its blocker and who unblocks it (owner = Maria · agent = Claude).

**Marks:** ✅ done · ⚠️ partial/unwitnessed (note says what's missing) · ❌ not built · — not applicable (non-screen task).

---

## NOW — the one task in progress

### T-01 · Login — §8.13 (shared screens) · §13.4.4 (auth engine) · §17.B.1
The front door: email+password, Google, forgot/reset, signup hand-off.

| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |

- **CODE ✅** — verify green; real authentication proven against the live server 17 Jul (real session for `artist@gigproof.test`); owner signed in successfully in her own live test 17 Jul.
- **MOBILE ⚠️ unwitnessed** — nobody has run §10.2 at 390px. **Maria must look.**
- **DESKTOP ⚠️ partially witnessed** — Maria used it successfully (17 Jul) but the §10.3 checklist was never run item-by-item. **Maria must look** (agent prepares the checklist walk).
- **LEXICON/INTERACT/NAV/A11Y ⚠️** — systematic §10 passes not yet run. **Claude runs these next** (that is the current work).
- **Blocker:** none for the agent-side checks; the two witness checks wait on Maria.

---

## BLOCKED — waiting on Maria (plain language)

### T-15 · Apply migration 037 (`is_demo` flag) — §14.3.2
The database change that separates test activity from real customer activity, so your Gate count ("1 real reaction + 1 real payment") is clean.
- **State:** written, tested, pushed (`supabase/migrations/037_analytics_is_demo.sql`). Supabase Pro is enabled — nothing technical remains.
- **What Maria does:** either paste the SQL I sent into Supabase → SQL Editor → Run, **or** reply "apply it" and I do it. After that I ship the paired server filter (never before — the order matters).

### T-10 (email half) · Gate email to the artist — §14.6.5
When a booking manager reacts, the artist should get an email. The in-app notification works today; the email cannot exist until there is an email account to send from.
- **What Maria does:** sign up at resend.com (free ≤3,000/month) → create an API key → put it in Vercel (I'll give the exact click-path when you have it). **Never paste the key in chat.**

### Witness requests (rule 4 — a human must look)
- **T-01 Login** and **T-08 Public Passport**: Maria looks at 390px (phone) and 1360px (desktop) against the §10.2/§10.3 checklists — I will hand her a one-page checklist for each when the agent-side passes are done.

---

## NEXT — the queue, in build order (owner's order, 17 Jul)

### T-02 · Onboarding — §8.1 (BUILT 2-step; TARGET 3-step noted honestly)
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
- **CODE ✅** — every save verified against the live database 17 Jul (9/9: consent · identity · strongest link · evidence mirror · read-backs). Refresh-resume built (step survives reload).
- All human-witness and §10 passes pending. **Blocker:** none. **Who:** Claude, then Maria witnesses.

### T-03 · Radar: desktop canvas — §8.2 (4-zone layout · six planets · bounded states · constellation · platform ring)
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ⚠️ | — | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
- **CODE ⚠️** — a substantial Radar exists (`RadarUniverse.jsx`) and runs; it has NOT been diffed against §8.2's definition-of-done (4 zones · state words under planets · thread colors · detected-only platform ring · inspector-XOR-dock CTA law). First step: gap-diff, then close gaps.
- MOBILE intentionally **not** in this task (rule 5 — separate task T-04). **Blocker:** none. **Who:** Claude.

### T-04 · Radar: mobile "Radar Focus" — §8.2 (mobile block) · §7.5 · §6 law 2
Designed separately: zoom-on-tap · swipe next/prev planet · pull-down closes the sheet · bottom one-action dock · inspector as bottom sheet.
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ⚠️ | ⚠️ | — | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
- **CODE ⚠️** — mobile layout exists but gestures (swipe/pull-down) and the dock-XOR-sheet CTA law unverified vs spec. **Blocker:** none. **Who:** Claude, then Maria witnesses on a real phone.

### T-05 · Radar: Planet Inspector + in-place fill — §8.3 · §17.A.2
The 3-layer action widget (what it means · what LOCK found · the one next thing), holding the single primary CTA; the Professional-Kit fill-in-place forms.
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
- **CODE ⚠️** — exists; owner's 17 Jul finding #3 ("not interactive enough") partially fixed live (expander is now a real 44px button; "Save — right here"→"Save"). Full §8.3 3-layer conformance + the design-language pass still owed.
- **Blocker:** none. **Who:** Claude, then Maria witnesses.

### T-06 · Radar: next-best-step engine + scene/lens system — §8.2 (interactions) · §9.4
ONE computed next action with its "why" line (priority ladder per spec); scene ★ re-weighting that never changes data; lenses that dim, never remove.
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
- **CODE ⚠️** — a next-action exists on the dashboard; the §8.2 priority ladder + scene lens + "why" lines unverified vs spec. **Blocker:** none. **Who:** Claude.

### T-07 · Artist Passport self-view — §8.4 (multi-view: edit vs buyer-preview)
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
- **CODE ❌** — today `/artist/passport` is a bare redirect (known gap S6). The real screen (see-what-buyers-see + edit affordances) is unbuilt. **Blocker:** none. **Who:** Claude.

### T-08 · Public Passport (buyer) — §8.7 (the 60-second decision page)
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | ⚠️ | ✅ |
- **CODE ✅** — live with two persona views (Booking / Representation); firewall strip removed 16 Jul; **NAV ✅** — fresh-opened shared links land correctly since 17 Jul (deep-link fix, live-verified).
- **DESKTOP ⚠️** — Maria viewed it live 17 Jul (worked); §10.3 checklist not run. **MOBILE ⚠️ unwitnessed.** **Blocker:** none. **Who:** Claude runs §10 passes; Maria witnesses.

### T-09 · Availability request + receipt — §8.8 (the Gate action)
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
- **CODE ✅** — form + server endpoint live; the security suite proves an anonymous request creates the row and the server-authored notification (10 denial checks green).
- All witness/§10 passes pending. **Blocker:** none. **Who:** Claude, then Maria.

### T-10 · Notification to the artist — §8.13 (bell) · §14.6 (email)
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
- **CODE ⚠️** — in-app bell works (server-authored, closed enum, tested). The EMAIL half is ❌ and **blocked on Maria** (Resend key — see BLOCKED). **Who:** Maria unblocks email; Claude builds the guarded send path (already designed).

### T-11 · Admin / Operator cockpit — §8.12
| CODE | MOBILE | DESKTOP | LEXICON | INTERACT | NAV | A11Y | FIREWALL |
|---|---|---|---|---|---|---|---|
| ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
- **CODE ⚠️** — operator export + basic admin exist; the Gate tiles (funnel counts — product-event numbers, allowed) are backlog. Gate metrics must read `is_demo=false` **after** T-15 applies. **Blocker:** T-15 (for clean numbers). **Who:** Claude.

**Everything after T-11 is post-Gate and is deliberately NOT queued (owner directive).**

---

## DONE — witnessed, with dates

### T-12 · Design-system tokens into code — §5.11 *(non-screen: MOBILE/DESKTOP —)*
All 8 applicable ✅. 16 Jul 2026. Type scale/radius/CTA paddings in `tailwind.config.js` + `tokens.ts`. Witnessed: verify suite + both builds green (Claude). Commit `835e699`.

### T-13 · Humanized band renderer — §5.10 *(non-screen)*
All 8 applicable ✅. 16 Jul 2026. Pure functions + 10/10 unit tests incl. the firewall property (output is a known line, never a number). Witnessed: test run (Claude). Commit `91b8497`.

### T-14 · §20 guardrail inspectors — §20 · §10.1 *(non-screen)*
All 8 applicable ✅. 16 Jul 2026. Five inspectors wired into `npm run verify` (suite = 10 checks). Witnessed: proven live by planting a bookability score on the Passport — blocked with 3 catches, then removed (Claude); the internal `score→weight` rename ruled by Maria. Commits `3b1e0ff`, `d5afb94`.

### T-16 · Owner-audit fixes ①②④ — §7.6 (deep-links) · §4/§6 (terminology) *(infra + lexicon)*
All 8 applicable ✅. 17 Jul 2026, **live on production** (merges `b49d568`, `5e75f0f` — owner-authorized). Refresh serves the app on all 29 routes; fresh-opened shared Passport links land on the Passport (browser-proven); "Sign in" unified. Witnessed: live URL tests post-deploy (Claude); **Maria's re-test requested** — her confirmation upgrades this from agent-witnessed to owner-witnessed. Finding ③'s full design pass lives in T-05, not here.

---

## Register maintenance log
- 2026-07-17 · Register created from real state; T-01…T-16 assigned (T-01…T-11 = owner's build order; T-12…T-16 = pre-register work needing permanent numbers). Next number: **T-17**.
