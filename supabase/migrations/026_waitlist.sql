-- ============================================================
-- GIGPROOF — migration 026: WAITLIST (Phase-1 demand capture)
--
-- WHAT THIS DOES (plain language):
--   The public marketing site collects waitlist emails — Phase-1 of the
--   validation track (email capture only; no accounts, no counsel needed).
--   One table, write-only from the public: anyone may JOIN the list, nobody
--   can READ it from a browser. Only the operator sees the list.
--
--   Feeds the Phase-1 metrics: signups by persona (artist / booking manager /
--   producer), per source page — first-party only, no third-party pixel.
--
-- Idempotent. Undo: 026_waitlist.down.sql
-- ============================================================

create table if not exists public.waitlist_signup (
  id           uuid primary key default gen_random_uuid(),
  email        text not null check (position('@' in email) > 1),
  name         text,
  role         text check (role in ('artist','booking_manager','producer','other')),
  message      text,
  source_page  text,          -- which page the signup came from (first-party attribution)
  locale       text,          -- 'en' / 'he' at time of signup
  created_at   timestamptz not null default now()
);

-- one row per email (case-insensitive); duplicates get a friendly
-- "you're already on the list" in the UI instead of a second row
create unique index if not exists idx_waitlist_email on public.waitlist_signup (lower(email));

alter table public.waitlist_signup enable row level security;

-- anyone may join…
drop policy if exists wl_anon_insert on public.waitlist_signup;
create policy wl_anon_insert on public.waitlist_signup
  for insert with check (true);

-- …but the list itself is operator-only. No public read path exists at all.
drop policy if exists wl_operator_read on public.waitlist_signup;
create policy wl_operator_read on public.waitlist_signup
  for select using (public.is_operator());

-- defense-in-depth: the anon role cannot SELECT this table even if a future
-- policy mistake opens rows (016/025 pattern)
revoke select on public.waitlist_signup from anon;
