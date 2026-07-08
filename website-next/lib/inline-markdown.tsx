import type { ReactNode } from 'react'

/**
 * Renders a plain-text string that may contain `**bold**` markers as React
 * nodes. Used by legal pages to preserve emphasis from the source Markdown
 * drafts (docs/legal/*.md) without pulling in a full Markdown renderer.
 *
 * Only `**bold**` is supported — legal copy is authored by us, not user
 * input, so this stays intentionally minimal.
 */
export function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}
