-- UNDO for 028. Restores 001's source_type set and 024's 14-event taxonomy.
-- Rows using the 028 values are neutralized first so the CHECKs can re-apply.

-- discovery source rows fold to 'public-profile' (closest legal source);
-- provenance columns dropped.
update public.evidence_artifacts set source_type = 'public-profile' where source_type = 'discovered';
alter table public.evidence_artifacts drop constraint if exists evidence_artifacts_source_type_check;
alter table public.evidence_artifacts add constraint evidence_artifacts_source_type_check
  check (source_type in
    ('ticket-export','settlement','screenshot','public-profile','producer-vouch',
     'self-band','self-reported'));
alter table public.evidence_artifacts
  drop column if exists discovery_source_url,
  drop column if exists discovery_query,
  drop column if exists same_person_state;

alter table public.artists drop column if exists stage_name_he, drop column if exists name_he;
alter table public.act     drop column if exists stage_name_he;

-- 028-only events are deleted (they cannot satisfy the restored CHECK).
delete from public.analytics_event where event_name in (
  'signup_started','signup_completed','login','oauth_login',
  'onboarding_started','onboarding_completed',
  'radar_opened','evidence_added','claim_confirmed',
  'act_created','act_switched','workspace_switched',
  'payment_reference_created','availability_request_responded');
alter table public.analytics_event drop constraint if exists analytics_event_event_name_check;
alter table public.analytics_event add constraint analytics_event_event_name_check
  check (event_name in (
    'passport_view','professional_reaction_submitted',
    'availability_request_created','producer_confirmation_sent',
    'producer_confirmation_received','claim_published',
    'passport_published','entitlement_activated',
    'gig_evidence_refresh_completed','share_link_created',
    'share_link_opened','consent_granted','consent_withdrawn',
    'account_deleted'));

alter table public.organization drop column if exists plan_flags;
