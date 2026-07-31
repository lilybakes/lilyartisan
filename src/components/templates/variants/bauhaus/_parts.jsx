/**
 * Shared primitives for the Bauhaus variant.
 *
 * The voice: warm cream paper, super-heavy Archivo Black titles all caps, and
 * SOLID PRIMARY COLORS — cobalt blue, marigold yellow, vermillion red, near
 * black. Every template opens with a composition of solid geometric shapes
 * across the top: rectangles, quarter-circles, and small full circles that
 * feel structured, iconic, and unapologetically graphic.
 *
 * The recurring marks:
 *   - <BhLogoMark> — a row of 3 small shapes (blue quarter-circle · yellow
 *     circle · red quarter-circle) sitting on a horizontal baseline. Replaces
 *     the DC monogram of the reference variant.
 *   - <BhShapeChip> — flat solid rectangle chips for meta (BREAD · YIELD 1
 *     LOAF · 240°C) and allergens (WHEAT · DAIRY · EGGS). Colors rotate for
 *     visual rhythm.
 *   - <BhMethodChip> — 6×6mm solid SQUARE (not circle) with white mono
 *     number. Blue for normal steps, RED for the final accent step.
 */

/** Extract two-letter monogram from a business name for the wordmark fallback */
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
 * BAUHAUS LOGO MARK — a row of 3 small shapes on a horizontal baseline:
 * blue quarter-circle · yellow full circle · red quarter-circle. This is
 * the top-right mark on the Recipe Card and other templates. If a real
 * logo image is uploaded, render it inside a small container instead.
 *
 * tone='ink' (default) | 'cream' (on the yellow/black backgrounds where
 * we need the yellow disk swapped for cream)
 */
export function BhLogoMark({ brand, size = 'md', tone = 'ink' }) {
  if (brand?.logo_data_url) {
    const box = size === 'sm' ? 26 : size === 'lg' ? 46 : 34
    return (
      <div className={`bh-logo bh-logo-${size} bh-logo-${tone}`} style={{ width: box, height: box }}>
        <img src={brand.logo_data_url} alt="" className="bh-logo-img"/>
      </div>
    )
  }
  return (
    <div className={`bh-logo-mark bh-logo-mark-${size} bh-logo-mark-${tone}`}>
      <span className="bh-logo-mark-qc-blue"/>
      <span className="bh-logo-mark-circle-yellow"/>
      <span className="bh-logo-mark-qc-red"/>
    </div>
  )
}

/**
 * Brand lockup — Archivo Black wordmark + Manrope tracked tagline. Same
 * three layout options as the reference variant (inline / stacked / textonly).
 */
export function BhBrandLockup({ brand, size = 'md', layout = 'inline', tone = 'ink', showTagline = true }) {
  const showLogo = layout !== 'textonly'
  const brandName = (brand?.business_name || 'Your Bakery').toUpperCase()
  const tagline = brand?.tagline
    ? `${brand.tagline}${brand?.city ? ` · ${brand.city.toUpperCase()}` : ''}`
    : (brand?.city ? brand.city.toUpperCase() : null)

  return (
    <div className={`bh-brand-lockup bh-brand-lockup-${layout}`}>
      {showLogo && <BhLogoMark brand={brand} size={size} tone={tone}/>}
      <div className="bh-brand-text">
        <h1 className={`bh-brand-name bh-brand-${tone}`}>{brandName}</h1>
        {showTagline && tagline && (
          <p className={`bh-brand-tagline bh-brand-tagline-${tone}`}>{tagline}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Meta/eyebrow — Manrope 700 wide-tracked uppercase.
 * tone='blue' (section eyebrows), 'red' (accent moments — INGREDIENTS,
 * CHEF'S NOTES), 'black' (structural labels), 'muted' (secondary meta),
 * 'cream' (on colored backgrounds).
 */
export function BhEyebrow({ children, tone = 'muted', className = '' }) {
  return <div className={`bh-eyebrow bh-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Thick horizontal rule — Bauhaus doesn't do hairlines. Default 2px. */
export function BhRule({ tone = 'ink', weight = 'medium', marginTop, marginBottom }) {
  return (
    <div
      className={`bh-rule bh-rule-${tone} bh-rule-${weight}`}
      style={{ marginTop, marginBottom }}
    />
  )
}

/**
 * Solid rectangle chip — used for meta pills, allergen chips, menu category
 * badges. Sharp corners, Manrope 700 uppercase, tight tracking.
 * color='black' | 'blue' | 'yellow' | 'red'
 * size='sm' | 'md'
 */
export function BhShapeChip({ children, color = 'black', size = 'md' }) {
  return <span className={`bh-chip bh-chip-${color} bh-chip-${size}`}>{children}</span>
}

/**
 * Numbered method chip — 6×6mm solid SQUARE (not circle) with a white mono
 * number. Normal = solid blue. The FINAL step gets `variant='accent'` — solid
 * RED — the moment of visual arrival.
 */
export function BhMethodChip({ number, variant = 'normal' }) {
  return (
    <span className={`bh-method-chip bh-method-chip-${variant}`}>
      {number}
    </span>
  )
}

/**
 * Footer — split (address left, contact right) is the default. Centered for
 * A6/A7 templates. Manrope 400 with the wide-tracked feel of the variant.
 */
export function BhFooter({ brand, layout = 'split', showSocials = true }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  if (layout === 'split') {
    return (
      <footer className="bh-footer bh-footer-split">
        <div className="bh-footer-left">
          {addressLines.map((l, i) => <div key={i} className="bh-footer-line">{l}</div>)}
        </div>
        <div className="bh-footer-right">
          {contact && <div className="bh-footer-line">{contact}</div>}
          {showSocials && socials && <div className="bh-footer-line">{socials}</div>}
        </div>
      </footer>
    )
  }
  if (layout === 'centered') {
    return (
      <footer className="bh-footer bh-footer-centered">
        {addressLines.length > 0 && (
          <div className="bh-footer-line">{addressLines.join(', ')}</div>
        )}
        {contact && <div className="bh-footer-line">{contact}</div>}
        {showSocials && socials && <div className="bh-footer-line">{socials}</div>}
      </footer>
    )
  }
  return (
    <footer className="bh-footer bh-footer-minimal">
      <div className="bh-footer-line">
        {[addressLines.join(', '), contact, showSocials ? socials : null]
          .filter(Boolean).join(' · ')}
      </div>
    </footer>
  )
}

/** Money formatter — "RM 10.00" with prefix, bare mode omits it (menu prices). */
export function bhMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

/** Zero-pad step numbers to two digits, matching the "01" "02" pattern */
export function zeroPad(n) {
  return String(n).padStart(2, '0')
}

/**
 * Normalize a method array into a flat { step } / { group } sequence.
 * (Same shape as the reference variant — supports plain strings or
 * { step, group } objects with grouping preserved in order.)
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
