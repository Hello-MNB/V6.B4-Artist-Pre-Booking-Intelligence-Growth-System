# LOCK — PRODUCT SPECIFICATION

**The single source of truth for building the LOCK product.**
_Status: consolidated master spec · Written 15 Jul 2026 · Firewall-safe · Repo doc (shareable — contains no credentials or secrets)._

> This document is written so that a developer or a fresh AI session could build the entire LOCK product from it alone, with no other context. It synthesizes and reconciles the full canon doc set (see §0.3 Sources). Where the interactive prototype and the newest design law differ from an older doc, **the prototype + the newest doc win** and the reconciliation is noted inline.
>
> **The behavioral ground-truth is the interactive prototype** (`scratchpad/lock-full-prototype.html`, published as artifact `1c9b0030`). The prototype *shows* how every screen behaves; **this document is the written law**. When in doubt about an interaction nuance, open the prototype; when in doubt about a rule, obey this document.

---

## 0. Table of Contents

- **0. Front matter** — 0.1 How to read · 0.2 Reconciliation rules · 0.3 Sources
- **1. Overview & Product Definition** — what LOCK is / is NOT; the pre-booking-proof thesis; the guiding sentence
- **2. The Firewall (absolute rules)**
- **3. Entity Model** — Person→Membership→Role→Workspace; Acts; ArtistAccess; the 6 actor families; demand-side segmentation; entity universe map; what is instantiated today
- **4. Canon Glossary** — every term, EN + HE
- **5. Design System** — palette/tokens; 3-tier token control layer; "dark is atmosphere not camouflage"; type/spacing/radius; CTA hierarchy; 44px; motion; the widget kit + full state sets; values still OWED by Codex
- **6. Global UX Laws**
- **7. Navigation & Shell** — identity hub; per-entity nav; real-app rule; mobile bottom-nav
- **8. Per-Screen Specification** — THE CORE (Onboarding · Artist Radar + full Inspector · Passport · Requests · Access · Buyer/Public Passport · Source-Confirmer · Representation · Production · Admin · shared screens)
- **9. AI / Scan Intelligence** — built vs target; discovery step; locale-awareness; provider fallback
- **10. QA / Acceptance** — mobile-first, desktop, per-field DoD, contrast, firewall scan
- **11. Current State & Living References**
- **12. Open Decisions** — owner rulings still pending

### 0.1 How to read
Sections 1–7 are the laws every screen inherits. Section 8 is the buildable core: each screen carries PURPOSE · DESKTOP layout · MOBILE layout · COMPONENTS · STATES · INTERACTIONS · EXACT MICROCOPY · FIREWALL notes · DEFINITION OF DONE, and is buildable from its sub-spec alone. Sections 9–12 are the intelligence layer, acceptance, current state, and unresolved rulings.

### 0.2 Reconciliation rules (applied throughout)
1. **Prototype + newest doc win** over older docs on any conflict.
2. **The firewall (CLAUDE.md) is absolute** and overrides everything, including design convenience.
3. **The glossary is binding**; any term not in §4 is a blocked review.
4. **Honesty firewall:** never present TARGET architecture as BUILT. Per-evidence AI claim extraction is BUILT; multi-source deep scan + locale-aware auto-discovery is TARGET.
5. **Code identifiers are frozen** — DB enum values (`workspace_type='producer'`, roles `booker`/`agency`/`producer`) keep legacy names; renaming them is a governed migration, never a casual edit. UI copy uses the canon terms regardless of the frozen identifier beneath.
6. Items that are unresolved are marked **OWED** (a deliverable another party must supply) or **OPEN** (an owner ruling) so they are never mistaken for settled.

### 0.3 Sources consolidated
CLAUDE.md (product definition + firewall) · `docs/architecture/ENTITY-STRUCTURE-AND-SMART-SCREENS-AUDIT.md` PARTS 1–10 (richest source) · `docs/SESSION-MEMORY.md` (entity model, standing rules, U1–U34 register, test-logins pointer) · `docs/ENTITY-GLOSSARY.md` + `docs/GLOSSARY.md` (canon terms) · `docs/design-system/A13-TOKEN-VALUES.md` + `COMPONENT-STATE-TOKENS.md` + `DS-v1.2.0-DIGEST-AND-ALIGNMENT.md` · `docs/VERSIONS.md` · `docs/team/TEST-LOGINS.md` (pointer only) · the living prototype `scratchpad/lock-full-prototype.html` (artifact `1c9b0030`).

---

## 1. Overview & Product Definition

### 1.1 What LOCK is
LOCK is a **pre-booking proof / risk-reduction tool**. It does two jobs for two sides of the same market:

- **For artists (supply side):** it helps an artist build a **provable professional identity** — standardized, method-labeled evidence of who they are and what they can do — assembled largely from what already exists publicly, and confirmed by the artist one tap at a time.
- **For Israeli demand-side buyers:** it lets **booking managers, promoters, event producers, planners, and private/corporate clients** (מזמיני הופעות) evaluate an **unfamiliar** artist through standardized, method-labeled evidence **before they risk their own name** on the booking.

The core insight: **talent ≠ bookability.** A buyer's real question is not "is this artist good?" but "can I put my name on this night without a nasty surprise?" LOCK answers that with checkable evidence, not with hype and not with a score.

### 1.2 What LOCK is NOT
- **NOT an EPK** (electronic press kit / promo reel). LOCK shows verifiable proof, not marketing assets.
- **NOT a booking CRM.** It does not manage deals, contracts, calendars, or pipelines.
- **NOT a guarantee.** It reduces risk by making trust *inspectable*; it never promises an outcome.
- **NOT a scoring/ranking engine.** See §2, the Firewall — this is the product's defining constraint.
- **NOT a cold directory / talent marketplace.** No cold discovery of artists who never opted in; evidence surfaces only for artists who confirm it.

### 1.3 The pre-booking-proof thesis
A booking manager risks their reputation every time they book an unfamiliar act. LOCK converts an artist's scattered public footprint (lineup listings, streaming catalogue, RA bookings, ticketed nights, press, producer word-of-mouth) into a **single Passport of method-labeled strengths** the buyer can check in under a minute — draw shown as **bands**, readiness as **binaries**, each carrying **how we know it**. The artist controls exactly what is public. The buyer never sees a number they must trust blindly; they see evidence they can open and verify.

### 1.4 The guiding sentence (the north star for EVERY screen)
> **"LOCK found something real. Here's what it means. Here's the one thing to do next."**

Never "here are many panels of evidence and internal states." Every screen leads with what the system already found or can do, explains why it matters in human language, and offers **one** clear next action. This sentence is the acceptance test for any screen's information architecture.

### 1.5 One Passport, shown in views
There is exactly **one** Passport per Act. It is shown in **views**, never duplicated into separate documents:
- **Artist view (private — the Radar):** shows gaps as invitations, private/working items, what still needs the artist. This is the artist's developmental intelligence.
- **Buyer view (public — the Passport):** shows **verified strengths only**, in each buyer's language. Never reveals a gap.

The retired term "Mirror / המראה" must never reappear — it is one Passport, shown in views.

### 1.6 Stage & the Gate
LOCK is **pre-validation**. The success **Gate** is deliberately small and binary: **one booking manager reacts to a real Passport AND one pays.** Monetisation is *measured, not required*; no price or ICP is locked until the Gate is reached. (Analytics events that measure the Gate: `availability_request_created` for the reaction; `entitlement_activated` for the verified payment — see §9 and §8.11 Admin.)

---

## 2. The Firewall (absolute rules)

The firewall is the product's identity. It is **absolute** and overrides design convenience, growth tactics, and every other consideration.

### 2.1 The evidence firewall
**NO** score · **NO** percentile · **NO** rank · **NO** "bookability %" · **NO** prediction · **NO** gauge · **NO** headcount · **NO** peer-leaderboard · **NO** position/placement number — **ever**, on any surface, for any entity.

Draw and standing are shown **ONLY** as:
- **Bands** (e.g. "300–800", "2,500–5,000", "Regular", "₪8,000–20,000") — never an exact figure.
- **Binaries** (e.g. "Invoice-ready · Yes", "Rider on file", "Set 90–120 min") — ready or not shown.
- **Method labels** (how we know it — see §4.4).

State is shown as one of four **bounded words** — **Ready · Developing · Needs you · Locked** (Radar); "Not needed yet" for a locked planet — plus four bounded node marks (**✓ ✦ ? +**) and colour. `N/A ≠ weakness`. Nothing goes public until the artist confirms it.

### 2.2 The firewall is ENFORCED BY DESIGN, never NARRATED (U33 — strengthened rule)
There is **no score/rank component in the codebase to begin with.** The firewall must **not** be described to the user on screen. The "No score · No ranking · No prediction · No guarantee · Bands · Binaries · Method labels" strip is **FORBIDDEN** on any app or Passport screen — it is technical narration.
> **Reconciliation note:** the prototype's Buyer/Public Passport (`buyer/passport`) still renders a `.fwstrip` footer ("No score · No ranking · No prediction · No guarantee · Bands · Binaries · Method labels"). This is a **known leftover that violates U33 and must be removed** in the build. The newest rule (U33) wins over the prototype here. The public Passport communicates its honesty through the *shape* of the evidence (bands + binaries + method labels), never through a printed disclaimer.

### 2.3 Streaming = secondary context
Streaming/online-reach figures are **secondary context**, never the headline and never a proxy for live draw. "Live-room proof matters more than follower count." Music/catalogue proves range, not draw.

### 2.4 Per-Act evidence is non-transferable
Evidence and the Passport are scoped **per Act** via `act_id`. A new Act starts **empty**. Switching Acts swaps the whole universe; evidence never merges across Acts. `passport_version.act_id` binds a Passport to an **Act**, not to a Person.

### 2.5 Reaction insight back to the artist = method-safe text ONLY
When a buyer's reaction returns to the artist, it is expressed as **method-safe text only — never a count, %, or score.** This is the single most fragile spot; any "buyers reacted" surface must be guarded. (Example allowed: "A booking manager checked your date." Forbidden: "3 buyers viewed you", "72% match".)

### 2.6 Method labels describe provenance, never quality
The four method labels describe *how strong the basis is* (provenance), never *how good the artist is*. They are the mechanism that lets draw be shown honestly as bands + binaries.

### 2.7 Genre/scene emphasis is guidance, never grading
Scene emphasis ("buyers in your scene look here first") is a **ring + words only** — never a weight, number, rank, %, genre-leaderboard, public badge, or buyer-facing weakness. With **no genre/scene signal → no emphasis at all** (every planet equal; never a guessed weight).

### 2.8 Honesty firewall (built vs target)
Never present TARGET architecture as BUILT. Per-evidence Anthropic claim extraction is BUILT; the multi-source deep scan + locale-aware auto-discovery is TARGET. Copy may show the *intended* discovery experience as vision, but method labels stay honest (found vs confirmed) and any "wider automatic scan" is disclosed as "in development."

---

## 3. Entity Model

