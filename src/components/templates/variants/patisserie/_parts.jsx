/**
 * Shared primitives for the Patisserie variant.
 *
 * The voice: warm cream paper, deep pinkish burgundy ink, blush pink washes
 * for the Care Card and Delivery Tag, muted rose for section eyebrows,
 * champagne gold for delicate frame borders and short accent rules.
 * Cormorant Garamond for elegant serif titles; Manrope for body prose.
 * Method steps render as gold Roman numerals — the final numeral turns
 * burgundy. Numbers spell out as words wherever it feels natural.
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
 * Gold-ring DC circle — the recurring mark of Patisserie. Thin ~1px gold
 * ring with burgundy Cormorant letters inside. If a logo image is uploaded,
 * it renders inside the ring; otherwise show the two-letter monogram.
 * tone='ink' (default burgundy on cream) or 'cream' (for use on the deep
 * burgundy Social Card).
 */
export function PaLogo({ brand, size = 'md', tone = 'ink' }) {
  const initials = getMonogramInitials(brand?.business_name)
  const cls = `pa-logo pa-logo-${size} pa-logo-${tone}`
  if (brand?.logo_data_url) {
    return (
      <div className={cls}>
        <img src={brand.logo_data_url} alt="" className="pa-logo-img"/>
      </div>
    )
  }
  return <div className={cls}><span className="pa-logo-initials">{initials}</span></div>
}

/**
 * Brand lockup — Cormorant serif business name over an italic Manrope
 * tagline+city. Restrained, delicate. layout='inline' (logo+text row)
 * | 'stacked' (logo above text, centered) | 'textonly' (just wordmark).
 */
