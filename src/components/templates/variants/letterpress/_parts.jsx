/**
 * Shared primitives used across all 10 Vintage Letterpress templates.
 *
 * The Letterpress voice is: cream paper, thin brown double borders,
 * Playfair Display serif titles, Cormorant Garamond italic sublines,
 * small-caps letter-spaced labels, rule-with-label dividers, fleuron
 * ornaments — highest formality, wedding-invitation grade.
 *
 * Each of the 10 letterpress templates composes these into its own
 * dedicated layout — no shared parent template.
 */

/** Two-letter monogram from a business name — "The Daily Crumb" → "DC" */
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
 * Monogram in a thin-bordered container. Shape varies by template:
 *   shape='square' — Recipe Card, Menu, Care Card, Certificate, Cost Breakdown
 *   shape='circle' — Product Label (small, bottom)
 *   shape='oval'   — Delivery Tag (filled burgundy, cream text)
 * If a logo image is uploaded, it's rendered inside the same shape.
 */
export function LetterpressLogo({ brand, size = 'md', shape = 'square' }) {
  const initials = getMonogramInitials(brand?.business_name)
  const cls = `l-logo l-logo-${shape} l-logo-${size}`
  if (brand?.logo_data_url) {
    return (
      <div className={cls}>
        <img src={brand.logo_data_url} alt="" className="l-logo-img"/>
      </div>
    )
  }
  return <div className={cls}><span>{initials}</span></div>
}

/**
 * Brand lockup — monogram (square) + name + tagline.
 *   layout='column'   — DC on top, name centered below (Recipe Card, Menu, Care Card)
 *   layout='row'      — DC left, name+tagline right (Cost Breakdown, Binder)
 *   layout='textonly' — no DC, just name+tagline centered (Wholesale, Delivery, Social)
 */
export function LetterpressBrandLockup({ brand, size = 'md', layout = 'column' }) {
  const showLogo = layout !== 'textonly'
  return (
    <div className={`l-brand-lockup l-brand-lockup-${layout}`}>
      {showLogo && <LetterpressLogo brand={brand} size={size} shape="square"/>}
      <div className="l-brand-text">
        <h1 className="l-brand-name">{brand?.business_name || 'Your Bakery'}</h1>
        {brand?.tagline && <p className="l-brand-tagline">{brand.tagline}</p>}
      </div>
    </div>
  )
}

/**
 * Rule with a centered small-caps label — signature Letterpress divider.
 * Used under the brand block on Recipe Card ("— RECIPE —"), Menu ("— LA CARTE —").
 */
export function LetterpressRuleWithLabel({ label }) {
  return (
    <div className="l-rule-with-label">
      <span className="l-rule-with-label-line"/>
      <span className="l-rule-with-label-text">{label}</span>
      <span className="l-rule-with-label-line"/>
    </div>
  )
}

/** Double horizontal brown rule (two thin lines close together) */
export function LetterpressDoubleRule({ marginTop, marginBottom }) {
  return <div className="l-rule-double" style={{ marginTop, marginBottom }}/>
}

/** Single thin brown rule */
export function LetterpressRule({ marginTop, marginBottom }) {
  return <div className="l-rule-single" style={{ marginTop, marginBottom }}/>
}

/** Very short accent rule under titles (Care Card, Social Card) */
export function LetterpressShortRule() {
  return <div className="l-rule-short"/>
}

/** Small-caps letter-spaced eyebrow. tone='burgundy' (default) or tone='muted' */
export function LetterpressEyebrow({ children, tone = 'burgundy', className = '' }) {
  return <div className={`l-eyebrow l-eyebrow-${tone} ${className}`}>{children}</div>
}

/**
 * Circular filled seal — burgundy background, cream small-caps text.
 * Certificate uses this ("BAKED / WITH / CARE"). Pass `/`-separated lines.
 */