### 3.1 The spine: Person → Membership → Role → Workspace
- **Person / Account** — the human login. One human. Never the public artist identity. A person never re-registers to switch context.
- **Workspace (Organization)** — the operating context that bears **data, billing, and seats**. The tenant. `organization.plan ∈ ('solo','agency','agency_plus')`. Valid customer workspace types: **artist · management (agency) · producer (production)**.
- **Membership** — a Person joins a Workspace via `organization_membership` with `org_role ∈ ('owner','admin','member')`.
- **Role** — permission inside the active workspace, carried by `role_assignment.functional_role ∈ ('booker','agency','artist_manager','artist','operator','producer')` + an `authority_scope` JSON. Role is permission, **not identity**. Multi-role stacking (one Person = manager + booking-agent) is legal in schema (two `role_assignment` rows) but has **no UI today** (gap E4).
- **Active context** — `active_role_context` holds the live workspace/role.
- **Subscription** — a row on the workspace carrying `seats_included` / `seats_used`.

**Solo → team → company is one shape upgraded:** a solo workspace is an org with one owner-member; a company is the same org upgraded (plan) with seats filled. Only **Artist, Manager office, and Production** are workspaces that can grow solo→team→company.

### 3.2 Acts (multi-Act)
One artist (Person) may hold several **Acts** — e.g. a psytrance Act and a techno Act — each its own universe with its own Passport and its own evidence, **non-transferable**. The solo/team/company axis lives on **(a)** the Act's performing form (`act.format ∈ dj-set/live-set/duo/band/open-format/vocalist/other`) and **(b)** workspace seats — **never** on the Person (the Person is always one human). Multi-Act is a *within-Person* fan-out, orthogonal to solo/team. Act switch = the Radar center-star; switching swaps the whole universe.

### 3.3 ArtistAccess (scoped, revocable, artist-approves)
A **separate axis** from org/team membership. An artist grants a manager/representative scoped access (`artist_access` grants, migrations 027/032). Properties: **consent-based · scoped · revocable by either side · artist-approves · NEVER implies ownership.** UI copy must never say "grant" in ownership language; the artist surface is "Who can act for you" (§8.5). Scopes seen in the prototype: **see** ("See my Passport") · **reply** ("Reply to date requests for me") · **manage** ("Help keep my Passport up to date").

### 3.4 The six workspace/actor families
| # | Family | Workspace? | Forms | Notes |
|---|---|---|---|---|
| 1 | **Artist / Act** | YES (type `artist`) | SOLO (built) · TEAM band/collective (schema via `act.format`) · COMPANY (schema-latent) | holds Acts; per-Act evidence + Passport. Person is always one human. |
| 2 | **Representation** (Manager office / Agency — אמרגן, **artist-side**) | YES (type `management`, role `agency`) | SOLO (plan `solo`) · TEAM (plan `agency`) · COMPANY (plan `agency_plus`) | roster + ArtistAccess. Membership ≠ ArtistAccess ≠ ownership. |
| 3 | **Production** (משרד הפקה) | YES (type `producer` — legacy value) | SOLO freelancer · TEAM crew · COMPANY | events + lineups + team. To *book* an artist, Production acts as a Buyer. |
| 4 | **Buyer** (מזמין הופעות — **demand side**) | **NO** workspace by default | segmented (see §3.5) | public Passport review needs **no login**; a signed-in pro booker gets a thin `/discover` home. |
| 5 | **Source-Confirmer** (מאשר-מקור) | **NO** workspace — accountless | individual only | confirms exactly ONE claim via a bounded magic link. NO signup, NO dashboard, NO workspace shell. |
| 6 | **Admin / Operator** (תפעול) | internal console, not a customer workspace | internal LOCK team only | `/admin` cockpit; `is_operator()` gives cross-tenant read via RLS. Never in public signup. |

### 3.5 Demand-side segmentation (never collapsed into "show-business pros")
| Buyer context | HE | Language register | Workspace? |
|---|---|---|---|
| Professional entertainment buyer (venue/club/festival/promoter/talent buyer) | מזמין הופעות / מנהל בוקינג / פרומוטר | booking/talent language OK | optional (booker screen-set) |
| Private event client (wedding couple, family/party) | לקוח פרטי / מזמין אירוע | simple, non-industry: style, fit, trust, availability | **NO** — Passport review/contact only |
| Corporate client (company/HR/office manager) | לקוח עסקי | reliability, fit, invoice/logistics | NO by default |
| Event planner (plans for a client) | מתכנן אירועים | coordination, style/fit, availability, vendors | optional |
| Event production (executes event/logistics/lineup) | מפיק אירוע / צוות הפקה / חברת הפקה | professional | **YES** — Production workspace |

**Absolute:** the buyer is **NEVER an אמרגן**. אמרגן = artist-side agent/office (the AGENCY entity). The v1.0 inversion (buyer ≡ אמרגן) is corrected everywhere.

**Six questions before any entity copy/route/component:** artist-side representation? · professional buyer? · private/non-industry client? · event production? · source-confirmation only? · does it need a workspace at all — or only a recipient/Passport-review flow?

### 3.6 Individual vs Team matrix
| Entity | Individual/Team | Workspace? | Boundary |
|---|---|---|---|
| Person/Account | individual only | no (the login) | account identity ≠ public artist identity |
| Artist | individual (one entity, many Acts) | yes | "supported, not inspected" |
| Act | belongs to one artist | no (inside artist ws) | evidence per-Act, never transfers |
| Manager office (אמרגן) | individual OR team/company | yes (seats/invites) | membership ≠ artist ownership |
| Production | individual OR team/company | yes | ≠ Source Confirmer; not a roster owner |
| Buyer | private individual OR business | **no** by default | public Passport review needs NO login |
| Source Confirmer | individual, accountless | no (magic-link task) | no signup/dashboard/endorsement |
| Operator | internal only | internal console | never in public signup |

### 3.7 The entity universe map — done / partial / absent (the critical modeling rule)
The full fine-grained entity universe (the "64-entity" catalogue: every Person/Workspace/Role/Act/Passport/ArtistAccess/buyer-segment/confirmer/operator permutation) is maintained in the canonical **ENTITIES artifact** (`f702abc5`, "structure + screens + intelligence + target"). This spec captures the **modeling rule** and the instantiation status; the fine-grained enumeration lives in that artifact and must stay in sync with it.

**The critical modeling rule:** solo-vs-team-vs-company is **NOT** a separate entity — it is the **same workspace** grown via seats (and, for the Artist, via `act.format`). There is no `entity_form` column today (gap E3): solo-vs-team is *derived* from member count, never declared. Multi-Act is a within-Person fan-out, not a new Person. ArtistAccess is a relationship/grant, never an entity that owns anything.

**Instantiation status (built / partial / absent):**
- **Built end-to-end:** Artist solo (onboarding → radar → passport → requests); multi-Act create/switch; Representation roster + ArtistAccess request/revoke + members/invites; Public Passport + availability request + receipt; Source-Confirmer at `/confirm/:token`; Admin console (~90%).
- **Partial:** Production (Team + Events render real data; Requests degrades honestly without migration 032; **no** event/lineup creation UI); artist edit (the D1 hole — confirmed radar nodes render with no edit form).
- **Absent / schema-latent:** artist team/company invite UI; explicit `entity_form`; multi-role stacking UI (E4); in-place solo→team upgrade flow (E6); buyer team/organization (post-Gate, E5); industry-comparison peer bands (RAD5).

### 3.8 The two named modeling defects to respect in any build
- **D1 (P0):** Artist identity is set-once with no edit surface — the owner's reported broken screen. The fix is the **Act-Identity Editor** (`/artist/act/edit`, §8.4/§8.6) with field-level save. Confirmed radar nodes must get an "edit" affordance.
- **D3 (P0):** the Source-Confirmer must **never** be a workspace shell. Any `/producer` + `/producer/received` logged-in shell is the D3 violation to **retire**; the confirmer lives ONLY at `/confirm/:token`.

---

## 4. Canon Glossary

Binding for every UI string, page, doc, and DS component. A surface that violates this glossary is a **blocked review**. Method labels stay **English inside Hebrew text** (deliberate universal-tag design).

### 4.1 Product concepts
| Concept | EN (locked) | HE (locked) | Forbidden |
|---|---|---|---|
| The product | **LOCK** (always uppercase; domain lock.show) | LOCK | GIGPROOF (old name) |
| Public buyer view | the **Passport** (Bookability Passport) | פספורט / הפספורט הציבורי | דרכון (any form); "Booking/Artist Passport" in HE |
| Artist private view | the artist's private view (the **Radar**) | האזור הפרטי של האמן (הרדאר) | Mirror / המראה (retired) |
| Evidence display | method-labeled evidence; **bands + binaries with method labels** | ראיות מתויגות-שיטה | any score/percentile/rank/gauge/prediction |
| Proof unit | Proof Unit | יחידת הוכחה | — |

### 4.2 Personas / entities
| Persona | EN | HE | Notes |
|---|---|---|---|
| Artist | artist | אמן | one entity even with many Acts/genres |
| **Act** | Act | **אקט** (de-facto live term; formal taste-ratification pending — never invent a third term) | bookable product/project inside the artist context; evidence per-Act |
| Artist-side agent/office | manager office / agency | **אמרגן / משרד אמרגנות** | **supply side. NOT a buyer.** |
| Professional entertainment buyer | booking manager (not "booker" in new copy) | מזמין הופעות / מנהל בוקינג / פרומוטר | venue, club, festival, promoter, talent buyer |
| Private event client | private client / event host | לקוח פרטי / מזמין אירוע | wedding couple, family event — simple non-industry language |
| Corporate client | corporate client | לקוח עסקי | reliability, fit, invoice/logistics |
| Event planner | event planner | מתכנן אירועים | coordination, style/fit, availability |
| Event production (workspace) | production office / team | מפיק אירוע / צוות הפקה / חברת הפקה | solo OR team; executes event/lineup |
| **Source Confirmer** | source confirmer (a **capability**, not a role — magic link, no account) | **מאשר-מקור** (RATIFIED as the only UI term; "מפיק מאשר" = historical alias, docs only) | no signup, no dashboard, no workspace shell; not every source is a producer |
| Booker (code context) | recipient/buyer context (discover screen-set) | מזמין הופעות | may be a private individual; Passport review needs no login |
| Operator | operator | אופרטור / תפעול | internal console; no public signup |
| Passport | Passport (per Act/version) | פספורט | verified strengths + method labels only |
| ArtistAccess | artist-granted access | הרשאת גישה מהאמן | scoped, revocable; never ownership |

**Forbidden blur:** buyer ≡ אמרגן · booker signup labeled מפיק · private clients in industry jargon · Source Confirmer built/described as a workspace.

### 4.3 Structural terms
| Term | Meaning |
|---|---|
| Person → Workspace → Role | one login; the workspace bears the subscription; role is per-assignment. "Agency" is an org PLAN, not a person's role. |
| Plans | Passport (free) · Momentum (artist) · Roster (manager). Buyer free forever. No booking commission ever. |
| Four data doors | official API · consented OAuth · artist artifact · artist-confirmed discovery (surface, never publish; no cold directories) |

