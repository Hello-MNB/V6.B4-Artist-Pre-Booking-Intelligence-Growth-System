-- ============================================================
-- GIGPROOF — migration 023: GIG DEPTH (additive only)
--
-- WHAT THIS DOES (plain language):
--   The live `gigs` table is thin (title/date/venue/city/status). Canon requires
--   draw to be GIG-SCOPED (never a global average) and the post-performance
--   "Gig Evidence Refresh" loop — the recurring-value driver. This adds, per
--   DB-Documentation §2.12:
--     • the gig-scoped draw band + how-it-was-measured label
--     • the artist-volunteered exact count (working-only, NEVER public)
--     • the post-gig closeout fields (actual attendance, settlement band,
--       ticket attribution, repeat-booking signal)
--
--   Band thresholds per DB-Doc §6.17 (flagged: confirm against scene reality).
--   Band values are EN slugs; Hebrew labels live in the app's i18n layer.
--
-- FIREWALL: audience/attendance/settlement are BANDS. exact_count is the one
--   exact field — working-only, artist-volunteered, never SELECT-able publicly
--   (column-grant enforcement lands in 025).
-- Idempotent. Undo: 023_*.down.sql
-- ============================================================

alter table public.gigs
  -- context of the performance (passport-ok as context)
  add column if not exists role_at_event  text
    check (role_at_event in ('headliner','support','lineup-member')),
  -- gig-scoped draw: band + what the band means (the method)
  add column if not exists audience_band  text
    check (audience_band in ('<50','50-150','150-300','300-600','600+','unknown')),
  add column if not exists band_means     text
    check (band_means in ('sold','scanned','attended','attributed-via-link')),
  add column if not exists sells_events_self boolean,   -- YES shows; NO/null → row omitted publicly
  -- the one exact number — 🔒 working-only, never public
  add column if not exists exact_count    integer,
  -- post-performance closeout (Gig Evidence Refresh — A16b)
  add column if not exists closeout_status text
    check (closeout_status in ('pending','completed','skipped')),
  add column if not exists attendance_band text,        -- actual, may differ from pre-event band
  add column if not exists settlement_band text,        -- fee received, band only
  add column if not exists ticket_attribution_confirmed boolean,  -- UTM/link produced measurable attribution
  add column if not exists repeat_booking_signal boolean;         -- producer expressed rebooking interest — YES/NO only
