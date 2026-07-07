-- UNDO for migration 021 (vocabulary & consent alignment).
-- Restores the old vocabulary. Consent scopes restore EXACTLY from scope_legacy.
-- Note: role rows that were 'agency' before 021 folded into 'booking_manager' and
-- return as 'booker' here (the pre-021 acting value); venue_programmer rows (if
-- any were created after 021) also fold to 'booker' to satisfy the old CHECK.

-- visibility back
alter table public.claims drop constraint if exists claims_visibility_check;
update public.claims set visibility = 'mirror-only' where visibility = 'working-only';
alter table public.claims alter column visibility set default 'mirror-only';
alter table public.claims add constraint claims_visibility_check
  check (visibility in ('passport-ok','mirror-only','internal'));

alter table public.profile_items drop constraint if exists profile_items_visibility_check;
update public.profile_items set visibility = 'mirror-only' where visibility = 'working-only';
alter table public.profile_items add constraint profile_items_visibility_check
  check (visibility in ('passport-ok','mirror-only'));

-- roles back
alter table public.role_assignment drop constraint if exists role_assignment_functional_role_check;
update public.role_assignment set functional_role = 'booker'
 where functional_role in ('booking_manager','venue_programmer');
alter table public.role_assignment add constraint role_assignment_functional_role_check
  check (functional_role in ('booker','agency','artist_manager','artist','operator','producer'));

alter table public.profiles drop constraint if exists profiles_role_check;
update public.profiles set role = 'booker' where role in ('booking_manager','venue_programmer');
alter table public.profiles add constraint profiles_role_check
  check (role in ('artist','agency','booker','operator','producer'));

-- both 009 functions restored verbatim (fallback/joiner role back to 'booker')
create or replace function public.bootstrap_personal_org(
  p_name text, p_functional_role text, p_email text default null, p_display_name text default null
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_org uuid; v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  insert into public.person(id, email, display_name)
    values (v_uid, p_email, p_display_name)
    on conflict (id) do update
      set email = coalesce(excluded.email, public.person.email),
          display_name = coalesce(excluded.display_name, public.person.display_name);

  select o.id into v_org
    from public.organization o
    join public.organization_membership m on m.organization_id = o.id
   where m.person_id = v_uid and m.org_role = 'owner' and m.status = 'active'
   limit 1;
  if v_org is not null then return v_org; end if;

  insert into public.organization(name, plan, created_by)
    values (coalesce(nullif(p_name, ''), 'My organization'), 'solo', v_uid)
    returning id into v_org;
  insert into public.subscription(organization_id, plan, seats_included, seats_used, status)
    values (v_org, 'solo', 1, 1, 'active');
  insert into public.organization_membership(organization_id, person_id, org_role, status, joined_at)
    values (v_org, v_uid, 'owner', 'active', now());
  insert into public.role_assignment(organization_id, person_id, functional_role)
    values (v_org, v_uid, coalesce(nullif(p_functional_role, ''), 'booker'));
  insert into public.active_role_context(person_id, active_organization_id)
    values (v_uid, v_org)
    on conflict (person_id) do update set active_organization_id = excluded.active_organization_id, updated_at = now();
  return v_org;
end; $$;

create or replace function public.accept_invite(p_token text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_org uuid; v_invited_email text; v_uid uuid := auth.uid(); v_email text;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select id, organization_id, invited_email into v_id, v_org, v_invited_email
    from public.organization_membership where invite_token = p_token and status = 'invited';
  if v_id is null then raise exception 'invalid or used invite'; end if;
  select email into v_email from auth.users where id = v_uid;
  if v_invited_email is not null and lower(v_invited_email) <> lower(coalesce(v_email, '')) then
    raise exception 'invite email mismatch';
  end if;
  insert into public.person(id, email) values (v_uid, v_email) on conflict (id) do nothing;
  update public.organization_membership
     set person_id = v_uid, status = 'active', joined_at = now(), invite_token = null
   where id = v_id;
  insert into public.role_assignment(organization_id, person_id, functional_role)
    values (v_org, v_uid, 'booker');
  return v_org;
end; $$;

-- consent scopes: exact restore from the stash, then drop the stash + constraint
alter table public.consent_records drop constraint if exists consent_records_scope_check;
update public.consent_records set scope = scope_legacy where scope_legacy is not null;
alter table public.consent_records drop column if exists scope_legacy;