### 4.4 Method labels (the trust vocabulary — canon, strongest → weakest)
The **only** provenance vocabulary. Never expose raw DB/client states as user-facing labels. Never re-word to "source-confirmed."

| Method label | HE | Meaning |
|---|---|---|
| **Producer-confirmed** | מאושר ע"י מפיק | a counterparty acknowledged **this specific claim** (strongest; covers this claim only, not a general endorsement) |
| **Source-linked** | — | a public footprint that can be checked against its live source |
| **Evidence-supported** | נתמך בראיה/מסמך/מקור | a captured record supporting the claim (authenticity limited without a live source) |
| **Self-declared** (a.k.a. Artist-declared / Self-reported) | מדווח ע"י האמן | the artist's own statement, shown as a band; strengthen with a source |

Additional universal tags seen in glossary/marketing copy: TICKET EXPORT · PLATFORM DATA · OPERATOR-REVIEWED. In the Radar Inspector, the raw "Source-linked" label is de-technicalised into a human line ("from your Instagram" / "from …") but the **canon vocabulary stays intact on the Passport**.

### 4.5 Voice law
Professional restraint; evidence-grade; show-business warmth without hype. NO emoji in UI/legal copy. No exclamation-mark salesiness. "Check, don't trust." EN and HE each fully professional — **never mixed in one view** (LANGUAGE LAW). Firewall words only: "needs your touch" / "ready to support" / "private for now" / "can become public when you approve" — never score/rank/weak/missing.

---

## 5. Design System

**Authority note:** the current DS authority is **Codex v1.6.25** (Drive, `00_CURRENT/LOCKSHOW_Design_System_CURRENT.html`) — **not in this repo**. The repo holds A13 token values, the component-state control file, and the v1.2.0 digest. This section is buildable from the in-repo tokens; exact values still OWED by Codex are flagged in §5.9.

### 5.1 The single governing rule: "Dark is atmosphere, not camouflage"
Everyday UI = **LIGHT / paper cards.** Dark is reserved for the **Radar universe** and the **Passport hero** (DS-sanctioned media/editorial surfaces) — never as a default ground. Dark sections **force** most cards/containers to readable paper/light cards unless the container is explicitly the Radar-universe. This resolves the #1 historical gap (theme inversion) and the owner's "dark-on-dark isn't sales-y." In the prototype, the Radar stage and Passport hero are dark "islands" (`.dark-island`) inside an otherwise light everyday UI.

### 5.2 Brand palette (A13 — the ONLY canonical colours)
| Token | Hex | Role |
|---|---|---|
| `--ink` / `color.ink` | `#090D0A`–`#0A0D0B` | near-black; darkest ground + light-surface text anchor |
| `--forest` / `color.forest` | `#17221A`–`#18221A` | forest panels & trust boundaries |
| **`--lime` / `color.action.primary`** | **`#C8F04D`** | **THE single action/brand accent** (dark text required on it) |
| `--paper` | `#F3F5EF` | paper canvas / reading ground (everyday-UI ground) |
| `--mist` | `#DDE3D9` | mist |
| `--slate` | `#687269` | secondary copy only |

The brand is **dark/forest canvas + a single lime accent.** There is **NO orange in the confirmed brand.**

### 5.3 App dark surfaces (A13, for the Radar/Passport islands)
| Token | Hex | Surface |
|---|---|---|
| `color.app.bg` | `#0B0C0B` | dark canvas (Radar/Passport only) |
| `color.app.surface` | `#14181A` | cards, Radar panels, Passport work surfaces |
| `color.app.surface2` | `#1B2022` | inputs, nested surfaces |
| `color.app.raise` | `#232A2B` | hover / elevation only |
| `color.text.app` | `#F3F0E8` | primary app text on dark |
| `color.text.muted` | `#98A19A` | secondary app copy |

### 5.4 Radar STATE colours (A13 `state.*` — provenance/scan states)
| State token | Hex | Meaning · rule |
|---|---|---|
| `state.confirmed` | `#CBEE72` | artist/source confirmed (Ready) |
| `state.developing` | `#46DCC2` (teal) | developing but useful |
| `state.found` | `#F2C063` (gold) | found/source-backed, **not** confirmed — **"small accents only"** |
| `state.needsReview` | `#E39A4B` (amber) | needs artist review/correction — "invitation to improve, never shame" |
| `state.notAssessable` | `#9AA29B` | not enough context — **never** weakness |

> **OPEN ruling (gold/amber):** whether to keep `state.found` gold + `state.needsReview` amber as small accents (A13's position) or retire them to lime+neutral (owner's earlier lean). The prototype currently renders the "Needs you"/"Found" states in **neutral mist** as an interim (pending the ruling). Do not treat gold/amber as settled until the owner rules (§12).

### 5.5 Approved AA contrast pairs (use these; never invent a pair)
Body text target: **AA minimum ≥ 4.5:1; prefer 7:1.** Key pairs from A13:
| Pair | BG | FG | Ratio | Use |
|---|---|---|---|---|
| paper + forest | `#F3F5EF` | `#18221A` | 14.91 | default light-surface text |
| white + forest | `#FFFFFF` | `#18221A` | 16.37 | white work cards |
| ink + paper | `#0A0D0B` | `#F3F5EF` | 17.78 | cinematic sections |
| app bg + app text | `#0B0C0B` | `#F3F0E8` | 17.21 | default app dark text |
| app surface + app text | `#14181A` | `#F3F0E8` | 15.69 | task surfaces |
| app surface + muted | `#14181A` | `#98A19A` | 6.72 | helper + metadata |
| lime + on-accent | `#C8F04D` | `#12160A` | 14.00 | primary CTA (ONE per view) |
| danger on paper | `#F3F5EF` | `#B23B2E` | 5.37 | error/destructive text |
| **faint on app bg** | `#0B0C0B` | `#69716B` | 3.90 | **FAILURE RULE: decorative tertiary ONLY — never critical labels/validation/CTA** |

### 5.6 The 3-tier token control layer (the code-binding surface)
Change a value in ONE place and every component follows. Codex owns names + values + AA; the code binding (this layer) is owned in-repo (`COMPONENT-STATE-TOKENS.md`). Components read **Tier 2/3**, never Tier 1 directly, and **never hardcode a colour.**
- **Tier 1 — BRAND (raw palette):** `--brand-ink #090D0A · --brand-forest #17221A · --brand-lime #C8F04D · --brand-paper #F3F5EF · --brand-mist #DDE3D9 · --brand-slate #687269 · --brand-teal #46DCC2 · --brand-gold #F2C063 · --brand-amber #E39A4B`.
- **Tier 2 — SEMANTIC (roles):** `--canvas · --surface-1..4 · --text · --text-muted · --text-faint · --accent · --on-accent (#12160A) · --border / --border-strong`. The theme flip (dark ↔ paper) is a Tier-2 remap, not a component rewrite.
- **Tier 3 — STATE vocabulary (the ONLY status colours):** `--state-ready (lime) · --state-dev (teal) · --state-attention (amber/interim mist) · --state-found (gold/interim mist) · --state-locked (faint) · --state-na (#9AA29B)`. Plus PROVENANCE tokens: `--prov-confirmed (lime fill) · --prov-evidence (lime outline) · --prov-source (neutral outline) · --prov-declared (faint outline)`.
- **How to restyle:** globally = edit Tier 1/2; pointwise = edit the component→state map row; a DS update = re-map Tier 1/2/3 to new values here, verify AA against §5.5, components inherit.

### 5.7 Type, spacing, radius, tap-target, motion
- **Type:** Display/headings **Georgia serif** (marketing/hero; clamp 44–78px, tight tracking) · Body/UI **Manrope** (EN) / **Heebo** (HE) · Labels/meta/dates **DM Mono** (8–9px, 700, uppercase, restricted to wordmark/eyebrows/method chips). **Body never below 16px**; metadata never carries meaning alone. Real typographic hierarchy (H1/H2/card-title/body, desktop + mobile) is defined by Codex — **exact px + weights OWED (§5.9).**
- **Radius:** controls 9–10px · cards 12–18px · hero 20px · mobile sheets 22px top.
- **Spacing:** 4px base. **Grid:** 12-col / 1440 desktop · 4-col + bottom-nav mobile.
- **Icons:** 1.8px stroke, currentColor, 16 dense / 20 standard / 24 feature / 32 empty; critical actions carry a text label.
- **Tap target:** **44px minimum** for every interactive element.
- **CTA hierarchy:** ONE dominant primary (lime) + ≤2 quiet secondaries per view. Lime is reserved for **action/confirmed only**, never to encode magnitude. Secondary = neutral/ghost. **Exact CTA state spec (primary/secondary/ghost) + 44px paddings OWED (§5.9).**
- **Motion:** subtle, alive, calm. Radar has `starglow` (~4.5s star breath), `sweep` (~9s conic — explicitly **NOT a gauge**, points at nothing), `sonar` ring, twinkling starfield, desktop parallax, constellation energy-flow inward on confirmed dimensions. **All motion disabled under `prefers-reduced-motion`.**

### 5.8 The widget kit (build once, reuse) + full state sets
LOCK is **interactive workspaces made of smart widgets, not pages.** Every widget must implement the full state set: **default · hover · selected · loading · empty · success · error · disabled/not-yet · mobile-collapsed · mobile-expanded.**

| Widget | Purpose | Key fields |
|---|---|---|
| **Radar canvas** | the interactive universe | center star · 6 planets · constellation threads · orbit rings · platform ring · scene lens |
| **Planet Inspector / focus card** | drill-in per dimension | name · state · 3 layers (Meaning / Found-proof / Next-action) · source-logo ring · one CTA + quiet secondary · public/private chip |
| **Source Logo Ring** | provenance chips | logos only when relevant; method label on tap; neutral icon if generic |
| **Smart Action / Next-move strip** | the one next-best action | title · why now · what happens next · primary CTA · optional secondary · privacy state |
| **Proof review / inline edit widget** | confirm/edit a claim in place | type · immediate validation · visible save · undo · loading · error |
| **Passport preview card** | how a buyer will read a proof | claim · context · band/binary · method chip · reviewed date |
| **Request decision card** | a buyer's availability request | who · what · date · fit summary · missing-info · safety cue · one primary + secondaries |
| **Roster action card** | one artist on a roster | Passport readiness · what changed · why · one next action · ArtistAccess state |
| **Lineup slot card** | one slot on an event | set-time · state (open/requested/confirmed) · suggested act + fit reason · one CTA |
| **Public proof card** | buyer-readable evidence | buyer-language claim · band/binary · method label · reviewed date |
| **One-statement Confirmer** | the accountless magic-link task | statement · asker · what-confirming-means / what-does-NOT · 3 large choices |
| **Gate metric tile** | admin | metric · source event · timeframe · demo-excluded badge |
| **Workspace switcher** | identity hub | human labels; ✓ on current; account actions |