export function PaBrandLockup({ brand, size = 'md', layout = 'inline', tone = 'ink', showTagline = true }) {
  const showLogo = layout !== 'textonly'
  const brandName = brand?.business_name || 'Your Bakery'
  const tagline = brand?.tagline
    ? `${brand.tagline}${brand?.city ? ` — ${brand.city}` : ''}`
    : (brand?.city ? `Artisan bakery — ${brand.city}` : null)

  return (
    <div className={`pa-brand-lockup pa-brand-lockup-${layout}`}>
      {showLogo && <PaLogo brand={brand} size={size} tone={tone}/>}
      <div className="pa-brand-text">
        <h1 className={`pa-brand-name pa-brand-${tone}`}>{brandName}</h1>
        {showTagline && tagline && (
          <p className={`pa-brand-tagline pa-brand-tagline-${tone}`}>{tagline}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Section eyebrow — Manrope uppercase, wide tracked, rendered in MAUVE
 * by default (INGREDIENTS, METHOD, STORAGE, ALLERGENS, etc.). tones:
 * 'mauve' (default), 'muted', 'burgundy', 'cream'.
 */
export function PaEyebrow({ children, tone = 'mauve', className = '' }) {
  return <div className={`pa-eyebrow pa-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Full-width hairline rule (tone='hair' | 'mauve' | 'gold' | 'cream'). */
export function PaRule({ tone = 'hair', marginTop, marginBottom }) {
  return <div className={`pa-rule pa-rule-${tone}`} style={{ marginTop, marginBottom }}/>
}

/**
 * Short gold rule — a delicate ~30-40mm horizontal `--pa-gold` line that
 * sits under product titles on Recipe Card / Care Card / Certificate as
 * a refined decorative underline.
 */
export function PaShortRule({ tone = 'gold' }) {
  return <div className={`pa-rule-short pa-rule-short-${tone}`}/>
}

/**
 * Muted italic subtitle — Manrope 400 italic. The recurring meta line
 * for tagline+city ("Artisan bakery — Ipoh"), recipe meta ("Bread · one
 * loaf · 240°C"), cost yield line, effective date, thank-you note.
 */
export function PaSubtitle({ children, tone = 'muted', className = '' }) {
  return <p className={`pa-subtitle pa-subtitle-${tone} ${className}`}>{children}</p>
}

/**
 * Gold-ring seal — the small ~16mm "MADE / BY / HAND" mark on the
 * Certificate. Thin gold ring with stacked burgundy Cormorant lines.
 */
export function PaSeal({ text, size = 60 }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className="pa-seal" style={{ width: size, height: size }}>
      <div className="pa-seal-inner">
        {lines.map((l, i) => <span key={i} className="pa-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Footer — split (address left, contact right) is the default. Centered
 * for A6/A7 templates. Restrained italic muted lines in the Patisserie
 * voice — never uppercase-tracked.
 */
export function PaFooter({ brand, layout = 'split', showSocials = true }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  if (layout === 'split') {
    return (
      <footer className="pa-footer pa-footer-split">
        <div className="pa-footer-left">
          {addressLines.map((l, i) => <div key={i} className="pa-footer-line">{l}</div>)}
        </div>
        <div className="pa-footer-right">
          {contact && <div className="pa-footer-line">{contact}</div>}
          {showSocials && socials && <div className="pa-footer-line">{socials}</div>}
        </div>
      </footer>
    )
  }
  if (layout === 'centered') {
    return (
      <footer className="pa-footer pa-footer-centered">
        {addressLines.length > 0 && (
          <div className="pa-footer-line">{addressLines.join(', ')}</div>
        )}
        {contact && <div className="pa-footer-line">{contact}</div>}
        {showSocials && socials && <div className="pa-footer-line">{socials}</div>}
      </footer>
    )
  }
  return (
    <footer className="pa-footer pa-footer-minimal">
      <div className="pa-footer-line">
        {[addressLines.join(', '), contact, showSocials ? socials : null]
          .filter(Boolean).join(' · ')}
      </div>
    </footer>
  )
}

/** Money formatter — "RM 10.00" with prefix, bare mode omits it (menu prices). */
export function paMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

/**
 * Spell out small numbers as words — for prose spots ("Yield ten slices",
 * "target food cost thirty per cent", "fourteen days"). Falls back to
 * digit form for larger numbers or non-integer values.
 */
export function spellOutNumber(n, { mode = 'lower', fallbackDigits = true } = {}) {
  const num = Number(n)
  if (!Number.isInteger(num) || num < 0 || num > 100) {
    return fallbackDigits ? String(n) : null
  }
  const singles = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
    'eighteen', 'nineteen',
  ]
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  let w
  if (num < 20) w = singles[num]
  else if (num === 100) w = 'one hundred'
  else {
    const t = Math.floor(num / 10)
    const o = num % 10
    w = o === 0 ? tens[t] : `${tens[t]}-${singles[o]}`
  }
  return mode === 'upper' ? w.toUpperCase() : w
}

/**
 * Convert 1-20 to Roman numerals (I, II, III ... XX). Falls back to
 * the digit string for larger values.
 */
export function toRoman(n) {
  const num = Number(n)
  if (!Number.isInteger(num) || num <= 0 || num > 20) return String(n)
  const romans = [
    '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  ]
  return romans[num]
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

/** Zero-pad step numbers to two digits. */
export function zeroPad(n) {
  return String(n).padStart(2, '0')
}

/** Format a Date as "31 July 2026" (day + spelled-out month + year). */
export function formatLongDate(d = new Date()) {
  const months = ['January','February','March','April','May','June',
    'July','August','September','October','November','December']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Bold the opening 1-2 word imperative phrase of a method step's text,
 * for the final-step highlight ("Cool completely" → **Cool** completely).
 */
export function renderFinalStep(text) {
  if (!text) return null
  const s = String(text).trim()
  const m = s.match(/^([A-Z][a-z]+(?:\s+[a-z]+)?)\s+(.+)$/)
  if (m) return <><strong>{m[1]}</strong> {m[2]}</>
  return s
}
