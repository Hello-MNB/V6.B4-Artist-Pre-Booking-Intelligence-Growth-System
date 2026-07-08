-- ============================================================
-- 027 (DOWN) — revert workspace_type + artist_access enrichment + new RPCs.
-- Does NOT restore rows to their pre-migration status value if they were
-- moved to 'pending'/'disputed' after 027 shipped — those are genuinely new
-- states with no pre-027 equivalent. Safe to run only if no live grant is
-- currently sitting in 'pending'/'disputed' (check before running on a real DB).
-- ============================================================

drop function if exists public.revoke_artist_access(uuid);
drop function if exists public.respond_to_access_request(uuid, boolean, text[]);
drop function if exists public.list_incoming_access_requests();
drop function if exists public.request_artist_access(uuid, uuid, text[], text);

alter table public.role_assignment drop constraint if exists role_assignment_functional_role_check;
alter table public.role_assignment add constraint role_assignment_functional_role_check
  check (functional_role in ('artist','booking_manager','artist_manager','producer','venue_programmer','operator'));

create or replace function public.artist_access_has_scope(a uuid, needed text)
returns boolean language sql stable security definer set search_path = public as $$ select false $$;
drop function if exists public.artist_access_has_scope(uuid, text);

create or replace function public.can_access_artist(a uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.artists ar
    where ar.id = a and ar.owner_organization_id in (select public.current_org_ids())
  ) or exists (
    select 1 from public.artist_access aa
    where aa.artist_id = a and aa.status = 'active'
      and aa.organization_id in (select public.current_org_ids())
  )
$$;

drop policy if exists aa_artist_owner_respond on public.artist_access;
drop policy if exists aa_artist_owner_read on public.artist_access;

drop index if exists idx_artist_access_artist_status;
alter table public.artist_access alter column status set default 'active';
alter table public.artist_access drop constraint if exists artist_access_status_check;
alter table public.artist_access add constraint artist_access_status_check
  check (status in ('active','revoked'));
alter table public.artist_access drop constraint if exists artist_access_scope_check;
alter table public.artist_access drop column if exists consent_at;
alter table public.artist_access drop column if exists expires_at;
alter table public.artist_access drop column if exists territory;
alter table public.artist_access drop column if exists scope;

alter table public.organization alter column workspace_type drop default;
alter table public.organization drop constraint if exists organization_workspace_type_check;
alter table public.organization drop column if exists workspace_type;

-- producer_confirmations.conflict_of_interest predates 027 (018/019) —
-- intentionally NOT dropped here to avoid undoing an unrelated migration.
