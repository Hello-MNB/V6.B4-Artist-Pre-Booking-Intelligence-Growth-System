# A9 Artist Radar — build brief (CODEX Design System v1.2.0 — "Proof Lime")
*Extracted 7 Jul 2026 from "Screens By Codex" (ProductPrototype.jsx LF-A1, RadarScreensShowcase, design-system-states.css, Design System v1.2.0).*

**⚠ IDENTITY RULING (Maria, 7 Jul 2026): the folder's Design System v1.2.0 IS the canonical app identity** — paper `#F3F5EF` · ink `#0A0D0B` · forest `#18221A` · **lime `#C8F04D` accent (always with DARK text)** · mist `#DDE3D9` · muted `#687269` · Georgia serif display · Manrope body · DM Mono labels · soft radii (9px controls / 13px rows / 15–18px cards). The stamp-purple/Archivo look was the *marketing-site variant* and was applied to the app by mistake, then corrected same day. Do not "supersede" the folder identity again.

## Screen anatomy (mobile-first, top→bottom) — the LINEAR reference (LF-A1)
1. **AppTop** — h1 "Artist Radar" + subtitle "Private to you and approved collaborators"
2. **Act switcher** (`context-pill`) — white pill: initials square · `<b>Act</b> <small>Independent artist · Owner access</small>` · chevron (maps to existing ContextSwitcher)
3. **Greeting** — date + "Your clearest next move"
4. **ONE `next-action` card** (never a list): dark `ink` card on paper · eyebrow "Recommended next action" · h3 imperative ("Add ticket activity from your last show") · one-line why ("supports how professionals understand your live demand — not just your online reach") · `stamp` button · small "About 3 minutes · your input is saved" · `is-done` state = deep green-dark
5. **`section-row`** — "Your evidence picture" + View all
6. **`dimension-list`** — rows (white card, 1px line border):
   - left: h4 dimension name + meta line (freshness/action: "Reviewed 28/06/2026", "2 details need attention")
   - right (`dimension-side`): bounded-status chip ONLY
   - ⚠ CODEX's `linear-track` %-fill = score-adjacent → **DELETED per standing firewall rule. Chip + freshness date only.**
7. **`privacy-note`** — private-surface reassurance
8. BottomNav (exists via AppShell)

## Bounded-status chips (`gp-status` tones → D1 re-tint, bg = 10–15% tint of fg on paper)
- strong/fresh → `bg ok/10, text ok` · developing → `bg warn/10, text warn`
- **missing = warm-brown, NOT error-red** (CODEX: `#f2e6dc/#8a5432`) — "Unknown evidence is never presented as weak evidence" (Journeys DoD)
- not-assessable → neutral (`surface`/`gap`); Space Mono, uppercase, dot via ::before, radius 2px
- Freshness vocabulary: `Reviewed DD/MM/YYYY` · "ageing" · "X months old · Refresh recommended"

## Desktop supplement (RadarScreensShowcase `radar-summary`)
Selected-dimension side panel: eyebrow SELECTED DIMENSION → state word → plain-language claim → dl rows (Evidence "2 confirmed" / Freshness "1 ageing") → BEST NEXT MOVE → CTA + quiet "Mark this not applicable". One selected insight at a time — never twelve recommendations at once.

## Firewall-banned from the CODEX sources (do NOT port)
`twelve-radar/-web/-area`, `radar-dial`, `dial-ring/-shape`, orbit/planet/satellite visuals, `passport-readiness-ring`, peer/artist comparison shapes, any %-driven fill. "No decorative dashboard · No overall public score."

## Interaction contract (design-system-states.css)
transitions .18s ease · press translateY(1px) scale(.99) · focus outline 3px offset 3px · disabled opacity .48 saturate(.45) · skeleton shimmer (never spinners on AI states) · buttons min-height 44px mobile · prefers-reduced-motion kills transforms.

## Passport (A15) quick keys — for the next screen after A9
Repo already has the canonical components: `website-next/components/proof-unit.tsx` + `band-pill.tsx` (text-only, no fill/gauge). Page: 480px column · header eyebrow `GIGPROOF · BOOKABILITY PASSPORT` → Archivo name → meta → 3px ink border · sections LIVE DRAW ("FIGURES SHOWN AS BAND — NO EXACT HEADCOUNT") / PERFORMANCE / COMMUNITY ("CONTEXTUAL — NOT DRAW EVIDENCE") / READINESS · footer 2px ink border + full no-score disclaimer · `proof-hero` = first ProofUnit boxed · sticky `Check availability` CTA → action-sheet (primary: check availability, request price · divider · save/forward/future-fit/request-proof/not-fit) → `receipt` "recorded privately. This does not create a booking or hold."

## Assets
`…\Screens By Codex\BRANDING AND DESIGN SYSTEM\02_ASSETS\gigproof-icons.svg` — 18-icon sprite (gp-radar, gp-passport, gp-evidence, gp-live, gp-audience, gp-booking, gp-lock, gp-approved, gp-warning, gp-arrow…), stroke 1.8, currentColor. Personas + artist-type art (1672×941 / 1122×1402) in same folder.
