-- ============================================================
-- GIGPROOF — migration 024: MEASUREMENT & SHARE (additive only)
--
-- WHAT THIS DOES (plain language): three NEW tables that make the gate
--   measurable, per DB-Documentation §2.14/§2.15/§2.23:
--     • passport_view_event — a Passport was OPENED. Critical rule: a view is
--       NOT a professional reaction; the two must never merge (P0-5).
--     • share_link — per-recipient tagged links; tracking disclosure mandatory.
--     • analytics_event — first-party product analytics, 14-event taxonomy
--       (§6.26). No third-party pixel exists anywhere near evidence surfaces.
--
-- FIREWALL: no PII beyond hashed/anonymous session ids; view events are
--   insertable publicly ONLY against a published artist (spam-gate).
-- Idempotent. Undo: 024_*.down.sql
-- ============================================================

-- ── share_link ────────────────────────────────────────────────────────────────
create table if not exists public.share_link (
  id                   uuid primary key default gen_random_uuid(),
  passport_version_id  uuid not null references public.passport_versions(id) on delete cascade,
  artist_id            uuid references public.artists(id) on delete cascade,  -- transition key (act_id below)
  act_id               uuid references public.act(id) on delete set null,
  recipient_label      text,       -- working-only — e.g. "Yossi", "Agency TLV"
  context              text,       -- working-only — why this link was sent
  tracking_disclosed   boolean not null default false,  -- MUST be true before sending (PUB4)
  expiry               timestamptz,
  utm_campaign         text,
  utm_source           text,
  utm_medium           text,
  status               text not null default 'active' check (status in ('active','expired','revoked')),
  opened_at            timestamptz,
  open_count           integer not null default 0,
  created_at           timestamptz not null default now()
);
create index if not exists idx_share_link_pv  on public.share_link(passport_version_id);
create index if not exists idx_share_link_act on public.share_link(act_id);

-- act_id auto-fill on insert (same transition helper as 020)
drop trigger if exists trg_actfill_share_link on public.share_link;
create trigger trg_actfill_share_link before insert on public.share_link
  for each row execute function public.set_act_from_artist_id();

alter table public.share_link enable row level security;
drop policy if exists sl_org_all on public.share_link;
create policy sl_org_all on public.share_link
  for all using (public.can_access_artist(artist_id))
  with check (public.can_access_artist(artist_id));
drop policy if exists sl_operator_read on public.share_link;
create policy sl_operator_read on public.share_link
  for select using (public.is_operator());

-- ── passport_view_event ───────────────────────────────────────────────────────
create table if not exists public.passport_view_event (
  id                   uuid primary key default gen_random_uuid(),
  passport_version_id  uuid not null references public.passport_versions(id) on delete cascade,
  share_link_id        uuid references public.share_link(id) on delete set null,
  public_session_id    uuid,          -- anonymous browser session
  actor_user_id        uuid references auth.users(id) on delete set null,
  actor_role_context   text,          -- functional_role if known — analytics NEVER pools roles
  viewed_at            timestamptz not null default now()
);
create index if not exists idx_pve_pv on public.passport_view_event(passport_version_id);

alter table public.passport_view_event enable row level security;
-- anon INSERT allowed, but ONLY against a published artist's snapshot (spam-gate;
-- deliberately stricter than 018's open reaction insert).
drop policy if exists pve_public_insert on public.passport_view_event;
create policy pve_public_insert on public.passport_view_event
  for insert with check (
    exists (select 1 from public.passport_versions pv
            join public.artists a on a.id = pv.artist_id
            where pv.id = passport_version_id and a.published)
  );
drop policy if exists pve_org_read on public.passport_view_event;
create policy pve_org_read on public.passport_view_event
  for select using (
    exists (select 1 from public.passport_versions pv
            where pv.id = passport_version_id
              and public.can_access_artist(pv.artist_id))
  );
drop policy if exists pve_operator_read on public.passport_view_event;
create policy pve_operator_read on public.passport_view_event
  for select using (public.is_operator());

-- ── analytics_event ───────────────────────────────────────────────────────────
create table if not exists public.analytics_event (
  id                   uuid primary key default gen_random_uuid(),
  event_name           text not null check (event_name in (
                         'passport_view','professional_reaction_submitted',
                         'availability_request_created','producer_confirmation_sent',
                         'producer_confirmation_received','claim_published',
                         'passport_published','entitlement_activated',
                         'gig_evidence_refresh_completed','share_link_created',
                         'share_link_opened','consent_granted','consent_withdrawn',
                         'account_deleted')),
  session_id           uuid,          -- hashed / anonymous
  actor_user_id        uuid references auth.users(id) on delete set null,
  actor_role           text,          -- functional_role if known
  passport_version_id  uuid references public.passport_versions(id) on delete set null,
  act_id               uuid references public.act(id) on delete set null,
  properties           jsonb,         -- event-specific, no PII
  created_at           timestamptz not null default now()
);
create index if not exists idx_ae_name_time on public.analytics_event(event_name, created_at desc);

alter table public.analytics_event enable row level security;
-- append-only: anyone may INSERT (first-party events fire from public surfaces
-- too, e.g. passport_view); ONLY the operator may read. No update/delete paths.
drop policy if exists ae_any_insert on public.analytics_event;
create policy ae_any_insert on public.analytics_event
  for insert with check (true);
drop policy if exists ae_operator_read on public.analytics_event;
create policy ae_operator_read on public.analytics_event
  for select using (public.is_operator());
