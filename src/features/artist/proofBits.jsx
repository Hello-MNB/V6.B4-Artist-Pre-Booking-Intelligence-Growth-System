// ── Proof-unit atoms — thin adapters over the shared ui.jsx components ───────
// The canonical MethodLabel/BandPill live in src/components/ui.jsx (Foundation).
// This module keeps the artist feature's call-site API ({ label, confirmed })
// while delegating rendering to the shared components.
// Firewall: a band is a bordered capsule of words, NEVER a bar/gauge/%.
import { MethodLabel as UiMethodLabel, BandPill } from '../../components/ui.jsx'

export function MethodLabel({ label, confirmed = false }) {
  if (!label) return null
  const strong = confirmed || /producer[\s-]?confirmed/i.test(String(label))
  return (
    <UiMethodLabel variant={strong ? 'lime' : 'gold'}>
      {strong && <span aria-hidden>★</span>}
      {label}
    </UiMethodLabel>
  )
}

export { BandPill }
