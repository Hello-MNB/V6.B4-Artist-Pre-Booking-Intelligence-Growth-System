import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateClaim, updateAct, addProfileItem } from '../../lib/db.js'
import { uploadFile } from '../../lib/storage.js'
import { BottomSheet, Spinner, GpIcon, PlatformMark, platformOf } from '../../components/ui.jsx'
import { useLang } from '../../context/LangContext.jsx'
import { PLANETS, NODE, buildUniverse, deriveWorlds, bandFromCount } from '../../lib/radarUniverse.js'

// ── The Radar Universe (Radar-Interface-Design-Spec v2.1) — MOBILE FIRST ─────
// Artist PHOTO at the center (they are the center of the universe) · 6 planets
// with bounded state rings · established planets carry a VERY subtle ✓ mark
// (accomplishment, never gamification) · planet drill-in opens as a FULL
// OVERLAY above the radar — the canvas never reflows, nothing jumps.
// Two filter axes: STATE chips + WORLDS tags (an artist lives in several
// content worlds — techno · festivals · weddings — tags subset, never rank).
// FIREWALL: no numbers, no fills, no position, no peer comparison. Ever.

const RING = {
  established: 'border-[#3E6B49]',
  developing: 'border-white/20',
  needs: 'border-accent',
}
const NODE_CHIP = {
  [NODE.CONFIRMED]: { icon: '✓', c: 'bg-[#DFF2D8] text-[#295B32]' },
  [NODE.FOUND]: { icon: '✦', c: 'bg-accent text-ink' },
  [NODE.REVIEW]: { icon: '?', c: 'bg-[#FFF0D9] text-[#8A591B]' },
  [NODE.MISSING]: { icon: '+', c: 'bg-[#F2E6DC] text-[#8A5432]' },
}

