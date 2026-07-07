-- UNDO for migration 022 (claim & evidence depth). Removes only what 022 added.
drop table if exists public.processing_job;

alter table public.evidence_artifacts
  drop column if exists claim_intent,
  drop column if exists source_owner_consent,
  drop column if exists checksum,
  drop column if exists retention_policy,
  drop column if exists platform,
  drop column if exists pii_scrubbed;

alter table public.claims
  drop column if exists public_band,
  drop column if exists public_wording,
  drop column if exists limitation_text,
  drop column if exists artist_approved,
  drop column if exists source_timestamp,
  drop column if exists status;
