import { ROLES } from '../../lib/constants.js'

// Shared nav tab definitions — consumed by BottomNav (mobile) and SideNav (desktop).
// Each tab: { key, label, to, end }
// `end` mirrors NavLink's `end` prop (exact-match active state).
export function getNavTabs(role, isAgency, T) {
  const n = T.nav
  if (role === ROLES.ARTIST) return [
    { key: 'radar',     label: n.radar,     to: '/artist/home',      end: true },
    { key: 'readiness', label: n.readiness, to: '/artist/readiness', end: true },
    { key: 'claims',    label: n.claims,    to: '/artist/claims',    end: true },
    { key: 'account',   label: n.account,   to: '/settings',         end: true },
  ]
  if (role === ROLES.AGENCY || isAgency) return [
    { key: 'roster',   label: n.roster,   to: '/agency',          end: true },
    { key: 'radar',    label: n.radar,    to: '/agency/radar',    end: true },
    { key: 'requests', label: n.requests, to: '/agency/requests', end: true },
    { key: 'account',  label: n.account,  to: '/settings',        end: true },
  ]
  if (role === ROLES.PRODUCER) return [
    { key: 'received', label: n.received, to: '/producer/received', end: false },
    { key: 'account',  label: n.account,  to: '/settings',          end: true  },
  ]
  if (role === ROLES.OPERATOR) return [
    { key: 'admin',   label: n.admin,   to: '/admin',    end: true },
    { key: 'account', label: n.account, to: '/settings', end: true },
  ]
  // Booker and fallback — account only until booker workspace is built
  return [
    { key: 'account', label: n.account, to: '/settings', end: true },
  ]
}

// Inline SVG icon set — 24×24 stroke, no fill, no external dependency.
export function NavIcon({ name }) {
  const p = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  switch (name) {
    case 'radar':
      return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    case 'readiness':
      return <svg {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    case 'claims':
      return <svg {...p}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/><polyline points="9 12 11 14 15 10"/></svg>
    case 'roster':
      return <svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
    case 'requests':
      return <svg {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
    case 'received':
      return <svg {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    case 'account':
      return <svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    case 'admin':
      return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    default:
      return null
  }
}