export default function RadarUniverse({ artist, items, claims, onClaimsChange, nextAction, onNextAction, onArtistChange, onItemsRefresh }) {
  const { T } = useLang()
  const S = T.radar.universe
  const nav = useNavigate()
  const [selected, setSelected] = useState(null)       // planet key → opens the OVERLAY
  const [filter, setFilter] = useState('needsYou')
  const [world, setWorld] = useState(null)             // world tag filter (null = all)
  const [card, setCard] = useState(null)
  const [undo, setUndo] = useState(null)
  const [savedFlash, setSavedFlash] = useState(false)
  const undoRef = useRef(null)
  const flashRef = useRef(null)

  function flashSaved() {
    clearTimeout(flashRef.current)
    setSavedFlash(true)
    flashRef.current = setTimeout(() => setSavedFlash(false), 2500)
  }

  const uni = useMemo(() => buildUniverse({ artist, items, claims, T }), [artist, items, claims, T])
  const worlds = useMemo(() => deriveWorlds({ artist, items }), [artist, items])
  const evidenceRoute = `/evidence/${artist.id}`

  // lock body scroll while the planet overlay is open (mobile flawlessness)
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  const matchesFilter = (n) =>
    (filter === 'all' ? true :
      filter === 'needsYou' ? (n.state === NODE.FOUND || n.state === NODE.REVIEW) :
      filter === 'found' ? n.state === NODE.FOUND :
      filter === 'missing' ? n.state === NODE.MISSING :
      n.state === NODE.CONFIRMED) &&
    (!world || (n.worlds || []).includes(world))

  const blossom = claims.length === 0 && items.filter((i) => i.item_type === 'link').length === 0

  async function confirm(node) {
    if (!node?.claim) return
    const c = node.claim
    await updateClaim(c.id, { artist_approved: true })
    onClaimsChange((prev) => prev.map((x) => x.id === c.id ? { ...x, artist_approved: true } : x))
    setCard(null)
    clearTimeout(undoRef.current)
    setUndo({ claim: c })
    undoRef.current = setTimeout(() => setUndo(null), 6000)
  }
  async function undoConfirm() {
    if (!undo) return
    clearTimeout(undoRef.current)
    await updateClaim(undo.claim.id, { artist_approved: false })
    onClaimsChange((prev) => prev.map((x) => x.id === undo.claim.id ? { ...x, artist_approved: false } : x))
    setUndo(null)
  }
  const pauseUndo = () => clearTimeout(undoRef.current)
  const resumeUndo = () => { if (undo) undoRef.current = setTimeout(() => setUndo(null), 3000) }

  function nodeAction(node) {
    if (node.state === NODE.FOUND || node.state === NODE.REVIEW) return confirm(node)
    setCard(null)
    setSelected(null)
    if (node.evidence) return nav(evidenceRoute)
    if (node.to) return nav(node.to)
  }

  const sel = selected ? uni.planets[selected] : null
  const batchable = sel ? sel.nodes.filter((n) => n.state === NODE.FOUND) : []
  const [batchOpen, setBatchOpen] = useState(false)

  // The drill-in shows the planet's FULL picture — actionable first. Filters
  // steer the canvas only; hiding nodes inside a planet just costs clicks.
  const STATE_ORDER = { [NODE.FOUND]: 0, [NODE.REVIEW]: 1, [NODE.MISSING]: 2, [NODE.CONFIRMED]: 3 }
  const overlayNodes = sel ? [...sel.nodes].sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state]) : []

  return (
    <div className="relative mb-5 overflow-hidden rounded-xl bg-[#131A15] p-4">
      {/* ONE control row: state filters + worlds DROPDOWN (mobile: no room for two rows) */}
      <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="radar filters">
        {['needsYou', 'found', 'missing', 'confirmed', 'all'].map((f) => (
          <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3 py-1 font-mono text-[10px] font-medium transition-colors ${
              filter === f ? 'bg-accent text-ink' : 'bg-white/5 text-[#AEB9AD] hover:bg-white/10'
            }`}>
            {S.filters[f]}
          </button>
        ))}
        {worlds.length > 0 && (
          <select
            value={world || ''}
            onChange={(e) => setWorld(e.target.value || null)}
            aria-label={S.worldsHint}
            className={`ms-auto shrink-0 appearance-none rounded-full border bg-[#131A15] px-3 py-1 font-mono text-[10px] outline-none ${
              world ? 'border-accent text-accent' : 'border-white/15 text-[#89958A]'
            }`}>
            <option value="">{S.allWorlds}</option>
            {worlds.map((w) => <option key={w} value={w}>{w.toUpperCase()}</option>)}
          </select>
        )}
      </div>

      {blossom ? (
        <div className="py-10 text-center">
          <CenterStar artist={artist} T={T} dim />
          <h3 className="font-display mt-5 text-lg text-[#EEF4E7]">{S.blossomTitle}</h3>
          <p className="mx-auto mt-1 max-w-[300px] text-xs leading-relaxed text-[#AEB9AD]">{S.blossomBody}</p>
          <button className="btn-primary mt-4 text-xs px-4 py-2.5" onClick={() => nav(evidenceRoute)}>{S.blossomCta}</button>
        </div>
      ) : (
        /* ── THE UNIVERSE — always mounted, never reflows ── */
        <div className="relative mx-auto aspect-square max-w-[400px]">
          <div className="absolute inset-[9%] rounded-full border border-white/[0.07]" aria-hidden />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <CenterStar artist={artist} T={T} />
          </div>
          {PLANETS.map((p) => {
            const info = uni.planets[p.key]
            const rad = (p.angle * Math.PI) / 180
            const x = 50 + 41 * Math.cos(rad)
            const y = 50 + 41 * Math.sin(rad)
            const dimmed = !info.nodes.some(matchesFilter) && (filter !== 'all' || world)
            const complete = info.state === 'established' && info.foundCount === 0 &&
              !info.nodes.some((n) => n.state === NODE.MISSING)
            return (
              <button key={p.key}
                onClick={() => setSelected(p.key)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-300 ${dimmed ? 'opacity-25' : 'opacity-100'}`}
                aria-label={`${S.planets[p.key]} — ${S.state[info.state]}${complete ? ` · ${S.complete}` : ''}`}>
                <span className={`relative mx-auto grid h-14 w-14 place-items-center rounded-full border-2 bg-[#1B241D] transition-transform hover:scale-105 ${RING[info.state]} ${info.foundCount > 0 ? 'shadow-[0_0_18px_rgba(200,240,77,0.25)]' : ''}`}>
                  <GpIcon id={p.icon} className="h-6 w-6 text-[#EEF4E7]" />
                  {info.foundCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent font-mono text-[9px] font-bold text-ink">✦</span>
                  )}
                  {/* accomplishment — deliberately quiet: a small settled ✓, no glow, no animation */}
                  {complete && (
                    <span aria-hidden className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#24402C] text-[8px] text-[#9FD3A8] ring-1 ring-[#131A15]">✓</span>
                  )}
                </span>
                <span className="mt-1.5 block w-20 font-mono text-[8px] uppercase tracking-[0.08em] text-[#89958A] leading-tight">
                  {S.planets[p.key]}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── ONE next move — folded INTO the canvas (1-screen mobile) ── */}
      {!blossom && nextAction && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <div className="min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#89958A]">{T.radar.nextActionEyebrow}</p>
            <p className="truncate text-sm font-semibold text-[#EEF4E7]">{nextAction.title}</p>
          </div>
          {nextAction.to && (
            <button className="btn-primary shrink-0 px-3 py-2 text-xs" onClick={() => onNextAction?.(nextAction)}>
              {T.common.continue}
            </button>
          )}
        </div>
      )}

      {/* undo toast */}
      {undo && (
        <div role="status" tabIndex={0} onMouseEnter={pauseUndo} onMouseLeave={resumeUndo} onFocus={pauseUndo} onBlur={resumeUndo}
          className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-3 rounded-md bg-[#DFF2D8] px-3 py-2 text-xs font-semibold text-[#295B32]">
          <span className="truncate">✓ {S.confirmedToast}</span>
          <button className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.08em] underline" onClick={undoConfirm}>
            {S.undo}
          </button>
        </div>
      )}

      {/* ── PLANET OVERLAY — a screen ABOVE the radar; nothing underneath moves ── */}
      {selected && (
        <div className="fixed inset-0 z-40 flex flex-col bg-paper animate-fade-in" role="dialog" aria-modal="true" aria-label={S.planets[selected]}>
          <div className="flex items-center justify-between border-b border-line px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <button className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted hover:text-ink min-h-[44px]" onClick={() => setSelected(null)}>
              {S.backToUniverse}
            </button>
            <span className="font-display text-base text-ink">{S.planets[selected]}</span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {batchable.length >= 2 && (
              <button className="btn-primary mb-3 w-full text-xs py-2.5" onClick={() => setBatchOpen(true)}>
                ✦ {S.reviewAll(batchable.length)}
              </button>
            )}
            <div className="space-y-1.5">
              {overlayNodes.map((n) => (
                <button key={n.id} onClick={() => setCard(n)}
                  className="flex w-full items-center gap-3 rounded-md border border-line bg-card px-3 py-3 text-start transition-colors hover:border-accent min-h-[52px]">
                  {n.url
                    ? <PlatformMark platform={platformOf(n.url)} />
                    : <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-muted"><GpIcon id={PLANETS.find((p) => p.key === selected)?.icon || 'gp-source'} className="h-4 w-4" /></span>}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{n.label}</span>
                    <span className="block truncate text-[11px] text-muted">{n.sub}</span>
                  </span>
                  <span className={`chip shrink-0 text-[10px] ${NODE_CHIP[n.state].c}`}>{NODE_CHIP[n.state].icon}</span>
                </button>
              ))}
              {overlayNodes.length === 0 && (
                <p className="py-6 text-center font-mono text-[10px] text-muted">—</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Impact Card — above the overlay */}
      <BottomSheet open={!!card} onClose={() => setCard(null)} title={card?.label || ''}>
        {card && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              {card.url && <PlatformMark platform={platformOf(card.url)} size="h-6 w-6" />}
              <span className={`chip text-[10px] ${NODE_CHIP[card.state].c}`}>{NODE_CHIP[card.state].icon}</span>
              <span className="text-xs text-muted">{card.sub}</span>
            </div>
            <p className="label">{S.whatItProves}</p>
            <p className="mb-3 text-sm text-soft">{card.proves}</p>
            <p className="label">{S.whatItDoesNotProve}</p>
            <p className="mb-4 text-sm text-muted">{card.notProves}</p>

            {/* MISSING + fillable → the form lives RIGHT HERE. No screen swaps. */}
            {card.state === NODE.MISSING && card.fill ? (
              <MissingFill
                node={card} artist={artist} S={S}
                onArtistChange={onArtistChange}
                onItemsRefresh={onItemsRefresh}
                onDone={() => { setCard(null); flashSaved() }}
              />
            ) : card.state === NODE.MISSING && card.evidence ? (
              <button className="btn-primary w-full" onClick={() => nodeAction(card)}>{S.fill.openEvidence}</button>
            ) : (
              <button className="btn-primary w-full" onClick={() => nodeAction(card)}>
                {card.state === NODE.FOUND || card.state === NODE.REVIEW ? `✦ ${S.confirmCta}` : S.viewCta}
              </button>
            )}
          </div>
        )}
      </BottomSheet>

      {/* saved-in-place flash */}
      {savedFlash && (
        <div role="status" className="absolute inset-x-3 bottom-3 z-10 rounded-md bg-[#DFF2D8] px-3 py-2 text-xs font-semibold text-[#295B32]">
          ✓ {S.fill.savedInPlace}
        </div>
      )}

      {/* batch confirm */}
      <BottomSheet open={batchOpen} onClose={() => setBatchOpen(false)} title={selected ? S.planets[selected] : ''}>
        <div className="space-y-2">
          {batchable.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2.5">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-soft">{n.label}</span>
                <span className="block truncate text-[11px] text-muted">{n.proves}</span>
              </span>
              <button className="btn-primary shrink-0 px-3 py-2 text-xs" onClick={() => confirm(n)}>✦ {S.confirmCta}</button>
            </div>
          ))}
          {batchable.length === 0 && <p className="py-3 text-center text-xs text-muted">✓</p>}
        </div>
      </BottomSheet>
    </div>
  )
}

