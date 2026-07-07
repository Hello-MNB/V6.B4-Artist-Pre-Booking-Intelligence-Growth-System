-- ============================================================
-- GIGPROOF — migration 020: THE ACTS SPINE (multi-Act foundation)
--
-- WHAT THIS DOES (plain language):
--   Canon: one artist (Person) may hold several Acts (e.g. a psytrance Act and
--   a techno Act), each with its OWN Passport and its OWN evidence. Today the
--   database hangs everything on `artists`. This migration introduces the `act`
--   entity and threads `act_id` through every evidence/proof table — WITHOUT
--   breaking the running app:
--
--     1. Creates the `act` table (per DB-Documentation §2.7).
--     2. Backfills ONE default Act per existing artist, reusing the SAME id
--        (act.id = artists.id) — so every existing child row maps 1:1, trivially.
--     3. Adds `act_id` to the 11 child tables and backfills it from artist_id.
--     4. Installs transition triggers so the CURRENT app keeps working:
--          • new artists row  → matching act row auto-created
--          • new child row    → act_id auto-filled from artist_id
--        The app can migrate to act-first reads screen by screen, no big-bang.
--
--   Verified pre-conditions (live, 7 Jul 2026): no `act` table; 2 artists rows,
--   all with created_by + org; 0 orphan child rows; all creators have person rows.
--
-- FIREWALL: no score/rank/prediction columns. community_count_declared is
--   working-only (never public; a band is derived from it).
-- Idempotent: IF NOT EXISTS / ON CONFLICT guards throughout. Undo: 020_*.down.sql
-- ============================================================

-- ── 0 · safety: person rows for any artist creator that lacks one ────────────
-- (0 today; guard kept so the migration is safe on any future re-run/restore)
insert into public.person (id, email, display_name)
select u.id, coalesce(u.email, ''), coalesce(u.raw_user_meta_data->>'full_name', '')
from auth.users u
where u.id in (select distinct created_by from public.artists where created_by is not null)
  and not exists (select 1 from public.person p where p.id = u.id)
on conflict (id) do nothing;