export function LetterpressSeal({ text, size = 96 }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className="l-seal" style={{ width: size, height: size }}>
      <div className="l-seal-inner">
        {lines.map((l, i) => <span key={i} className="l-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Small ornamental fleuron — used centrally on Recipe Card, Care Card as a
 * decorative accent between the title and body. Stylized curled scroll.
 */
export function LetterpressFleuron({ size = 22 }) {
  return (
    <svg
      className="l-fleuron"
      width={size}
      height={size * 0.55}
      viewBox="0 0 44 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* stylized ampersand-scroll — two mirrored curls */}
      <path d="M22 4 C 16 4, 12 8, 12 12 C 12 16, 16 20, 22 20 C 28 20, 32 16, 32 12 C 32 8, 28 4, 22 4 Z M 22 8 C 25 8, 27 10, 27 12 C 27 14, 25 16, 22 16 C 19 16, 17 14, 17 12 C 17 10, 19 8, 22 8 Z" />
      <path d="M8 12 L 2 12" strokeWidth="1.4" stroke="currentColor" fill="none" strokeLinecap="round"/>
      <path d="M42 12 L 36 12" strokeWidth="1.4" stroke="currentColor" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

/**
 * Corner ornament — placed at each corner of the Certificate inside the border.
 * Small curled-scroll fleuron. `rotate` prop rotates the SVG.
 */
export function LetterpressCornerOrnament({ size = 18, rotate = 0 }) {
  return (
    <svg
      className="l-corner-ornament"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M4 12 C 4 6, 8 4, 12 6 C 16 8, 18 12, 14 14 C 10 16, 8 12, 12 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="18" cy="14" r="1.6"/>
    </svg>
  )
}

/**
 * Footer with a thin rule above address + contact.
 * Every letterpress footer is centered, stacked, small-caps letter-spaced —
 * the "printed business card" look at the bottom of each page.
 */
export function LetterpressFooter({ brand, showSocials = true, extraLine = null }) {
  const address = [brand?.address_line1, brand?.address_line2].filter(Boolean).join(', ')
  const contact = [brand?.phone, brand?.email, brand?.website].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  // Compose into 1-3 centered lines. Letterpress footers are dense, formal.
  const line1 = [address, brand?.phone].filter(Boolean).join(' · ')
  const line2 = [brand?.email, brand?.website].filter(Boolean).join(' · ')

  return (
    <footer className="l-footer">
      <div className="l-rule-single"/>
      <div className="l-footer-content">
        {extraLine && <div className="l-footer-line">{extraLine}</div>}
        {line1 && <div className="l-footer-line">{line1}</div>}
        {line2 && <div className="l-footer-line">{line2}</div>}
        {showSocials && socials && (
          <div className="l-footer-line l-footer-social">{socials}</div>
        )}
      </div>
    </footer>
  )
}

/**
 * Format money — Letterpress prints prices without currency prefix inside
 * tables (context established in a caption) and with prefix elsewhere.
 */
export function letterpressMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

// ============================================================================
// Number-to-words helpers — letterpress typography spells small numbers
// ============================================================================

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const TEENS = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

/** Spell an integer 0–99 as English words; falls through to digits for anything else. */
export function spellOutNumber(n) {
  const int = Number(n)
  if (!Number.isFinite(int) || int < 0 || int > 99 || Math.floor(int) !== int) {
    return String(n)
  }
  if (int < 10) return ONES[int]
  if (int < 20) return TEENS[int - 10]
  const tens = Math.floor(int / 10)
  const ones = int % 10
  return ones === 0 ? TENS[tens] : `${TENS[tens]}-${ONES[ones]}`
}

const ORDINALS_SPECIAL = {
  1: 'first', 2: 'second', 3: 'third', 5: 'fifth',
  8: 'eighth', 9: 'ninth', 12: 'twelfth',
}
/** Spell an integer 1–31 as English ordinal words for dates. */
export function formalOrdinal(n) {
  const int = Number(n)
  if (!Number.isFinite(int) || int < 1 || int > 31) return String(n)
  if (ORDINALS_SPECIAL[int]) return ORDINALS_SPECIAL[int]
  if (int < 20) return spellOutNumber(int) + 'th'
  const tens = Math.floor(int / 10)
  const ones = int % 10
  if (ones === 0) return TENS[tens].replace(/y$/, 'ieth')
  return ORDINALS_SPECIAL[ones]
    ? `${TENS[tens]}-${ORDINALS_SPECIAL[ones]}`
    : `${TENS[tens]}-${spellOutNumber(ones)}th`
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
/** "the thirty-first of July, 2026" — Letterpress-style date */
export function letterpressDate(date = new Date()) {
  const d = date.getDate()
  const m = MONTHS[date.getMonth()]
  const y = date.getFullYear()
  return `the ${formalOrdinal(d)} of ${m}, ${y}`
}
