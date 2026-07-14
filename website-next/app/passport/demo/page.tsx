// Passport demo — rebuilt per Codex exact rebuild brief §6 (2026-07-14),
// the highest-impact visual fix. The demo SELLS ARTIST PRESENCE FIRST,
// then trust context. Desktop order: hero (scene tag · name · positioning ·
// genre pills · CTA) → Radar universe strip → media tiles → strongest
// signals (3–5 ONLY) → method-labels explanation → footer/disclaimer.
// Mobile order: image → name+genre → first-screen CTA → fit line → radar
// strip → top-3 signals → media → method → footer.
//
// PLACEHOLDER RULE (brief §6): a real Passport must use artist-approved
// image/video only. This demo uses the Shidapu imagery copied from Drive
// into public/brand/artist-types/ plus repo atmosphere shots as stand-ins.
//
// Firewall: bands + binaries with method labels ONLY — never a count,
// score, rank, percentile or prediction.
// ALL copy lives in content/passport-demo.ts ({ en, he }); this page
// renders EN — locale wiring is a later wave and stays mechanical.

import type { Metadata } from 'next'
import Link from 'next/link'

import { Icon } from '@/components/marketing/icons'
import { passportDemoContent } from '@/content/passport-demo'

const t = passportDemoContent.en

const HERO_IMAGE = '/brand/artist-types/lockshow-artist-shidapu-goa-atmosphere-hero-v1.webp'
const PORTRAIT_IMAGE =
  '/brand/artist-types/lockshow-artist-shidapu-roy-sason-profile-official-v1.jpg'

export const metadata: Metadata = {
  alternates: { canonical: '/passport/demo' },
  title: t.meta.title,
  description: t.meta.description,
}

// ── Small building blocks ───────────────────────────────────────────────────

function MonoLabel({
  children,
  color = 'var(--color-stamp)',
}: {
  children: string
  color?: string
}) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-space-mono)',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color,
        margin: '0 0 0.9rem',
      }}
    >
      {children}
    </p>
  )
}

