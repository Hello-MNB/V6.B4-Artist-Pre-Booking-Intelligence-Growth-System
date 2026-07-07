-- UNDO for migration 026 (waitlist).
-- ⚠ Dropping the table deletes collected signups — export first if any exist:
--   select * from public.waitlist_signup order by created_at;
drop table if exists public.waitlist_signup;
