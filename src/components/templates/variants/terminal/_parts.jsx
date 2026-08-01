/**
 * Shared primitives for the Terminal variant.
 *
 * The voice: deep dark navy CRT background, bright terminal teal accent,
 * warm amber for warnings and the final method step. JetBrains Mono is the
 * workhorse for every label, meta, price, and section eyebrow. Manrope 800
 * is reserved for big product titles and brand names. Code/CLI aesthetic —
 * underscores, slashes, kv pairs, ISO dates, `//` sub-headers.
 *
 * The recurring visual language:
 *  - Filled-block sections with a colored left vertical bar (teal or amber)
 *  - Status chips with bullet + wide-tracked mono label
 *  - Method step digits in plain teal mono (last step turns amber)
 *  - Grid-paper background overlay on every large template
 *  - DC square logo mark (never a circle — square with thin teal border)
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
 * Terminal's DC mark — a SQUARE with a thin teal border, initials centered
 * inside in JetBrains Mono teal. If a logo image is uploaded, render it
 * inside the square instead of the initials.
 */
export function TrLogo({ brand, size = 'md' }) {
  const initials = getMonogramInitials(brand?.business_name)
  const cls = `tr-logo tr-logo-${size}`
  if (brand?.logo_data_url) {
    return (
      <div className={cls}>
        <img src={brand.logo_data_url} alt="" className="tr-logo-img"/>
      </div>
    )
  }
  return <div className={cls}><span className="tr-logo-initials">{initials}</span></div>
}

/**
 * Brand lockup — DC square + Manrope 800 name + mono uppercase subtitle
 * ("ARTISAN BAKERY / IPOH" style). tone='default' or 'muted' for the
 * subtitle color.
 */
