'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLocale } from '@/lib/locale-context'
import type { Locale } from '@/lib/i18n'

const APP_URL = 'https://app.gigproof.co'

// Nav links use message keys — translated at render time
const NAV_LINK_KEYS = [
  { href: '/artists',      key: 'artists'      },
  { href: '/bookers',      key: 'bookers'      },
  { href: '/producers',    key: 'producers'    },
  { href: '/how-it-works', key: 'howItWorks'   },
  { href: '/methodology',  key: 'methodology'  },
  { href: '/pricing',      key: 'pricing'      },
] as const

// Locale toggle pill
function LocaleToggle() {
  const { locale, setLocale } = useLocale()
  const next: Locale = locale === 'en' ? 'he' : 'en'
  const label = locale === 'en' ? 'עב' : 'EN'
  return (
    <button
      onClick={() => setLocale(next)}
      aria-label={locale === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
      style={{
        fontFamily: 'var(--font-space-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.06em',
        color: 'var(--color-tally)',
        background: 'none',
        border: '1px solid rgba(122,118,106,0.35)',
        borderRadius: '2px',
        padding: '5px 9px',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const { messages } = useLocale()
  const nav = messages.nav

  // Map key to translated label
  const navLinks = NAV_LINK_KEYS.map(({ href, key }) => ({
    href,
    label: nav[key as keyof typeof nav] as string,
  }))

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        borderBottom: '1px solid rgba(22,21,15,0.1)',
        backgroundColor: 'var(--color-paper)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
      }}>
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-space-mono)',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.06em',
            color: 'var(--color-ink)',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          aria-label="GIGPROOF home"
        >
          GIGPROOF
        </Link>

        {/* Desktop links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
          className="nav-desktop"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-heebo)',
                fontSize: '0.875rem',
                color: 'var(--color-tally)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Link>
          ))}
          <LocaleToggle />
          <a
            href={APP_URL}
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              color: 'var(--color-stamp)',
              textDecoration: 'none',
              border: '1px solid var(--color-stamp)',
              padding: '8px 14px',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            {nav.getStarted} →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? nav.closeMenu : nav.openMenu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
          className="nav-mobile-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'var(--color-ink)', transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'var(--color-ink)', opacity: open ? 0 : 1, transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'var(--color-ink)', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div
          id="mobile-menu"
          style={{
            backgroundColor: 'var(--color-paper)',
            borderTop: '1px solid rgba(22,21,15,0.1)',
            padding: '16px 24px 24px',
          }}
          className="nav-mobile-menu"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                fontFamily: 'var(--font-heebo)',
                fontSize: '1rem',
                color: 'var(--color-ink)',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid rgba(22,21,15,0.06)',
              }}
            >
              {label}
            </Link>
          ))}
          {/* Locale toggle in mobile menu */}
          <div style={{ paddingTop: '16px', paddingBottom: '4px' }}>
            <LocaleToggle />
          </div>
          <a
            href={APP_URL}
            style={{
              display: 'block',
              marginTop: '12px',
              padding: '14px 20px',
              backgroundColor: 'var(--color-stamp)',
              color: '#fff',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              borderRadius: '2px',
              textAlign: 'center',
            }}
          >
            {nav.getStarted} →
          </a>
        </div>
      )}

      {/* Inline responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
