// BandPill — text-only audience draw indicator.
// NO fill bar. NO gauge. NO CSS width animation. NO fraction representation.
// Always renders as plain text in Space Mono.

interface BandPillProps {
  value: string   // e.g. "70–150"
  size?: 'sm' | 'md' | 'lg'
}

export function BandPill({ value, size = 'md' }: BandPillProps) {
  const fontSize =
    size === 'sm' ? '1rem' :
    size === 'lg' ? '1.75rem' :
    '1.3rem'

  return (
    <span
      style={{
        fontFamily: 'var(--font-space-mono)',
        fontSize,
        fontWeight: 700,
        color: 'var(--color-ink)',
        letterSpacing: '-0.01em',
        display: 'inline-block',
      }}
      aria-label={`Audience draw: ${value}`}
    >
      {value}
    </span>
  )
}
