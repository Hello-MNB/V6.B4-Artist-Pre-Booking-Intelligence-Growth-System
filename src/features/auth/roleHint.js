// Cross-funnel seam: the website's persona pages (e.g. /artists) link into
// the app as `/signup?role=artist` instead of a bare `/signup`. Signup.jsx
// stashes that hint here (sessionStorage, not query/state alone) so it
// survives the email-confirmation interruption, and UserTypeSelect.jsx reads
// it once to auto-resolve the "what would you like to do first?" question —
// killing an interstitial the visitor already answered by clicking a
// persona-specific CTA on the site. Scoped to the three self-signup jobs;
// producer/operator are never selected here (see constants.js SIGNUP_ROLES).
import { ROLES } from '../../lib/constants.js'

export const PENDING_ROLE_KEY = 'gigproof_pending_role'
export const JOB_ROLES = [ROLES.ARTIST, ROLES.AGENCY, ROLES.BOOKER]
