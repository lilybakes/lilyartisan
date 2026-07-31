/**
 * Shared primitives for the Tessellate variant.
 *
 * The voice: warm cream paper, deep navy ink, ember-rust accent, warm
 * brown secondary. Manrope throughout (700 bold titles, 300 light body,
 * 400 regular). Every meta label runs in JetBrains Mono — wide-tracked,
 * uppercase — so the tessellating checkerboards and diagonal stripe
 * bands feel like a print system, not a slide deck.
 *
 * The 2×2 quadrant logo (brown / rust / cream / navy) is the brand
 * mark. Method chips are SMALL SQUARES with mono numbers — not circles.
 */

export function getMonogramInitials(businessName) {
  if (!businessName) return 'YB'
  const stopwords = new Set(['the', 'a', 'an', 'of', '&', 'and'])
  const words = businessName
    .split(/\s+/)
    .filter(w => w && !stopwords.has(w.toLowerCase()))
  if (words.length === 0) return businessName.slice(0, 2).toUpperCase()
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

/**
 * Four-quadrant 2×2 brand mark — the identifying logo of Tessellate.
 * A perfect square split into 4 equal sub-squares: top-left brown,
 * top-right rust, bottom-left cream, bottom-right navy. If the brand
 * uploads a logo image, that's rendered inside a plain framed square
 * instead. tone='ink' (default) | 'cream' (for use on dark surfaces).
 */
export function TeLogo({ brand, size = 'md', tone = 'ink' }) {
  const cls = `te-logo te-logo-${size} te-logo-${tone}`
  if (brand?.logo_data_url) {
    return (
      <div className={`${cls} te-logo-image`}>
        <img src={brand.logo_data_url} alt="" className="te-logo-img"/>
      </div>
    )
  }
  return (
    <div className={cls} aria-hidden="true">
      <span className="te-logo-q te-logo-q-tl"/>
      <span className="te-logo-q te-logo-q-tr"/>
      <span className="te-logo-q te-logo-q-bl"/>
      <span className="te-logo-q te-logo-q-br"/>
    </div>
  )
}

/**
 * Brand lockup — the quadrant mark + wide-tracked business name.
 * layout='inline' (logo+text row) | 'stacked' (logo above text) |
 * 'textonly' (just the wordmark).
 */
export function TeBrandLockup({ brand, size = 'md', layout = 'inline', tone = 'ink', showTagline = true }) {
  const showLogo = layout !== 'textonly'
  const brandName = (brand?.business_name || 'Your Bakery').toUpperCase()
  const tagline = brand?.tagline
    ? `${brand.tagline}${brand?.city ? ` · ${brand.city.toUpperCase()}` : ''}`
    : (brand?.city ? brand.city.toUpperCase() : null)

  return (
    <div className={`te-brand-lockup te-brand-lockup-${layout}`}>
      {showLogo && <TeLogo brand={brand} size={size} tone={tone}/>}
      <div className="te-brand-text">
        <h1 className={`te-brand-name te-brand-${tone}`}>{brandName}</h1>
        {showTagline && tagline && (
          <p className={`te-brand-tagline te-brand-tagline-${tone}`}>{tagline}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Mono eyebrow — JetBrains Mono, uppercase, wide-tracked. tone controls
 * the colour: 'rust' for section titles (INGREDIENTS, METHOD, etc.),
 * 'muted' for meta labels, 'ink' for strong labels on cream, 'cream'
 * for dark backgrounds.
 */
export function TeEyebrow({ children, tone = 'muted', className = '' }) {
  return <div className={`te-eyebrow te-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Full-width hairline rule */
export function TeRule({ tone = 'hair', marginTop, marginBottom }) {
  return <div className={`te-rule te-rule-${tone}`} style={{ marginTop, marginBottom }}/>
}

/**
 * Short thin horizontal underline (~36mm wide) used under product
 * titles as a divider between title and meta.
 */
export function TeShortRule({ tone = 'ink' }) {
  return <div className={`te-rule-short te-rule-short-${tone}`}/>
}

/**
 * Small-squares dot rule — a horizontal line drawn from ~15-20 tiny
 * navy squares (approx 2×2mm each, ~3mm gaps). Used as a decorative
 * divider under labels, between menu categories, etc. width defaults
 * to '100%' but callers can constrain via className or size prop.
 */
export function TeDotRule({ tone = 'ink', width, className = '' }) {
  return (
    <div
      className={`te-dot-rule te-dot-rule-${tone} ${className}`}
      style={width ? { width } : undefined}
      aria-hidden="true"
    />
  )
}

/**
 * Numbered method chip — 5×5mm SQUARE (not a circle) with a monospace
 * step number inside. Normal: cream fill with a thin navy border and
 * navy number. Accent (last step only): filled rust with a cream
 * number — the singular eye-catch of a method list.
 */
export function TeMethodChip({ number, variant = 'normal' }) {
  return (
    <span className={`te-method-chip te-method-chip-${variant}`}>
      {number}
    </span>
  )
}

/**
 * "MADE BY HAND" seal — a frame border in rust×navy checkerboard
 * around a cream inner square with MADE / BY / HAND text stacked.
 * The border tessellates into the design language.
 */
export function TeSeal({ text, size = 96 }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className="te-seal" style={{ width: size, height: size }}>
      <div className="te-seal-inner">
        {lines.map((l, i) => <span key={i} className="te-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Footer — split (address left, contact right) is the default. Centered
 * for A6/A7 templates. All lines run in JetBrains Mono uppercase.
 */
export function TeFooter({ brand, layout = 'split', showSocials = true }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  if (layout === 'split') {
    return (
      <footer className="te-footer te-footer-split">
        <div className="te-footer-left">
          {addressLines.map((l, i) => <div key={i} className="te-footer-line">{l}</div>)}
        </div>
        <div className="te-footer-right">
          {contact && <div className="te-footer-line">{contact}</div>}
          {showSocials && socials && <div className="te-footer-line">{socials}</div>}
        </div>
      </footer>
    )
  }
  if (layout === 'centered') {
    return (
      <footer className="te-footer te-footer-centered">
        {addressLines.length > 0 && (
          <div className="te-footer-line">{addressLines.join(', ')}</div>
        )}
        {contact && <div className="te-footer-line">{contact}</div>}
        {showSocials && socials && <div className="te-footer-line">{socials}</div>}
      </footer>
    )
  }
  return (
    <footer className="te-footer te-footer-minimal">
      <div className="te-footer-line">
        {[addressLines.join(', '), contact, showSocials ? socials : null]
          .filter(Boolean).join(' · ')}
      </div>
    </footer>
  )
}

/** Money formatter — "RM 10.00" with prefix, bare mode omits it (menu prices). */
export function teMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

/**
 * Spell out small integers as words. mode='upper' | 'lower'. Falls back
 * to digits for values outside 0-20 or non-integer.
 */
export function spellOutNumber(n, { mode = 'lower', fallbackDigits = true } = {}) {
  const num = Number(n)
  if (!Number.isInteger(num) || num < 0 || num > 20) {
    return fallbackDigits ? String(n) : null
  }
  const words = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
    'eighteen', 'nineteen', 'twenty',
  ]
  const w = words[num]
  return mode === 'upper' ? w.toUpperCase() : w
}

/**
 * Normalize a method array into a flat { step } / { group } sequence.
 */
export function normalizeMethod(raw) {
  if (!raw || !Array.isArray(raw)) return []
  const out = []
  let lastGroup = null
  for (const item of raw) {
    if (typeof item === 'string') { out.push({ step: item }); continue }
    if (item && typeof item === 'object') {
      const g = item.group || item.group_label || item.groupLabel
      if (g && g !== lastGroup) { out.push({ group: g }); lastGroup = g }
      const s = item.step || item.text
      if (s) out.push({ step: s })
    }
  }
  return out
}

/** Zero-pad step numbers to two digits, matching the "01" "02" mockup pattern */
export function zeroPad(n) {
  return String(n).padStart(2, '0')
}
