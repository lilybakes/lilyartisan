/**
 * Inline preview shapes for the template picker.
 * Called with `shape` from the TEMPLATES registry (e.g. 'card-lines', 'card-bars',
 * 'card-dots', 'card-tag', 'grid', 'table', 'square', 'circle') and the pageSize.
 * Returns a small illustrative SVG that hints at the template layout.
 */
export default function TemplatePreviewGlyph({ shape = 'card-lines', pageSize = 'A5' }) {
  // Landscape formats get a rotated card
  const landscape = pageSize === 'A4 landscape' || pageSize === 'landscape'

  const w = 48
  const h = landscape ? 36 : 60

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Card outline */}
      <rect x="2" y="2" width={w - 4} height={h - 4} rx="3"
        fill="var(--tpl-glyph-bg, rgba(255,255,255,0.85))"
        stroke="currentColor" strokeWidth="1.4" opacity="0.9"/>
      {renderShape(shape, w, h)}
    </svg>
  )
}

function renderShape(shape, w, h) {
  const cx = w / 2
  const cy = h / 2

  switch (shape) {
    // Recipe card / binder — title + horizontal lines
    case 'card-lines':
      return (
        <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
          <line x1="8"  y1="12" x2={w - 20} y2="12" strokeWidth="1.8"/>
          <line x1="8"  y1="20" x2={w - 12} y2="20"/>
          <line x1="8"  y1="26" x2={w - 14} y2="26"/>
          <line x1="8"  y1="32" x2={w - 10} y2="32"/>
          <line x1="8"  y1="38" x2={w - 16} y2="38"/>
          <line x1="8"  y1="44" x2={w - 20} y2="44"/>
          <line x1="8"  y1="50" x2={w - 14} y2="50"/>
        </g>
      )

    // Cost breakdown — bar chart / stats
    case 'card-bars':
      return (
        <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
          <line x1="8"  y1="12" x2={w - 20} y2="12" strokeWidth="1.8"/>
          <rect x="8"  y="20" width="10" height="30" fill="currentColor" opacity="0.35" stroke="none"/>
          <rect x="21" y="26" width="10" height="24" fill="currentColor" opacity="0.55" stroke="none"/>
          <rect x="34" y="18" width="10" height="32" fill="currentColor" opacity="0.75" stroke="none"/>
        </g>
      )

    // Care & storage — dots + text
    case 'card-dots':
      return (
        <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
          <circle cx={cx} cy="14" r="4" fill="currentColor" opacity="0.4" stroke="none"/>
          <line x1="10" y1="26" x2={w - 10} y2="26"/>
          <line x1="10" y1="32" x2={w - 14} y2="32"/>
          <line x1="10" y1="42" x2={w - 12} y2="42" strokeDasharray="2 2"/>
          <line x1="10" y1="48" x2={w - 18} y2="48" strokeDasharray="2 2"/>
        </g>
      )

    // Product / delivery tag — includes tag hole
    case 'card-tag':
      return (
        <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
          <circle cx={cx} cy="10" r="2" fill="none"/>
          <rect x="8" y="20" width={w - 16} height="10" fill="currentColor" opacity="0.55" stroke="none"/>
          <line x1="10" y1="36" x2={w - 12} y2="36"/>
          <line x1="10" y1="42" x2={w - 16} y2="42"/>
          <rect x="8" y="48" width={w - 16} height="6" rx="1" fill="none" opacity="0.6"/>
        </g>
      )

    // Menu insert — grid of category rows
    case 'grid':
      return (
        <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
          <circle cx={cx} cy="10" r="3" fill="currentColor" opacity="0.35" stroke="none"/>
          <line x1="8"  y1="20" x2={w - 8} y2="20"/>
          <line x1="8"  y1="28" x2={w - 8} y2="28" strokeWidth="0.8" strokeDasharray="1 1"/>
          <line x1="8"  y1="36" x2={w - 8} y2="36"/>
          <line x1="8"  y1="44" x2={w - 8} y2="44" strokeWidth="0.8" strokeDasharray="1 1"/>
          <line x1="8"  y1="52" x2={w - 8} y2="52"/>
        </g>
      )

    // Wholesale price list — data table
    case 'table':
      return (
        <g stroke="currentColor" strokeWidth="1.2" opacity="0.75">
          <line x1="8"  y1="12" x2={w - 8} y2="12" strokeWidth="1.6"/>
          <line x1="18" y1="8"  x2="18" y2="52"/>
          <line x1="30" y1="8"  x2="30" y2="52"/>
          <line x1="42" y1="8"  x2="42" y2="52"/>
          <line x1="8"  y1="22" x2={w - 8} y2="22"/>
          <line x1="8"  y1="32" x2={w - 8} y2="32"/>
          <line x1="8"  y1="42" x2={w - 8} y2="42"/>
        </g>
      )

    // Social — square with center focus
    case 'square':
      return (
        <g stroke="currentColor" strokeLinecap="round" opacity="0.8">
          <line x1="10" y1="14" x2={w - 10} y2="14" strokeWidth="1.2"/>
          <rect x="10" y="22" width={w - 20} height="16" fill="currentColor" opacity="0.55" stroke="none"/>
          <rect x="15" y="44" width={w - 30} height="6" rx="3" fill="none" strokeWidth="1.4"/>
        </g>
      )

    // Certificate — landscape with center seal
    case 'circle':
      return (
        <g stroke="currentColor" strokeLinecap="round" opacity="0.8">
          <line x1="10" y1="10" x2={w - 10} y2="10" strokeWidth="1.4"/>
          <line x1="15" y1="16" x2={w - 15} y2="16" strokeWidth="0.9"/>
          <circle cx={cx} cy={cy + 3} r="7" fill="none" strokeWidth="1.4" strokeDasharray="2 1.5"/>
          <line x1="10" y1={h - 8} x2="22" y2={h - 8} strokeWidth="0.9"/>
          <line x1={w - 22} y1={h - 8} x2={w - 10} y2={h - 8} strokeWidth="0.9"/>
        </g>
      )

    default:
      return (
        <g stroke="currentColor" strokeWidth="1.2" opacity="0.5">
          <line x1="8" y1="14" x2={w - 8} y2="14"/>
          <line x1="8" y1="24" x2={w - 8} y2="24"/>
          <line x1="8" y1="34" x2={w - 8} y2="34"/>
        </g>
      )
  }
}
