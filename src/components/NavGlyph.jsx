/**
 * Duotone sidebar glyphs — one indigo hue throughout, per the design spec.
 *
 * Everything renders with:
 *   - stroke="currentColor" so the color follows the chip (indigo when rest, white when active)
 *   - .glyph-fill on the ONE duotone shape per icon (goes to none when active)
 *   - .glyph-dot on solid decorative fills that should follow currentColor
 *   - .glyph-hole on white knock-outs (padlock keyhole, price-tag eyelet)
 *
 * The active state is handled entirely in CSS by the parent .nav-item.active.
 */

const SVG_PROPS = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
}
const SW = 1.8

export function NavGlyph({ name }) {
  switch (name) {
    /* ============================================================ Main */
    case 'dashboard':
      // Four rounded panes — no duotone fill (this item is only ever seen active on the dashboard route, and the outlines suffice at rest too)
      return (
        <svg {...SVG_PROPS}>
          <rect x="3.5" y="3.5"  width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.9"/>
          <rect x="13.5" y="3.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.9"/>
          <rect x="3.5" y="13.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.9"/>
          <rect x="13.5" y="13.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.9"/>
        </svg>
      )

    case 'ingredients':
      // Mixing bowl with spoon — bowl filled
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z"/>
          <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z" stroke="currentColor" strokeWidth={SW}/>
          <path d="M9 4.5l2.6 6.5" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'recipes':
      // Open book — left page filled
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M12 6.5C10 5 7.5 4.5 5 4.5v13c2.5 0 5 .5 7 2Z"/>
          <path d="M12 6.5C10 5 7.5 4.5 5 4.5v13c2.5 0 5 .5 7 2 2-1.5 4.5-2 7-2v-13c-2.5 0-5 .5-7 2Z" stroke="currentColor" strokeWidth={SW}/>
          <path d="M12 6.5v13" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'bom':
      // Stacked cake tiers with candle — base tier filled
      return (
        <svg {...SVG_PROPS}>
          <rect className="glyph-fill" x="4" y="13.5" width="16" height="6" rx="2"/>
          <rect x="4" y="13.5" width="16" height="6" rx="2" stroke="currentColor" strokeWidth={SW}/>
          <rect x="6.5" y="8" width="11" height="5" rx="2" stroke="currentColor" strokeWidth={SW}/>
          <path d="M12 4v4" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'costing':
      // Yield dial — measured quadrant filled
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M12 12V3.8a8.2 8.2 0 0 1 8.2 8.2Z"/>
          <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth={SW}/>
          <path d="M12 3.8V12h8.2" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'pricing':
      // Price tag — body filled, eyelet knocked out
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M4.5 11.2V5.4a1 1 0 0 1 1-1h5.8l8 8-6.8 6.8-8-8Z"/>
          <path d="M4.5 11.2V5.4a1 1 0 0 1 1-1h5.8l8 8-6.8 6.8-8-8Z" stroke="currentColor" strokeWidth={SW}/>
          <circle className="glyph-hole" cx="8.4" cy="8.3" r="1.35" stroke="currentColor" strokeWidth="1.6"/>
        </svg>
      )

    case 'inventory':
      // Crate — right face filled
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M12 12l8-4v8.8L12 20.4Z"/>
          <path d="M12 3.6l8 4.4v8.8L12 20.4 4 16.8V8Z" stroke="currentColor" strokeWidth={SW}/>
          <path d="M12 12l8-4M12 12v8.4M12 12L4 8" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'templates':
      // Two stacked cards — the front one filled
      return (
        <svg {...SVG_PROPS}>
          <rect className="glyph-fill" x="4.5" y="8" width="12" height="12" rx="2"/>
          <rect x="7.5" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth={SW}/>
          <rect x="4.5" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth={SW}/>
          <path d="M7 12h7.5M7 15h5" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'vault':
      // Rounded padlock — body filled, shackle outlined
      return (
        <svg {...SVG_PROPS}>
          <rect className="glyph-fill" x="4.5" y="11" width="15" height="10" rx="2.5"/>
          <rect x="4.5" y="11" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth={SW}/>
          <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth={SW} fill="none"/>
          <circle cx="12" cy="15.5" r="1.5" fill="#FFFFFF"/>
          <path d="M12 17v1.5" stroke="#FFFFFF" strokeWidth={SW}/>
        </svg>
      )

    /* ============================================================ You */
    case 'personalize':
      // Artist's palette — body filled, three paint dots solid
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M12 3.6a8.4 8.4 0 0 0 0 16.8c1.4 0 2-1 1.6-2-.4-1.2.3-2.3 1.7-2.3h1.6c1.9 0 3.5-1.5 3.5-3.5 0-5-3.9-9-8.4-9Z"/>
          <path d="M12 3.6a8.4 8.4 0 0 0 0 16.8c1.4 0 2-1 1.6-2-.4-1.2.3-2.3 1.7-2.3h1.6c1.9 0 3.5-1.5 3.5-3.5 0-5-3.9-9-8.4-9Z" stroke="currentColor" strokeWidth={SW}/>
          <circle className="glyph-dot" cx="9"    cy="8.4" r="1.25"/>
          <circle className="glyph-dot" cx="13.6" cy="7.6" r="1.25"/>
          <circle className="glyph-dot" cx="8"    cy="13"  r="1.25"/>
        </svg>
      )

    case 'settings':
      // 8-tooth gear — hub filled
      return (
        <svg {...SVG_PROPS}>
          <circle className="glyph-fill" cx="12" cy="12" r="3.2"/>
          <path d="M12 3.4l1.6 2 2.5-.6.6 2.5 2.3 1.1-1 2.4 1 2.4-2.3 1.1-.6 2.5-2.5-.6-1.6 2-1.6-2-2.5.6-.6-2.5-2.3-1.1 1-2.4-1-2.4 2.3-1.1.6-2.5 2.5.6Z" stroke="currentColor" strokeWidth={SW}/>
          <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    /* ============================================================ Sysadmin › Business */
    case 'orders':
      // Receipt with torn bottom edge — header band filled
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M5.5 3.6h13a1 1 0 0 1 1 1v4.9h-15V4.6a1 1 0 0 1 1-1Z"/>
          <path d="M4.5 4.6a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v15.8l-2.4-1.5-2.4 1.5-2.4-1.5-2.4 1.5-2.4-1.5-1.6 1V4.6Z" stroke="currentColor" strokeWidth={SW}/>
          <path d="M4.5 9.5h15M8.4 13h7.2" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'users':
      // Two figures — front head filled
      return (
        <svg {...SVG_PROPS}>
          <circle className="glyph-fill" cx="9.6" cy="8.4" r="3.4"/>
          <circle cx="9.6" cy="8.4" r="3.4" stroke="currentColor" strokeWidth={SW}/>
          <path d="M3.8 19.4c0-3.2 2.6-5.2 5.8-5.2s5.8 2 5.8 5.2" stroke="currentColor" strokeWidth={SW}/>
          <path d="M16 5.4a3.2 3.2 0 0 1 0 6M18 14.6c2 .6 3.4 2.2 3.4 4.8" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'billing':
      // Payment card — magnetic stripe filled
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M3.2 9.4h17.6v2.8H3.2Z"/>
          <rect x="3.2" y="5" width="17.6" height="14" rx="2.4" stroke="currentColor" strokeWidth={SW}/>
          <path d="M3.2 9.4h17.6M3.2 12.2h17.6M6.6 15.8h3.4" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    /* ============================================================ Sysadmin › Content & Design */
    case 'content':
      // Pencil over page — pencil filled
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M17.2 3.6l3.2 3.2-7.6 7.6H9.6v-3.2Z"/>
          <path d="M19.5 12.8V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.4a2 2 0 0 1 2-2h5.4" stroke="currentColor" strokeWidth={SW}/>
          <path d="M17.2 3.6l3.2 3.2-7.6 7.6H9.6v-3.2Z" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'auth':
      // Padlock — body filled, keyhole knocked out
      return (
        <svg {...SVG_PROPS}>
          <rect className="glyph-fill" x="4.4" y="10.4" width="15.2" height="9.6" rx="2.2"/>
          <rect x="4.4" y="10.4" width="15.2" height="9.6" rx="2.2" stroke="currentColor" strokeWidth={SW}/>
          <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6" stroke="currentColor" strokeWidth={SW}/>
          <circle className="glyph-hole" cx="12" cy="15.2" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )

    case 'gallery':
      // Framed landscape — landscape mass filled
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M4.6 17.4l4.6-5 3.4 3.6 2.6-2.6 4.2 4.4v.6a1.6 1.6 0 0 1-1.6 1.6H6.2a1.6 1.6 0 0 1-1.6-1.6Z"/>
          <rect x="4" y="4.6" width="16" height="14.8" rx="2.2" stroke="currentColor" strokeWidth={SW}/>
          <path d="M4.6 17.4l4.6-5 3.4 3.6 2.6-2.6 4.2 4.4" stroke="currentColor" strokeWidth={SW}/>
          <circle cx="15.4" cy="9" r="1.5" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    /* ============================================================ Sysadmin › Platform */
    case 'platform':
      // Hub with four satellite nodes — hub filled (not stacked bars — that reads as Billing at 18px)
      return (
        <svg {...SVG_PROPS}>
          <rect className="glyph-fill" x="9.2" y="9.2" width="5.6" height="5.6" rx="1.5"/>
          <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1.5" stroke="currentColor" strokeWidth={SW}/>
          <rect x="3"    y="3"    width="4.6" height="4.6" rx="1.3" stroke="currentColor" strokeWidth={SW}/>
          <rect x="16.4" y="3"    width="4.6" height="4.6" rx="1.3" stroke="currentColor" strokeWidth={SW}/>
          <rect x="3"    y="16.4" width="4.6" height="4.6" rx="1.3" stroke="currentColor" strokeWidth={SW}/>
          <rect x="16.4" y="16.4" width="4.6" height="4.6" rx="1.3" stroke="currentColor" strokeWidth={SW}/>
          <path d="M8.9 8.9L7.4 7.4M15.1 8.9l1.5-1.5M8.9 15.1l-1.5 1.5M15.1 15.1l1.5 1.5" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    case 'audit':
      // Page with fold — fold filled
      return (
        <svg {...SVG_PROPS}>
          <path className="glyph-fill" d="M13.4 3.6l6 6h-6Z"/>
          <path d="M13.4 3.6H7a2 2 0 0 0-2 2v12.8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.6Z" stroke="currentColor" strokeWidth={SW}/>
          <path d="M13.4 3.6v6h6" stroke="currentColor" strokeWidth={SW}/>
          <path d="M8.4 13.4h7.2M8.4 16.6h4.4" stroke="currentColor" strokeWidth={SW}/>
        </svg>
      )

    default:
      return null
  }
}

export default NavGlyph
