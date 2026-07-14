'use client'

// Header chrome — structure/labels per Codex rebuild brief §4 (2026-07-14):
// Artists · Managers · Production · Bookers · How it works · Passport demo,
// then locale toggle + Log in + "Join free pilot" CTA. All strings live in
// content/chrome.ts ({ en, he }); mechanics (sticky header, APP_URL signup
// href, mobile hamburger, aria patterns) are unchanged from the previous nav.
//
// LIME-COLLISION DECISION: every rebuilt page hero renders a lime primary
// CTA (.mk-btn--primary) above the fold, and the brief's layout tokens allow
// only ONE lime CTA per viewport. The sticky header shares that viewport, so
// the header CTA uses the DARK/OUTLINE variant (matches .mk-btn--outline-dark
// tokens) instead of lime — in both desktop and mobile menus.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLocale } from '@/lib/locale-context'
import type { Locale } from '@/lib/i18n'
import { DoorStamp } from '@/components/door-stamp'
import { chromeContent } from '@/content/chrome'

import { APP_URL } from '@/lib/app-url'

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
        fontSize: '0.75rem',
        letterSpacing: '0.06em',
        color: 'var(--color-tally)',
        background: 'none',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '10px',
        padding: '15px 12px',
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
  const { locale } = useLocale()
  const t = chromeContent[locale].nav
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(`${href}/`)

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'var(--nav-blur)',
        WebkitBackdropFilter: 'var(--nav-blur)',
        borderBottom: '1px solid var(--nav-border)',
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
        height: '64px',
      }}>
        {/* Wordmark + stamp logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'var(--font-space-mono)',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.06em',
            color: 'var(--color-paper)',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          aria-label="LOCK home"
        >
          <DoorStamp size={36} style={{ color: 'var(--color-stamp)' }} />
          LOCK
        </Link>

        {/* Desktop links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '22px',
          }}
          className="nav-desktop"
        >
          {t.links.map(({ href, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                style={{
                  fontFamily: 'var(--font-heebo)',
                  fontSize: '0.875rem',
                  fontWeight: active ? 700 : 400,
                  color: active ? 'var(--color-paper)' : 'var(--color-tally)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  paddingBottom: '4px',
                  borderBottom: active
                    ? '2px solid var(--color-stamp)'
                    : '2px solid transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
          <LocaleToggle />
          <a
            href={`${APP_URL}/login`}
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              color: 'var(--color-paper)',
              textDecoration: 'none',
              padding: '15px 12px',
              whiteSpace: 'nowrap',
              fontWeight: 600,
            }}
          >
            {t.login}
          </a>
          {/* Header CTA — outline variant, NOT lime (page heroes own the one
              lime CTA in this viewport; see file header note). */}
          <a
            href={`${APP_URL}/signup`}
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              color: 'var(--color-paper)',
              textDecoration: 'none',
              backgroundColor: 'transparent',
              border: '1px solid rgba(243,245,239,0.28)',
              padding: '14px 18px',
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              fontWeight: 700,
            }}
          >
            {t.cta}
          </a>
        </div>

        {/* Mobile hamburger — 44px min touch target */}
        <button
          aria-label={open ? t.closeMenu : t.openMenu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
          className="nav-mobile-btn"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            minWidth: '44px',
            minHeight: '44px',
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'var(--color-paper)', transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'var(--color-paper)', opacity: open ? 0 : 1, transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'var(--color-paper)', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          style={{
            backgroundColor: 'rgba(10,13,11,0.97)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 24px 24px',
          }}
          className="nav-mobile-menu"
        >
          {t.links.map(({ href, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-heebo)',
                  fontSize: '1rem',
                  fontWeight: active ? 700 : 400,
                  color: active ? 'var(--color-stamp)' : 'var(--color-paper)',
                  textDecoration: 'none',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {label}
              </Link>
            )
          })}
          <div style={{ paddingTop: '16px', paddingBottom: '4px' }}>
            <LocaleToggle />
          </div>
          <a
            href={`${APP_URL}/login`}
            style={{
              display: 'block',
              marginTop: '12px',
              padding: '15px 20px',
              border: '1px solid var(--color-mist, rgba(255,255,255,.15))',
              color: 'var(--color-paper)',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            {t.login}
          </a>
          {/* Mobile CTA — same outline variant as desktop (the hero lime can
              remain visible below the dropdown menu on tall screens). */}
          <a
            href={`${APP_URL}/signup`}
            style={{
              display: 'block',
              marginTop: '10px',
              padding: '15px 20px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(243,245,239,0.28)',
              color: 'var(--color-paper)',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              borderRadius: '10px',
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            {t.cta}
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
