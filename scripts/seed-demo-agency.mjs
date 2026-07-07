// ============================================================
// Standing DEMO AGENCY for Maria — real signup path (anon key), then a roster
// of 3 artists with mixed states so the Roster Universe shows its range:
//   agency@gigproof.test · Gigproof!2026
// Idempotent: re-running signs in and skips existing rows.
// Run: node scripts/seed-demo-agency.mjs
// ============================================================
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = {}
for (const l of readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].trim() }
const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } })

const EMAIL = 'agency@gigproof.test'
const PASSWORD = 'Gigproof!2026'
const log = (s, d = '') => console.log(`✅ ${s}${d ? ' — ' + d : ''}`)
const die = (s, e) => { console.log(`❌ ${s}: ${e?.message || e}`); process.exit(1) }

// 1 · sign up or in
let session
{
  const { data, error } = await sb.auth.signUp({ email: EMAIL, password: PASSWORD, options: { data: { full_name: 'North Agency' } } })
  if (error && /registered/i.test(error.message)) {
    const { data: si, error: e2 } = await sb.auth.signInWithPassword({ email: EMAIL, password: PASSWORD })
    if (e2) die('signIn', e2)
    session = si; log('existing agency — signed in')
  } else if (error) die('signUp', error)
  else { session = data; log('agency user created', EMAIL) }
}
const uid = session.user.id

// 2 · role + org
{
  const { error: pe } = await sb.from('profiles').upsert({ id: uid, role: 'agency', full_name: 'North Agency' })
  if (pe) die('profile', pe)
  const { error: be } = await sb.rpc('bootstrap_personal_org', { p_name: 'North Agency', p_functional_role: 'agency', p_email: EMAIL, p_display_name: 'North Agency' })
  if (be) die('bootstrap', be)
  log('role + org')
}

// the org id — needed to link roster artists via artist_access (RADAR feed reads it)
let orgId = null
{
  const { data: m } = await sb.from('organization_membership').select('organization_id').eq('person_id', uid).limit(1).maybeSingle()
  orgId = m?.organization_id || null
  if (!orgId) log('org lookup', 'NOT FOUND — artist_access linking will be skipped')
}

// 3 · roster — 3 artists in different states
const ROSTER = [
  { stage_name: 'Noa Kedem', genre: 'psytrance', city: 'Tel Aviv', published: true,
    lineup_frequency_band: '3–5 / month', sells_tickets: true, price_band: '₪5K–9K', photo: null,
    claims: [
      { claim_type: 'draw-band', value: '350–500', public_band: '350–500', public_wording: 'Festival mainstage, producer confirmed', source_type: 'producer-vouch', verification_status: 'verified', method_label: 'producer-confirmed', visibility: 'passport-ok', artist_approved: true, status: 'published' },
      { claim_type: 'draw-band', value: '200–300', source_type: 'ticket-export', verification_status: 'verified', method_label: 'evidence-supported', visibility: 'mirror-only', artist_approved: false, status: 'processed' },
      { claim_type: 'community-size', value: '2,400', source_type: 'self-band', verification_status: 'self-reported', visibility: 'mirror-only', artist_approved: false, status: 'processed' },
    ] },
  { stage_name: 'Tomer Adjmi', genre: 'techno', city: 'Haifa', published: true,
    lineup_frequency_band: '1–2 / month', sells_tickets: false, price_band: null, photo: null,
    claims: [
      { claim_type: 'draw-band', value: '120–180', public_band: '120–180', public_wording: 'Club night, ticket export', source_type: 'ticket-export', verification_status: 'verified', method_label: 'evidence-supported', visibility: 'passport-ok', artist_approved: true, status: 'published' },
    ] },
  { stage_name: 'Lior Ben-Ami', genre: 'open-format · weddings', city: 'Jerusalem', published: false,
    lineup_frequency_band: null, sells_tickets: null, price_band: null, photo: null, claims: [] },
]

for (const r of ROSTER) {
  const { data: existing } = await sb.from('artists').select('id').eq('created_by', uid).eq('stage_name', r.stage_name).maybeSingle()
  let id = existing?.id
  if (!id) {
    const { data, error } = await sb.from('artists').insert({
      created_by: uid, stage_name: r.stage_name, name: r.stage_name, genre: r.genre, city: r.city,
      published: r.published, lineup_frequency_band: r.lineup_frequency_band,
      sells_tickets: r.sells_tickets, price_band: r.price_band,
    }).select('id').single()
    if (error) die(`artist ${r.stage_name}`, error)
    id = data.id
    if (r.claims.length) {
      const { error: ce } = await sb.from('claims').insert(r.claims.map((c) => ({ ...c, artist_id: id })))
      if (ce) die(`claims ${r.stage_name}`, ce)
    }
    if (r.published) await sb.from('passport_versions').insert({ artist_id: id, snapshot: {} })
    log(`roster: ${r.stage_name}`, `${r.claims.filter((c) => !c.artist_approved).length} candidates`)
  } else log(`roster exists: ${r.stage_name}`)

  // Formal roster linkage — the RADAR feed reads artist_access, not created_by;
  // without these rows /agency/radar shows an empty roster. Best-effort: RLS may
  // reject under some policies — log and continue, never fail the seed.
  if (id && orgId) {
    const { data: link } = await sb.from('artist_access').select('id').eq('artist_id', id).eq('organization_id', orgId).maybeSingle()
    if (!link) {
      const { error: ae } = await sb.from('artist_access').insert({ organization_id: orgId, artist_id: id, access_level: 'manage', status: 'active' })
      if (ae) log(`artist_access ${r.stage_name}`, `SKIPPED (${ae.message})`)
      else log(`artist_access ${r.stage_name}`, 'linked')
    }
  }
}

console.log(`\n════════ DEMO AGENCY READY ════════
  Login:    ${EMAIL}
  Password: ${PASSWORD}
  Home:     /agency  (Roster Universe: Noa ✦2 · Tomer established · Lior developing)`)
