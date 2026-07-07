-- UNDO for migration 020 (Acts spine).
-- Safe: removes only what 020 added. artists + all child rows keep their data;
-- only the act table, the act_id columns, and the transition triggers go away.

drop trigger if exists trg_act_from_artist on public.artists;
drop function if exists public.act_from_artist();

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
drop function if exists public.set_act_from_artist_id();

alter table public.claims                 drop column if exists act_id;
alter table public.evidence_artifacts     drop column if exists act_id;
alter table public.profile_items          drop column if exists act_id;
alter table public.gigs                   drop column if exists act_id;
alter table public.passport_versions      drop column if exists act_id;
alter table public.availability_requests  drop column if exists act_id;
alter table public.producer_confirmations drop column if exists act_id;
alter table public.professional_reaction  drop column if exists act_id;
alter table public.draw_signals           drop column if exists act_id;
alter table public.radar_signal           drop column if exists act_id;
alter table public.entitlements           drop column if exists act_id;

drop table if exists public.act;
