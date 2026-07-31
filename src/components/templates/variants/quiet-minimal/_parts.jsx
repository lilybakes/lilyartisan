/**
 * Shared primitives used across all 10 Quiet Minimal templates.
 *
 * The Quiet Minimal voice is: warm off-white paper, Manrope Light titles,
 * JetBrains Mono for every meta label / number / date, tiny rust bullet
 * dots before section titles, hairline dividers, generous whitespace.
 *
 * DESIGN LAW: No bounding box on the monogram — DC renders as plain mono
 * text. Uploaded logo images render at their natural aspect ratio without
 * any surrounding border or fill.
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
 * Quiet monogram — NO bounding box, no fill, no border.
 * • If a logo image is uploaded, render it at the given size, natural aspect.
 * • Otherwise render just the initials as spaced mono text.
 * tone='ink' (default) or tone='cream' (for use on rust backgrounds — Social Card)
 */
export function QuietLogo({ brand, size = 'md', tone = 'ink' }) {
  const initials = getMonogramInitials(brand?.business_name)
  const cls = `q-logo q-logo-${size} q-logo-${tone}`
  if (brand?.logo_data_url) {
    return (
      <div className={cls}>
        <img src={brand.logo_data_url} alt="" className="q-logo-img"/>
      </div>
    )
  }
  return <div className={cls}>{initials}</div>
}

/**
 * Brand lockup — DC + name + tagline. Very minimal — just aligned type.
 *   layout='inline'  — DC left, name+tagline right (Binder, Recipe, Cost, Wholesale)
 *   layout='textonly' — no DC, just name+tagline (Care, Label)
 */
export function QuietBrandLockup({ brand, size = 'md', layout = 'inline', tone = 'ink' }) {
  const showLogo = layout !== 'textonly'
  return (
    <div className={`q-brand-lockup q-brand-lockup-${layout}`}>
      {showLogo && <QuietLogo brand={brand} size={size} tone={tone}/>}
      <div className="q-brand-text">
        <h1 className={`q-brand-name q-brand-${tone}`}>{brand?.business_name || 'Your Bakery'}</h1>
        {brand?.tagline && <p className={`q-brand-tagline q-brand-tagline-${tone}`}>{brand.tagline}</p>}
      </div>
    </div>
  )
}

/**
 * Small-caps mono eyebrow — the workhorse meta label for Quiet Minimal.
 * Wide letter-spacing, mono font. tone options:
 *   'muted'  (default) — grey-brown for meta/labels
 *   'rust'   — rust accent for section highlights
 *   'cream'  — cream for use on rust backgrounds
 */
export function QuietEyebrow({ children, tone = 'muted', className = '' }) {
  return <div className={`q-eyebrow q-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Tiny rust bullet dot — the signature accent placed before major titles */
export function QuietDot({ tone = 'rust' }) {
  return <span className={`q-dot q-dot-${tone}`} aria-hidden="true"/>
}

/** Hairline horizontal rule — the only divider Quiet Minimal uses */
export function QuietRule({ tone = 'hair', marginTop, marginBottom }) {
  return <div className={`q-rule q-rule-${tone}`} style={{ marginTop, marginBottom }}/>
}

/** Very short thin horizontal accent rule under titles */
export function QuietShortRule({ tone = 'rust' }) {
  return <div className={`q-rule-short q-rule-${tone}`}/>
}

/** Thin bordered circular seal for Certificate — "BAKED WITH CARE" */
export function QuietSeal({ text, size = 92 }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className="q-seal" style={{ width: size, height: size }}>
      <div className="q-seal-inner">
        {lines.map((l, i) => <span key={i} className="q-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Footer — split (address left, contact right) is the default. Rendered in
 * body sans + rust for socials/links.
 * layout='split' — 2-col address / contact-socials
 * layout='centered' — stacked centered lines (Certificate, Care, Label)
 * layout='minimal' — single centered line
 */
export function QuietFooter({ brand, layout = 'split', showSocials = true }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.email].filter(Boolean).join(' · ')
  const socials = [
    brand?.website || null,
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook ? `fb/${brand.facebook}` : null,
  ]

  if (layout === 'split') {
    return (
      <footer className="q-footer q-footer-split">
        <div className="q-footer-left">
          {addressLines.map((l, i) => <div key={i} className="q-footer-line">{l}</div>)}
        </div>
        <div className="q-footer-right">
          {contact && <div className="q-footer-line">{contact}</div>}
          {showSocials && (
            <div className="q-footer-line">
              {socials.filter(Boolean).map((s, i) => (
                <span key={i}>
                  {i > 0 && ' · '}
                  <span className={i === 0 ? '' : 'q-footer-social'}>{s}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </footer>
    )
  }

  if (layout === 'centered') {
    return (
      <footer className="q-footer q-footer-centered">
        <div className="q-footer-line">
          {[addressLines.join(', '), brand?.phone].filter(Boolean).join(' · ')}
        </div>
        {showSocials && (
          <div className="q-footer-line">
            {socials.filter(Boolean).map((s, i) => (
              <span key={i}>
                {i > 0 && ' · '}
                <span className={i === 0 ? '' : 'q-footer-social'}>{s}</span>
              </span>
            ))}
          </div>
        )}
      </footer>
    )
  }

  return (
    <footer className="q-footer q-footer-minimal">
      <div className="q-footer-line">
        {[
          addressLines.join(', '),
          contact,
          showSocials && socials.filter(Boolean).join(' · '),
        ].filter(Boolean).join(' · ')}
      </div>
    </footer>
  )
}

/**
 * Money formatter matching the Quiet Minimal style — the currency prefix and
 * amount are separated by a non-breaking space so the mono spacing renders
 * cleanly ("RM 10.00"). `bare` skips the prefix for dense table cells.
 */
export function quietMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

/**
 * Render a numeric amount + unit with a WIDE space between them — the
 * signature "500  g" spacing seen throughout the Quiet Minimal set.
 * Renders two <span>s so CSS can size the gap consistently.
 */
export function QuietQty({ qty, unit }) {
  return (
    <>
      <span className="q-qty-num">{qty}</span>
      {unit && <span className="q-qty-unit">{unit}</span>}
    </>
  )
}
