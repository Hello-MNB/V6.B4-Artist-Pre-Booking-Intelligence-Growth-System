import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { getMyArtist, listClaims, updateClaimVisibility, updateClaim, deleteClaim, listProfileItems, updateItemVisibility, publishPassport } from '../../lib/db.js'
import { VISIBILITY, SOURCE_STATUS } from '../../lib/constants.js'
import { PageShell, Wordmark, Loading, EmptyState, ErrorState, SourceLabel, Spinner } from '../../components/ui.jsx'
import { useLang } from '../../context/LangContext.jsx'
import { logEvent, EVENTS } from '../../lib/analytics.js'
import { markPassportDirty, clearPassportDirty, isPassportDirty } from '../../lib/passportState.js'
import { DEMO } from '../../lib/demo.js'

export default function ClaimReview() {
  const { T } = useLang()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [artist, setArtist] = useState(null)
  const [claims, setClaims] = useState([])
  const [items, setItems] = useState([])
  const [toggling, setToggling] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [republishing, setRepublishing] = useState(false)

  async function load() {
    setLoadError(false)
    try {
      const a = await getMyArtist(user.id)
      setArtist(a)
      if (a) {
        const [cs, is] = await Promise.all([listClaims(a.id), listProfileItems(a.id)])
        setClaims(cs)
        setItems(is)
        setDirty(isPassportDirty(a.id))
      }
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [user.id])

  // Publish eligibility (canon A10): ONLY verified/supporting claims that the
  // artist explicitly confirmed may cross to passport-ok. Self-reported and
  // not-assessable stay in the private view always.
  function canPublish(claim) {
    return claim.artist_approved === true && ['verified', 'supporting'].includes(claim.verification_status)
  }

  async function toggle(claim) {
    if (toggling) return
    const goingPublic = claim.visibility !== VISIBILITY.PASSPORT_OK
    if (goingPublic && !canPublish(claim)) return // UI disables this; guard anyway
    setToggling(claim.id)
    try {
      const next = goingPublic ? VISIBILITY.PASSPORT_OK : VISIBILITY.MIRROR_ONLY
      await updateClaimVisibility(claim.id, next)
      logEvent(EVENTS.CLAIM_VISIBILITY_CHANGED, { claim_id: claim.id, from: claim.visibility, to: next })
      setClaims((prev) => prev.map((c) => c.id === claim.id ? { ...c, visibility: next } : c))
      markPassportDirty(artist.id); setDirty(true)
    } finally { setToggling(null) }
  }

  // ── A8 review actions — the artist-approval gate ──
  async function approve(claim) {
    if (toggling) return
    setToggling(claim.id)
    try {
      await updateClaim(claim.id, { artist_approved: true })
      setClaims((prev) => prev.map((c) => c.id === claim.id ? { ...c, artist_approved: true } : c))
    } finally { setToggling(null) }
  }

  async function correctValue(claim, newValue) {
    if (toggling || !newValue || newValue === claim.value) return
    setToggling(claim.id)
    try {
      await updateClaim(claim.id, { value: newValue, verified_by: 'artist' })
      setClaims((prev) => prev.map((c) => c.id === claim.id ? { ...c, value: newValue, verified_by: 'artist' } : c))
      if (claim.visibility === VISIBILITY.PASSPORT_OK) { markPassportDirty(artist.id); setDirty(true) }
    } finally { setToggling(null) }
  }

  async function omit(claim) {
    if (toggling) return
    if (!window.confirm(T.claims.omitConfirm)) return
    setToggling(claim.id)
    try {
      await deleteClaim(claim.id)
      setClaims((prev) => prev.filter((c) => c.id !== claim.id))
      if (claim.visibility === VISIBILITY.PASSPORT_OK) { markPassportDirty(artist.id); setDirty(true) }
    } finally { setToggling(null) }
  }

  async function flag(claim) {
    if (toggling) return
    setToggling(claim.id)
    try {
      // Wrong event / dispute → operator queue (status='disputed'); never publishable while flagged.
      await updateClaim(claim.id, { status: 'disputed', artist_approved: false, visibility: VISIBILITY.MIRROR_ONLY })
      setClaims((prev) => prev.map((c) => c.id === claim.id ? { ...c, status: 'disputed', artist_approved: false, visibility: VISIBILITY.MIRROR_ONLY } : c))
      if (claim.visibility === VISIBILITY.PASSPORT_OK) { markPassportDirty(artist.id); setDirty(true) }
    } finally { setToggling(null) }
  }

  async function toggleItem(item) {
    if (toggling) return
    setToggling(item.id)
    try {
      const next = item.visibility === VISIBILITY.PASSPORT_OK ? VISIBILITY.MIRROR_ONLY : VISIBILITY.PASSPORT_OK
      await updateItemVisibility(item.id, next)
      logEvent(EVENTS.CLAIM_VISIBILITY_CHANGED, { item_id: item.id, from: item.visibility, to: next })
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, visibility: next } : i))
      markPassportDirty(artist.id); setDirty(true)
    } finally { setToggling(null) }
  }

  async function republish() {
    if (republishing) return
    setRepublishing(true)
    try {
      await publishPassport(artist.id)
      clearPassportDirty(artist.id)
      setDirty(false)
    } finally { setRepublishing(false) }
  }

  if (loading) return <Loading />
  if (loadError) return (
    <PageShell>
      <Wordmark className="mb-6" />
      <ErrorState title={T.common.error} onRetry={() => { setLoading(true); load() }} />
    </PageShell>
  )
  if (!artist) return (
    <PageShell>
      <Wordmark className="mb-6" />
      <EmptyState title={T.dashboard.empty} action={<Link to="/onboarding" className="btn-primary">{T.common.continue}</Link>} />
    </PageShell>
  )

  // A8 triage: unreviewed first (nothing is publishable until confirmed), then
  // the confirmed sets, split by where they show.
  const pendingReview = claims.filter((c) => !c.artist_approved)
  const approved = claims.filter((c) => c.artist_approved)
  const passportOk = approved.filter((c) => c.visibility === VISIBILITY.PASSPORT_OK)
  const mirrorOnly = approved.filter((c) => c.visibility !== VISIBILITY.PASSPORT_OK)
  const hasDraw = artist.lineup_frequency_band || artist.sells_tickets != null || artist.price_band || artist.community_size_band
  const empty = claims.length === 0 && items.length === 0

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-6">
        <Wordmark />
        <Link to="/artist/home" className="text-sm text-muted">{T.common.back}</Link>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-1">
        <h1 className="text-xl font-bold text-soft">{T.claims.title}</h1>
        <span className="chip bg-accent/10 text-accent text-xs">{T.common.aiAssistedBeta}</span>
        {DEMO && <span className="chip bg-surface text-muted text-xs border border-line">{T.demo.sampleData}</span>}
      </div>
      <p className="text-sm text-muted mb-4">{T.claims.subtitle}</p>

      {/* Unpublished-changes banner — edits are private until re-published to the
          immutable public snapshot (so buyers never see silent mid-view changes). */}
      {artist.published && dirty && (
        <div className="card mb-4 border border-warn/40 bg-warn/10" role="status">
          <p className="font-bold text-warn">{T.claims.applyTitle}</p>
          <p className="text-xs text-muted mt-1 mb-3">{T.claims.applyBody}</p>
          <button className="btn-primary w-full" onClick={republish} disabled={republishing}>
            {republishing ? <Spinner /> : T.claims.applyCta}
          </button>
        </div>
      )}

      {/* Draw bands — firewall-safe, ALWAYS cross to the public דרכון. Show the
          artist exactly what's exposed (transparency); editing is via the profile. */}
      {hasDraw && (
        <div className="card mb-4 border border-line">
          <p className="text-xs font-bold uppercase tracking-wide text-accent mb-2">{T.claims.drawTitle}</p>
          <div className="space-y-1.5">
            {artist.lineup_frequency_band && <DrawLine label={T.passport.drawFrequency} value={artist.lineup_frequency_band} T={T} />}
            {artist.sells_tickets != null && <DrawLine label={T.passport.drawSellsTickets} value={artist.sells_tickets ? T.common.yes : T.common.no} T={T} />}
            {artist.price_band && <DrawLine label={T.passport.drawPrice} value={artist.price_band} T={T} />}
            {artist.community_size_band && <DrawLine label={T.passport.drawCommunity} value={artist.community_size_band} T={T} />}
          </div>
          <p className="text-xs text-muted mt-2">{T.claims.drawNote}</p>
          <Link to="/onboarding" className="text-xs text-[#657530] font-semibold mt-1 inline-flex items-center min-h-[40px]">{T.claims.drawEditHint}</Link>
        </div>
      )}

      {empty && (
        <div className="card text-center py-8">
          <p className="text-muted">{T.claims.noClaimsYet}</p>
          <Link to={`/evidence/${artist.id}`} className="btn-primary mt-4 inline-block">{T.evidence.title}</Link>
        </div>
      )}

      {/* A8 · needs review — the artist-approval gate comes first */}
      {pendingReview.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wide text-warn mb-1">{T.claims.needsReview} ({pendingReview.length})</p>
          <p className="text-xs text-muted mb-2">{T.claims.needsReviewHint}</p>
          <div className="space-y-2">
            {pendingReview.map((c) => (
              <ClaimRow key={c.id} claim={c} onToggle={toggle} toggling={toggling} T={T}
                canPublish={canPublish(c)} onApprove={approve} onCorrect={correctValue} onOmit={omit} onFlag={flag} />
            ))}
          </div>
        </div>
      )}

      {/* Passport-ok claims */}
      {passportOk.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wide text-ok mb-2">{T.claims.passportOk} ({passportOk.length})</p>
          <div className="space-y-2">
            {passportOk.map((c) => (
              <ClaimRow key={c.id} claim={c} onToggle={toggle} toggling={toggling} T={T}
                canPublish={canPublish(c)} onApprove={approve} onCorrect={correctValue} onOmit={omit} onFlag={flag} />
            ))}
          </div>
        </div>
      )}

      {/* Private (working-view) claims */}
      {mirrorOnly.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2">{T.claims.mirrorOnly} ({mirrorOnly.length})</p>
          <div className="space-y-2">
            {mirrorOnly.map((c) => (
              <ClaimRow key={c.id} claim={c} onToggle={toggle} toggling={toggling} T={T}
                canPublish={canPublish(c)} onApprove={approve} onCorrect={correctValue} onOmit={omit} onFlag={flag} />
            ))}
          </div>
        </div>
      )}

      {/* Track-record items — same Mirror↔Passport control as claims */}
      {items.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wide text-soft mb-2">{T.claims.itemsTitle} ({items.length})</p>
          <div className="space-y-2">
            {items.map((i) => <ItemRow key={i.id} item={i} onToggle={toggleItem} toggling={toggling} T={T} />)}
          </div>
        </div>
      )}

      {!empty && (
        <Link to={`/passport/${artist.id}`} className="btn-primary w-full mt-4 block text-center">
          {T.dashboard.viewPublic}
        </Link>
      )}
    </PageShell>
  )
}

