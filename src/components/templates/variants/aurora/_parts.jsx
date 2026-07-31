/**
 * Shared primitives for the Aurora variant.
 *
 * The voice: soft lavender paper, deep purple ink, and a signature four-stop
 * aurora gradient — purple → teal → pink — used everywhere as a full-width
 * band, chip fill, bar fill, and border. Manrope extrabold titles, purple
 * letter-tracked eyebrows, gradient-filled pill chips. The one hot accent —
 * a solid pink circle — is reserved for the FINAL method step.
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
 * Aurora circle mark — thin outlined circle in white (on gradient bands) or
 * purple (on paper). If a logo image is uploaded, render it inside the
 * circle; otherwise show the two-letter monogram in Manrope 700.
 * tone='ink' (purple on paper) | 'cream' (white on gradient).
 */
export function AuLogo({ brand, size = 'md', tone = 'ink' }) {
  const initials = getMonogramInitials(brand?.business_name)
  const cls = `au-logo au-logo-${size} au-logo-${tone}`
  if (brand?.logo_data_url) {
    return (
      <div className={cls}>
        <img src={brand.logo_data_url} alt="" className="au-logo-img"/>
      </div>
    )
  }
  return <div className={cls}><span className="au-logo-initials">{initials}</span></div>
}

/**
 * Brand lockup — Manrope extrabold business name + small-caps tagline.
 * layout='inline' | 'stacked' | 'textonly'
 * tone='ink' (purple on paper) | 'cream' (white on gradient).
 */
export function AuBrandLockup({ brand, size = 'md', layout = 'inline', tone = 'ink', showTagline = true }) {
  const showLogo = layout !== 'textonly'
  const brandName = (brand?.business_name || 'Your Bakery').toUpperCase()
  const tagline = brand?.tagline
    ? `${brand.tagline}${brand?.city ? ` · ${brand.city.toUpperCase()}` : ''}`
    : (brand?.city ? brand.city.toUpperCase() : null)

  return (
    <div className={`au-brand-lockup au-brand-lockup-${layout}`}>
      {showLogo && <AuLogo brand={brand} size={size} tone={tone}/>}
      <div className="au-brand-text">
        <h1 className={`au-brand-name au-brand-${tone}`}>{brandName}</h1>
        {showTagline && tagline && (
          <p className={`au-brand-tagline au-brand-tagline-${tone}`}>{tagline}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Small-caps eyebrow — Manrope 700, uppercase, letter-tracked. Purple by
 * default on paper; cream/white on gradient. The workhorse label for every
 * section title, meta line, and footer.
 * tone='ink' (deep ink) | 'purple' (--au-purple) | 'muted' | 'cream'.
 */
export function AuEyebrow({ children, tone = 'purple', className = '' }) {
  return <div className={`au-eyebrow au-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Full-width hairline rule */
export function AuRule({ tone = 'hair', marginTop, marginBottom }) {
  return <div className={`au-rule au-rule-${tone}`} style={{ marginTop, marginBottom }}/>
}

/**
 * Short thin horizontal underline — used sparingly under titles. Aurora
 * uses this less than flour-ink because the gradient band + huge title
 * already carries the divider job.
 */
export function AuShortRule({ tone = 'ink' }) {
  return <div className={`au-rule-short au-rule-short-${tone}`}/>
}

/**
 * Numbered method chip — solid gradient-filled circle with a white number
 * (Manrope 700). The FINAL step gets `variant='accent'` — solid hot pink
 * fill — the singular accent moment for the recipe method.
 */
export function AuMethodChip({ number, variant = 'normal' }) {
  return (
    <span className={`au-method-chip au-method-chip-${variant}`}>
      {number}
    </span>
  )
}

/**
 * Gradient pill chip — the signature UI element. Filled with the horizontal
 * aurora gradient, white Manrope 700 text, letter-tracked. Used for
 * allergens, category tags, meta chips.
 */
export function AuChip({ children, variant = 'fill', className = '' }) {
  return (
    <span className={`au-chip au-chip-${variant} ${className}`}>
      {children}
    </span>
  )
}

/**
 * Gradient circle mark — used on Certificate. A small solid gradient-filled
 * circle with optional stacked white text inside.
 */
export function AuGradientCircle({ text, size = 96 }) {
  const lines = text ? text.split('/').map(s => s.trim()) : []
  return (
    <div className="au-grad-circle" style={{ width: size, height: size }}>
      <div className="au-grad-circle-inner">
        {lines.map((l, i) => <span key={i} className="au-grad-circle-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Footer — split (default), centered (A6/A7), minimal. Colors adapt via
 * class; on paper the footer is muted purple, on gradient it's cream.
 */
export function AuFooter({ brand, layout = 'split', showSocials = true, tone = 'ink' }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  const cls = `au-footer au-footer-${layout} au-footer-${tone}`

  if (layout === 'split') {
    return (
      <footer className={cls}>
        <div className="au-footer-left">
          {addressLines.map((l, i) => <div key={i} className="au-footer-line">{l}</div>)}
        </div>
        <div className="au-footer-right">
          {contact && <div className="au-footer-line">{contact}</div>}
          {showSocials && socials && <div className="au-footer-line">{socials}</div>}
        </div>
      </footer>
    )
  }
  if (layout === 'centered') {
    return (
      <footer className={cls}>
        {addressLines.length > 0 && (
          <div className="au-footer-line">{addressLines.join(', ')}</div>
        )}
        {contact && <div className="au-footer-line">{contact}</div>}
        {showSocials && socials && <div className="au-footer-line">{socials}</div>}
      </footer>
    )
  }
  return (
    <footer className={cls}>
      <div className="au-footer-line">
        {[addressLines.join(', '), contact, showSocials ? socials : null]
          .filter(Boolean).join(' · ')}
      </div>
    </footer>
  )
}

/** Money formatter — "RM 10.00" with prefix, bare mode omits it (menu prices). */
export function auMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
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

/** Parse allergen string into a clean list — same helper flour-ink uses. */
export function parseAllergens(raw) {
  if (!raw) return []
  return raw
    .replace(/^\s*contains?\s*:?\s*/i, '')
    .replace(/\.\s*$/, '')
    .split(/\s*,\s*|\s+and\s+/i)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.toUpperCase())
}

/**
 * Format a quantity with unit — inserts a non-breaking space between the
 * numeric part and the unit ("500 g", "350 ml"). Returns the qty string
 * unchanged if no unit is present.
 */
export function formatQtyUnit(qty, unit) {
  if (qty === undefined || qty === null || qty === '') return unit ? unit.toUpperCase() : ''
  if (!unit) return String(qty)
  return `${qty} ${unit.toUpperCase()}`
}
