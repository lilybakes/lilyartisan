/**
 * Shared primitives used across all 10 Kraft templates.
 *
 * These are the LEGO bricks — monogram in a dashed circle, brand lockup,
 * double-rule divider, circular dashed seal, footer with dashed divider.
 *
 * Each of the 10 kraft templates composes these into its own dedicated
 * layout — no shared parent template, no CSS variant overrides.
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
 * Circular dashed monogram — brand's uploaded logo when present,
 * otherwise 2-letter initials rendered as bold slab-serif brown text.
 */
export function KraftMonogram({ brand, size = 'md' }) {
  const initials = getMonogramInitials(brand?.business_name)
  const cls = `k-monogram k-monogram-${size}`
  if (brand?.logo_data_url) {
    return (
      <div className={cls}>
        <img src={brand.logo_data_url} alt="" className="k-monogram-img"/>
      </div>
    )
  }
  return <div className={cls}><span>{initials}</span></div>
}

/**
 * Brand lockup — monogram + name + tagline.
 * `layout='row'` puts them side-by-side (used on recipe/binder/cost/wholesale)
 * `layout='column'` stacks them centered (used on care/social/menu/certificate)
 */
export function KraftBrandLockup({ brand, size = 'md', layout = 'row' }) {
  return (
    <div className={`k-brand-lockup k-brand-lockup-${layout}`}>
      <KraftMonogram brand={brand} size={size}/>
      <div className="k-brand-text">
        <h1 className="k-brand-name">{brand?.business_name || 'Your Bakery'}</h1>
        {brand?.tagline && <p className="k-brand-tagline">{brand.tagline}</p>}
      </div>
    </div>
  )
}

/** Double horizontal brown rule — signature divider under most headers */
export function KraftDoubleRule({ marginTop, marginBottom }) {
  return <div className="k-rule-double" style={{ marginTop, marginBottom }}/>
}

/** Dashed horizontal rule — used to separate footer from body */
export function KraftDashedRule({ marginTop, marginBottom }) {
  return <div className="k-rule-dashed" style={{ marginTop, marginBottom }}/>
}

/**
 * Circular dashed seal with tracked-caps text arranged as three
 * separate lines (e.g. "BAKED / SMALL / BATCH"). Pass the whole
 * string with `/` separators.
 */
export function KraftSeal({ text, size = 96, rotation = -8 }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className="k-seal" style={{ width: size, height: size, transform: `rotate(${rotation}deg)` }}>
      <div className="k-seal-inner">
        {lines.map((l, i) => <span key={i} className="k-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/** Small caps letter-spaced brown eyebrow */
export function KraftEyebrow({ children, className = '' }) {
  return <div className={`k-eyebrow ${className}`}>{children}</div>
}

/**
 * Footer with dashed divider above address/contact.
 * `layout='split'` = address left / contact right (used on recipe, cost, wholesale, binder, label)
 * `layout='centered'` = everything centered (used on care, delivery, menu, certificate, social)
 */
export function KraftFooter({ brand, layout = 'split', showSocials = true }) {
  const address = [brand?.address_line1, brand?.address_line2].filter(Boolean).join(', ')
  const contact = [brand?.phone, brand?.email, brand?.website].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <footer className={`k-footer k-footer-${layout}`}>
      <div className="k-rule-dashed"/>
      <div className="k-footer-content">
        {layout === 'centered' ? (
          <>
            {address && <div className="k-footer-address">{address}</div>}
            {contact && <div className="k-footer-contact">{contact}</div>}
            {showSocials && socials && <div className="k-footer-social">{socials}</div>}
          </>
        ) : (
          <>
            {address && <div className="k-footer-address">{address}</div>}
            <div className="k-footer-right">
              {contact && <div>{contact}</div>}
              {showSocials && socials && <div className="k-footer-social">{socials}</div>}
            </div>
          </>
        )}
      </div>
    </footer>
  )
}

/**
 * Format a money value — always `RM 0.00` for Malaysian Ringgit.
 * Kraft prints prices without currency prefix inside tables (menu, wholesale)
 * because context is established once in a caption; pass `bare` for that.
 */
export function kraftMoney(value, { bare = false } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `RM ${s}`
}