function MethodChip({ chip, onLight = false }: { chip: string; onLight?: boolean }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-space-mono)',
        fontSize: '0.6rem',
        fontWeight: 700,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        color: onLight ? 'var(--color-stamp-onlight)' : 'var(--color-stamp)',
        background: onLight ? 'rgba(200,240,77,0.14)' : 'rgba(200,240,77,0.1)',
        border: onLight ? '1px solid rgba(200,240,77,0.45)' : '1px solid rgba(200,240,77,0.3)',
        borderRadius: '4px',
        padding: '0.16rem 0.45rem',
        whiteSpace: 'nowrap',
      }}
    >
      {chip}
    </span>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function PassportDemo() {
  return (
    <main style={{ background: 'var(--color-ink)', color: 'var(--color-paper)' }}>
      {/* ── SAMPLE BANNER ── */}
      <div
        style={{
          background: 'var(--color-stamp)',
          color: 'var(--color-ink)',
          textAlign: 'center',
          padding: '10px 16px',
          fontFamily: 'var(--font-space-mono)',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
        }}
      >
        {t.banner}
      </div>

      {/* ── HERO — artist presence first (brief §6) ── */}
      <section
        style={{
          background:
            'radial-gradient(760px 500px at 82% 0%, rgba(200,240,77,0.09), transparent 60%), linear-gradient(165deg, var(--color-ink) 0%, var(--color-forest) 100%)',
          padding: 'clamp(48px, 8vh, 96px) max(24px, 4vw) clamp(56px, 8vh, 96px)',
        }}
      >
        <div className="mk-container pd-hero-grid">
          {/* Left: identity */}
          <div className="pd-hero-copy">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <span
                aria-hidden="true"
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: 'var(--color-stamp)',
                  boxShadow: '0 0 10px var(--color-stamp)',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-stamp)',
                }}
              >
                {t.hero.sceneTag}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 400,
                fontSize: 'clamp(3rem, 7vw, 5rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.04em',
                color: 'var(--color-paper)',
                margin: '0 0 1rem',
              }}
            >
              {t.hero.name}
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.02rem, 1.9vw, 1.15rem)',
                lineHeight: 1.6,
                color: 'rgba(243,245,239,0.75)',
                maxWidth: '460px',
                margin: '0 0 1.4rem',
              }}
            >
              {t.hero.positioning}
            </p>

            {/* Genre / event-fit pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '2rem' }}>
              {t.hero.genrePills.map((pill) => (
                <span
                  key={pill}
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-paper)',
                    border: '1px solid rgba(243,245,239,0.22)',
                    borderRadius: '999px',
                    padding: '0.34rem 0.75rem',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* CTA row — first-screen on mobile; ONE lime CTA per viewport */}
            <div
              className="mk-cta-row"
              style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}
            >
              <a href={t.hero.primaryCta.href} className="mk-btn mk-btn--primary">
                {t.hero.primaryCta.label}
                <Icon id="arrow" size={16} />
              </a>
              <a href={t.hero.secondaryCta.href} className="mk-btn mk-btn--outline-dark">
                <Icon id="share" size={15} />
                {t.hero.secondaryCta.label}
              </a>
            </div>

            {/* One-line fit statement — mobile wireframe slot (brief §6) */}
            <p
              className="pd-fit"
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '0.75rem',
                lineHeight: 1.6,
                letterSpacing: '0.05em',
                color: 'rgba(243,245,239,0.6)',
                maxWidth: '440px',
                margin: 0,
              }}
            >
              {t.hero.fitLine}
            </p>
          </div>

          {/* Right: large artist/atmosphere image + portrait inset */}
          <div className="pd-hero-media">
            <div
              role="img"
              aria-label={t.hero.imageAlt}
              style={{
                borderRadius: '32px',
                overflow: 'hidden',
                aspectRatio: '4 / 4.4',
                maxHeight: '560px',
                width: '100%',
                position: 'relative',
                border: '1px solid rgba(243,245,239,0.12)',
                boxShadow: '0 32px 80px -28px rgba(0,0,0,0.8)',
                background: `linear-gradient(200deg, rgba(10,13,11,0) 45%, rgba(10,13,11,0.55) 85%, rgba(10,13,11,0.8) 100%), url('${HERO_IMAGE}') center / cover no-repeat`,
              }}
            >
              {/* Portrait inset — identity anchor */}
              <div
                style={{
                  position: 'absolute',
                  insetInlineStart: '1.1rem',
                  bottom: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  background: 'rgba(10,13,11,0.62)',
                  border: '1px solid rgba(243,245,239,0.18)',
                  borderRadius: '16px',
                  padding: '0.55rem 0.9rem 0.55rem 0.55rem',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PORTRAIT_IMAGE}
                  alt={t.hero.portraitAlt}
                  width={44}
                  height={44}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--color-paper)',
                    }}
                  >
                    {t.hero.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '0.56rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-stamp)',
                    }}
                  >
                    LOCK · PASSPORT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLOW — orderable on mobile (radar → signals → media → method) ── */}
      <div className="pd-flow">
        {/* ── RADAR UNIVERSE STRIP — 6 icons, trust context (brief §6) ── */}
        <section
          className="pd-radar"
          style={{
            background: 'var(--color-forest)',
            borderBlock: '1px solid rgba(243,245,239,0.08)',
            padding: 'clamp(2.25rem, 4vw, 3.25rem) max(24px, 4vw)',
          }}
        >
          <div className="mk-container" style={{ textAlign: 'center' }}>
            <MonoLabel>{t.radarStrip.eyebrow}</MonoLabel>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 'clamp(0.75rem, 2vw, 1.5rem)',
                marginBottom: '1.1rem',
              }}
            >
              {t.radarStrip.sources.map((s) => (
                <span
                  key={s.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(243,245,239,0.05)',
                    border: '1px solid rgba(243,245,239,0.12)',
                    borderRadius: '999px',
                    padding: '0.45rem 0.9rem 0.45rem 0.5rem',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/brand/source-logos/${s.logo}`}
                      alt=""
                      width={16}
                      height={16}
                      style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                    />
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color: 'rgba(243,245,239,0.75)',
                    }}
                  >
                    {s.label}
                  </span>
                </span>
              ))}
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: 'rgba(243,245,239,0.55)',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              {t.radarStrip.caption}
            </p>
          </div>
        </section>

        {/* ── MEDIA TILES 3–6 (brief §6) ──
            Placeholder rule: real Passports use artist-approved imagery only —
            the two Shidapu assets are Drive-approved; the atmosphere tiles are
            repo stand-ins for the demo. */}
        <section
          className="pd-media"
          style={{ background: 'var(--color-ink)', padding: 'clamp(3rem, 6vw, 5rem) max(24px, 4vw)' }}
        >
          <div className="mk-container">
            <MonoLabel>{t.media.eyebrow}</MonoLabel>
            <div className="pd-media-grid">
              {t.media.tiles.map((tile) => (
                <figure
                  key={tile.src}
                  style={{
                    margin: 0,
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid rgba(243,245,239,0.1)',
                    aspectRatio: '4 / 3',
                    background: `linear-gradient(200deg, rgba(10,13,11,0) 55%, rgba(10,13,11,0.6) 100%), url('${tile.src}') center / cover no-repeat`,
                  }}
                  role="img"
                  aria-label={tile.alt}
                >
                  <figcaption
                    style={{
                      position: 'absolute',
                      insetInlineStart: '0.9rem',
                      bottom: '0.8rem',
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--color-paper)',
                      background: 'rgba(10,13,11,0.55)',
                      border: '1px solid rgba(243,245,239,0.2)',
                      borderRadius: '999px',
                      padding: '0.24rem 0.65rem',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {tile.label}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '0.66rem',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'rgba(243,245,239,0.45)',
                margin: '1rem 0 0',
              }}
            >
              {t.media.note}
            </p>
          </div>
        </section>

        {/* ── STRONGEST SIGNALS — 3–5 cards ONLY (brief §6) ── */}
        <section
          className="pd-signals"
          style={{
            background: 'var(--color-paper)',
            color: 'var(--color-ink)',
            padding: 'clamp(3rem, 6vw, 5rem) max(24px, 4vw)',
          }}
        >
          <div className="mk-container">
            <MonoLabel color="var(--color-tally-onlight)">{t.signals.eyebrow}</MonoLabel>
            <h2
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 400,
                fontSize: 'clamp(1.6rem, 3.2vw, 2.3rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                color: 'var(--color-ink)',
                margin: '0 0 0.6rem',
              }}
            >
              {t.signals.title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '0.64rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--color-tally-onlight)',
                margin: '0 0 2rem',
              }}
            >
              {t.signals.note}
            </p>
            <div
              className="m-divide pd-signal-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'clamp(1rem, 2vw, 1.5rem)',
              }}
            >
              {t.signals.cards.map((card, i) => (
                <div
                  key={card.claim}
                  className={`mk-card m-flat${i >= 3 ? ' pd-signal-extra' : ''}`}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(10,13,11,0.1)',
                    padding: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <MethodChip chip={card.method} onLight />
                    <span
                      style={{
                        fontFamily: 'var(--font-space-mono)',
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        letterSpacing: '0.09em',
                        color: 'var(--color-tally-onlight)',
                      }}
                    >
                      REVIEWED {card.reviewed}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-archivo)',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      lineHeight: 1.25,
                      letterSpacing: '-0.01em',
                      color: 'var(--color-ink)',
                    }}
                  >
                    {card.claim}
                  </div>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: 'var(--color-tally-onlight)',
                      margin: 0,
                    }}
                  >
                    {card.context}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── METHOD-LABELS EXPLANATION (brief §6) ── */}
        <section
          className="pd-method"
          style={{
            background: 'var(--color-forest)',
            padding: 'clamp(3rem, 6vw, 5rem) max(24px, 4vw)',
          }}
        >
          <div className="mk-container--narrow">
            <MonoLabel>{t.method.eyebrow}</MonoLabel>
            <h2
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 400,
                fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--color-paper)',
                margin: '0 0 0.9rem',
              }}
            >
              {t.method.title}
            </h2>
            <p
              style={{
                fontSize: '0.98rem',
                lineHeight: 1.7,
                color: 'rgba(243,245,239,0.65)',
                margin: '0 0 2rem',
                maxWidth: '620px',
              }}
            >
              {t.method.body}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {t.method.items.map((item) => (
                <div
                  key={item.chip}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.9rem',
                    flexWrap: 'wrap',
                    borderBottom: '1px solid rgba(243,245,239,0.08)',
                    paddingBottom: '0.9rem',
                  }}
                >
                  <MethodChip chip={item.chip} />
                  <span
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: 'rgba(243,245,239,0.7)',
                      flex: '1 1 260px',
                    }}
                  >
                    {item.explanation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── PASSPORT FOOTER / FIREWALL DISCLAIMER (brief §6) ── */}
      <section
        style={{
          background: 'var(--color-ink)',
          padding: 'clamp(2rem, 4vw, 3rem) max(24px, 4vw)',
          borderTop: '1px solid rgba(243,245,239,0.08)',
        }}
      >
        <div className="mk-container--narrow">
          <p
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.08em',
              lineHeight: 1.8,
              color: 'rgba(243,245,239,0.5)',
              margin: '0 0 0.6rem',
            }}
          >
            {t.footer.disclaimer}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--color-stamp)',
              margin: 0,
            }}
          >
            {t.footer.brand}
          </p>
        </div>
      </section>

      {/* ── BUILD-YOURS BAND ── */}
      <section
        style={{
          background:
            'radial-gradient(560px 320px at 50% 130%, rgba(200,240,77,0.1), transparent 65%), var(--color-forest)',
          textAlign: 'center',
          padding: 'clamp(3rem, 6vw, 4.5rem) max(24px, 4vw)',
          borderTop: '1px solid rgba(243,245,239,0.08)',
        }}
      >
        <div className="mk-container--narrow">
          <p
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--color-stamp)',
              margin: '0 0 0.7rem',
            }}
          >
            {t.build.label}
          </p>
          <p
            style={{
              fontSize: '0.98rem',
              lineHeight: 1.65,
              color: 'rgba(243,245,239,0.7)',
              maxWidth: '480px',
              margin: '0 auto 1.5rem',
            }}
          >
            {t.build.body}
          </p>
          <Link href={t.build.cta.href} className="mk-btn mk-btn--primary">
            {t.build.cta.label}
            <Icon id="arrow" size={16} />
          </Link>
        </div>
      </section>

      {/* Local layout composition — brief §6 wireframes. The shared Hero
          component has no scene-tag/genre-pill/portrait-inset props, so the
          Passport hero is composed here (gap reported to the caller). */}
      <style>{`
        .pd-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(320px, 0.92fr);
          gap: clamp(2.5rem, 5vw, 4.5rem);
          align-items: center;
        }
        .pd-fit { display: none; }
        .pd-media-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(0.75rem, 1.5vw, 1.25rem);
        }
        @media (max-width: 1080px) {
          .pd-media-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 960px) {
          /* Mobile wireframe (brief §6): image → name+genre → CTA →
             fit line → radar strip → top-3 signals → media → method */
          .pd-hero-grid { grid-template-columns: 1fr; gap: 1.75rem; }
          .pd-hero-media { order: -1; }
          .pd-fit { display: block; }
          .pd-flow { display: flex; flex-direction: column; }
          .pd-radar { order: 1; }
          .pd-signals { order: 2; }
          .pd-media { order: 3; }
          .pd-method { order: 4; }
        }
        @media (max-width: 640px) {
          .pd-media-grid { grid-template-columns: 1fr; }
          .pd-signal-extra { display: none; } /* top-3 signals on mobile */
        }
      `}</style>
    </main>
  )
}
