-- UNDO for migration 023 (gig depth). Removes only what 023 added.
alter table public.gigs
  drop column if exists role_at_event,
  drop column if exists audience_band,
  drop column if exists band_means,
  drop column if exists sells_events_self,
  drop column if exists exact_count,
  drop column if exists closeout_status,
  drop column if exists attendance_band,
  drop column if exists settlement_band,
  drop column if exists ticket_attribution_confirmed,
  drop column if exists repeat_booking_signal;
