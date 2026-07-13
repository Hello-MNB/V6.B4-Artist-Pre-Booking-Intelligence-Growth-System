# G16 — QA/PILOT DATA ISOLATION PLAN (Claude Code + Cowork, 13 Jul)
GOAL: QA writes NEVER pollute pilot signals; test rows identifiable + removable; environment recorded.
1. TAGGING: every QA-created row carries the marker — analytics events get properties.is_qa=true
   (Cowork's harness + my agents set it); app entities (artists/requests/claims) created during QA
   use the reserved prefix 'QA-' in stage_name/requester_name. DEMO mode already writes nothing.
2. EXCLUSION: all funnel/Gate reads (admin cockpit read-model, CFRO checks, Growth Op weekly)
   filter OUT properties->>'is_qa'='true' AND names LIKE 'QA-%'. Binding on the P0.5 cockpit build.
3. CLEANUP: after each QA round Cowork runs the cleanup queries (delete analytics rows where
   is_qa; delete QA-% entities) and records before/after counts as evidence.
4. RECORDING: every QA session logs candidate SHA + environment (preview URL) + window in its
   evidence doc. Preview uses the SAME Supabase project (accepted pilot-stage risk) — isolation is
   BY TAGGING+CLEANUP until a separate staging project is justified post-Gate.
5. CLOSURE: G16 = VERIFIED when Cowork demonstrates one full tagged-QA cycle (write→read-exclusion
   →cleanup) with evidence. Write-path preview gate (G11+G12+G16) then re-evaluates.