### 5.9 Values still OWED by Codex (v1.6.25 / the Drive DS)
These are flagged so they are not mistaken for settled; build with the A13 interim values until Codex supplies:
1. **Exact type-scale numbers** (H1/H2/card/body px + weight, desktop + mobile).
2. **App LIGHT-card token values** (paper/white card bg, border, text, muted on light beyond A13 core hexes) + the precise "Radar-universe" dark-boundary definition.
3. **CTA hierarchy spec** (primary/secondary/ghost states) + the 44px rule's paddings.
4. **The logo master SVG** (`lockshow-symbol-spotlight-lens-v2-master-lime.svg`) — the prototype uses a geometry stand-in (padlock/keyhole/spotlight-lens mark).
5. **Real venue logos** (Barby, The Block, Sunset) for the evidence cards.
6. **The gold/amber ruling** — keep `state.found`/`state.needsReview` as small accents (A13) or retire to lime+neutral (owner lean). See §5.4 / §12.
7. The full dark-app semantic scale + status set + elevation shadows + the `forest-2/chrome-bg/rail-bg` chrome tints proposed in the nav consolidation (all tints/opacities of existing hues — Codex to confirm/rename).

---

## 6. Global UX Laws (apply to every screen)

1. **One screen = one job = one next action.** Never "many panels of evidence and internal states."
2. **Mobile-first: mobile is the DEFAULT.** Desktop uses the extra space for **overview / context / comparison** (inspector panels, side rails); mobile is for **action** (bottom sheets, one widget per view). Design mobile Radar **separately** from desktop, not as a shrink.
3. **One primary CTA on screen at a time** + ≤2 quiet secondaries. Never duplicate CTAs (the inspector CTA and a bottom dock must never both be primary — see §8.3).
4. **No technical / internal architecture language.** FORBIDDEN: a "Navigation" label, a "Career Workspace" eyebrow, "genre-primary", raw DB/client states, decorative hero/atmosphere images that don't contribute. Images are **entity content only** (artist photo, platform/venue logos), never decoration. If nav isn't self-evident, the design failed.
5. **Immediate feedback on every action** (typing, saving, confirming, undo).
6. **Always show private/public** — the user always knows what is theirs alone vs what a buyer can see.
7. **One-viewport per primary workflow** — every primary screen fits one viewport height with **no page scroll** where feasible (a hard target for Radar/Onboarding/Passport hero; long ledgers may scroll within a contained region).
8. **Warm tone, never judging.** Gaps are invitations, never penalties. N/A is never a weakness.
9. **Every proof explains "why this matters."**
10. **The firewall is enforced by design, never narrated** (§2.2).
11. **Value before effort** — the user sees value grow after every useful contribution (Input→benefit; Discovery→confirmation; Gap→opportunity; Private→protected).

---

## 7. Navigation & Shell

### 7.1 Identity chrome: exactly TWO elements
The chrome is **brand lockup (top-left)** + **one unified hub (top-right)** = account + workspace switch. Everything else (a separate top-left workspace switcher, a rail persona card, a person-name eyebrow, a duplicated breadcrumb) was removed. The center crumb (if shown) carries only the section name in calm sans, and is hidden ≤640px.

### 7.2 The unified top-right hub (≤2-step workspace switch)
Click avatar (**step 1**) → ONE dropdown menu containing, in order:
1. **Identity header** — avatar/initials · name · role · "{Workspace} workspace".
2. **Switch workspace** group — all workspaces the user has, each row = icon/avatar + label + sub-label, with a **✓ on the current one** (`role=menuitemradio` + `aria-checked`). Click a row = **step 2** → switched. Never deeper than 1–2.
3. **Account actions** — (Artist only: "Who can act for you") · Edit profile · Account settings · Restart demo (demo only) · Sign out. In public/confirm modes the danger action is **"Exit preview"** instead of Sign out.

The hub **renders in EVERY mode** (app / public / confirm) so no persona is ever trapped. A11y: `aria-haspopup/expanded/controls`; Escape closes + returns focus; roving arrow-key nav; on mobile the hub is avatar-only, pinned right, menu fits in-viewport.

### 7.3 Per-entity context nav
Each workspace has its own small context nav (desktop = one nav only, top bar OR rail — never both; mobile = bottom nav). Prototype nav sets (labels + badges):
- **Artist:** Radar · Passport · Requests (badge 2). Default = Radar.
- **Representation:** Roster · Requests (badge 2) · Radar · Team. Default = Roster.
- **Production:** Events (badge 3) · Requests (badge 4) · Workspace. Default = Events.
- **Buyer (public mode):** Passport · Availability. Default = Passport.
- **Source-Confirmer (confirm mode):** Confirm only. Default = Confirm.
- **Admin:** Home · Requests / SLA (badge 3) · Provenance · Risk (badge 2). Default = Home.

Codex's human-label refinement (target): My Artist / My Roster / My Lineups / View as Buyer / Confirm a Detail / Admin.

### 7.4 The real-app rule (vs demo mode)
In the **real app**, a user sees **ONLY the roles/workspaces they actually have** — never all six. The all-six switcher is a **demo/prototype** convenience. If a demo must show all entity views, it must carry a **visible "Demo switcher — shows all entity views" label**. On mobile, the entity switch lives under "Me" (the hub), not always in view.

### 7.5 Mobile bottom-nav
On ≤640px, per-entity nav becomes a bottom nav (`.botnav`): the same nav items as icons + labels + badges, current item active. Radar adds a bottom-sheet inspector and a bottom action dock (§8.3). Bottom sheets and gestures (swipe between planets, pull-down to close) are the mobile interaction idiom — never a new page per tap.

---

## 8. Per-Screen Specification (THE CORE)

Each screen is buildable from its sub-spec alone. Routes shown are the prototype/target routes.

---

### 8.1 Onboarding (`/onboarding`) — the 3-step discover→confirm narrative

**PURPOSE.** Turn a cold artist into a live Passport-in-progress with the least possible effort: the artist gives only the basics; LOCK discovers the public footprint; the artist confirms. "You don't build from scratch — you approve what we found." Warm conversion copy, never technical. EN + HE, locale-aware.

**DESKTOP & MOBILE layout.** A centered full-screen overlay card (`.overlay > .ob`), one job per step, 3 step-dots at top. No page scroll. Identical structure on mobile (single-column card). Language switcher **removed** (U1) — EN-only in the prototype; HE strings retained as data for the localisation pass.

**COMPONENTS.** Brand lockup (spotlight-lens mark) · step-dots · fieldset (Step 1) · locale/market pill + animated source-scan grid + scan bar + cycling caption (Step 2) · found-grid rows with source logos + "✦ Found" chips + tally (Step 3) · one primary CTA + a quiet "explore a sample first" escape hatch.

**STATES (per step).**
- **Step 1 · The basics** — two fields: Artist/Act name, One main link. Primary disabled until both present (helper: "Add your name and one link to start.").
- **Step 2 · Discovering** — an animated scan: source logos (`instagram · eventer · spotify · goout · residentadvisor · tickchak · soundcloud · tiktok` — a mix of **local Israeli** + **global** sources) light one-by-one; a market pill shows "Your market · Israel" + "Hebrew · English · Russian"; a caption cycles through scan lines (~900ms) then auto-advances (~3.2s) to Step 3. Honest scope footer.
- **Step 3 · Confirm** — a found-grid of the 5 sources with what was found on each; a tally line; primary CTA into the Radar. This step never publishes anything.

**INTERACTIONS.** Step 1 → `obNext` (captures name/link) → Step 2 auto-runs the scan → Step 3. "Open my Radar & confirm" (`obToRadar`) closes onboarding, sets `welcomed=true` and `discovered=true`, navigates to `artist/radar`. Explore hatches jump to the Radar with a sample.

**EXACT MICROCOPY (EN).**
- S1 eyebrow "Step 1 of 3 · The basics" · h "Let's start your Passport" · sub "Your name and one link is all we need — we find the rest of your public footprint." · fields "Artist / Act name" (ph "e.g. NOYA VOLK"), "One main link" (ph "Instagram, Spotify or your website") · helper "One link is enough to start. We look across your **public footprint** — the same sources a booking manager checks — never anything private, and nothing is published until you confirm it." · CTA "Find my footprint →" · escape "I'll explore a sample first".
- S2 eyebrow "Step 2 of 3 · Discovering" · h "Finding your footprint…" · sub "Searching the sources booking managers check — in **Hebrew, English and Russian**, where your audience is. We read only what's public — nothing is published, nothing is decided. You'll confirm every finding yourself." · market "Your market · Israel" / "Hebrew · English · Russian" · captions ["Reading your Instagram lineup listings…","Checking Eventer & Go-Out event pages…","Matching your Spotify catalogue…","Searching in Hebrew, English & Russian…","Looking across Resident Advisor & Tickchak…","Reading your public footprint across Israel…"] · footer "We look across your public footprint in your market. A wider multi-source auto-scan is in development — today we start from the link you gave."
- S3 eyebrow "Step 3 of 3 · Confirm" · h "Here's what we found" · sub "We found your footprint across **5 sources**. From here it's simple: confirm what's really yours. You don't build from scratch — you approve what we found." · rows [Instagram "14 lineup listings + your community band" · Spotify "Streaming catalogue — 3 releases" · RA "Booked on 6 RA event pages" · SoundCloud "12 mixes & DJ sets" · TikTok "Engaged following, consistent"] · tally "8 findings · each labeled how we know it · nothing public until you confirm" · CTA "Open my Radar & confirm →" · escape "I'll explore first".
- **HE** equivalents are defined verbatim in the prototype `OBT.he` (e.g. S1 h "בוא נתחיל את הפספורט שלך"; canon terms פספורט / אקט; "מאשר-מקור" where relevant) and are the localisation source of record.

**FIREWALL.** The scan is disclosed as "your public footprint" + "a wider multi-source auto-scan is in development" (honesty firewall). No score/tally-as-grade — the "8 findings" count is a count of the artist's own found items, each method-labeled, "nothing public until you confirm."

**DEFINITION OF DONE.** Two-field Step 1 with disabled-until-valid CTA; animated locale-aware Step 2 that auto-advances and respects `prefers-reduced-motion`; Step 3 found-grid that lands the artist on the Radar with found (✦) items waiting; EN + HE strings externalized (no hardcoded copy); one viewport, no page scroll; escape hatch present.

---

### 8.2 Artist Radar (`/artist/radar`) — the central interactive engine

**PURPOSE.** The artist's private, living picture of their own professional proof — six dimensions a booking manager weighs — where LOCK shows what it *found* on public sources and the artist *confirms* what's really theirs, one tap at a time. It is where evidence is reviewed and confirmed; it is **not** a dashboard, and buyers never see it. Two readings for every component: **Artist read** = "what's strong, what still needs me, what to do next" (gaps are invitations); **Buyer relevance** = the same signal, once confirmed + method-labeled, becomes a checkable strength on the public Passport.

