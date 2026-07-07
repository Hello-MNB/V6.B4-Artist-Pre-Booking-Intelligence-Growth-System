-- ============================================================
-- GIGPROOF — migration 025: FIREWALL COLUMN GRANTS (extends 016's pattern)
--
-- WHAT THIS DOES (plain language):
--   016 locked the anonymous (public) role down to explicit column lists on
--   artists / profile_items / claims. Migrations 020–024 added new tables and
--   columns — this migration extends the same physical firewall to them:
--     • claims: grant anon the NEW public display fields (public_band,
--       public_wording, limitation_text, verified_at, expires_at) — the
--       Passport needs them; row access stays gated by the published+passport-ok
--       RLS policy from 001.
--     • gigs: convert to explicit column-grant mode — anon gets context + BAND
--       columns only; gig.exact_count is physically un-SELECTable by anon.
--     • act: published-artist read policy (transition: published flag still
--       lives on artists) + passport-ok columns only. contact /
--       community_count_declared / artist_goal / tech_info are NOT granted.
--     • share_link / analytics_event / passport_view_event: anon may not read
--       AT ALL (view/analytics inserts still allowed via 024's RLS).
--
-- FIREWALL: this is defense-in-depth — even if a future RLS policy mistake
--   opens rows, the column grants keep exact counts and internal fields dark.
-- Idempotent (grants/revokes re-run safely). Undo: 025_*.down.sql
-- ============================================================

-- ── claims: add the new public display fields to anon's column list ──────────
grant select (public_band, public_wording, limitation_text, verified_at, expires_at)
  on public.claims to anon;

-- ── gigs: explicit column-grant mode (016 pattern) ────────────────────────────
revoke select on public.gigs from anon;
grant select (id, organization_id, artist_id, act_id, title, venue, city, event_date, status,
              role_at_event, audience_band, band_means, sells_events_self,
              attendance_band, closeout_status)
  on public.gigs to anon;
-- deliberately NOT granted: exact_count (working-only), settlement_band
-- (fee data — buyer sees fee context only via method-labeled claims),
-- ticket_attribution_confirmed / repeat_booking_signal (working-only signals).

-- ── act: public read of passport-ok identity columns only ────────────────────
revoke select on public.act from anon;
grant select (id, stage_name, genre, city, positioning, photo_url, video_url, music_links)
  on public.act to anon;
-- deliberately NOT granted: contact (internal), community_count_declared
-- (working-only — bands only in public), artist_goal, tech_info, person_id.

-- transition row policy: an Act is publicly readable while its artist row is
-- published (the published flag moves to passport_version at act-first cutover).
drop policy if exists act_public_read on public.act;
create policy act_public_read on public.act
  for select using (
    exists (select 1 from public.artists a where a.id = act.id and a.published)
  );

-- ── measurement tables: anon writes events, never reads them ─────────────────
revoke select on public.share_link          from anon;
revoke select on public.passport_view_event from anon;
revoke select on public.analytics_event     from anon;
