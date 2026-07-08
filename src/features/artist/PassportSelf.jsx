import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { getMyArtist } from '../../lib/db.js'
import { Loading } from '../../components/ui.jsx'

// Artist nav "Passport" tab (IA CORRECTION — canon: Radar · Passport ·
// Requests · Account). This is NOT a second bespoke preview screen — it opens
// the artist's own REAL passport, the same public /passport/:id surface
// ArtistDashboard and ClaimReview already link out to ("View public Passport").
// If the artist hasn't onboarded yet there is nothing to preview, so we send
// them to onboarding instead of a dead end. If they have an artist record but
// haven't published, /passport/:id itself already renders the honest
// "isn't published" pre-publish state — never a blank screen.
export default function PassportSelf() {
  const { user } = useAuth()
  const [artistId, setArtistId] = useState(undefined) // undefined = loading, null = none yet

  useEffect(() => {
    let alive = true
    getMyArtist(user.id)
      .then((a) => { if (alive) setArtistId(a?.id || null) })
      .catch(() => { if (alive) setArtistId(null) })
    return () => { alive = false }
  }, [user.id])

  if (artistId === undefined) return <Loading />
  if (!artistId) return <Navigate to="/onboarding" replace />
  return <Navigate to={`/passport/${artistId}`} replace />
}
