/**
 * Shared primitives used across all 10 Editorial Magazine templates.
 *
 * The Editorial voice is: cream paper, filled rust blocks (side bands,
 * mastheads, midplates), thick 3px horizontal rules, big serif titles with
 * one italic accent word, small-caps Archivo eyebrows, sans body copy.
 *
 * Each of the 10 editorial templates composes these into its own dedicated
 * layout.
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
 * Editorial logo — a filled rust square with cream initials by default.
 * variant='filled' — filled rust square, cream text (default; every template)
 * variant='bordered-on-rust' — thin cream border on rust background, cream text
 *                              (used inside side bands / mastheads)
 */
export function EditorialLogo({ brand, size = 'md', variant = 'filled' }) {
  const initials = getMonogramInitials(brand?.business_name)
  const cls = `e-logo e-logo-${variant} e-logo-${size}`
  if (brand?.logo_data_url) {
    return (
      <div className={cls}>
        <img src={brand.logo_data_url} alt="" className="e-logo-img"/>
      </div>
    )
  }
  return <div className={cls}><span>{initials}</span></div>
}

/**
 * Brand lockup — DC monogram + name + tagline.
 * layout='row' — DC on left, text on right (Recipe Card header)
 * layout='row-reverse' — text on left, DC on right (Menu, Wholesale, Certificate)
 * layout='text-first' — big brand name serif (with italic accent) + small caps tagline (Menu, Wholesale)
 * layout='stacked-on-rust' — big cream brand + cream tagline inside a rust band (Binder Page sidebar)
 */
export function EditorialBrandLockup({
  brand, size = 'md', layout = 'row', italicizeBrand = false, tagAsSmallCaps = false,
}) {
  const brandName = italicizeBrand
    ? <>{stylizeTitle(brand?.business_name || 'Your Bakery', 'last-word')}</>
    : (brand?.business_name || 'Your Bakery')

  const tagCls = tagAsSmallCaps ? 'e-brand-tagline e-brand-tagline-caps' : 'e-brand-tagline'
  const showLogo = layout === 'row' || layout === 'row-reverse'

  return (
    <div className={`e-brand-lockup e-brand-lockup-${layout}`}>
      {showLogo && <EditorialLogo brand={brand} size={size}/>}
      <div className="e-brand-text">
        <h1 className={italicizeBrand ? 'e-brand-name e-brand-name-italic' : 'e-brand-name'}>
          {brandName}
        </h1>
        {brand?.tagline && <p className={tagCls}>{brand.tagline}</p>}
      </div>
    </div>
  )
}

/**
 * Small-caps letter-spaced eyebrow — the workhorse label for Editorial.
 * tone='rust' (default) — rust color for primary labels
 * tone='muted' — muted for meta info
 * tone='cream' — cream, for use on rust backgrounds
 */
