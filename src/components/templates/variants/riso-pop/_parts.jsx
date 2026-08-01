/**
 * Shared primitives for the Riso Pop variant.
 *
 * The voice: risograph misregistration. Warm cream paper, deep navy ink,
 * rust orange-red accents. Every major title uses the OFFSET TITLE EFFECT
 * — a rust duplicate offset ~5px down-right behind a navy foreground copy
 * — so the title reads like an offset-printed poster where the color
 * plates don't quite line up.
 *
 * The other recurring mark is the SOLID FILLED CIRCLE — rust and navy
 * disks appear in the composition on nearly every template, sometimes
 * overlapping, in which case the top circle gets `mix-blend-mode: multiply`
 * so its intersection with the disk beneath renders as a deep brown
 * "overprint" region — no need to hardcode a brown shape.
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
 * OFFSET TITLE — the defining move of Riso Pop. Renders the same text
 * twice: a RUST copy positioned ~5px down-right, and a NAVY copy on top.
 * Reads as an offset-printed poster with plate misregistration.
 *
 * Sizes: sm (30), md (44), lg (56), xl (72). tone='default' | 'oncolor'
 * (inverts to cream front + navy shadow — used when the title sits on
 * a rust-filled surface).
 */
export function RpOffsetTitle({ children, className = '', size = 'lg', tone = 'default' }) {
  const text = typeof children === 'string' ? children : String(children ?? '')
  const toneCls = tone === 'oncolor' ? 'rp-offset-title-oncolor' : ''
  return (
    <h2 className={`rp-offset-title rp-offset-title-${size} ${toneCls} ${className}`}>
      <span className="rp-offset-title-shadow" aria-hidden="true">{text}</span>
      <span className="rp-offset-title-front">{text}</span>
    </h2>
  )
}

/**
 * Brand wordmark — Manrope 800 title-case (the business name as given),
 * tight letter-spacing. The brand tagline+city underneath uses the wide-
 * tracked meta label style in RUST on cream (or cream on colored bg).
 */