**DESKTOP layout — the 4-zone canvas** (`.radar-work`):
- **TOP-CENTER · scene lens** (`.rwscene`) — a segmented control ("Your standing in" + Melodic / Progressive / Afro / All). It **never overlays the act card**.
- **LEFT · Act identity + privacy + lens** (`identityCol`) — round photo, "Your Act", stage name; a privacy line ("Private to you — nothing is public until you approve it." / when published: "Some strengths are public on your Passport — you approved them."); a "Show" lens rail (All · Needs my review · Ready to publish).
- **CENTER · the dark universe island** (`.radar-stage.dark-island`) — starfield · sweep · sonar · orbit rings · constellation threads · center star (avatar + name + scene chip) · the six planets.
- **RIGHT · the persistent Planet Inspector** (`inspectorPanel`) — holds the single primary CTA whenever visible (always on desktop). Full spec in §8.3.
- **BOTTOM · next-best-move dock** (`radarDock`) — shown **only** when the inspector is NOT holding the CTA (i.e. mobile overview). Guarantees exactly ONE primary lime CTA on screen at any moment.

**MOBILE layout / gestures — "Radar Focus" (designed separately).** Top = Act + scene; center = zoomable Radar; bottom = one-action dock. Tap a planet → it zooms/focuses in place (others fade to ~40%, never gone) and source logos orbit it; tap a logo → a small proof card; **swipe left/right → next/prev planet** (`cyclePlanet`); **pull-down / grab-handle → close** the bottom-sheet inspector; tap center → overview; long-press a logo → method label. No new page per tap, no long drawers, no endless stacks. The inspector renders as a bottom-sheet (`.rwinsp.insp-panel` with `.insp-grab`) and only holds the CTA when the sheet is open; otherwise the bottom dock carries the next-best move.

**COMPONENTS & the six proof-dimension planets.** Fixed orbit (angles −90/−30/30/90/150/210). Each planet's nodes are derived at render time from the Act's real fields + evidence — nothing stored, nothing scored.

| Planet | Meaning (artist / buyer) | Nodes | Genre-primary in scenes |
|---|---|---|---|
| **Identity & Story** | who you are / the first thing they read | stage name, one-line positioning, genre, press photo, Act goal, identity links | — |
| **Music & Catalogue** | a live checkable catalogue / hear the sound | Spotify/SoundCloud/Bandcamp/Apple links; releases; mixes & sets | prog |
| **Live Show** | you draw a real crowd (bands, never headcount) | lineup-frequency band, track-record events, RA bookings, ticket/settlement export (strongest draw proof) | techno · prog · afro |
| **Audience & Community** | a room you can fill (a band, not a follower count) | owned-community band, engaged-following consistency, social links | techno · prog · afro |
| **Professional Kit** | book you without friction (binaries + bands) | set length, regions, technical rider, invoice-ready, contact | techno |
| **Career Proof** | third-party proof that outranks a self-claim | producer-confirmed rebookings, press mentions, draw claims, "ask a producer to confirm" | afro |

**Planet states (bounded rollup — never a count on the face):** **Needs you** (something found is waiting to confirm, OR still empty) · **Developing** (some confirmed, gaps remain) · **Ready** (confirmed, no gaps) · **Locked / "Not needed yet"** (Professional Kit stays locked until Live Show is backed — a sequencing hook, not a judgement). Node marks: ✓ (settled) · ✦ (found dot) · ? / + . Each planet also shows its **plain-language state word** under it (Ready · Developing · Needs you · Not needed yet). Genre-primary planets carry a second gold ring + a ★ and a topline; additive only (non-primary planets keep full opacity/interactivity/order).

**Supporting components:**
- **Constellation threads** — one thread center↔each planet, coloured by live state (amber=Needs you, teal=Developing, lime=Ready, faint=Locked); confirmed threads glow and flow energy inward (growth made visible). Firewall: colour is a state only; geometry is fixed by planet angle, identical for every artist — it grades nothing.
- **Platform ring** ("Where your proof comes from") — one tile per platform **actually detected in this Act's data**; connected = full colour + lime dot, not-yet = greyed + one "+ connect". Per-source hover meaning in plain language (Instagram = "your lineup listings & community", Spotify = "your streaming catalogue", Eventer/Tickchak/Go-Out = your Israeli ticketed events / ticket sales / event listings, etc.). Caption stays honest: "5 sources connected · buyers check these to verify you. A wider automatic scan is in development." META-FIELD LAW: never an invented count/follower number.
- **Milestone journey M1–M8** (optional frame; the prototype shows a compact version) — named waypoints **Arrived → First light → Radar alive → Focused → Backed → Published → In market → Answered** mapping to the analytics funnel; a "N of 8 milestones" count-up. Firewall: named waypoints + the artist's OWN step count — no %, no bar-as-grade, no peer comparison.
- **Lenses** (the "Show" rail): **All · Needs my review · Ready to publish** — a focus filter that dims off-lens planets to ~22% (reversible), never removes them. "Needs my review" is the review entry.

**INTERACTIONS.** Scene switch (`pickScene`) re-weights which planets carry the ★ (a reading lens on the SAME evidence — never a data change). Lens/filter (`pickFilter`) dims/highlights. Tap a planet (`openPlanet`) selects it → inspector + orbiting source logos. `nextStep` from the bottom dock jumps to the computed next-best action's planet/target. The **next-best-step engine** computes ONE action from real planet state (priority: a genre-primary planet in Needs-you with found items → any planet with found items → a locked planet's unlock → all-lit → publish → else add the missing proof), each carrying a `why` line; firewall-safe (action + reason only).

**EXACT MICROCOPY (samples).** Scene "Your standing in" · lens "All / Needs my review / Ready to publish" · privacy "Private to you — nothing is public until you approve it." · dock eyebrow "Your next move" · sample dock title "Confirm your live-draw proof" + why "One tap turns what we found into a strength on your Passport. Nothing goes public until you say so." + CTA "Continue →". State words: Ready · Developing · Needs you · Not needed yet.

**FIREWALL.** Bands + binaries + method labels only. No score/rank/%/gauge/headcount/leaderboard. The sweep is thematic, not a gauge. Scene ★ is guidance, never grading; no signal → no emphasis. The found count appears only inside panel copy ("we found 2 things here"), never as a grading badge on the face.

**DEFINITION OF DONE.** 4-zone desktop; separate mobile Radar-Focus with swipe/pull-down; exactly one primary CTA at all times (inspector XOR dock); six planets with bounded state + state word + node marks; constellation + platform ring reading real (detected-only) data; scene lens that re-weights ★ without changing data; lenses that dim not remove; all motion under `prefers-reduced-motion`; no h-scroll at 390 and 1360; zero score/rank/%/gauge anywhere.

---

### 8.3 The Planet Inspector (the full spec)

**PURPOSE.** On planet select, a SHORT 3-layer action widget that answers the guiding sentence for that one dimension: what it means, what LOCK found, the one thing to do next. It is **not** a long drawer.

**Scene switch behavior.** The scene lens sits top-center and re-weights the ★ across planets; it never overlays the act card and never changes the underlying evidence.

**Planet states surfaced in the inspector:** Found (✦, waiting) · Needs-you · Ready · Private · Published (public on Passport) · Locked / Not-needed-yet. The status chip reads one of: **"Still private"** (default — "Still private. It only helps your Passport after you approve it.") · **"Ready on your Passport"** (public — "This proof is ready. Want to see how a buyer will read it?") · **"Not needed yet"** (locked — "This isn't needed yet — it opens once your live draw is backed.").

**The 3 layers** (desktop right-rail; mobile bottom-sheet):
1. **Layer 1 · Meaning** — one short, scene-aware line: "In {Scene}, {why this dimension matters}." (e.g. "In Melodic Techno, live-room proof matters more than follower count.")
2. **Layer 2 · Found proof** — a brief human summary of what LOCK found ("LOCK found fourteen lineup listings under your name and six Resident Advisor bookings.") + the **source-logo ring** (each row = source mark + a **human source line**: **"from your Instagram"** for own accounts, **"from …"** for third-party listings — the raw "Source-linked" label is de-technicalised here while the Passport keeps canon vocabulary) + a per-row tag (Confirmed / Found / Needs you) + the status chip.
3. **Layer 3 · Next action** — the **single primary CTA** + an optional quiet secondary. CTA is computed: if found items exist → "Review your {dimension}" (`confirmTop`) with a secondary "Not mine / later" (`dismissTop`); if locked → "Confirm your live draw first"; if public-ready → "Preview on Passport"; if only empty → the add-source label ("Add a ticket export", etc.); else "Preview on Passport".

**Source-logo ring / orbit behavior.** On select, source logos **orbit the selected planet in place** (percent geometry, fanned inward toward the star, ~84° spread, emerging with a stagger unless reduced-motion). Confirmed logos carry a ✓; a confirm "blooms" at the planet centre with a small celebration (`justLockLogo`). Tap/long-press a logo → its method + human source line. Locked Kit shows no orbiting evidence.

**Found-row content law.** Every found row shows, BEFORE the confirm button: (1) the exact claim wording, (2) the concrete source (method label + identifiable reference, e.g. "instagram.com · listings #3–#16"), (3) the honest proves / doesn't-prove line. The button names what it confirms.

**Confirm → destination honesty.** A confirm turns ✦ found → ✓ confirmed on one tap. Only **verified/supporting + passport-ok** claims reach the public Passport; everything else stays private and **says so**. The receipt names *what* landed *where* ("Added to your Passport" vs "Saved privately") with a **7s undo**. A "this isn't me" reject (`dismissTop`) is **recorded, not deleted** (name-ambiguity honesty). Nothing is `artist_approved=true` until confirmed.

**Inline edit widgets (per-field DoD — the D1 fix).** Every missing/editable proof opens an **inline mini-widget in the smart panel** — NOT a new page. Per-field Definition of Done: **empty = friendly helper · typing = active border · invalid = human explanation · saved = visible confirmation · undo · loading · error-retry.** Confirmed radar nodes must expose an "edit" affordance that re-opens the fill widget pre-filled. Every field is QA'd with: empty · typing · long value · Hebrew · URL · invalid.

**MOBILE.** The inspector is a bottom-sheet with a grab handle; it holds the CTA only when open; a scrim + `closeSheet` + pull-down close it; swipe cycles planets.

**FIREWALL.** No score/rank/%/gauge; no "missing/weakness" language. Status is one of the bounded chips. The de-technicalised source line never leaks a raw DB state.

**DEFINITION OF DONE.** 3-layer inspector (Meaning/Found-proof/Next-action); orbiting source logos with method-on-tap; found rows carry exact wording + concrete source + proves/doesn't-prove before the button; one primary CTA + one quiet secondary; confirm bloom + named receipt + 7s undo; reject records, doesn't delete; inline edit widget with the full per-field DoD; mobile bottom-sheet with swipe + pull-down; reduced-motion respected.

---

### 8.4 Artist Passport (`/artist/passport`) — multi-view, edit vs buyer-preview

**PURPOSE.** The artist previews **exactly** what a buyer sees — the proof a booking manager reads before putting their name on the night — in each buyer's language, and controls publish/share. (In the real app, `/artist/passport` redirects to the public `/passport/:id` so the artist previews the true Buyer view.)

**DESKTOP & MOBILE layout.** Page head with H1 "Passport" + a purpose line + the **unified view-switcher chip** (U34). Below: the standing row (Draft/Live), the dark hero island, the "what this viewer cares about" line, the public-frame reassurance, the view eyebrow, the evidence ledger (lead + support proof cards), a ready row, and a private-gaps bar. Single column; the hero is a `.dark-island`, everything else is light.

