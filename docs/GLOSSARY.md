# LOCK — מילון מונחים / CANONICAL GLOSSARY
**v1.0 · 8 Jul 2026 · Owner: Maria (R00) · BINDING for every agent, every document, every surface.**
Any text produced for LOCK — UI, marketing, legal, docs — MUST use these terms. A document that violates this glossary is REJECTED (R00 precedent: privacy v0.2, 8 Jul 2026).

## Product concepts
| Concept | EN (locked) | HE (locked) | FORBIDDEN |
|---|---|---|---|
| The product | LOCK (always uppercase; domain lock.show; formerly GIGPROOF, renamed 8 Jul 2026) | LOCK | **GIGPROOF** (old name — forbidden in new copy) |
| Public buyer view | Bookability Passport / the Passport | פספורט / הפספורט הציבורי | **דרכון** (any form) · "Booking Passport" · "Artist Passport" in HE text |
| Artist private view | the artist's private view (the Radar) | האזור הפרטי של האמן (הרדאר) | **Mirror / המראה** (retired: one Passport, shown in views) |
| Evidence display | method-labeled evidence; bands + binaries with method labels | ראיות מתויגות-שיטה; רצועות + בינאריים עם תוויות-שיטה | any score/percentile/rank/gauge/prediction except in explicit negations |
| Proof unit | Proof Unit | יחידת הוכחה | — |
| Method labels (universal tags) | TICKET EXPORT · PRODUCER-CONFIRMED · PLATFORM DATA · OPERATOR-REVIEWED · SELF-REPORTED | kept in English inside Hebrew text (deliberate universal-tag design) | translating them |

## Personas (entity truth — never blur)
| Persona | EN | HE |
|---|---|---|
| Artist | artist | אמן |
| Buyer | booking manager (NOT "booker" in new copy) | אמרגן |
| Producer | producer | מפיק |
| Representative | artist representative | נציג אמן |
| Internal | operator | אופרטור |
| Source Confirmer | source confirmer (capability, not a role — magic link, no account) | מאשר-מקור |

## Structural terms
| Term | Meaning |
|---|---|
| Person → Workspace → Role | one login; workspace bears the subscription; role is per-assignment. "Agency" is an org PLAN, not a person's role |
| Act | one artist (Person) may hold several Acts; evidence is per-Act, non-transferable |
| Plans | Passport (free) · Momentum (artist) · Roster (manager). Buyer free forever. No booking commission ever |
| Four data doors | official API · consented OAuth · artist artifact · artist-confirmed discovery (surface, never publish; no cold directories) |
| Certainty (claim ladder, canon-pending final ruling) | COUNTERPARTY_CONFIRMED > ARTIFACT_SUPPORTED > OAUTH_VERIFIED > SELF_REPORTED (+ STALE/CONFLICTED states) |

## HE lexicon (from canon Lexicon v1.1 / Localization Matrix v2.0 — for the Hebrew pass)
| Term | Locked HE | Forbidden |
|---|---|---|
| Artist view / Buyer view | תצוגת אמן / תצוגת קונה | — |
| PRODUCER-CONFIRMED | מאושר ע"י מפיק | אושר ע״י מפיק |
| SELF-REPORTED | מדווח ע"י האמן | הצהרת האמן |
| ARTIFACT-SUPPORTED | נתמך בראיה/מסמך/מקור | נתמך בראיות |
| generic "verified" | — | **מאומת** (never generic; current repo has 10 occurrences → HE-pass fix list) |
| Draw hero (public) | כוח בוקינג | עוצמת מכירה (INTERNAL ONLY — never in UI) |
| Act | ⏳ NO locked HE term — R00 ruling pending; never invent one |

## Voice law
Professional restraint; evidence-grade; show-business warmth without hype. NO emoji in UI/legal copy. No exclamation-mark salesiness. "check, don't trust". EN and HE each fully professional — never mixed in one view (LANGUAGE LAW, see LOCALIZATION-MATRIX.md).

## Factual stack statements (for legal/marketing accuracy — keep current!)
- Hosting: **Vercel** (NOT Netlify). DB/Auth: Supabase. AI: **Anthropic, ACTIVE** (server-side evidence labeling — never describe the pilot as "no external AI").
- Analytics: GA4 `G-ZX907M2NY8`, ACTIVE, consent-gated (Consent Mode v2, defaults denied).
- Not yet active (describe as conditional): Resend, Google/Facebook OAuth (client created, not enabled), Tavily discovery (key verified, build pending, counsel-gated).
- Payment: Bit + reference code GP-XXXX, manual activation. Receipts: Green Invoice (pending signup).

## CHANGELOG
- v1.0 (8 Jul 2026): Created after R00 rejected privacy v0.2 for glossary violations (דרכון, המראה, Netlify, false no-AI claim).
