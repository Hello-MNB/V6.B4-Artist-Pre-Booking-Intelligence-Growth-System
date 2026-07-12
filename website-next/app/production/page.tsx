import type { Metadata } from 'next'
import WaitlistForm from '@/components/waitlist-form'

// S9 outreach page (rel-07.13) — production offices / event producer teams.
// Content per Codex DS v1.6.11 handoff. Route separation (Codex law):
// /producers = Source-Confirmer education · /production = THIS beta signup.
export const metadata: Metadata = {
  alternates: { canonical: '/production' },
  title: 'For Production Offices — Build Lineups With Clearer Artist Context',
  description:
    'Use LOCK Passports to understand artist fit, reliability and source-backed context before a lineup becomes a production risk. Join the production beta.',
  openGraph: {
    url: '/production',
    title: 'For Production Offices | LOCK',
    description: 'Build lineups with clearer artist context. Join the production beta.',
    type: 'website',
    images: [{ url: '/og/lockshow-og-production-v1.png', width: 1200, height: 630 }],
  },
}

const sections = [
  {
    num: '01',
    title: 'Artist context before commitment.',
    body: 'Every lineup slot is a promise to your audience and your name. Read an artist’s method-labeled Passport before you lock the slot — fit, reliability and history, checked and dated.',
  },
  {
    num: '02',
    title: 'Requests and replies in one place.',
    body: 'Availability requests your office sends, and the artists’ replies, live in one inbox with clear status — sent, answered, closed. No more WhatsApp archaeology before an event.',
  },
  {
    num: '03',
    title: 'Source-backed claims, not popularity guesses.',
    body: 'Every claim on a Passport carries its method and review date. You judge an unfamiliar act on checked evidence — never on follower counts or a hype reel.',
  },
  {
    num: '04',
    title: 'Join the production beta.',
    body: 'The production workspace is in closed beta. Early offices shape how lineup building with verified context works — events, lineups and requests in one governed place.',
  },
]

export default function ProductionPage() {
  return (
    <main style={{ backgroundColor: 'var(--color-paper)', color: 'var(--color-ink)', fontFamily: 'var(--font-heebo)' }}>
      {/* ── HERO — full-bleed, atmosphere image ── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'min(80svh, 720px)',
          display: 'flex',
          alignItems: 'flex-end',
          backgroundImage: 'linear-gradient(rgba(10,13,11,0.55), rgba(10,13,11,0.75)), url(/brand/lockshow-atmosphere-production-warehouse-v1.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: '820px', padding: 'clamp(32px, 6vw, 72px)' }}>
          <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-stamp)', margin: '0 0 14px' }}>
            FOR PRODUCTION OFFICES · EVENT PRODUCERS · TEAMS
          </p>
          <h1 style={{ fontFamily: 'var(--font-frank)', fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.1, color: '#fff', margin: '0 0 16px' }}>
            Build lineups with clearer artist context.
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.65, color: 'rgba(255,255,255,0.88)', maxWidth: '58ch', margin: 0 }}>
            Use LOCK Passports to understand artist fit, reliability and source-backed context before a
            lineup becomes a production risk.
          </p>
        </div>
      </section>

      {/* ── SECTIONS ── */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(40px, 7vw, 88px) clamp(20px, 4vw, 40px)' }}>
        {sections.map((s) => (
          <div key={s.num} className="m-divide" style={{ display: 'grid', gridTemplateColumns: 'minmax(48px, 80px) 1fr', gap: '20px', padding: '28px 0', borderBottom: '1px solid rgba(10,13,11,0.1)' }}>
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '0.8rem', color: 'var(--color-tally-onlight)' }}>{s.num}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-frank)', fontSize: 'clamp(1.2rem, 2.4vw, 1.55rem)', margin: '0 0 8px' }}>{s.title}</h2>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--color-tally-onlight)', margin: 0, maxWidth: '62ch' }}>{s.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── SIGNUP — role + source preset (waitlist_signup, first-party) ── */}
      <section id="join" style={{ maxWidth: '620px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 40px) clamp(56px, 8vw, 104px)' }}>
        <h2 style={{ fontFamily: 'var(--font-frank)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', margin: '0 0 8px' }}>Join production beta</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-tally-onlight)', margin: '0 0 24px', lineHeight: 1.65 }}>
          For production offices, event producers and teams building lineups.
        </p>
        <WaitlistForm presetRole="production" source="production_page" cta="JOIN PRODUCTION BETA →" helper="For production offices, event producers and teams building lineups." />
      </section>
    </main>
  )
}
