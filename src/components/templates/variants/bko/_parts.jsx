/**
 * Shared primitives used across all 10 BakeOnomics Clean templates.
 *
 * The theme reads as a "finished printed sheet": square bordered logo box
 * (not circular like Kraft), a solid accent rule under every header,
 * navy titles, purple accents, monospace numerals, hairline dividers.
 *
 * Each of the 10 bko templates composes these into its own dedicated
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
 * Square bordered logo box — brand's uploaded logo when present,
 * otherwise 2-letter initials in bold accent-color type.
 */
export function BkoLogo({ brand, size = 'md' }) {
  const initials = getMonogramInitials(brand?.business_name)
  const cls = `b-logo b-logo-${size}`
  if (brand?.logo_data_url) {
    return (
      <div className={cls}>
        <img src={brand.logo_data_url} alt="" className="b-logo-img"/>
      </div>
    )
  }
  return <div className={cls}><span>{initials}</span></div>
}

/**
 * Brand lockup — logo box + name + tagline.
 * `layout='row'` puts them side-by-side (recipe, cost, wholesale, binder, menu, label, care)
 * `layout='column'` stacks them centered (delivery tag, social card)
 */
export function BkoBrandLockup({ brand, size = 'md', layout = 'row' }) {
  return (
    <div className={`b-brand-lockup b-brand-lockup-${layout}`}>
      <BkoLogo brand={brand} size={size}/>
      <div className="b-brand-text">
        <h1 className="b-brand-name">{brand?.business_name || 'Your Bakery'}</h1>
        {brand?.tagline && <p className="b-brand-tagline">{brand.tagline}</p>}
      </div>
    </div>
  )
}

/** Solid accent full-width rule — signature divider under every header */
export function BkoRule({ marginTop, marginBottom }) {
  return <div className="b-rule-brand" style={{ marginTop, marginBottom }}/>
}

/** Thin gray hairline — internal separators, footer divider */
export function BkoHairline({ marginTop, marginBottom }) {
  return <div className="b-rule-hairline" style={{ marginTop, marginBottom }}/>
}

/** Small caps letter-spaced eyebrow. `tone='accent'` (default) or `tone='muted'` */
export function BkoEyebrow({ children, tone = 'accent', className = '' }) {
  return <div className={`b-eyebrow b-eyebrow-${tone} ${className}`}>{children}</div>
}

/** Bordered pill/chip — recipe card meta tags ("BREAD", "YIELD 1 LOAF") */
export function BkoChip({ children }) {
  return <span className="b-chip">{children}</span>
}

/**
 * Thin-lined circular seal (not dashed) — Certificate only.
 * Pass the whole string with `/` separators for multi-line text.
 */
export function BkoSeal({ text, size = 96 }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className="b-seal" style={{ width: size, height: size }}>
      <div className="b-seal-inner">
        {lines.map((l, i) => <span key={i} className="b-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Footer with hairline divider above address/contact.
 * `layout='split'`    = address left / contact right (recipe, cost, wholesale, binder, menu)
 * `layout='stacked'`  = address then contact+handles, both left-aligned (care card)
 * `layout='minimal'`  = single contact line, left-aligned, no address (product label)
 * `layout='centered'` = everything centered (delivery, social, certificate)
 */
export function BkoFooter({ brand, layout = 'split', showSocials = true }) {
  const address = [brand?.address_line1, brand?.address_line2].filter(Boolean).join(', ')
  const contact = [brand?.phone, brand?.email, brand?.website].filter(Boolean).join(' · ')
  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <footer className={`b-footer b-footer-${layout}`}>
      <div className="b-rule-hairline"/>
      <div className="b-footer-content">
        {layout === 'centered' && (
          <>
            {socials && <div className="b-footer-social">{socials}</div>}
            <div className="b-footer-line">
              {[brand?.website, contact].filter(Boolean).join(' · ') || contact}
            </div>
          </>
        )}
        {layout === 'stacked' && (
          <>
            {address && <div>{address}</div>}
            <div>
              {[contact, showSocials ? socials : null].filter(Boolean).join(' · ')}
            </div>
          </>
        )}
        {layout === 'minimal' && (
          <div>{[contact, showSocials ? socials : null].filter(Boolean).join(' · ')}</div>
        )}
        {layout === 'split' && (
          <>
            <div className="b-footer-left">
              {address && <div>{address}</div>}
            </div>
            <div className="b-footer-right">
              {contact && <div>{contact}</div>}
              {showSocials && socials && <div className="b-footer-social">{socials}</div>}
            </div>
          </>
        )}
      </div>
    </footer>
  )
}

/** Format a money value — always `RM 0.00` for Malaysian Ringgit. */
export function bkoMoney(value, { bare = false } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `RM ${s}`
}
