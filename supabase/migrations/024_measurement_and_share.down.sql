-- UNDO for migration 024 (measurement & share). Removes only what 024 added.
drop table if exists public.analytics_event;
drop table if exists public.passport_view_event;
drop trigger if exists trg_actfill_share_link on public.share_link;
drop table if exists public.share_link;