function DrawLine({ label, value, T }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-soft">{label}: <span className="font-medium">{value}</span></span>
      <span className="chip bg-ok/15 text-ok text-xs shrink-0">{T.claims.alwaysVisible}</span>
    </div>
  )
}

function VisibilityToggle({ isPassportOk, busy, onClick, T }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`chip shrink-0 min-h-[40px] px-3 py-1.5 text-xs font-bold transition ${
        isPassportOk ? 'bg-ok/20 text-ok hover:bg-ok/30' : 'bg-surface text-muted hover:bg-line'
      }`}
    >
      {isPassportOk ? T.claims.passportOk : T.claims.mirrorOnly}
    </button>
  )
}

function ItemRow({ item, onToggle, toggling, T }) {
  const isPassportOk = item.visibility === VISIBILITY.PASSPORT_OK
  const busy = toggling === item.id
  return (
    <div className={`card transition ${busy ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-soft text-sm font-medium truncate">{item.title}{item.item_date ? ` · ${item.item_date}` : ''}</p>
          <div className="mt-1">
            <SourceLabel status={item.source_status === SOURCE_STATUS.PUBLIC_VERIFIED ? 'supporting' : 'self-reported'} />
          </div>
        </div>
        <VisibilityToggle isPassportOk={isPassportOk} busy={busy} onClick={() => onToggle(item)} T={T} />
      </div>
    </div>
  )
}

function ClaimRow({ claim, onToggle, toggling, T, canPublish, onApprove, onCorrect, onOmit, onFlag }) {
  const isPassportOk = claim.visibility === VISIBILITY.PASSPORT_OK
  const busy = toggling === claim.id
  const isConfirmed = claim.method_label === 'producer-confirmed'
  const isFlagged = claim.status === 'disputed'
  const needsReview = !claim.artist_approved
  const LS_KEY = `gp_confirm_${claim.id}`

  const [correcting, setCorrecting] = useState(false)
  const [correctVal, setCorrectVal] = useState(claim.value || '')
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  // Persist generated link across navigation; clear when confirmed.
  const [link, setLinkRaw] = useState(() => isConfirmed ? '' : (localStorage.getItem(LS_KEY) || ''))
  const [reqBusy, setReqBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reqError, setReqError] = useState('')

  function setLink(val) {
    setLinkRaw(val)
    if (val) localStorage.setItem(LS_KEY, val)
    else localStorage.removeItem(LS_KEY)
  }

  useEffect(() => {
    if (isConfirmed) localStorage.removeItem(LS_KEY)
  }, [isConfirmed, LS_KEY])

  async function generate() {
    if (reqBusy) return
    setReqError('')
    if (DEMO) {
      setLink(`${window.location.origin}/confirm/demo-token-preview`)
      return
    }
    setReqBusy(true)
    try {
      const res = await fetch('/api/request-confirmation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId: claim.id, producerContact: email || null }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json.path) setLink(`${window.location.origin}${json.path}`)
      else setReqError(json.error || T.producer.serverOffline)
    } catch { setReqError(T.producer.serverOffline) } finally { setReqBusy(false) }
  }

  const hasPending = !isConfirmed && !!link

  return (
    <div className={`card transition ${busy ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* a naked band ("180–260") tells the artist nothing — always lead with
              WHAT is being claimed (type label), then the band + its wording */}
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{(claim.claim_type || '').replace(/[-_]/g, ' ')}</p>
          <p className="text-soft text-sm font-medium truncate">
            {claim.value
              ? (claim.public_wording ? `${claim.value} — ${claim.public_wording}` : claim.value)
              : (claim.public_wording || (claim.claim_type || '').replace(/[-_]/g, ' '))}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <SourceLabel status={claim.verification_status} methodLabel={claim.method_label} expiresAt={claim.expires_at} />
            {/* only when SourceLabel doesn't already say it — no double ★ */}
            {isConfirmed && claim.method_label !== 'producer-confirmed' && (
              <span className="chip bg-accent/20 text-[#657530] text-xs font-bold">★ {T.methodLabel['producer-confirmed']}</span>
            )}
            {claim.artist_approved && (
              <span className="chip bg-ok/15 text-ok text-xs">✓ {T.claims.approvedChip}</span>
            )}
            {isFlagged && (
              <span className="chip bg-warn/15 text-warn text-xs">⚑ {T.claims.flaggedChip}</span>
            )}
            {hasPending && (
              <span className="chip bg-warn/15 text-warn text-xs">⏳ {T.producer.pendingChip}</span>
            )}
            {claim.reason_code && <span className="text-xs text-muted truncate">{String(claim.reason_code).replace(/[-_]/g, ' ')}</span>}
          </div>
        </div>
        {/* the toggle only offers "go public" when the claim is confirmed AND verified/supporting */}
        <VisibilityToggle
          isPassportOk={isPassportOk}
          busy={busy || (!isPassportOk && !canPublish)}
          onClick={() => onToggle(claim)}
          T={T}
        />
      </div>

      {/* "what this supports / does not establish" — honesty text travels with the claim */}
      {claim.limitation_text && (
        <p className="mt-2 text-[11px] text-muted"><span className="font-semibold">{T.claims.limitationLabel}:</span> {claim.limitation_text}</p>
      )}

      {/* why can't this go public? */}
      {!isPassportOk && !canPublish && !isFlagged && (
        <p className="mt-2 text-[11px] text-muted">
          {needsReview ? T.claims.notApprovedHint : T.claims.selfReportedNoPassport}
        </p>
      )}

      {/* A8 review actions — shown until the artist decides */}
      {needsReview && !isFlagged && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
          <button className="btn-primary flex-1 min-w-[110px] text-sm" onClick={() => onApprove(claim)} disabled={busy}>
            {busy ? <Spinner /> : `✓ ${T.claims.approve}`}
          </button>
          <button className="btn-ghost text-sm" onClick={() => setCorrecting((v) => !v)} disabled={busy}>{T.claims.correct}</button>
          <button className="btn-ghost text-sm" onClick={() => onFlag(claim)} disabled={busy}>{T.claims.flag}</button>
          <button className="btn-ghost text-sm text-warn" onClick={() => onOmit(claim)} disabled={busy}>{T.claims.omit}</button>
        </div>
      )}
      {isFlagged && (
        <div className="mt-3 flex gap-2 border-t border-line pt-3">
          <button className="btn-ghost text-sm text-warn" onClick={() => onOmit(claim)} disabled={busy}>{T.claims.omit}</button>
        </div>
      )}
      {correcting && needsReview && (
        <div className="mt-2 flex gap-2">
          <input className="field flex-1 text-sm" value={correctVal} onChange={(e) => setCorrectVal(e.target.value)} />
          <button className="btn-ghost text-sm" onClick={() => { onCorrect(claim, correctVal); setCorrecting(false) }} disabled={busy}>
            {T.claims.correctSave}
          </button>
        </div>
      )}

      {!isConfirmed && (
        <button className="text-xs text-muted mt-1 min-h-[40px] hover:text-soft" onClick={() => setOpen((o) => !o)}>
          {T.producer.requestTitle}
        </button>
      )}
      {open && !isConfirmed && (
        <div className="mt-2 border-t border-line pt-2">
          {reqError && <p className="text-xs text-void mb-2">{reqError}</p>}
          {link ? (
            <>
              <p className="text-xs text-muted mb-1">{T.producer.linkReady}</p>
              <p className="text-xs text-[#657530] break-all" dir="ltr">{link}</p>
              <div className="flex gap-2 mt-2">
                <button className="btn-ghost text-xs flex-1" onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500) }}>
                  {copied ? T.producer.copied : T.producer.copyLink}
                </button>
                <button className="text-xs text-muted hover:text-warn px-2" onClick={() => setLink('')} aria-label="clear">×</button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-muted mb-2">{T.producer.requestHelp}</p>
              <input className="field text-sm" type="email" dir="ltr" placeholder={T.producer.requestEmail}
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn-primary w-full text-sm mt-2" onClick={generate} disabled={reqBusy}>
                {reqBusy ? <Spinner /> : T.producer.requestCta}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
