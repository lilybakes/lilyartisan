/**
 * Shared primitives for the Flour & Ink variant.
 *
 * The voice: cream paper, near-black ink, stone-tan for Delivery Tag and
 * photo placeholder. Jost throughout, light weights, wide letter-tracking
 * on every title and label. The one dark accent — a filled black circle —
 * is reserved for the FINAL method step and the Cost Sheet's suggested
 * price rectangle. Reads as a print artifact.
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
 * Thin-outlined DC circle — the ONE recurring mark of Flour & Ink.
 * If a logo image is uploaded, render it inside the circle; otherwise
 * show the two-letter monogram in wide-tracked small caps.
 * tone='ink' (default) or 'cream' (for use on the ink-black Social Card).
 */
export function FiLogo({ brand, size = 'md', tone = 'ink' }) {
  const initials = getMonogramInitials(brand?.business_name)
  const cls = `fi-logo fi-logo-${size} fi-logo-${tone}`
  if (brand?.logo_data_url) {
    return (
      <div className={cls}>
        <img src={brand.logo_data_url} alt="" className="fi-logo-img"/>
      </div>
    )
  }
  const spaced = initials.split('').join(' ')  // "DC" → "D C" for the tracked feel
  return <div className={cls}><span className="fi-logo-initials">{spaced}</span></div>
}

/**
 * Brand lockup — letter-tracked business name + small-caps tagline. The
 * whole thing typesets in Jost with wide tracking. No serifs, no drama.
 * layout='inline' (logo+text row) | 'stacked' (logo above text, centered)
 * | 'textonly' (just the wordmark, no logo)
 */
export function FiBrandLockup({ brand, size = 'md', layout = 'inline', tone = 'ink', showTagline = true }) {
  const showLogo = layout !== 'textonly'
  const brandName = (brand?.business_name || 'Your Bakery').toUpperCase()
  const tagline = brand?.tagline
    ? `${brand.tagline}${brand?.city ? ` · ${brand.city.toUpperCase()}` : ''}`
    : (brand?.city ? brand.city.toUpperCase() : null)

  return (
    <div className={`fi-brand-lockup fi-brand-lockup-${layout}`}>
      {showLogo && <FiLogo brand={brand} size={size} tone={tone}/>}
      <div className="fi-brand-text">
        <h1 className={`fi-brand-name fi-brand-${tone}`}>{brandName}</h1>
        {showTagline && tagline && (
          <p className={`fi-brand-tagline fi-brand-tagline-${tone}`}>{tagline}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Small-caps eyebrow — Jost, wide-tracked. tone='ink' | 'muted' | 'cream'.
 * The workhorse label for every section title, meta line, and footer.
 */
export function FiEyebrow({ children, tone = 'muted', className = '' }) {
  return <div className={`fi-eyebrow fi-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Full-width hairline rule */
export function FiRule({ tone = 'hair', marginTop, marginBottom }) {
  return <div className={`fi-rule fi-rule-${tone}`} style={{ marginTop, marginBottom }}/>
}

/**
 * Short thin horizontal underline — appears under nearly every product
 * title in the set. Width is small (~30-40mm), acts as a divider between
 * title and meta.
 */
export function FiShortRule({ tone = 'ink' }) {
  return <div className={`fi-rule-short fi-rule-short-${tone}`}/>
}

/**
 * Numbered method chip — thin outlined circle with the step number
 * centered. The FINAL step gets `variant='accent'` — filled black with a
 * cream number — the singular dark accent of the whole variant.
 */
export function FiMethodChip({ number, variant = 'normal' }) {
  return (
    <span className={`fi-method-chip fi-method-chip-${variant}`}>
      {number}
    </span>
  )
}

/**
 * Heavy outlined seal — the "MADE BY HAND" mark on Certificate, drawn
 * with a MUCH thicker stroke than the DC monogram (3px vs 1px) so it
 * anchors the composition. Text runs vertically stacked inside.
 */
export function FiSeal({ text, size = 96 }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className="fi-seal" style={{ width: size, height: size }}>
      <div className="fi-seal-inner">
        {lines.map((l, i) => <span key={i} className="fi-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Footer — split (address left, contact right) is the default. Centered
 * for A6/A7 templates. Everything is small-caps letter-tracked in the
 * Flour & Ink voice.
 */
export function FiFooter({ brand, layout = 'split', showSocials = true }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  if (layout === 'split') {
    return (
      <footer className="fi-footer fi-footer-split">
        <div className="fi-footer-left">
          {addressLines.map((l, i) => <div key={i} className="fi-footer-line">{l}</div>)}
        </div>
        <div className="fi-footer-right">
          {contact && <div className="fi-footer-line">{contact}</div>}
          {showSocials && socials && <div className="fi-footer-line">{socials}</div>}
        </div>
      </footer>
    )
  }
  if (layout === 'centered') {
    return (
      <footer className="fi-footer fi-footer-centered">
        {addressLines.length > 0 && (
          <div className="fi-footer-line">{addressLines.join(', ')}</div>
        )}
        {contact && <div className="fi-footer-line">{contact}</div>}
        {showSocials && socials && <div className="fi-footer-line">{socials}</div>}
      </footer>
    )
  }
  return (
    <footer className="fi-footer fi-footer-minimal">
      <div className="fi-footer-line">
        {[addressLines.join(', '), contact, showSocials ? socials : null]
          .filter(Boolean).join(' · ')}
      </div>
    </footer>
  )
}

/** Money formatter — "RM 10.00" with prefix, bare mode omits it (menu prices). */
export function fiMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

/**
 * Spell out small numbers as words — matches the "YIELD TWELVE", "TEN
 * UNITS", "thirty per cent", "fourteen days" pattern that appears
 * throughout the set. Falls back to the digit form for larger numbers
 * or non-integer values. Preserves case per the caller's preference:
 * `mode='upper'` for headings, `mode='lower'` for prose.
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
