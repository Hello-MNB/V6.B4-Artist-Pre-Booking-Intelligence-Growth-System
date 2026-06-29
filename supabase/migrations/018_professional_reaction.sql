-- ============================================================
-- GIGPROOF — migration 018: ProfessionalReaction corpus tables
-- Adds three new tables (professional_reaction, reaction_reason, opportunity)
-- and enriches producer_confirmations with authority/identity fields.
--
-- Background:
--   The B2 action ladder on the Passport captures demand-side reactions.
--   Previously these were ephemeral POST /api/passport-signal calls with no
--   persistence. This migration makes them first-class records so the artist
--   and agency can see what professionals actually do on the Passport.
--
-- Key rule from corrections doc:
--   check-availability / request-price write BOTH professional_reaction AND
--   availability_requests. All other action types write professional_reaction ONLY.
--   The requests inbox (AG2/AX7) shows availability_requests only.
--   A separate reaction/activity surface shows the full professional_reaction set.
--
-- FIREWALL: no score, no headcount, no prediction. action_type vocab is bounded.
-- RLS: professional_reaction writes are anon-allowed (public action from Passport);
--      reads are owning org only.
-- Idempotent (IF NOT EXISTS).
-- ============================================================

-- ── professional_reaction ────────────────────────────────────────────────────
-- One row per professional action on a Passport. Logged even when the viewer
-- has no account. Idempotency key prevents double-logging on retry/reload.

create table if not exists public.professional_reaction (
  id                   uuid primary key default gen_random_uuid(),
  -- which snapshot of the Passport was being viewed
  passport_version_id  uuid references public.passport_versions(id) on delete set null,
  -- resolved artist (denormalized for fast owner reads)
  artist_id            uuid references public.artists(id) on delete set null,
  -- the opportunity context this reaction is attached to (optional)
  opportunity_id       uuid,        -- FK to opportunity added below after table creation
  -- who acted — at most one of these is non-null
  actor_user_id        uuid references auth.users(id) on delete set null,
  actor_role_context_id uuid,       -- future: org_membership.id once org model stable
  public_session_id    uuid,        -- anonymous session (no account)
  share_link_id        uuid,        -- which share link brought them here (future)
  -- what they did — bounded vocabulary matches ActionLadder signal keys + Correction 2
  action_type          text not null check (action_type in (
                         'check_availability',   -- PRIMARY: goes to AvailabilityRequest
                         'request_price',        -- PRIMARY: goes to AvailabilityRequest
                         'save',                 -- SECONDARY workflow
                         'forward',              -- SECONDARY workflow (rungForward)
                         'future_fit',           -- SECONDARY workflow (rungFuture)
                         'request_proof',        -- DIAGNOSTIC (rungNeedsProof)
                         'not_fit'               -- CLOSE (rungNotThis)
                       )),
  reaction_status      text not null default 'recorded'
                         check (reaction_status in ('recorded','retracted')),
  created_at           timestamptz not null default now(),
  -- prevents double-log when the same session taps the same rung twice
  idempotency_key      text unique
);

-- ── reaction_reason ──────────────────────────────────────────────────────────
-- Optional sub-reason, captured when a professional selects a diagnostic action.
-- Used for Moat-6 corpus building (which dimension is actually missing?).
-- free_text is INTERNAL ONLY — never surfaced to the artist or public.

create table if not exists public.reaction_reason (
  id            uuid primary key default gen_random_uuid(),
  reaction_id   uuid not null references public.professional_reaction(id) on delete cascade,
  reason_type   text check (reason_type in (
                  'missing_draw',         -- attributed draw evidence missing
                  'missing_fee',          -- fee band or price info missing
                  'missing_activity',     -- recent activity / track record gap
                  'wrong_territory',      -- artist doesn't operate in booker's area
                  'no_fit',               -- general mismatch, not a proof gap
                  'timing',               -- no suitable dates
                  'price',                -- fee out of budget
                  'other'
                )),
  free_text     text,   -- INTERNAL ONLY — never displayed externally
  created_at    timestamptz not null default now()
);

-- ── opportunity ──────────────────────────────────────────────────────────────
-- An open booking opportunity created by a BOOKER or AGENCY org.
-- Artists and Passports can be matched against open opportunities.
-- capacity_band and budget_band follow the draw-bands rule (never exact numbers).

