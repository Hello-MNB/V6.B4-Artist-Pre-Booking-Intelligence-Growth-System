-- ============================================================
-- GIGPROOF — migration 019: REPAIR of migration 018
--
-- WHY THIS EXISTS (verified against the live DB, anon read-only probe, 7 Jul 2026):
--   Migration 018 FAILED to apply and rolled back completely. Its `opp_org_all`
--   policy referenced public.org_memberships (does not exist) with column user_id
--   (does not exist). The real table is public.organization_membership / person_id.
--   Postgres runs a migration as one transaction, so that single bad statement
--   discarded ALL of 018 — leaving the live DB at 017 with NONE of these:
--     • professional_reaction  (table)   — confirmed MISSING
--     • reaction_reason        (table)   — confirmed MISSING
--     • opportunity            (table)   — confirmed MISSING
--     • producer_confirmations.authority_type / name_visibility /
--       identity_verified / conflict_of_interest / offline_confirmation_source
--                               (columns) — confirmed MISSING
--
-- This migration is the REPAIR mandated by DB-Documentation §5.1: re-apply
-- everything 018 lost, with the policy defect fixed and the FK guarded.
--
-- FIDELITY NOTE (deliberate): this is a faithful restore of 018's INTENT against
--   the AS-BUILT live schema — it keys on artist_id (the `act` table does not
--   exist yet; re-keying to act_id happens in a later Multi-Act migration) and
--   keeps the underscore action_type vocabulary the app/legacy tables use.
--   Vocabulary alignment to the DB-Doc enum SSOT (hyphens · working-only · role
--   terms · consent-scope CHECK) is intentionally NOT done here — it belongs to
--   one dedicated vocabulary migration executed in lockstep with app-code changes,
--   so this repair introduces no new drift.
--
-- FIREWALL: no score, no headcount, no prediction. action_type vocab is bounded.
-- Idempotent: safe to run against a DB at 017 AND safe to re-run.
-- ============================================================

-- ── professional_reaction ────────────────────────────────────────────────────
-- One row per professional action on a Passport. Logged even with no account.
create table if not exists public.professional_reaction (
  id                    uuid primary key default gen_random_uuid(),
  passport_version_id   uuid references public.passport_versions(id) on delete set null,
  artist_id             uuid references public.artists(id) on delete set null,
  opportunity_id        uuid,        -- FK added below, after opportunity exists
  actor_user_id         uuid references auth.users(id) on delete set null,
  actor_role_context_id uuid,        -- future: org membership id once org model stable
  public_session_id     uuid,        -- anonymous session (no account)
  share_link_id         uuid,        -- which share link brought them here (future)
  action_type           text not null check (action_type in (
                          'check_availability',   -- PRIMARY: also writes AvailabilityRequest
                          'request_price',        -- PRIMARY: also writes AvailabilityRequest
                          'save',                 -- SECONDARY
                          'forward',              -- SECONDARY
                          'future_fit',           -- SECONDARY
                          'request_proof',        -- DIAGNOSTIC
                          'not_fit'               -- CLOSE
                        )),
  reaction_status       text not null default 'recorded'
                          check (reaction_status in ('recorded','retracted')),
  created_at            timestamptz not null default now(),
  idempotency_key       text unique
);

-- ── reaction_reason ──────────────────────────────────────────────────────────
-- Optional sub-reason for a diagnostic action. free_text is INTERNAL ONLY.
create table if not exists public.reaction_reason (
  id            uuid primary key default gen_random_uuid(),
  reaction_id   uuid not null references public.professional_reaction(id) on delete cascade,
  reason_type   text check (reason_type in (
                  'missing_draw','missing_fee','missing_activity','wrong_territory',
                  'no_fit','timing','price','other'
                )),
  free_text     text,   -- INTERNAL ONLY — never displayed externally
  created_at    timestamptz not null default now()
);

-- ── opportunity ──────────────────────────────────────────────────────────────
-- An open booking opportunity created by a booking-manager / agency org.
-- capacity_band / budget_band follow the draw-bands rule (never exact numbers).
create table if not exists public.opportunity (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid references public.organization(id) on delete cascade,
  event_type       text,
  venue            text,
  date_range       text,
  territory        text,
  capacity_band    text,                      -- BAND only, never exact head-count
  budget_band      text,                      -- BAND only, never exact fee
  status           text not null default 'open'
                     check (status in ('open','filled','cancelled','expired')),
  created_at       timestamptz not null default now()
);

-- FK professional_reaction → opportunity (guarded so re-runs cannot error).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'pr_opportunity_fk') then
    alter table public.professional_reaction
      add constraint pr_opportunity_fk
      foreign key (opportunity_id) references public.opportunity(id) on delete set null
      deferrable initially deferred;
  end if;
end $$;

-- ── producer_confirmations enrichment (the 5 columns 018 tried to add) ────────
alter table public.producer_confirmations
  add column if not exists authority_type       text
    check (authority_type in ('producer','venue_rep','ticketing_admin','organizer','other')),
  add column if not exists name_visibility      text not null default 'public'
    check (name_visibility in ('public','initials','anonymous')),
  add column if not exists identity_verified    boolean not null default false,
  add column if not exists conflict_of_interest boolean not null default false,
  add column if not exists offline_confirmation_source text
    check (offline_confirmation_source in ('phone','message','in_person'));

-- ── Row-Level Security ───────────────────────────────────────────────────────
alter table public.professional_reaction enable row level security;
alter table public.reaction_reason        enable row level security;
alter table public.opportunity            enable row level security;

-- professional_reaction: anon INSERT (public passport action, no login). Owning org reads.
drop policy if exists pr_anon_insert   on public.professional_reaction;
create policy pr_anon_insert on public.professional_reaction
  for insert with check (true);

drop policy if exists pr_org_read      on public.professional_reaction;
create policy pr_org_read on public.professional_reaction
  for select using (public.can_access_artist(artist_id));

drop policy if exists pr_operator_read on public.professional_reaction;
create policy pr_operator_read on public.professional_reaction
  for select using (public.is_operator());

-- reaction_reason
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

drop policy if exists rr_anon_insert   on public.reaction_reason;
create policy rr_anon_insert on public.reaction_reason
  for insert with check (true);

-- opportunity: active org members get full access to their org's rows; operator reads all.
-- >>> THE FIX vs 018: organization_membership / person_id (was org_memberships / user_id) <<<
drop policy if exists opp_org_all      on public.opportunity;
create policy opp_org_all on public.opportunity
  for all using (
    exists (
      select 1 from public.organization_membership om
      where om.organization_id = opportunity.organization_id
        and om.person_id = auth.uid()
        and om.status = 'active'
    )
  )
  with check (
    exists (
      select 1 from public.organization_membership om
      where om.organization_id = opportunity.organization_id
        and om.person_id = auth.uid()
        and om.status = 'active'
    )
  );

drop policy if exists opp_operator_read on public.opportunity;
create policy opp_operator_read on public.opportunity
  for select using (public.is_operator());
