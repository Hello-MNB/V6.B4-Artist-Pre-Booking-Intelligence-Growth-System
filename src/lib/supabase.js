import { createClient } from '@supabase/supabase-js'
import { DEMO } from './demo.js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

const realConfig = Boolean(url && anon && !url.includes('YOUR-PROJECT'))

// `isConfigured` gates the setup notice. In DEMO mode it's true (routes render
// from fixtures) even though there is no real client.
export const isConfigured = DEMO || realConfig

// No real client in DEMO — db.js + the public Passport short-circuit to fixtures.
export const supabase = (!DEMO && realConfig)
  ? createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // OAuth (Google) fix: Supabase's provider redirect returns a `?code=`
        // (PKCE). Without flowType:'pkce' + detectSessionInUrl the client can't
        // exchange it, so the user lands back on the login screen after Google
        // — the exact bug Maria hit 9 Jul. PKCE is also the secure default for
        // a browser SPA.
        flowType: 'pkce',
        detectSessionInUrl: true,
      },
    })
  : null