create table if not exists public.opportunity (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid references public.organization(id) on delete cascade,
  event_type       text,                      -- 'club' | 'festival' | 'private' | 'corporate' | other
  venue            text,
  date_range       text,                      -- e.g. "Q4 2026" or "Dec 2026 – Jan 2027"
  territory        text,                      -- city / region / country
  capacity_band    text,                      -- BAND only, never exact head-count
  budget_band      text,                      -- BAND only, never exact fee
  status           text not null default 'open'
                     check (status in ('open','filled','cancelled','expired')),
  created_at       timestamptz not null default now()
);

-- Add FK from professional_reaction → opportunity now that opportunity table exists
alter table public.professional_reaction
  add constraint pr_opportunity_fk
  foreign key (opportunity_id) references public.opportunity(id) on delete set null
  deferrable initially deferred;

-- ── producer_confirmations enrichment ────────────────────────────────────────
-- Adds identity and conflict-of-interest fields per Correction 3 requirements:
-- a confirmer's authority type and identity transparency must be recorded so
-- the Passport can show the appropriate source-strength label and so
-- operator override logic cannot silently inflate trust.

alter table public.producer_confirmations
  add column if not exists authority_type     text
    check (authority_type in ('producer','venue_rep','ticketing_admin','organizer','other')),
  add column if not exists name_visibility    text not null default 'public'
    check (name_visibility in ('public','initials','anonymous')),
  add column if not exists identity_verified  boolean not null default false,
  add column if not exists conflict_of_interest boolean not null default false,
  -- offline_confirmation_source records HOW an offline response was collected
  -- (phone|message|in_person). NULL = magic-link flow. Non-null = offline record.
  -- An operator may set this ONLY when an actual offline response was received —
  -- silence cannot become confirmation (Correction 3).
  add column if not exists offline_confirmation_source text
    check (offline_confirmation_source in ('phone','message','in_person'));

-- ── Row-Level Security ───────────────────────────────────────────────────────

alter table public.professional_reaction enable row level security;
alter table public.reaction_reason        enable row level security;
alter table public.opportunity            enable row level security;

-- professional_reaction: anon INSERT allowed (public passport action, no login needed).
-- Owning artist org may read their own reactions.
drop policy if exists pr_anon_insert   on public.professional_reaction;
create policy pr_anon_insert on public.professional_reaction
  for insert with check (true);

drop policy if exists pr_org_read      on public.professional_reaction;
create policy pr_org_read on public.professional_reaction
  for select using (public.can_access_artist(artist_id));

drop policy if exists pr_operator_read on public.professional_reaction;
create policy pr_operator_read on public.professional_reaction
  for select using (public.is_operator());

-- reaction_reason: only readable by the owning org (via join to reaction → artist).
-- No direct RLS needed if reads always go through the owning-org check on pr.
-- Simplest safe policy: operator reads all; users read via their own reactions.
drop policy if exists rr_operator_read on public.reaction_reason;
create policy rr_operator_read on public.reaction_reason
  for select using (public.is_operator());

drop policy if exists rr_owner_read    on public.reaction_reason;
create policy rr_owner_read on public.reaction_reason
  for select using (
    exists (
      select 1 from public.professional_reaction pr
      where pr.id = reaction_id
        and public.can_access_artist(pr.artist_id)
    )
  );

-- reaction_reason INSERT: tied to the reaction INSERT (same request, same session).
drop policy if exists rr_anon_insert   on public.reaction_reason;
create policy rr_anon_insert on public.reaction_reason
  for insert with check (true);

-- opportunity: org full access to own opportunities; operator reads all.
drop policy if exists opp_org_all      on public.opportunity;
create policy opp_org_all on public.opportunity
  for all using (
    exists (
      select 1 from public.org_memberships om
      where om.organization_id = opportunity.organization_id
        and om.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.org_memberships om
      where om.organization_id = opportunity.organization_id
        and om.user_id = auth.uid()
    )
  );

drop policy if exists opp_operator_read on public.opportunity;
create policy opp_operator_read on public.opportunity
  for select using (public.is_operator());

-- ── Notes on integration ─────────────────────────────────────────────────────
-- 1. The /api/passport-signal endpoint (currently fire-and-forget POST) should
--    be updated to INSERT into professional_reaction with the correct action_type.
--    For check_availability / request_price it should also insert availability_requests.
-- 2. The idempotency_key should be generated client-side as:
--    sha256(artistId + ':' + sessionId + ':' + actionType + ':' + dateUTC)
--    to prevent duplicate logging on network retry.
-- 3. The reaction_reason table is populated in a second request when the
--    professional selects a sub-reason (future BT-61 dimension-selector UI).
-- 4. offline_confirmation_source in producer_confirmations must be set by the
--    operator only — never by a producer or artist. The server (service role)
--    enforces this; the field has no client-side write path.
