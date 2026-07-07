import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { getArtist, addEvidence, listEvidence, listClaims, hasConsent, recordConsentScope, processEvidence, updateAct } from '../../lib/db.js'
import { uploadFile } from '../../lib/storage.js'
import { EVIDENCE, evidenceFileError } from '../../lib/constants.js'
import { PageShell, Wordmark, Field, Spinner, ErrorNote, Loading, SourceLabel } from '../../components/ui.jsx'
import { useLang } from '../../context/LangContext.jsx'

// ── Claim-first evidence capture (canon A7) ──────────────────────────────────
// The artist starts from WHAT THEY WANT TO PROVE; the system requests the
// matching evidence. Not "upload a file" — "what do you want to show?"
// Each intent maps to its evidence ask + source_type (canon claim→source table).
const INTENTS = ['drew-crowd', 'sold-via-link', 'rebooked', 'community', 'produced-event', 'consistent-frequency', 'producer-confirm']

export default function EvidenceCapture() {
  const { T, BANDS } = useLang()
  const { artistId } = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [artist, setArtist] = useState(null)
  const [evidence, setEvidence] = useState([])
  const [claims, setClaims] = useState([])
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [processing, setProcessing] = useState(false)

  // claim-first: which claim the artist wants to prove (null = picker)
  const [intent, setIntent] = useState(null)

  // Third-party evidence consent gate (collected inline here, not upfront).
  const [evConsent, setEvConsent] = useState(false)
  const [consentBusy, setConsentBusy] = useState(false)

  // per-intent form state
  const [band, setBand] = useState('')
  const [bandUrl, setBandUrl] = useState('')
  const [textVal, setTextVal] = useState('')
  const [numVal, setNumVal] = useState('')
  const [uploading, setUploading] = useState(false)

  async function load() {
    try {
      const a = await getArtist(artistId); setArtist(a)
      setEvConsent(await hasConsent(user.id, 'evidence-storage'))
      setEvidence(await listEvidence(artistId))
      setClaims(await listClaims(artistId))
    } catch (err) {
      setError(err.message || T.common.error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [artistId])

  function flash(msg) { setToast(msg); setTimeout(() => setToast(''), 2200) }
  function resetForms() { setBand(''); setBandUrl(''); setTextVal(''); setNumVal('') }

  async function acceptEvidenceConsent() {
    setConsentBusy(true); setError('')
    try {
      await recordConsentScope(user.id, 'evidence-storage')
      setEvConsent(true)
    } catch (e) {
      setError(e.message || T.common.error)
    } finally {
      setConsentBusy(false)
    }
  }

  // every artifact carries the claim intent + source-authority confirmation
  async function submitEvidence(item) {
    await addEvidence({ artist_id: artistId, claim_intent: intent, source_owner_consent: true, ...item })
    resetForms(); await load(); flash(T.evidence.addedOk)
  }

  async function onFile(e, sourceType) {
    const file = e.target.files?.[0]; if (!file) return
    const bad = evidenceFileError(file)
    if (bad) { setError(bad === 'size' ? T.evidence.errFileSize : T.evidence.errFileType); e.target.value = ''; return }
    setUploading(true); setError('')
    try {
      const { url } = await uploadFile('evidence', user.id, file)
      await submitEvidence({ evidence_type: 'file', source_type: sourceType, file_url: url, value: file.name })
    } catch (err) { setError(err.message) } finally { setUploading(false) }
  }

  async function addBand() {
    if (!band) return
    setError('')
    try {
      await submitEvidence({
        evidence_type: 'band',
        source_type: bandUrl ? 'public-profile' : 'self-band',
        value: band, public_url: bandUrl || null,
      })
    } catch (err) { setError(err.message) }
  }

  async function addLink(sourceType) {
    if (!textVal) return
    setError('')
    try {
      const isUrl = /^https?:\/\//i.test(textVal.trim())
      await submitEvidence({
        evidence_type: 'link', source_type: sourceType,
        value: textVal, public_url: isUrl ? textVal.trim() : null,
      })
    } catch (err) { setError(err.message) }
  }

  // community: a NUMBER only — Amendment 13 forbids member lists/screenshots.
  async function addCommunityCount() {
    const n = parseInt(numVal, 10)
    if (!Number.isFinite(n) || n <= 0) return
    setError('')
    try {
      await updateAct(artistId, { community_count_declared: n }) // working-only; public sees a band, never this integer
      await submitEvidence({ evidence_type: 'band', source_type: 'self-band', value: String(n) })
    } catch (err) { setError(err.message) }
  }

  async function process() {
    setProcessing(true); setError('')
    try {
      await processEvidence(artistId) // server (real AI) if present, else client-side canon stub
      await load()
    } catch (err) { setError(err.message || T.common.error) } finally { setProcessing(false) }
  }

  if (loading) return <Loading />

  // Gate: no evidence add/processing without third-party evidence consent.
  if (!evConsent) {
    return (
      <PageShell>
        <div className="flex items-center justify-between mb-6">
          <Wordmark /><Link to="/artist/home" className="text-sm text-muted">{T.common.back}</Link>
        </div>
        <h1 className="text-xl font-bold text-soft mb-1">{T.evidence.title}</h1>
        <ErrorNote>{error}</ErrorNote>
        <div className="card">
          <p className="font-bold text-soft mb-1">{T.consent.evidenceTitle}</p>
          <p className="text-sm text-muted mb-4">{T.consent.evidence}</p>
          <button className="btn-primary w-full" onClick={acceptEvidenceConsent} disabled={consentBusy}>
            {consentBusy ? <Spinner /> : T.consent.evidenceGateCta}
          </button>
        </div>
      </PageShell>
    )
  }

  const pending = evidence.filter((e) => e.status === 'submitted').length

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-6">
        <Wordmark /><Link to="/artist/home" className="text-sm text-muted">{T.common.back}</Link>
      </div>
      <h1 className="text-xl font-bold text-soft mb-1">{T.evidence.title}</h1>
      <p className="text-sm text-muted mb-4">{T.evidence.subtitle}</p>
      <ErrorNote>{error}</ErrorNote>
      {toast && <p className="mb-3 text-sm text-ok">{toast}</p>}

      {/* ── Step 1: what do you want to prove? ── */}
      {!intent && (
        <div className="card mb-4">
          <p className="font-bold text-soft mb-1">{T.evidence.intentTitle}</p>
          <p className="text-xs text-muted mb-3">{T.evidence.intentHelp}</p>
          <div className="flex flex-wrap gap-2">
            {INTENTS.map((k) => (
              <button key={k} type="button" onClick={() => { setIntent(k); setError('') }}
                className="rounded-lg border border-line px-3 py-2 text-sm text-soft transition-colors hover:border-accent/40">
                {T.evidence.intents[k]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: the matching evidence request ── */}
      {intent && (
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="font-bold text-soft">{T.evidence.intents[intent]}</p>
            <button type="button" className="text-xs text-muted hover:text-soft" onClick={() => { setIntent(null); resetForms() }}>
              {T.evidence.changeIntent}
            </button>
          </div>
          <p className="text-xs text-muted mb-4">{T.evidence.intentAsk[intent]}</p>

          {/* drew-crowd: strongest = export/settlement file; also band + public link */}
          {intent === 'drew-crowd' && (
            <>
              <p className="text-sm font-semibold text-soft mb-1">{T.evidence.uploadFile}</p>
              <input type="file" accept={EVIDENCE.ACCEPT} onChange={(e) => onFile(e, 'ticket-export')} className="text-sm text-muted mb-1" />
              <p className="text-xs text-muted mb-4">{T.evidence.fileHint}</p>
              {uploading && <Spinner />}
              <p className="text-sm font-semibold text-soft mb-1">{T.evidence.bandEntry}</p>
              <Field label={T.onboarding.freqBand}>
                <div className="flex flex-wrap gap-2">
                  {BANDS.frequency.map((o) => (
                    <button key={o} onClick={() => setBand(o)}
                      className={`chip min-h-[44px] px-4 py-2 ${band === o ? 'bg-accent text-ink' : 'bg-surface text-soft'}`}>{o}</button>
                  ))}
                </div>
              </Field>
              <Field label={T.evidence.publicUrl}>
                <input className="field" dir="ltr" value={bandUrl} onChange={(e) => setBandUrl(e.target.value)} placeholder="https://…" />
              </Field>
              <button className="btn-ghost w-full" onClick={addBand}>{T.common.add}</button>
            </>
          )}

          {/* sold-via-link: UTM/coupon export upload */}
          {intent === 'sold-via-link' && (
            <>
              <input type="file" accept={EVIDENCE.ACCEPT} onChange={(e) => onFile(e, 'ticket-export')} className="text-sm text-muted mb-1" />
              <p className="text-xs text-muted">{T.evidence.fileHint}</p>
              {uploading && <Spinner />}
            </>
          )}

          {/* rebooked: venue/producer reference */}
          {intent === 'rebooked' && (
            <>
              <Field label={T.evidence.referenceLabel}>
                <input className="field" value={textVal} onChange={(e) => setTextVal(e.target.value)} placeholder={T.evidence.referencePlaceholder} />
              </Field>
              <button className="btn-ghost w-full" onClick={() => addLink('producer-vouch')}>{T.common.add}</button>
            </>
          )}

          {/* community: NUMBER ONLY (Amendment 13 — no member lists, ever) */}
          {intent === 'community' && (
            <>
              <Field label={T.evidence.communityLabel}>
                <input className="field" type="number" min="1" inputMode="numeric" value={numVal} onChange={(e) => setNumVal(e.target.value)} placeholder="1200" />
              </Field>
              <p className="text-xs text-warn mb-3">{T.evidence.communityPII}</p>
              <button className="btn-ghost w-full" onClick={addCommunityCount}>{T.common.add}</button>
            </>
          )}

          {/* produced-event: public link or poster file */}
          {intent === 'produced-event' && (
            <>
              <Field label={T.evidence.publicUrl}>
                <input className="field" dir="ltr" value={textVal} onChange={(e) => setTextVal(e.target.value)} placeholder="https://…" />
              </Field>
              <button className="btn-ghost w-full mb-4" onClick={() => addLink('public-profile')}>{T.common.add}</button>
              <p className="text-sm font-semibold text-soft mb-1">{T.evidence.uploadFile}</p>
              <input type="file" accept={EVIDENCE.ACCEPT} onChange={(e) => onFile(e, 'screenshot')} className="text-sm text-muted" />
              {uploading && <Spinner />}
            </>
          )}

          {/* consistent-frequency: public lineup link */}
          {intent === 'consistent-frequency' && (
            <>
              <Field label={T.evidence.publicUrl}>
                <input className="field" dir="ltr" value={textVal} onChange={(e) => setTextVal(e.target.value)} placeholder="https://…" />
              </Field>
              <button className="btn-ghost w-full" onClick={() => addLink('public-profile')}>{T.common.add}</button>
            </>
          )}

          {/* producer-confirm: contact → one-claim confirmation link (P1 flow) */}
          {intent === 'producer-confirm' && (
            <>
              <Field label={T.evidence.producerContactLabel}>
                <input className="field" value={textVal} onChange={(e) => setTextVal(e.target.value)} placeholder={T.evidence.producerContactPlaceholder} />
              </Field>
              <button className="btn-ghost w-full" onClick={() => addLink('producer-vouch')}>{T.common.add}</button>
            </>
          )}

          <p className="mt-3 text-[11px] text-muted">{T.evidence.authorityNote}</p>
        </div>
      )}

      {/* submitted evidence */}
      {evidence.length > 0 && (
        <div className="card mb-4">
          <p className="font-bold text-soft mb-2">{T.evidence.collected}</p>
          <ul className="space-y-2">
            {evidence.map((e) => (
              <li key={e.id} className="flex items-center justify-between text-sm">
                <span className="text-soft">{e.value || e.evidence_type} · {e.source_type}</span>
                <span className={`chip ${e.status === 'processed' ? 'bg-ok/15 text-ok' : 'bg-surface text-muted'}`}>
                  {e.status === 'processed' ? T.evidence.processed : T.evidence.pending}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* resulting claims */}
      {claims.length > 0 && (
        <div className="card mb-4">
          <p className="font-bold text-soft mb-2">{T.evidence.results}</p>
          <ul className="space-y-2">
            {claims.map((c) => (
              <li key={c.id} className="flex items-center justify-between text-sm">
                <span className="text-soft">{c.value || c.claim_type}</span>
                <SourceLabel status={c.verification_status} methodLabel={c.method_label} expiresAt={c.expires_at} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn-primary w-full" onClick={process} disabled={processing || pending === 0}>
        {processing ? <><Spinner /> {T.evidence.processing}</> : `${T.evidence.process}${pending ? ` (${pending})` : ''}`}
      </button>
    </PageShell>
  )
}