**The multi-view / faces (U22).** ONE evidence pool, **four reads**, re-ordered per face — never four documents. Views: **Booker · Representation (manager) · Production · Private & corporate.** Each face declares what that viewer cares about + a lead proof + support proofs:
- **Booker** — "A booker asks one thing: will they fill the room and show up like a pro?" lead = draw ("300–800"), support = rebook, sells-tickets.
- **Representation** — "A manager weighs the trajectory: is this real enough to put on my roster?" lead = performance history, support = lineup frequency, confirmed draw.
- **Production** — "Production needs zero surprises on the night — set, region, paperwork." lead = the ready-on-the-night binaries, support = set position, rider.
- **Private & corporate** — "A private or corporate host asks: is this a safe, name-worthy booking?" lead = recognisable stages, support = invoice-ready, confirmed draw. Language is warm, non-industry.

**The unified view-switcher (U34).** The **same dropdown-chip pattern as the Radar scene switch**, placed in the **page header** (a shared component/CSS, never in-card tabs). Chip label: "**Viewing as: {view} ▾**". Popover header "Show this Passport as", radio rows (Booker · Representation · Production · Private & corporate) with a check on active, note "Each buyer weighs different proof first."

**COMPONENTS.** View-switcher chip · standing row · dark hero (photo + veil + "LOCK · Verified" seal + name + one-line positioning + source logos) · "what {noun} sees" cares line · public-frame line · view eyebrow · evidence ledger of proof cards (each: source logo · big band OR claim · context · method chip · "Reviewed {date}") · ready row of lime binary chips · private-gaps bar.

**Edit vs buyer-preview split (target, Codex P0).** The Passport screen must clearly separate **owner-edit** (what the artist controls/publishes) from **buyer-preview** (the exact public read). Edits happen via the Radar's inline widgets / the Act-Identity Editor (§8.6), not by typing into the public preview. A **publish/share widget** is new work.

**De-technicalised provenance (U23).** Remove technical badges ("✓ Buyer view public", "✓ Verified professional profile", "✓ 2 published"). Provenance is shown via the method chips + the "LOCK · Verified" seal (a brand lens emblem, not a bare checkmark), never a technical status row.

**STATES.**
- **Draft** — standing "Draft — only you can see this" + a "Publish Passport" primary. Private-gaps bar visible to the artist only.
- **Live/published** — standing "Live for buyers · refreshed {date}"; inspector/radar reflect public-ready.
- **Per-view** — the ledger re-orders per selected face.
- **Gaps bar** — collapsed ("＋ 1 private item to add · only you") / expanded (explains the item; "Gaps never appear on a buyer's Passport — adding one builds strength, it never removes a penalty." + an "Add it" ghost).

**INTERACTIONS.** `toggleView` opens the popover; `pickView` switches face; `publish` publishes; `toggleGaps` expands the private item; `goEvidence` opens the add flow; the CTA on a ready view is "Preview on Passport".

**EXACT MICROCOPY.** Purpose line: "This is the proof a booking manager reads before they put their name on your night — your real strengths, in each buyer's language, never a demo reel." · public-frame: "This is your public Passport — **exactly what {noun} sees.** Nothing here reveals a gap." · draft: "Draft — only you can see this" + "Publish Passport" · live: "Live for buyers · refreshed 12 May".

**FIREWALL.** Verified strengths only; draw as bands, readiness as binaries, each with a method chip; no gap ever shown on a buyer face; **no firewall strip / no narration** (U33 — remove the `.fwstrip`, §2.2); no score/rank.

**DEFINITION OF DONE.** Four faces from one evidence pool; unified header view-switcher (shared with Radar scene switch); purpose line present; draft/live standing with publish; de-technicalised provenance (method chips + seal, no technical badges); gaps bar artist-only; owner-edit vs buyer-preview visibly separated; no firewall strip; light surface with a single dark hero island; one viewport for the hero.

---

### 8.5 Artist Access — "Who can act for you" (`/artist/access`) (U31)

**PURPOSE.** Surface the ArtistAccess grant in the artist UI: the artist grants a trusted manager/representative scoped, revocable help with bookings — **never** handing over the account, **never** ownership.

**DESKTOP & MOBILE layout.** Page head: H1 "Who can act for you" + subtitle + an "Invite someone" primary. Below: a list of representative cards (or an empty state). Single column.

**COMPONENTS.** Rep card (`repCard`): name · org · state pill · scope pills · actions. Scope labels: **See my Passport** (`see`) · **Reply to date requests for me** (`reply`) · **Help keep my Passport up to date** (`manage`).

**STATES.**
- **Active** — "Active · {since}"; actions "Change what they can do" + "End access".
- **Pending** — "Invited — waiting for them to accept"; action "Resend invite".
- **Ended** — "Access ended"; "No longer has access", no actions.
- **Empty** — "No one has access yet. Invite a manager you trust to help handle date requests."

**INTERACTIONS.** `accessInvite` (invite) · `accessResend` · `accessEdit` (change scopes) · `accessRevoke` (end access). Reachable from the account hub ("Who can act for you") and from the Account screen.

**EXACT MICROCOPY.** Subtitle: "People you've allowed to help with bookings. This never hands over your account — you decide what they can do, and you can end it anytime."

**FIREWALL / entity law.** Never "grant"/ownership language toward the artist; access is consent-based, scoped, revocable by either side.

**DEFINITION OF DONE.** Invite/active/pending/ended/empty states; scope pills reflecting real scopes; revoke + edit + resend; reachable from hub + account; no ownership language.

---

### 8.6 Artist Account / Act-Identity Editor (`/artist/account`, target `/artist/act/edit`) — resolves D1