export function RpBrandLockup({ brand, tone = 'default', showTagline = true, className = '' }) {
  const name = brand?.business_name || 'Your Bakery'
  const cityLine = brand?.city ||
    (brand?.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const tagline = brand?.tagline
    ? `${brand.tagline} · ${cityLine}`.toUpperCase()
    : `Artisan bakery · ${cityLine}`.toUpperCase()

  const toneCls = tone === 'oncolor' ? 'rp-brand-lockup-oncolor' : ''
  return (
    <div className={`rp-brand-lockup ${toneCls} ${className}`}>
      <div className="rp-brand-name">{name}</div>
      {showTagline && (
        <div className="rp-brand-tagline">{tagline}</div>
      )}
    </div>
  )
}

/**
 * Meta label / eyebrow — Manrope 700 uppercase, wide tracking. Colours:
 *   tone='rust'   — rust on cream (default eyebrow)
 *   tone='navy'   — navy on cream (occasional)
 *   tone='muted'  — soft muted color
 *   tone='cream'  — cream on colored backgrounds
 */
export function RpEyebrow({ children, tone = 'rust', className = '' }) {
  return <div className={`rp-eyebrow rp-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Thin horizontal rule. tone='navy' | 'navy-thick' | 'hair' | 'cream' */
export function RpRule({ tone = 'hair', marginTop, marginBottom, className = '' }) {
  return (
    <div
      className={`rp-rule rp-rule-${tone} ${className}`}
      style={{ marginTop, marginBottom }}
    />
  )
}

/**
 * Meta pill — small solid rectangular chip. variant:
 *   'navy'    — solid navy, cream text (default)
 *   'rust'    — solid rust, cream text
 *   'outline' — cream bg, navy 1px outline, navy text
 */
export function RpMetaPill({ children, variant = 'navy', className = '' }) {
  return (
    <span className={`rp-meta-pill rp-meta-pill-${variant} ${className}`}>
      {children}
    </span>
  )
}

/**
 * Numbered method chip. variant='normal' — plain rust digit right-aligned
 * (no fill, just tinted text). variant='accent' — filled RUST square with
 * a cream number centered. variant='navy' — filled NAVY square (used for
 * the LAST binder-page step).
 */
export function RpMethodChip({ number, variant = 'normal' }) {
  return (
    <span className={`rp-method-chip rp-method-chip-${variant}`}>
      {number}
    </span>
  )
}

/**
 * Solid filled circle — the recurring shape mark. Positioned absolutely
 * by the caller. When two circles overlap in a composition, put
 * `blend={true}` on the ONE ON TOP to get the brown overprint intersection
 * via `mix-blend-mode: multiply`.
 */
export function RpCircle({ color = 'rust', size = 40, top, left, right, bottom, blend = false, className = '' }) {
  const style = { width: `${size}mm`, height: `${size}mm`, top, left, right, bottom }
  return (
    <div
      className={`rp-circle rp-circle-${color} ${blend ? 'rp-circle-blend' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

/** Footer — split (address left, contact right) is the default. */
export function RpFooter({ brand, layout = 'split', showSocials = true, tone = 'default' }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  const toneCls = tone === 'oncolor' ? 'rp-footer-oncolor' : ''

  if (layout === 'split') {
    return (
      <footer className={`rp-footer rp-footer-split ${toneCls}`}>
        <div className="rp-footer-left">
          {addressLines.map((l, i) => <div key={i} className="rp-footer-line">{l}</div>)}
        </div>
        <div className="rp-footer-right">
          {contact && <div className="rp-footer-line">{contact}</div>}
          {showSocials && socials && <div className="rp-footer-line rp-footer-line-accent">{socials}</div>}
        </div>
      </footer>
    )
  }
  if (layout === 'centered') {
    return (
      <footer className={`rp-footer rp-footer-centered ${toneCls}`}>
        {addressLines.length > 0 && (
          <div className="rp-footer-line">{addressLines.join(', ')}</div>
        )}
        {contact && <div className="rp-footer-line">{contact}</div>}
        {showSocials && socials && <div className="rp-footer-line rp-footer-line-accent">{socials}</div>}
      </footer>
    )
  }
  return (
    <footer className={`rp-footer rp-footer-minimal ${toneCls}`}>
      <div className="rp-footer-line">
        {[addressLines.join(', '), contact, showSocials ? socials : null]
          .filter(Boolean).join(' · ')}
      </div>
    </footer>
  )
}

/** Money formatter — "RM 10.00" default, bare mode omits currency. */
export function rpMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

/** Spell out small numbers as words — kept for parity with flour-ink;
 * Riso Pop uses digits mostly ("1 loaf", "10 slices"), but the helper
 * stays available for any prose that wants it. */
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

/** Normalize method array into a flat { step } / { group } sequence. */
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

/** Zero-pad step numbers to two digits ("01", "02"). */
export function zeroPad(n) {
  return String(n).padStart(2, '0')
}

/**
 * Parse "Contains: wheat, dairy and eggs." → ["WHEAT", "DAIRY", "EGGS"].
 * Same parser used across the variant set.
 */
export function parseAllergens(raw) {
  if (!raw) return []
  return String(raw)
    .replace(/^\s*contains?\s*:?\s*/i, '')
    .replace(/\.\s*$/, '')
    .split(/\s*,\s*|\s+and\s+/i)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.toUpperCase())
}

/**
 * Bold the leading 1-2-word imperative of the LAST method step
 * ("Cool completely and slice." → "**Cool completely** and slice.").
 * Same regex used across the variant set.
 */
export function renderLastStep(text) {
  if (!text) return null
  const s = String(text).trim()
  const m = s.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)\s+(.+)$/)
  if (m) return <><strong>{m[1]}</strong> {m[2]}</>
  return s
}
