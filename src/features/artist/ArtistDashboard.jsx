import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { getMyArtist, upsertArtist, listProfileItems, listClaims, publishPassport, unpublishArtist, hasConsent, recordConsentScope, getEntitlement } from '../../lib/db.js'
import { PageShell, Wordmark, Loading, EmptyState, ErrorState, LanguageToggle, BottomSheet } from '../../components/ui.jsx'
import { useLang } from '../../context/LangContext.jsx'
import { isPassportDirty, clearPassportDirty, markPassportDirty } from '../../lib/passportState.js'
import RadarUniverse from './RadarUniverse.jsx'

// ── A9 Artist Radar (canon LF-A1, linear) ────────────────────────────────────
// Bounded dimension states + ONE next action. FIREWALL: rule-based states only —
// no score, no %, no fill bars; a gap renders as an invitation, never a failure.

// ONE prioritized action — a coach's single clearest move, never a list of ten.
// (The bounded dimension picture now lives in the Universe's planets; the old
// linear list below the radar was duplication and was removed — R00, 7 Jul.)
function pickNextAction(artist, items, claims, T) {
  const A = T.radar.nextActions
  const links = items.filter((i) => i.item_type === 'link')
  const exp = items.filter((i) => i.item_type !== 'link')
  const pending = claims.filter((c) => !c.artist_approved)
  const supported = claims.filter((c) => ['verified', 'supporting'].includes(c.verification_status))

  if (pending.length > 0) return { ...A.reviewClaims, to: '/artist/claims' }
  if (supported.length === 0) return { ...A.draw, to: `/evidence/${artist.id}` }
  if (!artist.photo_url) return { ...A.photo, to: '/onboarding' }
  if (links.length === 0) return { ...A.links, to: '/onboarding' }
  if (exp.length < 3) return { ...A.experience, to: '/onboarding' }
  if (!artist.lineup_frequency_band) return { ...A.bands, to: '/onboarding' }
  return { ...A.done, to: null }
}

function DashHeader() {
  const { T } = useLang()
  return (
    <div className="flex items-center justify-between mb-6">
      <Wordmark />
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <Link to="/settings" className="text-sm text-muted hover:text-soft">{T.dashboard.settings}</Link>
      </div>
    </div>
  )
}

