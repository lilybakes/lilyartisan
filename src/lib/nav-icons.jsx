// Sidebar navigation icons — proposal 5D (duotone, one brand hue).
// Every glyph is drawn on a 24×24 optical box, stroke 1.8, round caps and joins.
// - Class .s   → stroke shapes (violet in rest, white in active)
// - Class .f   → the one identifying region that's flood-filled (lavender in rest, transparent in active)
// - Class .fe  → "filled eyelet" (white with violet stroke — used by the price-tag hole)
// Colors and active-state overrides live in styles.css so the icons don't need to know about state.

export const NAV_GLYPHS = {
  dash: (
    <>
      <rect x="3.5"  y="3.5"  width="7" height="7" rx="2" className="s"/>
      <rect x="13.5" y="3.5"  width="7" height="7" rx="2" className="s"/>
      <rect x="3.5"  y="13.5" width="7" height="7" rx="2" className="s"/>
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" className="s"/>
    </>
  ),
  ingredients: (
    <>
      <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z" className="f"/>
      <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z" className="s"/>
      <path d="M9 4.5l2.6 6.5" className="s"/>
    </>
  ),
  recipes: (
    <>
      <path d="M12 6.5C10 5 7.5 4.5 5 4.5v13c2.5 0 5 .5 7 2Z" className="f"/>
      <path d="M12 6.5C10 5 7.5 4.5 5 4.5v13c2.5 0 5 .5 7 2 2-1.5 4.5-2 7-2v-13c-2.5 0-5 .5-7 2Z" className="s"/>
      <path d="M12 6.5v13" className="s"/>
    </>
  ),
  bom: (
    <>
      <rect x="4" y="13.5" width="16" height="6" rx="2" className="f"/>
      <rect x="4" y="13.5" width="16" height="6" rx="2" className="s"/>
      <rect x="6.5" y="8" width="11" height="5" rx="2" className="s"/>
      <path d="M12 4v4" className="s"/>
    </>
  ),
  costing: (
    <>
      <path d="M12 12V3.8a8.2 8.2 0 0 1 8.2 8.2Z" className="f"/>
      <circle cx="12" cy="12" r="8.2" className="s"/>
      <path d="M12 3.8V12h8.2" className="s"/>
    </>
  ),
  pricing: (
    <>
      <path d="M4.5 11.2V5.4a1 1 0 0 1 1-1h5.8l8 8-6.8 6.8-8-8Z" className="f"/>
      <path d="M4.5 11.2V5.4a1 1 0 0 1 1-1h5.8l8 8-6.8 6.8-8-8Z" className="s"/>
      <circle cx="8.4" cy="8.3" r="1.35" className="fe"/>
    </>
  ),
  inventory: (
    <>
      <path d="M12 12l8-4v8.8L12 20.4Z" className="f"/>
      <path d="M12 3.6l8 4.4v8.8L12 20.4 4 16.8V8Z" className="s"/>
      <path d="M12 12l8-4M12 12v8.4M12 12L4 8" className="s"/>
    </>
  ),

  // Extended to match the 5D recipe: one filled key shape, everything else stroke.
  // Used under the "System" section. Filled shape is the center hub.
  settings: (
    <>
      <circle cx="12" cy="12" r="3" className="f"/>
      <circle cx="12" cy="12" r="3" className="s"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" className="s"/>
    </>
  ),
}

export function NavIcon({ name, size = 18 }) {
  const glyph = NAV_GLYPHS[name]
  if (!glyph) return null
  return (
    <svg
      className="nav-glyph"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      fill="none"
    >
      {glyph}
    </svg>
  )
}