**PURPOSE.** The artist edits the facts a booking manager reads first, per active Act, with field-level save — the missing edit surface (D1, the owner's reported broken screen).

**LAYOUT.** Page head: eyebrow "◆ Identity & Story · Act" + H1 "Your Act & identity" + Act chips (current Act + "＋ Second act"). Subtitle. An identity grid of editable rows. A "Who can act for you" card linking to §8.5.

**COMPONENTS.** `idRow` per field: **Stage name** (serif display) · **City** · **One-line positioning** (textarea, 120-char, live counter) · **Genre**. Each row: label · value display OR inline input · a "Public on Passport" chip · Edit/Save/Cancel.

**STATES / per-field DoD.** Display (value + Edit) · Editing (active input + "● Editing" dirty chip + Cancel + "Save — right here") · Saved ("✓ Saved" chip). Live char-count on the textarea. Prefilled from the Act. Field-level save (each row independent); ≤3 clicks from the Radar; per active Act.

**EXACT MICROCOPY.** Subtitle: "These are the facts a booking manager reads first. Edit and save each on its own — nothing publishes until your Passport is refreshed." · helper "Your genre also lights the planets that matter most in your world. Draw fields save as bands only." · access card "Who can act for you" + "Let a manager you trust help with date requests — you decide what they can do, and you can end it anytime."

**FIREWALL.** Draw fields save as **bands only**. "What becomes public" chip on each field; nothing publishes until the Passport is refreshed.

**DEFINITION OF DONE.** Inline-editable stage_name · city · genre · `act.format` · positioning · photo · links; field-level save with dirty/saved/error; live "what becomes public" chip; prefilled; per active Act; ≤3 clicks from the Radar; confirmed radar nodes re-open this pre-filled.

---

### 8.7 Buyer / Public Passport (`/passport/:id`) — the 60-second decision page

**PURPOSE.** THE product surface for the buyer. A recipient-safe, **no-login** page that answers **fit · trust · readiness · availability** in the first viewport, in the buyer's language, and offers one action: check the date. This is the Gate-critical buyer surface.

**DESKTOP & MOBILE layout.** A full page (`.pp`): dark hero island (photo + veil + LOCK wordmark) → id block (eyebrow "LOCK · FOR YOUR EVENT" · genre/active-since line · name · one-line positioning · persona toggle · "No login needed" reassurance) → body sections (proof-of-draw / career-proof grid · performance track · booking-readiness binaries · the CTA) → footer. Mobile: single column, sticky availability CTA.

**COMPONENTS.** Persona toggle (**Booking a show** / **Representing**) that changes copy + CTA · proof cards (big band OR claim + context + method label + reviewed date) · performance track rows (each source-linked) · readiness chips (binaries only) · primary CTA + sub-line.

**Non-pro language (target — broaden beyond "booker").** The buyer surface must read for **all** demand segments (private/corporate/planner), not only pros. Evidence is phrased buyer-readable ("Can this artist carry a room?" not "Proof of draw"). Booking-vs-representing changes the copy and the CTA. The private/corporate register is warm and non-industry.

**STATES.** Persona = booking (section title "Proof of draw"; CTA "Check availability for your date") · persona = rep (title "Career proof"; CTA "Discuss representation"). Hover a proof-unit → a source peek (where-it-comes-from + what-the-label-means).

**EXACT MICROCOPY.** eyebrow "LOCK · FOR YOUR EVENT" · reassurance "**No login needed.** This is the public Passport — read it, then check the date." "Under a minute" · draw cap "Figures shown as band — no exact headcount" · readiness cap "Binaries only — ready or not shown" · CTA sub "No commitment — this only asks the artist about the date." · sample proofs: "300–800 · Headline draw · own-name nights, Tel Aviv · ★ Producer-confirmed · Reviewed 12/05/2026"; "Sells tickets to their own name · Yes · Evidence-supported"; "Lineup frequency · Regular · Source-linked"; "Price / guarantee band · ₪8,000–20,000 · Artist-declared".

**FIREWALL.** Verified strengths only; draw as bands, readiness as binaries, each with a method label; no gap; no score/rank/prediction. **Remove the `.fwstrip` footer** (U33 — the prototype's leftover strip is a violation; §2.2). Peer bands are **not** shown buyer-side unless method-safe and requested.

**DEFINITION OF DONE.** First viewport answers fit·trust·readiness·availability; no-login; persona toggle changes copy + CTA; source-peek on proof units; sticky/compact availability CTA; non-pro readable; no firewall strip; no score/rank.

---

### 8.8 Availability request + receipt (`/passport/:id/request` → `/sent`) — the Gate action

**PURPOSE.** The buyer asks the artist about a date — **THE Gate reaction event** (`availability_request_created`). Deliberately short; no commitment.

**LAYOUT.** A focused form page (LOCK wordmark + back link): H1 "Availability check — {name}" + sub + form → primary "Send request". On submit → a receipt page.

**COMPONENTS.** Fields: Full name (required) · Organization/company · Event date · Location · **Expected audience (range — a select, pre-set to Passport bands)** · **Budget (range — a select)** · Message. Bands are pre-set from what the Passport showed — the buyer **never types an exact headcount or fee**.

**STATES.** Form (default) · Sent → receipt card ("✓ Request sent", "{artist} will get back to you soon.", a keep-box with the passport URL + Copy, and a back-link to the passport).

**EXACT MICROCOPY.** sub "Fill in the details and the artist will get back to you. No commitment." · CTA sub "Bands are pre-set to what the Passport showed — you never type an exact headcount or fee." · receipt "SABLE will get back to you soon. Thank you, Dana." + "Keep the passport link for your file — the evidence stays available there." + "Copy".

**FIREWALL.** Audience & budget are **ranges/bands via selects**, never free-typed exact numbers.

**DEFINITION OF DONE.** Required-name validation; band selects pre-set from the Passport; submit → receipt with copyable passport link + back link; fires the Gate reaction event; no exact-number entry.

---

### 8.9 Source-Confirmer (`/confirm/:token`) — warm one-minute confirmation

**PURPOSE.** An **accountless** person confirms exactly ONE claim via a bounded magic link — the mechanism that upgrades a claim to **Producer-confirmed**. The entire correct surface is `/confirm/:token`: no nav, no switch, no home, no dashboard. **NEVER a workspace shell** (D3 — retire any `/producer` shell).

**LAYOUT.** A single centered card (`.confirmer-wrap`): eyebrow "One-statement confirmation · מאשר-מקור" → H1 "{Asker} asked you to confirm one statement." → reassurance → asker chip → the **statement card** (the exact one claim + context + a two-column "what confirming means / what does NOT happen") → three large choices → a closing reassurance.

**COMPONENTS.** Asker chip (initials + name + Act/genre + "is asking") · claim card (◆ "The statement you're confirming" + the quoted statement + context line) · the pos/neg two-column explainer · three choice buttons · done state.

**STATES.**
- **Ask** — three choices: **"Yes — this is accurate"** (primary; "Confirm exactly as written · adds PRODUCER-CONFIRMED") · **"Partly right — needs a fix"** ("Confirm most of it, note what to correct" — inline correction) · **"No — this isn't accurate"** (warn; "Records a decline · it won't show as confirmed").
- **Done** — "Recorded — thank you", "Your confirmation now appears on this one statement of {artist}'s Passport as **PRODUCER-CONFIRMED**. You're done — nothing else is needed." + chips "✓ Producer-confirmed" · "Revocable anytime" + a "Replay this link" ghost.

**INTERACTIONS.** `cfConfirm` (Yes / Partly) · `cfDecline` (No) · `cfReset` (replay). Name-visibility control + legal detail live in an expandable "What happens after I answer?" (target).

**EXACT MICROCOPY.** "No account needed. Your reply applies to this statement only — you won't be signed up for anything." · pos column "You verify this one statement is accurate. / It gets the **PRODUCER-CONFIRMED** label." · neg column "No account, no ongoing role. / Never a score or rating. / {artist} controls publishing. / Revocable anytime." · closing "This confirmation refers to the specific statement above only — never an endorsement, never a score." · target tagline "One detail. One answer. No account."

**FIREWALL.** Confirms this one statement only — never an endorsement, never a score/rating. Adds only the canon **Producer-confirmed** label. Revocable anytime; the artist controls publishing.

**DEFINITION OF DONE.** Single `/confirm/:token` surface (no workspace shell); the exact one statement shown with context; three warm choices incl. inline "partly" correction; done state with revoke route; no login, no nav, one decision; legal moved to an expandable.

---

### 8.10 Representation — Roster cockpit (`/representation/roster` + `/reqs` · `/radar` · `/team`)

**PURPOSE.** A roster **cockpit** (not a CRM table): "who needs help today", each act a card with what changed · why · one action bound to that artist. Access is a grant the artist can revoke — never ownership.

**LAYOUT.** Page head: eyebrow "Artist-Manager lens · {n} acts" + H1 "Roster" + "＋ Invite artist". Subtitle. A stack of artist action cards (urgent ones flagged).

**COMPONENTS (roster action card).** Avatar · artist + Act tag (e.g. "Psytrance act") · owner + city + "Public passport live" · consent chip · a **found/what-changed line** with a `why` ("LOCK verified a new press mention from Time Out Tel Aviv." + why "Fresh third-party proof strengthens the public passport — buyers trust an outlet over a self-claim.") · a strip of method/band chips · the ArtistAccess grant scopes (view/upload/publish) · **one** next-action button (Publish update / Answer request).

**STATES.** Default card · **urgent** card (a buyer is waiting — "A buyer is **waiting on you** — Barby Club asked about a Feb date." + why "An unanswered availability request beats everything else on the roster. Answer it first.") · action-taken (chip "✓ Update published" / "✓ Availability sent"). Filters (target): urgent / ready / needs-approval.

**Other Representation screens.** `/reqs` = Requests inbox (availability requests routed to acts; answer/forward/decline, logged as grants) · `/radar` = combined Roster Radar across consented acts · `/team` = seats/roles/scopes ("Access to an artist is a grant the artist can revoke — never ownership").

**FIREWALL / entity law.** No roster **rank**; never-rank-roster pattern. Reaction insight = method-safe text only. No CRM tables. ArtistAccess = grant, revocable, never ownership.

**DEFINITION OF DONE.** Each row = one artist-bound card (what changed · why · one action); urgent state; publish/answer actions mutate the row; consent + scope shown; no rank; no ownership language.

---

### 8.11 Production — Lineup board (`/production/events` + `/reqs` · `/workspace`)

**PURPOSE.** An event/lineup **board** (not rows): each event holds lineup slots; fill a slot by requesting availability or confirming a known act. To *book*, Production acts as a Buyer (opens a Passport → availability request).

**LAYOUT.** Page head: eyebrow "{Company} · משרד הפקה" + H1 "Events" + "＋ New event / open slot". Subtitle. Event cards, each with a header (name · date) and **timeline slots top-to-bottom by set time**.

**COMPONENTS (lineup slot card).** Slot label + set-time (e.g. "Closing set · 01:00–02:30") · slot state · one CTA per slot · suggested-act cards with a fit reason (target).

**STATES (per slot).** **Open** ("Open slot · needs an act" → "Confirm for this slot") · **Requested** ("SABLE · availability requested" → chip "Awaiting reply") · **Confirmed** (chip "✓ Confirmed · {act}"). New-event created → a Draft card ("New event created" + "add a date and open your first lineup slot"). NOTE: event/lineup **creation** UI is target (currently view-only in the real app).

**Other Production screens.** `/reqs` = requests you sent to artists + replies (confirm a slot the moment an artist says yes) · `/workspace` = team/seats/event access ("Production reads Passports; it never owns an artist's evidence").

**EXACT MICROCOPY.** subtitle "Every event holds lineup slots. Fill a slot by requesting availability or confirming an act you already know." · workspace "Production reads Passports; it never owns an artist's evidence."

**FIREWALL / entity law.** Production never owns an artist's evidence; it reads Passports. No score/rank of acts; suggested acts carry a fit *reason*, never a rank.

**DEFINITION OF DONE.** Event board with time-ordered slots; open/requested/confirmed slot states; create-event/open-slot action; one CTA per slot; Production-as-Buyer path to a Passport; no ownership of evidence.

---

### 8.12 Admin / Operator cockpit (`/admin`)

**PURPOSE.** An internal operational **cockpit** (not a pale dashboard): the Gate as hero metric, a visual funnel, AI-cost with budget, publish freshness, risk — with every metric's **source event · timeframe · demo-excluded** made explicit. Internal LOCK team only; never in public signup.

**LAYOUT.** Page head: eyebrow "Pilot cockpit · friends-cohort test" + H1 "Business overview" + a "LIVE" chip. A "Gate" row of 3 tiles → a Gate-condition line → a two-column grid (funnel · AI-cost ledger + more).

**COMPONENTS.** **Gate tiles** (reaction / intent / verified-pay, each with the exact source event) · **pilot funnel** (signup → onboarded → radar_opened → evidence_added → claim_confirmed → passport_published → share_link_created → availability_request; counts only, with a fill bar) · **AI cost ledger** (Anthropic extraction, spend vs hard cap, runs/30d) · publish-freshness · risk tile. Every number carries "from a bounded operator read-model · demo activity excluded · through {date}".

**STATES.** Gate met (reaction ✓ + verified pay ✓) vs not. Intent (`payment_reference_created`) is willingness-to-pay, **never** counted as revenue.

**EXACT MICROCOPY.** subtitle "Every number from a bounded operator read-model · demo activity excluded · through 14 Jul 2026." · Gate line "✓ **Gate condition reached:** one booking manager reacted to a real Passport AND one paid. Intent (2) is willingness-to-pay, never counted as revenue." · Gate tiles: "reaction · availability_request_created · qualified buyer" / "intent · payment_reference_created · NOT a payment" / "verified pay · entitlement_activated · by Maria".

**FIREWALL.** Funnel = the user's OWN product milestones (counts of events), never a grade of any artist. Demo-excluded badge consistent. Intent ≠ revenue.

**DEFINITION OF DONE.** Gate hero tiles with exact source events; visual funnel (counts only) with source/timeframe/demo-excluded stated; AI-cost with budget-left/alert; publish freshness (stale vs unpublished); risk tile; internal-only.

---

### 8.13 Shared / supporting screens
- **Evidence capture (`/artist/evidence`).** A guided add flow reached from the Radar: pick a claim → paste a public link → honest "AI is labeling your evidence" (skeleton) → the extracted claim returns as a **found node** with its method label + concrete source + proves/doesn't-prove → "Confirm & add to Radar". Target: proactivity inversion — "Connect — we'll pull it" leads; manual = SELF-REPORTED fallback. Honest note: "LOCK labels the sources you add, one at a time. A wider multi-source scan is in development." FIREWALL: nothing publishes until confirmed; pulled media is checked against its source, never re-hosted as a claim.
- **Claim review** — approve/edit/route extracted claims; primary per-card action = "send to a מאשר-מקור to upgrade to Producer-confirmed." (Reachable as a Radar review panel; do not leave orphaned in nav — D6.)
- **Booker home (`/discover`)** — a signed-in professional buyer's thin home: a link-resolver + explainer + one action + a sample-passport escape hatch. (Buyers otherwise need no login.)
- **Auth / redirectors** — login, signup (auto-confirm with a signInWithPassword fallback), reset/forgot, invite-accept (`/invite/:token`). Deep-link `state.from` must be honored on login.

---

## 9. AI / Scan Intelligence

Three intelligence pillars render method-safe on the Radar. **Honesty firewall (§2.8) governs this whole section.**

### 9.1 Pillar (a) — SCAN (what LOCK found)
- **BUILT:** per-evidence Anthropic claim extraction (`server/index.js` → `processor.labelWithMethod`). One artifact at a time → a **bounded status** (verified / supporting / self-reported / not-assessable) + claim_type + value + reason. Firewall enforced twice: the system prompt prohibits score/percentile/rank/exact-count; a `#sanitize()` step forces the bounded status. A deterministic stub fallback keeps a batch alive without an API key. The Radar's ✦found nodes render this pipeline's output.
- **TARGET (not built — zero external-integration code today):** a **multi-source deep scan at onboarding**. Flow: consent (`thirdparty-evidence`) → Claude generates **8–12 locale-aware queries** → **Tavily** search+extract → `claude-opus-4-8` extracts candidate claims per source with `same_person_confidence` + source + date + proves/doesn't-prove → dedup → appears as ✦found → the artist confirms (or "this isn't me" → recorded, not deleted). Cost target ≈ **$1/scan** (~$0.15–0.25 measured range in the spec). **Incremental re-scans** on-demand or ≤monthly (`last_discovery_scan_at`). Needs migration 028+ (`source_type='discovered'`, `person.full_name_<locale>`, `artist.country/languages`), a `POST /api/discovery-scan/:actId` endpoint + a Vercel-Cron chunked worker writing `processing_job`. **Gated on:** counsel sign-off + a real Anthropic key + **operator hand-QA before user-facing.** Honest coverage: ~50–60% of public findings auto-discoverable; ~15–20% (legal structure, management, label) never.

### 9.2 Locale-aware discovery (owner directive — NOT hardcoded HE/EN)
Discovery adapts to the artist's **country and the languages spoken there** (detect from locale/input, or ask once). Query generation + name transliterations run in that market's languages: **Israel = Hebrew + English + Russian**; Germany = German + English; France = French + English; default = English + the country's primary language(s). The **platform set is locale-aware**: Israel → Eventer · Tickchak · Go-Out · local promoters, **plus** the global set (Spotify · Instagram · Resident Advisor · SoundCloud · Bandcamp · YouTube); other markets → their local ticketing/listing platforms + the global set. (The onboarding scan animation in §8.1 shows exactly this Israel mix.)

### 9.3 Pillar (b) — INDUSTRY COMPARISON (method-safe context)
- **BUILT:** genre-emphasis guidance — `genreWeights.js` marks which planets "matter most in your genre" as an **additive ring + words only** ("★ buyers in your scene look here first"), firewall-clean (never a number/rank/%/leaderboard/badge). This is genre-normative guidance, not a peer comparison.
- **TARGET (RAD5, roadmap):** true peer/industry **bands** ("what does a techno DJ at your stage usually show?") as **bands + method labels only, never a rank/percentile.** Nothing compares an artist to a peer cohort today; firewall-review required before any cohort context renders, and **never buyer-side** unless method-safe and requested.

### 9.4 Pillar (c) — RECOMMENDATIONS (reasoned next-best-action)
- **BUILT:** the rule-based next-best-action engine (`pickNextAction` / `nextBestStep`) derives ONE clearest move from real state, each carrying a `why`; the milestone journey M1–M8 frames progress (no %, no bar-as-grade).
- **TARGET:** reasoned, evidence-linked recommendations that cite the scan + comparison ("*found a Selector listing — confirm it to fill your Proof planet, which buyers in techno weigh first*"). Partly reachable by extending the built engine.

### 9.5 Provider fallback + firewall preservation
A provider fallback may use a **cheaper tier with narrower extraction**, but it **must preserve the evidence firewall** (bounded status, no score/rank/count) and **disclose the narrower scope**. No business case may price or assume the deep scan until implementation and measured cost are verified.

### 9.6 Render principle for all three pillars (method-safe)
scan result = a **found card** (source + proves/doesn't-prove + confirm/reject); comparison = a **muted mono caption of bands + method labels**; recommendation = the **one lime next-action card** citing the finding. **No gauge, no cohort number, no rank — ever.** Reaction insight back to the artist = method-safe text only.

---

## 10. QA / Acceptance

### 10.1 Firewall scan (blocking — run on every screen)
Grep/scan the rendered UI and copy for any of: score · percentile · rank · % as a grade · gauge · prediction · exact headcount · follower count · leaderboard · position/placement number · a firewall-narration strip. **Any hit blocks release.** Confirm draw shows only as bands, readiness only as binaries, and every proof carries a canon method label. Confirm reaction-to-artist copy is method-safe text only.

### 10.2 Mobile-first checklist (390px)
One job per view; bottom nav present; Radar = separate Radar-Focus (zoom, swipe between planets, pull-down to close, logo ring, one-action drawer); bottom sheets not new pages; exactly one primary CTA; no horizontal scroll; hub reachable (avatar-only) in every mode; 44px tap targets; primary workflows fit one viewport.

### 10.3 Desktop checklist (1360px)
4-zone Radar canvas + inspector rail; one nav only (not top + rail); no duplicated titles; identity chrome = 2 elements (brand + hub); ≤2-step workspace switch; one primary CTA; inspector holds the CTA (dock hidden); no horizontal scroll; 0 console/page errors.

### 10.4 Per-field DoD (every editable/inline field)
empty = friendly helper · typing = active border · invalid = human explanation · saved = visible confirmation · undo available · loading state · error-retry. QA each field with: empty · typing · long value · **Hebrew** · URL · invalid. Confirmed radar nodes expose an edit affordance that re-opens the field pre-filled.

### 10.5 Contrast (WCAG 2.2 AA — P0)
Body text ≥ **4.5:1** minimum; **prefer 7:1**. Use only the approved AA pairs (§5.5); never place critical labels/validation/CTA on the `faint on app bg` pair (3.90, decorative only). Fix black-on-black input fields; token the text-field area. RTL/LTR both native (HE + EN; Russian + German next); i18n keys complete, no hardcoded strings, per-key fallback.

### 10.6 Flow / continuity checklist
New-user registration → onboarding → radar reachable; existing-user login honors deep-link `state.from`; the user can always return (no dead-ends); workspace create/switch never lands in a silent dead-end (D2); every primary workflow has a forward AND a backward path.

### 10.7 Motion / a11y
All motion respects `prefers-reduced-motion`; menu a11y (haspopup/expanded/controls, Escape returns focus, roving arrow keys); the sweep/starglow/sonar are decorative only.

---

## 11. Current State & Living References

### 11.1 What is live per surface (from `docs/VERSIONS.md`, mid-Jul 2026)
- **App (app.lock.show):** live at `a874ab5` (rel-2026.07.10, incl. the firewall hotfix) — the **OLD dark build**; it does **not** yet reflect the prototype. The next app step is to implement the approved prototype into the real React app (`src/`) as an RC, then Q8, then production.
- **Site (lock.show):** live at the Codex homepage narrative rebuild (DS v1.6.25); homepage done, inner pages pending the same architecture pass. Site is served by manual alias-promote from a Codex feature branch (governance note: not yet from `main`).
- **Embed (lock.show/app):** mirrors the app release; every app release must rebuild the embed (`build:embed`) or the two surfaces skew.
- **DB:** applied through ~035 (Cowork-verified); migration 021 is FROZEN (do not apply). Diff before creating 019+/036+; never recreate existing tables.

### 11.2 The prototype is the behavioral ground-truth
The interactive prototype (`scratchpad/lock-full-prototype.html`, artifact **`1c9b0030`**) is COMPLETE and owner-approved-in-iteration: engaging Radar + signal spec, consolidated ≤2-step nav hub + branding, discover→confirm planet drill-in, the Radar Inspector, onboarding narrative EN+HE locale-aware, multi-view Passport, Requests, Access, the unified switcher, and the light theme with dark Radar/Passport islands. **It is the behavioral ground-truth; this document is the written law.** When a nuance is ambiguous here, open the prototype.

### 11.3 The three canonical artifacts (the only ones to maintain)
1. **VERSION MAP** — `a65d12d9-a66d-442c-9077-306eb05fddd6`.
2. **ENTITIES / FLOWS** (structure + screens + intelligence + target) — `f702abc5-beb4-41a6-9f60-a2f8d239b6c6` (holds the fine-grained entity universe map).
3. **FULL APP PROTOTYPE** (6 entities / 24 screens, nav, full flow, DB-map, real branding) — `1c9b0030-9b25-4e1a-87ee-5d18823a661b`.

### 11.4 Test logins
The five QA/demo accounts (one per entity type, `@gigproof.test`) are documented in **`docs/team/TEST-LOGINS.md`** and seeded by `scripts/seed.mjs`. **Do not paste the password into this or any shareable surface** — see that file. Login at `www.lock.show/app/login`.

### 11.5 Stack
React + Vite + Tailwind + Supabase (ref `qexfndiyallwqhhzeerd`) + Vercel + Anthropic API. Analytics: GA4 `G-ZX907M2NY8` (consent-gated, Consent Mode v2, defaults denied). Payment: Bit + reference code, manual activation. Canonical codebase: GitHub Hello-MNB/lock.show (source of truth); Drive = DS + collaboration only. Not-yet-active (describe as conditional): Resend, Google/Facebook OAuth (created, not enabled), Tavily discovery (key verified, build pending, counsel-gated).

---

## 12. Open Decisions (owner rulings still pending)

Marked so they are never mistaken for settled. **OPEN** = an owner ruling; **OWED** = a deliverable another party must supply.

| # | Item | Type | Notes |
|---|---|---|---|
| B-1 | **Canonical entity ruling** — 3 workspaces; role + authority layers; Manager ≠ Booking-Agent; which buyer types serve Gate 1 | OPEN (owner) | awaits approval; the demand-side segmentation (§3.5) is the working model. |
| — | **Pilot price** | OPEN (owner) | recommendation ₪179; no price/ICP locked until the Gate. |
| — | **Hebrew "Act" ratification** | OPEN (owner taste) | de-facto live term = **אקט** (proceeds); formal ratification vs מופע/פרויקט pending; never invent a third term. |
| — | **`state.found` gold / `state.needsReview` amber ruling** | OPEN (owner/Codex) | keep gold+amber as small accents (A13) or retire to lime+neutral; prototype interim = neutral mist. Affects §5.4. |
| — | **Theme ground** | RESOLVED → build | DS v1.6.23/25 "dark is atmosphere, not camouflage" resolves it: everyday UI = light/paper, dark only for Radar/Passport. Re-ground remaining dark surfaces. |
| — | **Canonical origin app (app.lock.show)** | OPEN | the real app is still the old dark build; the approved prototype must be ported to `src/` as the canonical app. |
| — | **Codex v1.6.25 owed values** | OWED (Codex) | the seven items in §5.9: type-scale px+weights · light-card token values + Radar-universe boundary · CTA hierarchy + 44px paddings · logo master SVG · real venue logos (Barby/The Block/Sunset) · gold/amber ruling · full dark-app semantic scale + shadows + chrome tints. |
| — | **Firewall strip removal (U33)** | build task | remove the `.fwstrip` leftover from the Buyer/Public Passport (and never narrate the firewall anywhere). |
| — | **Discovery Engine go-live** | OPEN (gated) | counsel sign-off + real Anthropic key + operator hand-QA before the target scan is user-facing; do not market as built. |
| — | **Buyer register segmentation UI (D9)** | build task (P2) | private/corporate/planner warm-copy paths. |
| — | **Production event/lineup creation** | build task | currently view-only; add create-event / open-slot / confirm-slot. |
| — | **Retire Source-Confirmer workspace shell (D3)** + fix create dead-end (D2) | build task (P0) | confirmer lives only at `/confirm/:token`; recompute effective role so a base-role producer/booker isn't dead-ended. |

---

_Firewall re-verified across this document: no score/rank/%/gauge/prediction introduced on any screen; state stays the four bounded words + four node marks + the four canon method labels; reaction-to-artist stays method-safe text; built vs target kept honest throughout._

_End of LOCK Product Specification._
