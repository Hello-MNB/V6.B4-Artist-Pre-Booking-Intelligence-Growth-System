-- UNDO for migration 025 (firewall column grants).
-- Restores the pre-025 grant state: gigs/act back to default full-column grant
-- (rows still gated by RLS), removes the claims new-column grants and the act
-- public-read policy, restores default select grants on the 024 tables.

revoke select (public_band, public_wording, limitation_text, verified_at, expires_at)
  on public.claims from anon;

revoke select on public.gigs from anon;
grant select on public.gigs to anon;

drop policy if exists act_public_read on public.act;
revoke select on public.act from anon;
grant select on public.act to anon;

grant select on public.share_link          to anon;
grant select on public.passport_view_event to anon;
grant select on public.analytics_event     to anon;
