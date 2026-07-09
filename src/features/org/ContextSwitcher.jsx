import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrg } from '../../context/OrgContext.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useLang } from '../../context/LangContext.jsx'
import { BottomSheet } from '../../components/ui.jsx'
import { ROLES } from '../../lib/constants.js'

const orgRoleLabel = (r, T) => ({ owner: T.org.roleOwner, admin: T.org.roleAdmin, member: T.org.roleMember }[r] || r)

function workspaceTypeLabel(role, isAgency, T, isProducerWorkspace) {
  const n = T.nav
  if (role === ROLES.ARTIST) return n.workspaceArtist
  if ((role === ROLES.AGENCY || isAgency) && isProducerWorkspace) return n.workspaceProduction
  if (role === ROLES.AGENCY || isAgency) return n.workspaceManager
  if (role === ROLES.PRODUCER) return n.workspaceProducer
  if (role === ROLES.BOOKER) return n.workspaceBooker
  if (role === ROLES.OPERATOR) return n.workspaceOperator
  return T.org.entitySolo
}

// "Add workspace" destination — the artist wizard (/onboarding) is
// ARTIST-ONLY. Every other role must land on its OWN home, never inside
// another role's screen (bug fix: previously linked everyone to /onboarding).
function addWorkspaceRoute(role, isProducerWorkspace) {
  if (role === ROLES.ARTIST) return '/onboarding'
  if (role === ROLES.AGENCY) return isProducerWorkspace ? '/production' : '/agency'
  if (role === ROLES.BOOKER) return '/discover'
  if (role === ROLES.PRODUCER) return '/producer/received'
  if (role === ROLES.OPERATOR) return '/admin'
  return '/'
}

// O3 — Workspace / account switcher. Canon ROUND 4: person → workspace →
// role; switching lives TOP-RIGHT (never bottom-left, never a re-registration).
// Rendered once from AppShell's top bar, on every breakpoint — always visible
// (not just when multi-org), since it is also the "add a workspace" surface.
export default function ContextSwitcher() {
  const { T } = useLang()
  // role: the ACTIVE workspace's effective role (ROUND 4), so the label under
  // the avatar and the "add workspace" destination follow whichever workspace
  // is selected right now, not a single static profile role.
  const { memberships, activeOrgId, switchOrg, role, isProducerWorkspace } = useOrg()
  const { profile } = useAuth()
  const [open, setOpen] = useState(false)

  const active = memberships?.find((m) => m.organization?.id === activeOrgId) || memberships?.[0]
  const isAgency = ['agency', 'agency_plus'].includes(active?.organization?.plan)
  const typeLabel = workspaceTypeLabel(role, isAgency, T, isProducerWorkspace)
  const initial = (profile?.full_name || 'G').trim().charAt(0).toUpperCase() || 'G'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pe-3 ps-1 transition hover:border-accent/50"
      >
        <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface2 text-sm font-bold text-ink">
          {initial}
        </span>
        <span className="hidden text-start sm:block">
          <span className="block text-[10px] font-medium uppercase tracking-wide text-muted">{typeLabel}</span>
          {active?.organization?.name && (
            <span className="block max-w-[140px] truncate text-xs font-semibold text-ink">{active.organization.name}</span>
          )}
        </span>
        <span aria-hidden className="text-muted">▾</span>
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={T.org.switchOrg}>
        <div className="space-y-2">
          {profile?.full_name && <p className="mb-1 truncate text-sm font-semibold text-ink">{profile.full_name}</p>}
          {memberships.map((m) => {
            const isActive = m.organization?.id === activeOrgId
            return (
              <button
                key={m.organization?.id}
                onClick={() => { switchOrg(m.organization?.id); setOpen(false) }}
                className={`card w-full text-start flex items-center justify-between ${isActive ? 'border-accent' : ''}`}
              >
                <div className="min-w-0">
                  <p className="text-ink text-sm font-medium truncate">{m.organization?.name}</p>
                  <p className="text-xs text-muted">{orgRoleLabel(m.org_role, T)}</p>
                </div>
                {isActive && <span className="text-accent" aria-label="active">✓</span>}
              </button>
            )
          })}
          <Link
            to={addWorkspaceRoute(role, isProducerWorkspace)}
            onClick={() => setOpen(false)}
            className="mt-1.5 block w-full py-1.5 text-center text-xs text-muted transition hover:text-accent"
          >
            {T.nav.addWorkspace}
          </Link>
          <p className="mt-1 text-center text-[10px] text-faint">{T.org.switchNote}</p>
        </div>
      </BottomSheet>
    </div>
  )
}
