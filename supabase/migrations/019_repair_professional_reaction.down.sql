-- UNDO for migration 019 (the reaction-model repair).
-- Safe: 019 only creates new, empty tables/columns — dropping them loses no prior data.
-- Order respects foreign keys (reaction_reason → professional_reaction → opportunity).

drop table if exists public.reaction_reason;
drop table if exists public.professional_reaction;   -- also removes pr_opportunity_fk
drop table if exists public.opportunity;

alter table public.producer_confirmations
  drop column if exists authority_type,
  drop column if exists name_visibility,
  drop column if exists identity_verified,
  drop column if exists conflict_of_interest,
  drop column if exists offline_confirmation_source;