-- ── 1 · the act table ─────────────────────────────────────────────────────────
-- Transitional divergence from DB-Doc §2.7 (deliberate, tightened later):
--   genre/city nullable (live artists rows may lack them); anon read arrives
--   when the public Passport switches to act-first reads.
create table if not exists public.act (
  id                        uuid primary key default gen_random_uuid(),
  person_id                 uuid not null references public.person(id) on delete cascade,
  organization_id           uuid references public.organization(id) on delete set null,
  stage_name                text not null,                    -- passport-ok
  genre                     text,                             -- passport-ok
  city                      text,                             -- passport-ok
  positioning               text check (positioning is null or char_length(positioning) <= 120), -- passport-ok
  photo_url                 text,                             -- passport-ok
  video_url                 text,                             -- passport-ok
  music_links               text[],                           -- passport-ok (context strip only)
  tech_info                 text,                             -- working-only
  contact                   text,                             -- INTERNAL ONLY — routing, never public
  artist_goal               text check (artist_goal in (
                              'more-shows','new-venues','support-slots','out-of-town',
                              'raise-fee','prove-community','external-bookings','not-sure')),
                              -- working-only; EN slugs now, HE labels live in i18n (per build-in-EN rule)
  format                    text check (format in ('dj-set','live-set','duo','band','open-format','vocalist','other')),
  alias                     text,
  is_default                boolean not null default true,
  community_count_declared  integer,                          -- working-only 🔒 never public; band derived
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- ── 2 · backfill: one default Act per existing artist (same id ⇒ 1:1 map) ────
insert into public.act (id, person_id, organization_id, stage_name, genre, city,
                        positioning, photo_url, music_links, is_default, created_at)
select a.id,
       a.created_by,
       coalesce(a.owner_organization_id, a.organization_id),
       coalesce(nullif(a.stage_name, ''), nullif(a.name, ''), 'Unnamed'),
       a.genre,
       a.city,
       a.one_line,
       a.photo_url,
       case when jsonb_typeof(a.music_links) = 'array'
            then array(select jsonb_array_elements_text(a.music_links))
            else null end,
       true,
       coalesce(a.created_at, now())
from public.artists a
where a.created_by is not null
on conflict (id) do nothing;

-- ── 3 · act_id on the 11 child tables, backfilled from artist_id ─────────────
-- (act.id = artists.id, so the backfill is a plain copy; FK set-null keeps
--  transition safe — nothing double-deletes.)
alter table public.claims                 add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.evidence_artifacts     add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.profile_items          add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.gigs                   add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.passport_versions      add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.availability_requests  add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.producer_confirmations add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.professional_reaction  add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.draw_signals           add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.radar_signal           add column if not exists act_id uuid references public.act(id) on delete set null;
alter table public.entitlements           add column if not exists act_id uuid references public.act(id) on delete set null;

update public.claims                 set act_id = artist_id where act_id is null and artist_id is not null;
update public.evidence_artifacts     set act_id = artist_id where act_id is null and artist_id is not null;
update public.profile_items          set act_id = artist_id where act_id is null and artist_id is not null;
update public.gigs                   set act_id = artist_id where act_id is null and artist_id is not null;
update public.passport_versions      set act_id = artist_id where act_id is null and artist_id is not null;
update public.availability_requests  set act_id = artist_id where act_id is null and artist_id is not null;
update public.producer_confirmations set act_id = artist_id where act_id is null and artist_id is not null;
update public.professional_reaction  set act_id = artist_id where act_id is null and artist_id is not null;
update public.draw_signals           set act_id = artist_id where act_id is null and artist_id is not null;
update public.radar_signal           set act_id = artist_id where act_id is null and artist_id is not null;
update public.entitlements           set act_id = artist_id where act_id is null and artist_id is not null;

create index if not exists idx_claims_act        on public.claims(act_id);
create index if not exists idx_evidence_act      on public.evidence_artifacts(act_id);
create index if not exists idx_items_act         on public.profile_items(act_id);
create index if not exists idx_gigs_act          on public.gigs(act_id);
create index if not exists idx_pv_act            on public.passport_versions(act_id);
create index if not exists idx_requests_act      on public.availability_requests(act_id);
create index if not exists idx_confirmations_act on public.producer_confirmations(act_id);
create index if not exists idx_reactions_act     on public.professional_reaction(act_id);
create index if not exists idx_drawsignals_act   on public.draw_signals(act_id);
create index if not exists idx_radar_act         on public.radar_signal(act_id);
create index if not exists idx_entitlements_act  on public.entitlements(act_id);

-- ── 4 · transition triggers: the CURRENT app keeps working untouched ─────────
-- 4a: a new artists row auto-creates its default Act (same id).
create or replace function public.act_from_artist() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.created_by is not null then
    insert into public.act (id, person_id, organization_id, stage_name, genre, city,
                            positioning, photo_url, is_default)
    values (new.id, new.created_by, coalesce(new.owner_organization_id, new.organization_id),
            coalesce(nullif(new.stage_name,''), nullif(new.name,''), 'Unnamed'),
            new.genre, new.city, new.one_line, new.photo_url, true)
    on conflict (id) do nothing;
  end if;
  return new;
end $$;

drop trigger if exists trg_act_from_artist on public.artists;
create trigger trg_act_from_artist
  after insert on public.artists
  for each row execute function public.act_from_artist();

-- 4b: child rows written by the current app (artist_id only) get act_id filled.
create or replace function public.set_act_from_artist_id() returns trigger
language plpgsql as $$
begin
  if new.act_id is null and new.artist_id is not null then
    new.act_id := new.artist_id;
  end if;
  return new;
end $$;

drop trigger if exists trg_actfill_claims        on public.claims;
drop trigger if exists trg_actfill_evidence      on public.evidence_artifacts;
drop trigger if exists trg_actfill_items         on public.profile_items;
drop trigger if exists trg_actfill_gigs          on public.gigs;
drop trigger if exists trg_actfill_pv            on public.passport_versions;
drop trigger if exists trg_actfill_requests      on public.availability_requests;
drop trigger if exists trg_actfill_confirmations on public.producer_confirmations;
drop trigger if exists trg_actfill_reactions     on public.professional_reaction;
drop trigger if exists trg_actfill_drawsignals   on public.draw_signals;
drop trigger if exists trg_actfill_radar         on public.radar_signal;
drop trigger if exists trg_actfill_entitlements  on public.entitlements;
create trigger trg_actfill_claims        before insert on public.claims                 for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_evidence      before insert on public.evidence_artifacts     for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_items         before insert on public.profile_items          for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_gigs          before insert on public.gigs                   for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_pv            before insert on public.passport_versions      for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_requests      before insert on public.availability_requests  for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_confirmations before insert on public.producer_confirmations for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_reactions     before insert on public.professional_reaction  for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_drawsignals   before insert on public.draw_signals           for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_radar         before insert on public.radar_signal           for each row execute function public.set_act_from_artist_id();
create trigger trg_actfill_entitlements  before insert on public.entitlements           for each row execute function public.set_act_from_artist_id();

-- ── 5 · RLS on act ────────────────────────────────────────────────────────────
-- Same access model as artists during transition: owning-org members full,
-- operator read. (Anon/public read arrives when the Passport goes act-first —
-- until then the public surface still reads `artists` under 016's column grants.)
alter table public.act enable row level security;

drop policy if exists act_org on public.act;
create policy act_org on public.act
  for all using (public.can_access_artist(id))
  with check (public.can_access_artist(id));

drop policy if exists act_operator_read on public.act;
create policy act_operator_read on public.act
  for select using (public.is_operator());
