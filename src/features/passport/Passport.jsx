import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Wordmark, Loading, SourceLabel, LanguageToggle, BottomSheet, PageShell, PlatformMark, platformOf, GpIcon } from '../../components/ui.jsx'
import { useLang } from '../../context/LangContext.jsx'
import { SOURCE_STATUS } from '../../lib/constants.js'
import { DEMO } from '../../lib/demo.js'
import { getPublicPassport, recordPassportView, recordProfessionalReaction } from '../../lib/db.js'

// ── A15 · The public Passport (canon block order · CODEX Proof Lime) ─────────
// Public, buyer-facing, no login. Reads LIVE via anon + RLS; the firewall is
// physical (published-gate + passport-ok RLS + 016/025 column grants).
// RENDER LAW: a section with nothing verified is REMOVED from the DOM — the
// public face never shows "missing", "building" or any gap. Bands only.
// Opening the page writes passport_view_event; ONLY an explicit action writes
// professional_reaction (canon P0-5 — a view is not a reaction).

const isBand = (v = '') => /^[\d,.]+\s*[–-]\s*[\d,.]+/.test(String(v).trim())

export default function Passport() {
  const { T } = useLang()
  const { id } = useParams()
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [artist, setArtist] = useState(null)
  const [items, setItems] = useState([])
  const [claims, setClaims] = useState([])
  const [sheet, setSheet] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await getPublicPassport(id)
        if (!alive) return
        setArtist(data.artist)
        setItems(data.items ?? [])
        setClaims(data.claims ?? [])
        if (data.artist?.published) recordPassportView(id) // measurement, never blocks
      } catch { /* artist stays null → shows not-found */ }
      finally { if (alive) setLoading(false) }
    })()
    return () => { alive = false }
  }, [id])

  if (loading) return <Loading />
  if (!artist || !artist.published) {
    return <PageShell><Wordmark className="mb-6" /><p className="text-muted">{T.passport.notFound}</p></PageShell>
  }

  const exp = items.filter((i) => !['link', 'draw_signal'].includes(i.item_type))
  const links = items.filter((i) => i.item_type === 'link')

  // draw evidence: passport-ok claims (strongest first: producer-confirmed → verified → supporting)
  const order = { 'producer-confirmed': 0 }
  const vOrder = { verified: 1, supporting: 2 }
  const drawClaims = [...claims].sort((a, b) =>
    (order[a.method_label] ?? vOrder[a.verification_status] ?? 3) - (order[b.method_label] ?? vOrder[b.verification_status] ?? 3))
  const drawBands = [
    artist.lineup_frequency_band && { value: artist.lineup_frequency_band, ctx: T.passport.drawFrequency },
    artist.sells_tickets != null && { value: artist.sells_tickets ? T.common.yes : T.common.no, ctx: T.passport.drawSellsTickets },
    artist.price_band && { value: artist.price_band, ctx: T.passport.drawPrice },
  ].filter(Boolean)
  const hasDraw = drawClaims.length > 0 || drawBands.length > 0
  const hasReadiness = artist.set_length || artist.regions || artist.invoice_ready

  // action sheet — primary actions continue to the request form; the rest record only
  async function act(actionType, label, { toRequest = false } = {}) {
    if (busy) return
    setBusy(true)
    try {
      await recordProfessionalReaction(id, actionType)
      if (toRequest) { setSheet(false); nav(`/passport/${id}/request`); return }
      setReceipt(label)
    } catch { setReceipt(label) } // reaction is best-effort for the visitor
    finally { setBusy(false) }
  }

  return (
    <div className="min-h-full bg-paper pb-24">
      <div className="mx-auto max-w-[480px] px-5">

        {/* ── ① IDENTITY — the passport header ── */}
        <header className="border-b-[3px] border-ink pb-4 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#657530]">{T.passport.eyebrow}</p>
          <div className="mt-3 flex items-center gap-4">
            {artist.photo_url && (
              <img src={artist.photo_url} alt=""
                className="h-[88px] w-[88px] shrink-0 rounded-xl object-cover ring-2 ring-accent ring-offset-2 ring-offset-paper" />
            )}
            <div className="min-w-0">
              <h1 className="font-display text-[clamp(1.6rem,7vw,2.2rem)] leading-[1.02] text-ink">{artist.stage_name}</h1>
              {artist.one_line && <p className="mt-1 text-sm text-muted">{artist.one_line}</p>}
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                {[artist.genre, artist.city].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        </header>

        {/* ── ② LIVE DRAW ★ the hero evidence block ── */}
        {hasDraw && (
          <PassportSection icon="gp-live" label={T.passport.liveDraw} caption={T.passport.drawCaption}>
            {drawClaims.map((c, i) => (
              <ProofUnit key={c.id} hero={i === 0}
                value={c.public_band || c.value}
                context={c.public_wording || (c.claim_type || '').replace(/[-_]/g, ' ')}
                status={c.verification_status}
                methodLabel={c.method_label}
                reviewedAt={c.verified_at}
                T={T}
              />
            ))}
            {drawBands.map((b, i) => (
              <ProofUnit key={`band-${i}`} hero={drawClaims.length === 0 && i === 0}
                value={b.value} context={b.ctx} status="self-reported" T={T} />
            ))}
          </PassportSection>
        )}

        {/* ── ③ PERFORMANCE — track record ── */}
        {exp.length > 0 && (
          <PassportSection icon="gp-artist" label={T.passport.performance}>
            {exp.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-3 border-b border-ink/[0.07] py-3 last:border-0">
                <span className="min-w-0 truncate text-sm text-ink">{i.title}{i.item_date ? <span className="text-muted"> · {i.item_date}</span> : null}</span>
                <SourceLabel status={i.source_status === SOURCE_STATUS.PUBLIC_VERIFIED ? 'supporting' : 'self-reported'} />
              </div>
            ))}
          </PassportSection>
        )}

        {/* ── ④ COMMUNITY — contextual, explicitly NOT draw evidence ── */}
        {artist.community_size_band && (
          <PassportSection icon="gp-audience" label={T.passport.community} caption={T.passport.communityCaption}>
            <ProofUnit value={artist.community_size_band} context={T.passport.drawCommunity} status="self-reported" T={T} />
          </PassportSection>
        )}

        {/* ── ⑤ MUSIC — context strip: platform names only, never raw URLs ── */}
        {links.length > 0 && (
          <PassportSection icon="gp-source" label={T.passport.music}>
            <div className="flex flex-wrap gap-2 pt-1">
              {links.map((l) => (
                <a key={l.id} href={l.public_url} target="_blank" rel="noreferrer"
                  className="chip gap-1.5 border border-line bg-card font-mono text-[10px] uppercase tracking-[0.06em] text-ink hover:border-accent">
                  <PlatformMark platform={platformOf(l.public_url)} size="h-5 w-5" />
                  {hostOf(l.public_url)} ↗
                </a>
              ))}
            </div>
          </PassportSection>
        )}

        {/* ── ⑥ BOOKABILITY — binaries; absent = omitted, never "missing" ── */}
        {hasReadiness && (
          <PassportSection icon="gp-booking" label={T.passport.readiness}>
            <div className="flex flex-wrap gap-2 pt-1">
              {artist.set_length && <span className="chip border border-line bg-card text-xs text-ink">{T.passport.setLabel}: {artist.set_length}</span>}
              {artist.regions && <span className="chip border border-line bg-card text-xs text-ink">{T.passport.regionsLabel}: {artist.regions}</span>}
              {artist.invoice_ready && <span className="chip border border-line bg-card text-xs text-ink">{T.passport.invoiceLabel}</span>}
            </div>
          </PassportSection>
        )}

        {/* ── FOOTER — the standing disclaimer ── */}
        <footer className="mt-8 border-t-2 border-ink pt-4 pb-2">
          <p className="font-mono text-[9px] leading-relaxed tracking-[0.06em] text-muted">{T.passport.disclaimer}</p>
          <Link to="/" className="mt-3 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#657530]">GIGPROOF · gigproof.co</Link>
        </footer>
      </div>

      {/* ── sticky single PRIMARY CTA → the action sheet (canon P0-6) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[480px] items-center gap-3">
          <LanguageToggle />
          <button className="btn-primary flex-1" onClick={() => { setReceipt(null); setSheet(true) }}>{T.passport.cta}</button>
        </div>
      </div>

      {/* ── the professional action sheet (B2 ladder) ── */}
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title={T.passport.sheetTitle}>
        {receipt ? (
          <p role="status" className="rounded-md bg-[#DFF2D8] px-3 py-3 text-sm font-semibold text-[#295B32]">
            ✓ {T.passport.receipt(receipt)}
          </p>
        ) : (
          <div>
            {/* PRIMARY — commercial intent → also creates an availability request */}
            <button className="btn-primary mb-2 w-full" disabled={busy}
              onClick={() => act('check_availability', T.passport.checkAvailability, { toRequest: true })}>
              {T.passport.checkAvailability}
            </button>
            <button className="btn-ghost mb-3 w-full" disabled={busy}
              onClick={() => act('request_price', T.passport.rungPrice, { toRequest: true })}>
              {T.passport.rungPrice}
            </button>
            <p className="label border-t border-line pt-3">{T.passport.sheetOther}</p>
            <div className="mt-1 grid grid-cols-1 gap-1.5">
              {[
                ['save', T.passport.rungSave],
                ['forward', T.passport.rungForward],
                ['future_fit', T.passport.rungFuture],
                ['request_proof', T.passport.rungNeedsProof],
                ['not_fit', T.passport.rungNotThis],
              ].map(([a, label]) => (
                <button key={a} className="btn-ghost min-h-[44px] text-sm" disabled={busy} onClick={() => act(a, label)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}

// ── ProofUnit — GIGPROOF's visual signature: claim · context · method · date ──
// Method label FIRST (the demo-page variant); band values render as BandPill.
function ProofUnit({ value, context, status, methodLabel, reviewedAt, hero, T }) {
  const reviewed = reviewedAt ? new Date(reviewedAt).toLocaleDateString('en-GB') : null

  // HERO — the strongest proof gets the CODEX dark-panel treatment: forest panel,
  // lime method chip (dark text on lime), band value large in paper. This is the
  // one "wow" moment a producer sees first — still bands-only, method-first.
  if (hero) {
    const key = methodLabel === 'producer-confirmed' ? 'producer-confirmed'
      : ['verified', 'supporting'].includes(status) ? 'evidence-supported'
      : 'artist-declared'
    const icon = key === 'producer-confirmed' ? '★' : key === 'evidence-supported' ? '✓' : '✎'
    return (
      <div className="mb-3 rounded-xl bg-forest p-4 shadow-[0_10px_28px_rgba(10,13,11,0.18)]">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="chip bg-accent px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-ink">
            <span aria-hidden="true">{icon}</span> {T.methodLabel[key]}
          </span>
          {reviewed && <span className="font-mono text-[9px] tracking-[0.06em] text-mist/80">{T.passport.reviewedShort(reviewed)}</span>}
        </div>
        {isBand(value)
          ? <span aria-label={`Audience draw: ${value}`} className="font-mono text-4xl font-bold tracking-[-0.01em] text-paper">{value}</span>
          : <p className="font-display text-2xl text-paper">{value}</p>}
        {context && <p className="mt-1 text-xs text-mist">{context}</p>}
      </div>
    )
  }

  return (
    <div className="border-b border-ink/[0.07] py-3 last:border-0">
      <div className="mb-1 flex items-center gap-2">
        <SourceLabel status={status} methodLabel={methodLabel} />
        {reviewed && <span className="font-mono text-[9px] tracking-[0.06em] text-muted">{T.passport.reviewedShort(reviewed)}</span>}
      </div>
      {isBand(value)
        ? <BandPill value={value} />
        : <p className="font-display text-base text-ink">{value}</p>}
      {context && <p className="mt-0.5 text-xs text-muted">{context}</p>}
    </div>
  )
}

// BandPill — text only. NO fill. NO gauge. NO width animation. Ever.
function BandPill({ value, lg }) {
  return (
    <span aria-label={`Audience draw: ${value}`}
      className={`font-mono font-bold tracking-[-0.01em] text-ink ${lg ? 'text-3xl' : 'text-lg'}`}>
      {value}
    </span>
  )
}

function PassportSection({ label, caption, icon, children }) {
  return (
    <section className="mt-6">
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        {icon && <GpIcon id={icon} className="h-3.5 w-3.5 shrink-0 text-[#657530]" />}
        {label}
      </p>
      {caption && <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-[#8A8578]">{caption}</p>}
      <div className="mt-2">{children}</div>
    </section>
  )
}

const hostOf = (url = '') => {
  // brand name when we know the platform ("open.spotify.com" must read SPOTIFY,
  // not OPEN); otherwise the full hostname — never a bare subdomain
  const p = platformOf(url)
  if (p) return p === 'apple' ? 'apple music' : p
  try { return new URL(url).hostname.replace('www.', '') } catch { return url.slice(0, 18) }
}
