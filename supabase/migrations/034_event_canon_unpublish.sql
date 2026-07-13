-- LOCK — migration 034: add 'passport_unpublished' to the analytics event CANON
-- Why: the app logs PASSPORT_UNPUBLISHED (publish-cadence / staleness — the
-- CFRO recurring-revenue signal), but 028's CHECK vocabulary doesn't allow it,
-- so the event stayed localStorage-only (GPT admin-cockpit audit, P0 flag 2).
-- Additive + reversible. Widen the CHECK only; no data change.
alter table public.analytics_event drop constraint if exists analytics_event_event_name_check;
alter table public.analytics_event add constraint analytics_event_event_name_check
  check (event_name in (
    -- 024 originals (unchanged)
    'passport_view','professional_reaction_submitted',
    'availability_request_created','producer_confirmation_sent',
    'producer_confirmation_received','claim_published',
    'passport_published','entitlement_activated',
    'gig_evidence_refresh_completed','share_link_created',
    'share_link_opened','consent_granted','consent_withdrawn',
    'account_deleted',
    -- 028 · M1 funnel additions (unchanged)
    'signup_started','signup_completed','login','oauth_login',
    'radar_opened','evidence_added','claim_confirmed',
    'act_created','act_switched','workspace_switched',
    'payment_reference_created','availability_request_responded',
    -- 034 · publish-cadence signal + onboarding fix (applied version, Cowork 13 Jul:
    -- onboarding_completed was in the app CANON but missing from the 028 CHECK — added on apply)
    'passport_unpublished','onboarding_completed'));
