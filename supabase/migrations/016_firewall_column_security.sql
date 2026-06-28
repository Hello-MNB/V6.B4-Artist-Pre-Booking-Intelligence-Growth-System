-- ============================================================
-- 016 — FIREWALL column security (defense-in-depth for the PUBLIC anon key).
-- The row-level public-read policies (published / passport-ok) correctly gate
-- ROWS, but anon — a PUBLIC, shippable key — could still pull PRIVATE columns
-- directly:  artists.whatsapp_number / rider_url / created_by, and
-- claims.internal_confidence (a SCORE — firewall!) / expires_at (raw timestamp).
-- Fix: grant anon SELECT on BUYER-SAFE columns only. Row-level RLS is unchanged;
-- service_role (the server /api/passport) keeps full access; the OWNER still reads
-- their own private fields via the org policy + the `authenticated` grant.
-- Idempotent. Apply in the Supabase SQL editor (no secret).
-- ============================================================

-- artists: drop anon's blanket select, re-grant only buyer-safe columns
revoke select on public.artists from anon;
grant select (id, stage_name, name, genre, city, photo_url, one_line, regions,
  set_length, invoice_ready, music_links, lineup_frequency_band, sells_tickets,
  price_band, community_size_band, published) on public.artists to anon;

-- profile_items: buyer-safe columns only (no internal metadata)
revoke select on public.profile_items from anon;
grant select (id, artist_id, item_type, title, detail, item_date, public_url, source_status)
  on public.profile_items to anon;

-- claims: buyer-safe columns only — NO internal_confidence (score), NO expires_at
-- (raw timestamp), NO extraction_method / model_version / verified_by
revoke select on public.claims from anon;
grant select (id, artist_id, claim_type, value, source_type, verification_status, reason_code, method_label)
  on public.claims to anon;