// ── MissingFill — the in-place fill form inside the Impact Card ──────────────
// One node = one tiny form. Saving updates the data and the node flips to ✓
// without ever leaving the Radar. (Ticket exports stay in the evidence flow —
// they carry the third-party consent gate.)
function MissingFill({ node, artist, S, onArtistChange, onItemsRefresh, onDone }) {
  const { kind, field, max, placeholder } = node.fill
  const [v, setV] = useState('')
  const [v2, setV2] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function run(fn) {
    setBusy(true); setErr('')
    try { await fn(); onDone() }
    catch (e) { setErr(e.message || 'error') }
    finally { setBusy(false) }
  }

  const saveArtist = (patch) => run(async () => { await onArtistChange(patch) })

  async function onPhotoFile(e) {
    const file = e.target.files?.[0]; if (!file) return
    run(async () => {
      const { url } = await uploadFile('public-media', artist.created_by || artist.id, file)
      await onArtistChange({ photo_url: url })
    })
  }

  return (
    <div className="space-y-2">
      {kind === 'boolean' && (
        <button className="btn-primary w-full" disabled={busy} onClick={() => saveArtist({ [field]: true })}>
          {busy ? <Spinner /> : S.fill.invoiceYes}
        </button>
      )}

      {(kind === 'text' || kind === 'url') && (
        <>
          <input className="field" dir={kind === 'url' ? 'ltr' : undefined} maxLength={max}
            placeholder={kind === 'url' ? S.fill.urlPlaceholder : (placeholder || node.label)}
            value={v} onChange={(e) => setV(e.target.value)} />
          <button className="btn-primary w-full" disabled={busy || !v.trim()} onClick={() => saveArtist({ [field]: v.trim() })}>
            {busy ? <Spinner /> : S.fill.save}
          </button>
        </>
      )}

      {kind === 'photo' && (
        <>
          <input type="file" accept="image/*" onChange={onPhotoFile} className="text-sm text-muted" />
          <p className="text-[11px] text-muted">{S.fill.photoOr}</p>
          <input className="field" dir="ltr" placeholder={S.fill.urlPlaceholder} value={v} onChange={(e) => setV(e.target.value)} />
          {v.trim() && (
            <button className="btn-primary w-full" disabled={busy} onClick={() => saveArtist({ photo_url: v.trim() })}>
              {busy ? <Spinner /> : S.fill.save}
            </button>
          )}
        </>
      )}

      {kind === 'number' && (
        <>
          <input className="field" type="number" min="1" inputMode="numeric"
            placeholder={S.fill.numberPlaceholder} value={v} onChange={(e) => setV(e.target.value)} />
          <button className="btn-primary w-full" disabled={busy || !(parseInt(v, 10) > 0)}
            onClick={() => run(async () => {
              const n = parseInt(v, 10)
              await updateAct(artist.id, { community_count_declared: n }) // integer stays working-only
              await onArtistChange({ community_size_band: bandFromCount(n) }) // only the band goes anywhere
            })}>
            {busy ? <Spinner /> : S.fill.save}
          </button>
        </>
      )}

      {kind === 'event' && (
        <>
          <input className="field" placeholder={S.fill.eventTitle} value={v} onChange={(e) => setV(e.target.value)} />
          <input className="field" type="date" aria-label={S.fill.eventDate} value={v2} onChange={(e) => setV2(e.target.value)} />
          <button className="btn-primary w-full" disabled={busy || !v.trim()}
            onClick={() => run(async () => {
              await addProfileItem({ artist_id: artist.id, item_type: 'event', title: v.trim(), item_date: v2 || null, visibility: 'passport-ok', source_status: 'artist-provided' })
              await onItemsRefresh?.()
            })}>
            {busy ? <Spinner /> : S.fill.save}
          </button>
        </>
      )}

      {kind === 'link' && (
        <>
          <input className="field" dir="ltr" placeholder={S.fill.urlPlaceholder} value={v} onChange={(e) => setV(e.target.value)} />
          <button className="btn-primary w-full" disabled={busy || !/^https?:\/\//i.test(v.trim())}
            onClick={() => run(async () => {
              await addProfileItem({ artist_id: artist.id, item_type: 'link', title: 'link', public_url: v.trim(), visibility: 'passport-ok', source_status: 'artist-provided' })
              await onItemsRefresh?.()
            })}>
            {busy ? <Spinner /> : S.fill.save}
          </button>
        </>
      )}

      {err && <p className="text-xs text-warn" role="alert">{err}</p>}
    </div>
  )
}

function CenterStar({ artist, T, dim }) {
  // The artist IS the center of the universe — photo first, always.
  return (
    <div className={`text-center transition-opacity ${dim ? 'opacity-50' : ''}`}>
      {artist.photo_url
        ? <img src={artist.photo_url} alt="" className="mx-auto h-20 w-20 rounded-full border-2 border-accent object-cover shadow-[0_0_24px_rgba(200,240,77,0.18)]" />
        : <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-accent bg-[#1B241D] font-display text-xl text-[#EEF4E7]">
            {(artist.stage_name || '★').slice(0, 1)}
          </span>}
      <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.1em] text-[#89958A]">
        {artist.stage_name || T.radar.universe.you}
      </span>
    </div>
  )
}
