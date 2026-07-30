// Feature icons — used on Landing.jsx feature cards.
// Key must match a value in FEATURE_ICON_OPTIONS.

const P = { viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round' }

export function FeatureIcon({ name }) {
  switch (name) {
    case 'cost': return (
      <svg {...P}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
        <path d="M12 6v2M12 16v2"/>
      </svg>
    )
    case 'chart': return (
      <svg {...P}>
        <path d="M12 20V10"/>
        <path d="M18 20V4"/>
        <path d="M6 20v-6"/>
      </svg>
    )
    case 'measure': return (
      <svg {...P}>
        <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )
    case 'mobile': return (
      <svg {...P}>
        <rect x="5" y="2" width="14" height="20" rx="3"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    )
    case 'export': return (
      <svg {...P}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    )
    case 'private': return (
      <svg {...P}>
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    )
    case 'clock': return (
      <svg {...P}>
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    )
    case 'sparkle': return (
      <svg {...P}>
        <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18"/>
      </svg>
    )
    default: return (
      <svg {...P}>
        <circle cx="12" cy="12" r="9"/>
      </svg>
    )
  }
}
