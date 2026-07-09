-- ============================================================
-- 028 — DISCOVERY FIELDS + M1 FUNNEL EVENTS + PLAN CAPABILITY FLAGS
-- (board P0-7/#11, P1-2/#4, P1-7/#9 — the pre-announced one-approval bundle)
--
-- ⚠ REQUIRES OWNER APPROVAL BEFORE APPLYING TO THE LIVE DB (same protocol
-- as 027). Additive-only, idempotent, zero data loss; undo: 028_*.down.sql.
--
-- WHAT THIS DOES (plain language):
--   1. DISCOVERY (#4): lets the web scanner store what it finds —
--      'discovered' becomes a legal evidence source (surfaced to the artist
--      for approve/dismiss, NEVER auto-published — Amendment-13 posture),
--      plus Hebrew/English name fields so search can run in both languages.
--   2. ANALYTICS (#11): extends the first-party event taxonomy (024's 14
--      events) with the 14 missing M1 funnel events, so the site→app→service
--      funnel and the Gate are measurable end-to-end. Firewall unchanged:
--      counts of events about the PRODUCT, never scores about artists.
--   3. PLANS (#9): a capability-flags column on organization so the app can
--      gate features per plan (Passport/Momentum/Roster) without an enum
--      migration every time packaging changes. Flags are jsonb; the app
--      reads them, the operator writes them. Display stays value-first.
-- ============================================================

-- ── 1a · 'discovered' evidence source ────────────────────────────────────────
alter table public.evidence_artifacts drop constraint if exists evidence_artifacts_source_type_check;
alter table public.evidence_artifacts add constraint evidence_artifacts_source_type_check
  check (source_type in
    ('ticket-export','settlement','screenshot','public-profile','producer-vouch',
     'self-band','self-reported','discovered'));

-- discovery provenance: where the scanner found it + disambiguation state.
alter table public.evidence_artifacts
  add column if not exists discovery_source_url text,
  add column if not exists discovery_query      text,     -- the exact query that surfaced it
  add column if not exists same_person_state    text not null default 'unreviewed'
    check (same_person_state in ('unreviewed','artist-confirmed','artist-dismissed'));

-- ── 1b · bilingual name fields (search runs HE + EN) ─────────────────────────
alter table public.artists
  add column if not exists stage_name_he text,
  add column if not exists name_he       text;
alter table public.act
  add column if not exists stage_name_he text;

-- ── 2 · M1 funnel events (extends 024's 14-event taxonomy) ───────────────────
alter table public.analytics_event drop constraint if exists analytics_event_event_name_check;
alter table public.analytics_event add constraint analytics_event_event_name_check
  check (event_name in (
    -- 024 originals (unchanged)
    'passport_view','professional_reaction_submitted',
    'availability_request_created','producer_confirmation_sent',
    'producer_confirmation_received','claim_published',
    'passport_published','entitlement_activated',
    'gig_evidence_refresh_completed','share_link_created',
    'share_link_opened','consent_granted','consent_withdrawn',
    'account_deleted',
    -- 028 · M1 funnel additions
    'signup_started','signup_completed','login','oauth_login',
    'onboarding_started','onboarding_completed',
    'radar_opened','evidence_added','claim_confirmed',
    'act_created','act_switched','workspace_switched',
    'payment_reference_created','availability_request_responded'));

-- ── 3 · plan capability flags ────────────────────────────────────────────────
-- e.g. {"momentum": true, "roster_seats": 5, "deep_scan": true}
alter table public.organization
  add column if not exists plan_flags jsonb not null default '{}'::jsonb;

comment on column public.organization.plan_flags is
  '028: per-workspace plan capabilities (Passport/Momentum/Roster gating). '
  'App reads, operator writes. Never rendered as a score/level to buyers.';