export function EditorialEyebrow({ children, tone = 'rust', className = '' }) {
  return <div className={`e-eyebrow e-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Thick horizontal rule — Editorial's structural divider. tone='black'|'rust' */
export function EditorialRule({ tone = 'black', weight = 'thick', marginTop, marginBottom }) {
  return <div className={`e-rule e-rule-${weight} e-rule-${tone}`} style={{ marginTop, marginBottom }}/>
}

/** Short thick accent rule under titles — 30-40mm long, block-anchored */
export function EditorialShortRule({ tone = 'rust' }) {
  return <div className={`e-rule-short e-rule-${tone}`}/>
}

/**
 * Rotated vertical text — used on side bands.
 * The rust band itself is drawn in the template CSS; this component
 * renders the rotated small-caps text inside it.
 */
export function EditorialSideText({ children }) {
  return <div className="e-side-text">{children}</div>
}

/** Bordered circular seal — thin outline, small-caps text, for the Certificate */
export function EditorialSeal({ text, size = 84 }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className="e-seal" style={{ width: size, height: size }}>
      <div className="e-seal-inner">
        {lines.map((l, i) => <span key={i} className="e-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Footer — 2-column split by default (address left, contact right).
 * layout='split' — address left, contact + socials right (Recipe, Menu, Wholesale)
 * layout='centered' — all lines centered (Delivery, Social)
 * layout='minimal' — single centered contact line (Product Label)
 * layout='inline' — single row, all separated by ·  (Certificate)
 */
export function EditorialFooter({ brand, layout = 'split', showSocials = true }) {
  const address = [brand?.address_line1, brand?.address_line2].filter(Boolean).join(', ')
  const contact = [brand?.phone, brand?.email].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook ? `fb/${brand.facebook}` : null,
    brand?.website || null,
  ].filter(Boolean).join(' · ')

  return (
    <footer className={`e-footer e-footer-${layout}`}>
      {layout === 'split' && (
        <>
          <div className="e-footer-left">
            {address && <div className="e-footer-line">{address}</div>}
          </div>
          <div className="e-footer-right">
            {contact && <div className="e-footer-line">{contact}</div>}
            {showSocials && socials && (
              <div className="e-footer-line e-footer-social">{socials}</div>
            )}
          </div>
        </>
      )}
      {layout === 'centered' && (
        <>
          {address && <div className="e-footer-line">{address}</div>}
          {contact && <div className="e-footer-line">{contact}</div>}
          {showSocials && socials && (
            <div className="e-footer-line e-footer-social">{socials}</div>
          )}
        </>
      )}
      {layout === 'minimal' && (
        <div className="e-footer-line">
          {[contact, showSocials ? socials : null].filter(Boolean).join(' · ')}
        </div>
      )}
      {layout === 'inline' && (
        <div className="e-footer-line">
          {[address, contact, showSocials ? socials : null].filter(Boolean).join(' · ')}
        </div>
      )}
    </footer>
  )
}

/**
 * Format money — Editorial keeps the currency prefix in titles/labels,
 * omits it in dense tables.
 */
export function editorialMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

// ============================================================================
// Italic-accent title helper — the signature Editorial move
// ============================================================================

/**
 * Split a title into words and italicize one/more per the mode:
 *   'auto'               — default. Handles most cases automatically:
 *                          "Blueberry Muffins" → *Muffins*
 *                          "Chocolate Fudge Cake" → *Fudge* (middle)
 *                          "Vanilla Cupcakes with Buttercream" → *Buttercream*
 *                          (last word after "with"/"of"/"and")
 *   'last-word'          — italicize the last word only. Used for brand names
 *                          ("The Daily *Crumb*").
 *   'phrase-after-first' — italicize words 2..end as a phrase. Used for special
 *                          document titles ("Wholesale *Price List*",
 *                          "Certificate *of Craft*").
 * Returns a JSX fragment (array of spans) suitable for inline rendering.
 */
export function stylizeTitle(title, mode = 'auto') {
  const words = String(title || '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return null
  if (words.length === 1) return words[0]

  let italicIndexes = new Set()
  if (mode === 'last-word') {
    italicIndexes.add(words.length - 1)
  } else if (mode === 'phrase-after-first') {
    for (let i = 1; i < words.length; i++) italicIndexes.add(i)
  } else {
    // auto
    const connectorIdx = words.findIndex(w => /^(with|and|of|for)$/i.test(w))
    if (connectorIdx > 0 && connectorIdx < words.length - 1) {
      // Italicize everything after the connector (e.g. "with Buttercream")
      for (let i = connectorIdx + 1; i < words.length; i++) italicIndexes.add(i)
    } else if (words.length === 2) {
      italicIndexes.add(1)
    } else if (words.length === 3) {
      // Middle word — matches "Classic *Sourdough* Loaf", "Chocolate *Fudge* Cake"
      italicIndexes.add(1)
    } else {
      // Longer titles — italicize last word
      italicIndexes.add(words.length - 1)
    }
  }

  return words.map((w, i) => (
    <span key={i}>
      {i > 0 && ' '}
      {italicIndexes.has(i) ? <em>{w}</em> : w}
    </span>
  ))
}

/**
 * Horizontal bar-chart data for Cost Breakdown "Where the Money Goes".
 * Sorts lines by cost desc, keeps top N, computes % of largest for bar width.
 */
export function topContributors(lines, n = 6) {
  const sorted = [...(lines || [])]
    .filter(l => Number(l.cost) > 0)
    .sort((a, b) => Number(b.cost) - Number(a.cost))
    .slice(0, n)
  if (sorted.length === 0) return { items: [], max: 0 }
  const max = Number(sorted[0].cost) || 1
  return {
    items: sorted.map(l => ({
      name: l.ingredient_name || 'Unknown',
      cost: Number(l.cost) || 0,
      pct:  Math.max(6, Math.round((Number(l.cost) / max) * 100)),
    })),
    max,
  }
}
