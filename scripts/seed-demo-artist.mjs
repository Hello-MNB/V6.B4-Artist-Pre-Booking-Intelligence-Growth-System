// ============================================================
// Standing DEMO ARTIST for Maria — created via the REAL signup path (anon key),
// then seeded rich so the Radar Universe + Passport show their best on login.
// Credentials (documented in README convention):
//   artist@gigproof.test · Gigproof!2026
// Idempotent-ish: if the user exists, signs in instead and re-seeds missing rows.
// Run: node scripts/seed-demo-artist.mjs
// ============================================================
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = {}
for (const l of readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/); if (m) env[m[1]] = m[2].trim() }
const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } })

const EMAIL = 'artist@gigproof.test'
const PASSWORD = 'Gigproof!2026'
const log = (s, d = '') => console.log(`✅ ${s}${d ? ' — ' + d : ''}`)
const die = (s, e) => { console.log(`❌ ${s}: ${e?.message || e}`); process.exit(1) }

// 1 · sign up (or in)
let session = null
{
  const { data, error } = await sb.auth.signUp({ email: EMAIL, password: PASSWORD, options: { data: { full_name: 'Maya Vale' } } })
  if (error && /registered/i.test(error.message)) {
    const { data: si, error: e2 } = await sb.auth.signInWithPassword({ email: EMAIL, password: PASSWORD })
    if (e2) die('signIn', e2)
    session = si
    log('existing demo user — signed in')
  } else if (error) die('signUp', error)
  else { session = data; log('demo user created', EMAIL) }
}
const uid = session.user.id

// 2 · role + org bootstrap (the app's /select step)
{
  const { error: pe } = await sb.from('profiles').upsert({ id: uid, role: 'artist', full_name: 'Maya Vale' })
  if (pe) die('profile', pe)
  const { error: be } = await sb.rpc('bootstrap_personal_org', { p_name: 'Maya Vale', p_functional_role: 'artist', p_email: EMAIL, p_display_name: 'Maya Vale' })
  if (be) die('bootstrap', be)
  log('role + personal org')
}

// 3 · consents (the two required scopes, as the app records them)
for (const scope of ['privacy-policy', 'data-processing']) {
  await sb.from('consent_records').insert({ subject_id: uid, scope, version: 'v3-inline-gates', status: 'accepted' })
}
log('consents recorded')

// 4 · artist (published, rich identity) — reuse if exists
let artistId = null
{
  const { data: existing } = await sb.from('artists').select('id').eq('created_by', uid).limit(1).maybeSingle()
  if (existing) { artistId = existing.id; log('artist exists', artistId) }
  else {
    const { data, error } = await sb.from('artists').insert({
      created_by: uid,
      stage_name: 'Maya Vale', name: 'Maya Vale',
      genre: 'melodic techno', city: 'Tel Aviv',
      one_line: 'Peak-time rooms from Tel Aviv to Berlin',
      published: true,
      lineup_frequency_band: '2–4 / month', sells_tickets: true,
      price_band: '₪4K–7K', community_size_band: '1,000–2,500',
      set_length: '90 min', regions: 'Center · North', invoice_ready: true,
    }).select('id').single()
    if (error) die('artist insert', error)
    artistId = data.id
    log('artist created + published', artistId)
  }
}

// 5 · act goal (the 020 spine — same id as the artist)
await sb.from('act').update({ artist_goal: 'new-venues', community_count_declared: 1800 }).eq('id', artistId)
log('act goal set')

// 6 · claims — 2 confirmed passport-ok + 2 CANDIDATES (✦ for the Universe)
{
  const { data: have } = await sb.from('claims').select('id').eq('artist_id', artistId)
  if (!have?.length) {
    const { error } = await sb.from('claims').insert([
      { artist_id: artistId, claim_type: 'draw-band', value: '220–340', public_band: '220–340', public_wording: 'Paid attendance, headline night', source_type: 'ticket-export', verification_status: 'verified', method_label: 'evidence-supported', visibility: 'passport-ok', artist_approved: true, status: 'published', verified_at: new Date().toISOString() },
      { artist_id: artistId, claim_type: 'draw-band', value: '400–600', public_band: '400–600', public_wording: 'Festival stage, producer confirmed', source_type: 'producer-vouch', verification_status: 'verified', method_label: 'producer-confirmed', visibility: 'passport-ok', artist_approved: true, status: 'published', verified_at: new Date().toISOString() },
      // candidates — appear as ✦ Found on the Universe, waiting for one-tap confirm
      { artist_id: artistId, claim_type: 'draw-band', value: '180–260', source_type: 'ticket-export', verification_status: 'verified', method_label: 'evidence-supported', visibility: 'mirror-only', artist_approved: false, status: 'processed' },
      { artist_id: artistId, claim_type: 'community-size', value: '1,800', source_type: 'self-band', verification_status: 'self-reported', visibility: 'mirror-only', artist_approved: false, status: 'processed' },
    ])
    if (error) die('claims', error)
    log('claims seeded (2 confirmed · 2 candidates ✦)')
  } else log('claims exist', `${have.length}`)
}

// 7 · track record + links
{
  const { data: have } = await sb.from('profile_items').select('id').eq('artist_id', artistId)
  if (!have?.length) {
    const { error } = await sb.from('profile_items').insert([
      { artist_id: artistId, item_type: 'event', title: 'Barby TLV — headline', item_date: '2026-05-14', visibility: 'passport-ok', source_status: 'public-verified' },
      { artist_id: artistId, item_type: 'event', title: 'Kuli Alma — resident night', item_date: '2026-04-02', visibility: 'passport-ok', source_status: 'public-verified' },
      { artist_id: artistId, item_type: 'event', title: 'Midburn stage', item_date: '2026-06-20', visibility: 'passport-ok', source_status: 'artist-provided' },
      { artist_id: artistId, item_type: 'link', title: 'Spotify', public_url: 'https://open.spotify.com/artist/demo', visibility: 'passport-ok', source_status: 'artist-provided' },
      { artist_id: artistId, item_type: 'link', title: 'Instagram', public_url: 'https://instagram.com/mayavale.demo', visibility: 'passport-ok', source_status: 'artist-provided' },
    ])
    if (error) die('items', error)
    log('track record + links')
  } else log('items exist', `${have.length}`)
}

// 8 · published snapshot row (pv_owner_insert — enables view-event measurement)
{
  const { data: have } = await sb.from('passport_versions').select('id').eq('artist_id', artistId).limit(1)
  if (!have?.length) {
    const { error } = await sb.from('passport_versions').insert({ artist_id: artistId, snapshot: {} })
    if (error) die('passport version', error)
    log('passport version snapshot')
  }
}

console.log(`\n════════ DEMO ARTIST READY ════════
  Login:    ${EMAIL}
  Password: ${PASSWORD}
  Radar:    /artist/home   (Universe: 2 ✦ candidates waiting)
  Passport: /passport/${artistId}`)
