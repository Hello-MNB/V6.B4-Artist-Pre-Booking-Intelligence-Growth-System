import type { Metadata } from 'next'
import WaitlistForm from '@/components/waitlist-form'

// S9 outreach page (rel-07.13) — artist-side representation audience (משרד אמרגנות).
// Content per Codex DS v1.6.11 handoff (#outreach-pages-managers-production).
// NOT the buyer page (/bookers) and NOT the Source-Confirmer page (/producers).
export const metadata: Metadata = {
  alternates: { canonical: '/managers' },
  title: 'For Artist Managers — Make Every Roster Pitch Easier to Trust',
  description:
    'Help each artist show the right proof, share a cleaner Passport and track who reacted — without taking ownership of the artist’s identity. Join the manager beta.',
  openGraph: {
    url: '/managers',
    title: 'For Artist Managers | LOCK',
    description: 'Make every roster pitch easier to trust. Join the manager beta.',
    type: 'website',
    images: [{ url: '/og/lockshow-og-professional-buyers-v1.png', width: 1200, height: 630 }],
  },
}

const sections = [
  {
    num: '01',
    title: 'Roster readiness without ranking.',
    body: 'See which proof each artist on your roster still needs — as next actions, never as a grade. You always know which act is ready to pitch and what would make the next one ready.',
  },
  {
    num: '02',
    title: 'ArtistAccess — a consented grant, not ownership.',
    body: 'Artists grant your office scoped access to their Passport. The identity stays theirs; the pitch power becomes yours. Every grant is visible, revocable and honest.',
  },
  {
    num: '03',
    title: 'One inbox for Passport reactions.',
    body: 'Every buyer reaction to a roster artist’s Passport lands in one place. You see what worked, which pitch landed, and who to follow up with — instead of chasing screenshots.',
  },
  {
    num: '04',
    title: 'Join the roster beta.',
    body: 'The manager workspace is in closed beta. Early offices shape how roster pitching with method-labeled proof works — and get it first.',
  },
]

export default function ManagersPage() {
  return (
    <main style={{ backgroundColor: 'var(--color-paper)', color: 'var(--color-ink)', fontFamily: 'var(--font-heebo)' }}>
      {/* ── HERO — full-bleed, atmosphere image ── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'min(80svh, 720px)',
          display: 'flex',
          alignItems: 'flex-end',
          backgroundImage: 'linear-gradient(rgba(10,13,11,0.55), rgba(10,13,11,0.75)), url(/brand/lockshow-atmosphere-agency-roster-room-v1.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: '820px', padding: 'clamp(32px, 6vw, 72px)' }}>
          <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-stamp)', margin: '0 0 14px' }}>
            FOR ARTIST MANAGERS · AGENCIES · REPRESENTATIVES
          </p>
          <h1 style={{ fontFamily: 'var(--font-frank)', fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.1, color: '#fff', margin: '0 0 16px' }}>
            Make every roster pitch easier to trust.
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.65, color: 'rgba(255,255,255,0.88)', maxWidth: '58ch', margin: 0 }}>
            Help each artist show the right proof, share a cleaner Passport and track who reacted — without
            taking ownership of the artist’s identity.
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
        <h2 style={{ fontFamily: 'var(--font-frank)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', margin: '0 0 8px' }}>Join manager beta</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-tally-onlight)', margin: '0 0 24px', lineHeight: 1.65 }}>
          For artist managers, agencies and representatives.
        </p>
        <WaitlistForm presetRole="artist_manager" source="managers_page" cta="JOIN MANAGER BETA →" helper="For artist managers, agencies and representatives." />
      </section>
    </main>
  )
}
