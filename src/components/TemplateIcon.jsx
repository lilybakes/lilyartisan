/**
 * Small illustrative SVG glyph shown inside each sidebar tpl-item.
 * Rendered ~24×24 inside a 36×36 gradient tile.
 */
export default function TemplateIcon({ type = 'card-lines' }) {
  const props = {
    width:  24, height: 24,
    viewBox: '0 0 24 24',
    fill:    'none',
    stroke:  'currentColor',
    strokeWidth: 1.6,
    strokeLinecap:  'round',
    strokeLinejoin: 'round',
    xmlns: 'http://www.w3.org/2000/svg',
  }

  switch (type) {
    case 'card-lines': // recipes, binder
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2"/>
          <line x1="7"  y1="8"  x2="14" y2="8"  strokeWidth="2"/>
          <line x1="7"  y1="12" x2="17" y2="12"/>
          <line x1="7"  y1="15" x2="16" y2="15"/>
          <line x1="7"  y1="18" x2="15" y2="18"/>
        </svg>
      )

    case 'card-bars': // cost breakdown
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2"/>
          <line x1="7" y1="7" x2="13" y2="7" strokeWidth="2"/>
          <rect x="7"  y="11" width="3" height="7" fill="currentColor" stroke="none" opacity="0.4"/>
          <rect x="11" y="13" width="3" height="5" fill="currentColor" stroke="none" opacity="0.7"/>
          <rect x="15" y="10" width="3" height="8" fill="currentColor" stroke="none"/>
        </svg>
      )

    case 'card-dots': // care & storage
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2" strokeDasharray="2 1.5"/>
          <circle cx="12" cy="8"  r="1.5" fill="currentColor" stroke="none"/>
          <line x1="7"  y1="13" x2="17" y2="13"/>
          <line x1="7"  y1="17" x2="15" y2="17"/>
        </svg>
      )

    case 'card-tag': // product label, delivery tag
      return (
        <svg {...props}>
          <path d="M4 6l3-3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"/>
          <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/>
          <line x1="10" y1="12" x2="17" y2="12"/>
          <line x1="10" y1="16" x2="15" y2="16"/>
        </svg>
      )

    case 'grid': // menu insert
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2"/>
          <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/>
          <line x1="6" y1="12" x2="18" y2="12"/>
          <line x1="6" y1="15" x2="18" y2="15" strokeDasharray="1 1"/>
          <line x1="6" y1="18" x2="18" y2="18"/>
        </svg>
      )

    case 'table': // wholesale price list
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2"/>
          <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2"/>
          <line x1="9"  y1="9" x2="9"  y2="20"/>
          <line x1="15" y1="9" x2="15" y2="20"/>
          <line x1="3"  y1="14" x2="21" y2="14"/>
        </svg>
      )

    case 'square': // social card
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="7"  y1="8"  x2="17" y2="8"/>
          <rect x="7" y="11" width="10" height="4" fill="currentColor" stroke="none" opacity="0.7"/>
          <rect x="9" y="17" width="6"  height="2" rx="1"/>
        </svg>
      )

    case 'circle': // certificate
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2"/>
          <circle cx="12" cy="12" r="4" strokeDasharray="1.5 1"/>
          <line x1="5" y1="17" x2="9"  y2="17"/>
          <line x1="15" y1="17" x2="19" y2="17"/>
        </svg>
      )

    default:
      return (
        <svg {...props}>
          <rect x="4" y="3" width="16" height="18" rx="2"/>
          <line x1="7" y1="9"  x2="17" y2="9"/>
          <line x1="7" y1="13" x2="17" y2="13"/>
          <line x1="7" y1="17" x2="17" y2="17"/>
        </svg>
      )
  }
}
