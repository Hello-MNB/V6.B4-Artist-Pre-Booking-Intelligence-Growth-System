/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── CODEX Design System v1.2.0 — "Proof Lime" (the canonical identity,
        //    Screens By Codex/BRANDING AND DESIGN SYSTEM; applied 7 Jul 2026) ──
        paper: '#F3F5EF',   // page background (cool paper)
        ink: '#0A0D0B',     // true dark — dark panels, logo square text
        forest: '#18221A',  // deep green-dark — feature panels, next-action card
        lime: '#C8F04D',    // THE accent — CTAs, selections, verified cues
        mist: '#DDE3D9',    // hairlines / subtle borders
        tally: '#687269',   // secondary text (CODEX --muted)

        // Semantic tokens (screens reference these)
        surface: '#E9EDE4',    // subtle tint on paper (chips, hovers)
        card: '#FFFFFF',       // card background
        line: '#DDE3D9',       // borders (= mist)
        muted: '#687269',      // secondary text
        soft: '#151B16',       // primary body text (CODEX body color)
        accent: '#C8F04D',     // = lime
        'accent-700': '#B4DC3B', // lime hover
        night: '#18221A',      // dark sections (= forest)
        ok: '#285B31',         // strong/success fg (tint bg #E5F5DF)
        warn: '#8A591B',       // developing/caution fg (tint bg #FFF0D9)
        gap: '#566159',        // neutral/not-assessable fg (tint bg #ECEFEB)
        void: '#8B3328',       // danger fg (tint bg #FFF0ED)
      },
      fontFamily: {
        sans: ['"Manrope"', '"Heebo"', 'system-ui', 'sans-serif'], // body (Heebo covers Hebrew)
        display: ['Georgia', '"Times New Roman"', 'serif'],        // headings — CODEX serif voice
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],          // labels · badges · metadata
      },
      borderRadius: {
        // CODEX: soft, humane corners — 9px controls, 13px rows, 15–18px cards
        DEFAULT: '13px',
        sm: '9px',
        md: '13px',
        lg: '15px',
        xl: '18px',
        '2xl': '18px',
        '3xl': '22px',
        xl2: '15px', // legacy alias used by .card
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 220ms ease-out both',
      },
    },
  },
  plugins: [],
}
