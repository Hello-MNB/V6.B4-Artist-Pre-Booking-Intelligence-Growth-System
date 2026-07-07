-- ============================================================
-- GIGPROOF — migration 022: CLAIM & EVIDENCE DEPTH (additive only)
--
-- WHAT THIS DOES (plain language):
--   Adds the fields the automated claim pipeline and the claim-review screen
--   write, per DB-Documentation §2.9/§2.10/§2.11:
--     • claims — the public-facing representation fields (public_band /
--       public_wording / limitation_text), the artist-approval flag that gates
--       everything, the claim lifecycle status, and the source timestamp.
--     • evidence_artifacts — claim-first capture fields (claim_intent),
--       consent + integrity fields (source_owner_consent, checksum,
--       retention_policy, platform), and the Amendment-13 PII-scrub flag.
--     • processing_job — NEW table tracking each automated AI extraction run.
--
--   NO existing column is changed or renamed (021 vocabulary work stays frozen).
--   The running app ignores all of this until the LOOP screens use it.
--
-- FIREWALL: public_band is a BAND string (e.g. "50–150") — the only draw form
--   allowed publicly. exact values stay in claims.value (working-only).
-- Idempotent. Undo: 022_*.down.sql
-- ============================================================

-- ── claims: what the buyer may see + the artist-approval gate ────────────────
alter table public.claims
  add column if not exists public_band      text,      -- band representation; the ONLY public draw form
  add column if not exists public_wording   text,      -- exact text as it will appear on the Passport
  add column if not exists limitation_text  text,      -- "what this supports / does not establish"
  add column if not exists artist_approved  boolean not null default false,  -- nothing reaches any view without this
  add column if not exists source_timestamp timestamptz,                     -- when the source data was generated
  add column if not exists status           text not null default 'submitted'
    check (status in ('submitted','processed','source-supported','published',
                      'self-reported','not-assessable','stale','disputed'));

-- ── evidence_artifacts: claim-first capture + Amendment-13 fields ─────────────
alter table public.evidence_artifacts
  add column if not exists claim_intent         text,     -- what the artist wants to prove (drives extraction)
  add column if not exists source_owner_consent boolean not null default false, -- artist confirms authority over source
  add column if not exists checksum             text,     -- sha256 integrity
  add column if not exists retention_policy     text not null default 'standard',
  add column if not exists platform             text,     -- e.g. 'spotify' · 'eventer' · 'instagram'
  add column if not exists pii_scrubbed         boolean not null default false;
    -- Amendment-13: third-party PII must be scrubbed before claims are extracted.

-- ── processing_job: one row per automated extraction run ─────────────────────
create table if not exists public.processing_job (
  id                    uuid primary key default gen_random_uuid(),
  evidence_artifact_id  uuid not null references public.evidence_artifacts(id) on delete cascade,
  status                text not null default 'queued'
                          check (status in ('queued','running','completed','failed')),
  model_version         text,      -- which AI model ran
  ruleset_version       text,      -- which claim-support ruleset was applied
  error_message         text,      -- human-readable failure for the operator queue
  started_at            timestamptz,
  completed_at          timestamptz,
  created_at            timestamptz not null default now()
);
create index if not exists idx_processing_job_artifact on public.processing_job(evidence_artifact_id);

-- RLS: owning org may read job status; operator reads all; writes are
-- server-side only (service role bypasses RLS — no client write policy).
alter table public.processing_job enable row level security;

drop policy if exists pj_org_read on public.processing_job;
create policy pj_org_read on public.processing_job
  for select using (
    exists (select 1 from public.evidence_artifacts e
            where e.id = evidence_artifact_id
              and public.can_access_artist(e.artist_id))
  );

drop policy if exists pj_operator_read on public.processing_job;
create policy pj_operator_read on public.processing_job
  for select using (public.is_operator());