export function TrBrandLockup({ brand, size = 'md', layout = 'inline' }) {
  const showLogo = layout !== 'textonly'
  const brandName = brand?.business_name || 'Your Bakery'
  const city = (brand?.city ||
    (brand?.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh').toUpperCase()
  const tagline = (brand?.tagline || 'Artisan bakery').toUpperCase()
  const subtitle = `${tagline} / ${city}`

  return (
    <div className={`tr-brand-lockup tr-brand-lockup-${layout}`}>
      {showLogo && <TrLogo brand={brand} size={size}/>}
      <div className="tr-brand-text">
        <h1 className="tr-brand-name">{brandName}</h1>
        <p className="tr-brand-subtitle">{subtitle}</p>
      </div>
    </div>
  )
}

/**
 * Small mono eyebrow — JetBrains Mono uppercase wide-tracked. Used for
 * every section label, meta line, footer term.
 * tone='teal' (default) | 'muted' | 'amber'.
 */
export function TrEyebrow({ children, tone = 'teal', className = '' }) {
  return <div className={`tr-eyebrow tr-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Full-width hairline rule */
export function TrRule({ tone = 'hair', marginTop, marginBottom }) {
  return <div className={`tr-rule tr-rule-${tone}`} style={{ marginTop, marginBottom }}/>
}

/**
 * Status chip: `• LABEL` in JetBrains Mono uppercase, wide-tracked, inside
 * a thin outlined rounded rectangle. tone='teal' (default) | 'amber'.
 * Used for • ACTIVE, • IN STOCK, • BAKED TODAY, • RESTRICTED / INTERNAL.
 */
export function TrStatusChip({ children, tone = 'teal', bullet = true }) {
  return (
    <span className={`tr-status-chip tr-status-chip-${tone}`}>
      {bullet && <span className="tr-status-dot">•</span>}
      <span className="tr-status-label">{children}</span>
    </span>
  )
}

/**
 * Filled block section with a colored vertical bar on its left edge. Used
 * for STORAGE, ALLERGENS, KEEP ME HAPPY, "Internal use only" callouts.
 * tone='teal' (default) | 'amber'. Pass children as anything — eyebrow +
 * body copy typically.
 */
export function TrBarBlock({ children, tone = 'teal', className = '' }) {
  return (
    <div className={`tr-bar-block tr-bar-block-${tone} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Meta cell — dark box with a teal left bar, mono uppercase teal label
 * above, Manrope 700 white value below. Used in Recipe Card 3-cell meta
 * row and Binder Page 4-cell meta row.
 * tone='default' (white value) | 'teal' (teal value — for SELL/UNIT etc).
 */
export function TrMetaCell({ label, value, tone = 'default' }) {
  return (
    <div className={`tr-meta-cell tr-meta-cell-${tone}`}>
      <div className="tr-meta-cell-label">{label}</div>
      <div className="tr-meta-cell-value">{value}</div>
    </div>
  )
}

/**
 * Numbered method digit — plain teal JetBrains Mono digits ("01" "02"),
 * no chip background, right-aligned in the digit column. The FINAL step
 * gets variant='accent' which turns the digit AMBER.
 */
export function TrMethodDigit({ number, variant = 'normal' }) {
  return (
    <span className={`tr-method-digit tr-method-digit-${variant}`}>
      {number}
    </span>
  )
}

/**
 * Terminal footer — split (address left, contact right) is the default,
 * centered for A6/A7 templates. All mono uppercase wide-tracked. The
 * @handle line uses teal color; other lines stay muted.
 */
export function TrFooter({ brand, layout = 'split', showSocials = true }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')
  const socialsList = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean)
  const socialsLine = socialsList.join(' · ')

  if (layout === 'split') {
    return (
      <footer className="tr-footer tr-footer-split">
        <div className="tr-footer-left">
          {addressLines.map((l, i) => (
            <div key={i} className="tr-footer-line">{l.toUpperCase()}</div>
          ))}
        </div>
        <div className="tr-footer-right">
          {contact && <div className="tr-footer-line">{contact.toUpperCase()}</div>}
          {showSocials && socialsLine && (
            <div className="tr-footer-line tr-footer-line-teal">{socialsLine.toUpperCase()}</div>
          )}
        </div>
      </footer>
    )
  }
  if (layout === 'centered') {
    return (
      <footer className="tr-footer tr-footer-centered">
        {addressLines.length > 0 && (
          <div className="tr-footer-line">{addressLines.join(', ').toUpperCase()}</div>
        )}
        {contact && <div className="tr-footer-line">{contact.toUpperCase()}</div>}
        {showSocials && socialsLine && (
          <div className="tr-footer-line tr-footer-line-teal">{socialsLine.toUpperCase()}</div>
        )}
      </footer>
    )
  }
  return (
    <footer className="tr-footer tr-footer-minimal">
      <div className="tr-footer-line">
        {[addressLines.join(', '), contact, showSocials ? socialsLine : null]
          .filter(Boolean).join(' · ').toUpperCase()}
      </div>
    </footer>
  )
}

/** Money formatter — "RM 10.00" with prefix, bare mode omits it. */
export function trMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

/**
 * Spell out small numbers as words — kept for API parity with flour-ink,
 * though Terminal generally uses digits (its aesthetic is code-like, not
 * verbose prose).
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

/** Zero-pad step numbers to two digits ("01" "02"). */
export function zeroPad(n) {
  return String(n).padStart(2, '0')
}

/**
 * ISO-8601 date formatter — YYYY-MM-DD. This is Terminal's date style,
 * appearing on Menu (2026-07), Wholesale (EFFECTIVE 2026-07-31),
 * Certificate (2026-07-31). Defaults to the "today" date fixed to a
 * consistent value so previews are stable, but callers can pass any
 * Date instance.
 */
export function isoDate(d = new Date()) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** ISO year-month YYYY-MM — used by Menu Insert eyebrow. */
export function isoYearMonth(d = new Date()) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}`
}

/**
 * Parse allergens text into an array of uppercase tokens joined by " · "
 * for label/care card display. Handles "Contains: wheat, dairy, eggs.",
 * "wheat, dairy and eggs", etc.
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
 * Bold + amber the opening 1-2 word imperative phrase of the final method
 * step, matching the "Cool completely" / "fully cooled" highlight pattern.
 */
export function renderLastStep(text) {
  if (!text) return null
  const s = String(text).trim()
  const m = s.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)\s+(.+)$/)
  if (m) return <><strong>{m[1]}</strong> {m[2]}</>
  const m2 = s.match(/^(.+?\s+)(\w+\s+\w+)(\s+.+)$/)
  if (m2 && s.length > 30 && s.length < 90) {
    return <>{m2[1]}<strong>{m2[2]}</strong>{m2[3]}</>
  }
  return s
}
