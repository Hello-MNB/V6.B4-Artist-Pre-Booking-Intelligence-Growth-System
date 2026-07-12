# GO-LIVE RUNBOOK — rel-2026.07.13 (owner order 12 Jul: prepare EVERYTHING for air)

_The single operational sequence from here to live. Each step names its owner, its evidence, and
what unblocks it. Artists first (North Star). Green Invoice arrives via Maria's tech partner in
1–2 days — the sequence accounts for it: the VERSION can go live before it; the first REAL PAYMENT
cannot._

## PHASE 1 — Build to preview-ready (Claude Code, in progress)
| # | Item | Status |
|---|---|---|
| 1.1 | Artist lane interactive core: Radar interactivity ✓ · next-action ladder now drives publish→share (North-Star chain) ✓ · +New Act ✓ · real magic-link confirm ✓ | ✅ built |
| 1.2 | Terminology + voice wave (owner-approved) | ✅ built |
| 1.3 | Remaining before preview-ready: S2 arrow unification · S3 footer regroup · S4 waitlist type floor · S5 private-client line · S6 Source-Confirmer line · N10 entitlement-status visibility · N-lane states pass (loading/empty/error on N1–N11) · embed rebuild | 🟠 next build push |
| 1.4 | Declare **PREVIEW-READY** in chat + task board | gate to Phase 2 |

## PHASE 2 — Pre-launch testing (the "בדיקה לפני עלייה" — it exists and is binding)
| # | Step | Owner | Evidence |
|---|---|---|---|
| 2.1 | Apply migration 032 (additive; unlocks roster + production inbox) | Cowork — **on Maria's direct word** | SQL applied + regression note |
| 2.2 | ONE preview deploy of the train branch (both projects) | Cowork (one-time hook) | preview URLs |
| 2.3 | Q1 machine gate re-run against the preview commit | Claude Code | verify output |
| 2.4 | Q3 real-browser flows ON PREVIEW: email+Google signup · artist journey end-to-end (onboarding→radar→evidence→publish→share) · booker link · workspace switch · +New Act · producer magic link | Cowork | screenshots + pass/fail table |
| 2.5 | Q4 mobile pass @360px: Radar, roster, Passport, recipient, publish sheet | Claude (Playwright) + Cowork (device) | PNGs in current-screens/ |
| 2.6 | Q5+Q6 firewall + terminology scans on preview | Claude Code | scan outputs |
| 2.7 | Fixes if any → re-run failed Q only | Claude Code | commits |

## PHASE 3 — Go live (atomic)
| # | Step | Owner |
|---|---|---|
| 3.1 | Record rollback anchors (current live SHAs) in DEPLOY-LOG | Claude Code |
| 3.2 | Merge train → main = ONE production deploy per project; embed in same push | Claude Code merges · deploy hooks fire |
| 3.3 | Q2 live fingerprints + embed hash parity | Claude Code |
| 3.4 | Q3–Q5 re-run against LIVE (spot set) | Cowork |
| 3.5 | Q7 governance: VERSIONS.md · DEPLOY-LOG row · Version Map · canon-pack refresh to Drive | Claude Code |
| 3.6 | **Q8 owner pass — Maria looks at the live product and approves. THIS is the launch.** | Maria |
| 3.7 | Tag push + Morning-Sync arm | Cowork |
Rollback: any Q failure on live → redeploy previous SHA (one hook call), fix on branch, re-enter Phase 2.

## PHASE 4 — First-money readiness (parallel, not blocking the version)
| # | Step | Owner |
|---|---|---|
| 4.1 | Billing company name + Green Invoice via tech partner (1–2 days) | Maria |
| 4.2 | Receipt flow test (sandbox → real): pay → operator activates (WHO recorded ✓) → receipt issued | Cowork + Maria |
| 4.3 | First real payer decision (CFRO Q8; clarify "SHIGAON") | Maria |
| 4.4 | Only then: the Gate's "pays" half runs for real | — |

## WHAT I NEED FROM EACH SUPPORTING AI (explicit, per the handoff protocol)
**Cowork:** ① 032 apply (after Maria's word) ② one-time preview hook + the two preview URLs ③ Q3/Q4 evidence packs (screenshots + pass/fail per flow, artist journey weighted) ④ post-live spot re-run ⑤ tag push ⑥ Morning Sync arm (after Maria's go).
**Codex:** ① S5/S6 final wording (one line each, registers per ENTITY-GLOSSARY §2b) — needed in the next build push ② font token VALUES (display/ui/mono/rtl) — blocks font binding, NOT the launch ③ atmosphere/hero image bank — post-launch train ④ review my Q4 screenshots within a day (working rhythm §5).
**GPT-Drive:** ① classify the 2 native GIGPROOF docs ② delete the dead mirror stub ③ after 3.5: verify the refreshed canon pack appears and flag if stale >48h.
**CFRO (CLAUDE CHAT):** ① nothing blocks the launch — hold pricing design until post-Gate (Option A assumed unless Maria says otherwise) ② prepare the 3-cohort price-test design so it's ready the day the Gate closes.
**Maria:** ① "apply 032" to Cowork ② "preview go" ③ Q8 owner pass when live ④ billing company name (1–2 days, Phase 4) ⑤ first-payer decision.