export default function ArtistDashboard() {
  const { T } = useLang()
  const { user } = useAuth()
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [artist, setArtist] = useState(null)
  const [items, setItems] = useState([])
  const [claims, setClaims] = useState([])
  const [ent, setEnt] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [pubError, setPubError] = useState('')
  const [loadError, setLoadError] = useState(false)
  const [needPubConsent, setNeedPubConsent] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [pubSheet, setPubSheet] = useState(false)

  async function load() {
    setLoadError(false)
    try {
      const a = await getMyArtist(user.id)
      setArtist(a)
      if (a) {
        setItems(await listProfileItems(a.id))
        setClaims(await listClaims(a.id))
        setEnt(await getEntitlement(a.id))
        setDirty(isPassportDirty(a.id))
      }
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [user.id])

  // in-place fill from the Universe writes through here (no screen swaps)
  async function saveArtist(patch) {
    const updated = await upsertArtist({ ...artist, ...patch, id: artist.id, created_by: artist.created_by })
    setArtist(updated)
    if (updated.published) { markPassportDirty(updated.id); setDirty(true) }
    return updated
  }
  async function refreshItems() { setItems(await listProfileItems(artist.id)) }

  // A11 readiness HARD-BLOCK (canon): publish is DISABLED at zero supported
  // claims — an empty public Passport must be impossible, not discouraged.
  const supportedCount = claims.filter((c) =>
    ['verified', 'supporting'].includes(c.verification_status) && c.artist_approved).length
  const canPublish = supportedCount > 0

  async function togglePublish() {
    if (publishing) return
    setPubError('')
    if (!artist.published && !canPublish) { setPubError(T.dashboard.readinessBlock); return }
    if (artist.published) {
      setPublishing(true)
      try {
        const updated = await unpublishArtist(artist)
        setArtist(updated)
      } catch (e) {
        setPubError(T.dashboard.publishError)
      } finally {
        setPublishing(false)
      }
      return
    }
    // Publishing on: require public-publish consent first (once).
    setPublishing(true)
    const ok = await hasConsent(user.id, 'public-publish')
    setPublishing(false)
    if (!ok) { setNeedPubConsent(true); return }
    await doPublish()
  }

  async function doPublish() {
    setPublishing(true)
    try {
      await publishPassport(artist.id) // server writes the immutable snapshot
      setArtist({ ...artist, published: true })
      clearPassportDirty(artist.id); setDirty(false)
    } catch (e) {
      setPubError(T.dashboard.publishError)
    } finally {
      setPublishing(false)
    }
  }

  async function agreeAndPublish() {
    try { await recordConsentScope(user.id, 'public-publish') } catch { /* non-blocking */ }
    setNeedPubConsent(false)
    await doPublish()
  }

  // Re-snapshot so visibility/claim edits reach the public Passport.
  async function refreshPublic() {
    if (publishing) return
    setPubError('')
    setPublishing(true)
    try {
      await publishPassport(artist.id)
      clearPassportDirty(artist.id); setDirty(false)
    } catch (e) {
      setPubError(T.dashboard.publishError)
    } finally {
      setPublishing(false)
    }
  }

  if (loading) return <Loading />
  if (loadError) return <PageShell><DashHeader /><ErrorState title={T.common.error} onRetry={() => { setLoading(true); load() }} /></PageShell>
  if (!artist || !artist.stage_name) {
    return (
      <PageShell>
        <DashHeader />
        <EmptyState title={T.dashboard.empty}
          action={<Link to="/onboarding" className="btn-primary">{T.common.continue}</Link>} />
      </PageShell>
    )
  }

  const nextAction = pickNextAction(artist, items, claims, T)

  return (
    <PageShell>
      <DashHeader />
      <h1 className="text-xl font-bold text-soft mb-0.5">{T.radar.artistTitle}</h1>
      <p className="text-xs text-muted mb-4">{T.radar.artistSubtitle}</p>

      {/* ── THE UNIVERSE — artist at center, 6 planets, one-tap confirm.
            1-SCREEN mobile: the next move lives INSIDE the canvas. ── */}
      <RadarUniverse artist={artist} items={items} claims={claims} onClaimsChange={setClaims}
        nextAction={nextAction} onNextAction={(a) => nav(a.to)}
        onArtistChange={saveArtist} onItemsRefresh={refreshItems} />

      {/* passport state — ONE line; controls live in a sheet, not on the screen */}
      <button
        onClick={() => setPubSheet(true)}
        className="mb-3 flex w-full items-center justify-between rounded-md border border-line bg-card px-3 py-2.5 text-start">
        <span className="text-xs text-muted">
          <span className={`me-2 inline-block h-2 w-2 rounded-full align-middle ${artist.published ? 'bg-[#608C45]' : 'bg-gap'}`} aria-hidden />
          <span className="font-semibold text-ink">{artist.published ? T.dashboard.statusActive : T.dashboard.statusOff}</span>
          {dirty && <span className="ms-2 text-warn font-semibold">⚠ {T.dashboard.unpublishedBadge}</span>}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#657530]">{T.dashboard.managePassport} ▸</span>
      </button>

      <BottomSheet open={pubSheet} onClose={() => setPubSheet(false)} title={T.dashboard.managePassport}>
      <div className="card border-0 p-0">
        <div className="flex items-center justify-between">
          <span className="text-soft">{artist.published ? T.dashboard.publishOn : T.dashboard.publishOff}</span>
          <button onClick={togglePublish} disabled={publishing || (!artist.published && !canPublish)}
            className={`chip min-h-[40px] px-4 py-2 transition ${publishing || (!artist.published && !canPublish) ? 'opacity-60' : ''} ${artist.published ? 'bg-ok/20 text-ok' : 'bg-surface text-muted'}`}>
            {publishing ? T.dashboard.publishing : artist.published ? T.dashboard.statusActive : T.dashboard.statusOff}
          </button>
        </div>
        {needPubConsent && (
          <div className="mt-3 rounded-xl border border-accent/40 bg-accent/10 p-3 text-start">
            <p className="font-bold text-soft mb-1">{T.consent.publishTitle}</p>
            <p className="text-xs text-muted mb-3">{T.consent.publishBody}</p>
            <div className="flex gap-2">
              <button className="btn-primary flex-1" onClick={agreeAndPublish} disabled={publishing}>{T.consent.publishAgree}</button>
              <button className="btn-ghost" onClick={() => setNeedPubConsent(false)} disabled={publishing}>{T.common.cancel}</button>
            </div>
          </div>
        )}
        {artist.published && (
          <>
            {dirty
              ? <p className="mt-3 text-xs font-bold text-warn"><span aria-hidden="true">⚠ </span>{T.dashboard.unpublishedBadge}</p>
              : <p className="mt-3 text-xs text-muted">{T.dashboard.publishedHint}</p>}
            <button onClick={refreshPublic} disabled={publishing}
              className={`mt-2 w-full text-sm ${dirty ? 'btn-primary' : 'btn-ghost'}`}>
              {T.dashboard.refreshPublic}
            </button>
          </>
        )}
        {pubError && <p className="mt-2 text-xs text-warn">{pubError}</p>}
        {/* commercial state folded here — a line, never a wall */}
        <p className="mt-3 border-t border-line pt-2 text-xs text-muted">
          {ent?.status === 'active'
            ? <>🌐 {T.offer.activeTitle}</>
            : ent?.status === 'pending'
              ? <>⏳ {T.offer.pendingTitle}</>
              : <Link to="/artist/offer" className="text-[#657530] font-semibold hover:underline">{T.offer.getPassport} · {T.offer.price}</Link>}
          {artist.published && (
            <Link to={`/passport/${artist.id}`} className="ms-3 text-[#657530] font-semibold hover:underline">{T.dashboard.viewPublic} →</Link>
          )}
        </p>
      </div>
      </BottomSheet>

      <p className="mt-6 text-center text-[11px] text-muted">{T.radar.privacyNote}</p>
    </PageShell>
  )

}
