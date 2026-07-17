// Classify an auth failure into a UI error taxonomy (B1 QA finding 1, spec
// §17.B.2 STATES): a network/offline failure must NEVER be reported as
// "wrong credentials" — that misdiagnoses the user's own input when the
// server was simply unreachable. Returns a key into T.login:
//   'errorNetwork'     — fetch never reached Supabase (offline / DNS / reset)
//   'errorRateLimited' — 429 (spec: "Too many attempts — wait a moment")
//   'error'            — genuine auth rejection (wrong email/password)
// The RAW error text is never shown to the user (U8 / lexicon law) — only
// these i18n keys are rendered.
export function classifyAuthError(err) {
  if (!err) return 'error'
  const status = typeof err.status === 'number' ? err.status : null
  const name = err.name || ''
  const msg = String(err.message || '')
  // supabase-js wraps unreachable-network failures as AuthRetryableFetchError
  // (status 0); a bare fetch TypeError ("Failed to fetch") can also surface.
  if (
    name === 'AuthRetryableFetchError' ||
    status === 0 ||
    (status === null && (err instanceof TypeError || /fetch|network/i.test(msg)))
  ) return 'errorNetwork'
  if (status === 429) return 'errorRateLimited'
  return 'error'
}

// Minimal-but-humane email shape check for CLIENT-side validation (§10.4
// "invalid = human explanation"): we only need to catch obvious typos before
// submitting; the server remains the real authority.
export const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
