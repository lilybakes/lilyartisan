/**
 * Shared primitives used across all 10 Ember templates.
 *
 * The Ember voice: warm cream paper, burgundy→red→orange gradient headers
 * with diagonal-cut bottom edges, heavy condensed uppercase display type,
 * ember red as the singular accent (prices, section labels, numbered steps).
 * Very bold, industrial, confident.
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
 * Brand lockup — heavy condensed uppercase brand name + muted sans tagline.
 * tone='ink' (default) or 'cream' (for use on gradient/dark backgrounds)
 * size='sm' | 'md' | 'lg'
 */
export function EmberBrandLockup({ brand, size = 'md', tone = 'ink' }) {
  return (
    <div className={`em-brand-lockup em-brand-lockup-${size}`}>
      <h1 className={`em-brand-name em-brand-${tone}`}>
        {(brand?.business_name || 'Your Bakery').toUpperCase()}
      </h1>
      {brand?.tagline && (
        <p className={`em-brand-tagline em-brand-tagline-${tone}`}>{brand.tagline}</p>
      )}
    </div>
  )
}

/**
 * Small-caps eyebrow — Manrope letter-spaced. tone='ember' (default), 'muted', 'cream'.
 * className is exposed so callers can override letter-spacing / size when needed.
 */
export function EmberEyebrow({ children, tone = 'ember', className = '' }) {
  return <div className={`em-eyebrow em-eyebrow-${tone} ${className}`}>{children}</div>
}

/**
 * Meta chip — filled rectangular pill (slightly rounded corners).
 *   tone='black'    — filled near-black with cream text  (BREAD)
 *   tone='ember'    — filled ember red with cream text   (YIELD 1 LOAF)
 *   tone='outlined' — cream with black border            (240°C)
 */
export function EmberChip({ children, tone = 'ember' }) {
  return <span className={`em-chip em-chip-${tone}`}>{children.toString().toUpperCase()}</span>
}

/**
 * Category tag — filled ember rectangle for menu categories. Wider padding,
 * matches image 5 mockup where BREAD / COOKIES / CAKES sit as bold flags.
 */
export function EmberCategoryTag({ children }) {
  return <span className="em-cat-tag">{children.toString().toUpperCase()}</span>
}

/** Thick horizontal rule — the workhorse divider */
export function EmberRule({ tone = 'ink', weight = 'thick', marginTop, marginBottom }) {
  return <div className={`em-rule em-rule-${weight} em-rule-${tone}`} style={{ marginTop, marginBottom }}/>
}

/** Filled circular gradient seal — for Certificate "MADE / BY / HAND" */
export function EmberSeal({ text, size = 96 }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className="em-seal" style={{ width: size, height: size }}>
      <div className="em-seal-inner">
        {lines.map((l, i) => <span key={i} className="em-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Footer — split (address left, contact right) is the default.
 * @handle rendered in bold ember as the accent.
 * layout='split' | 'centered' | 'minimal'
 */
export function EmberFooter({ brand, layout = 'split', showSocials = true, showBrand = false }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')
  const socials = []
  if (brand?.instagram) socials.push(<span key="ig" className="em-footer-social">@{brand.instagram}</span>)
  if (brand?.facebook)  socials.push(<span key="fb">fb/{brand.facebook}</span>)
  const socialLine = socials.reduce((acc, cur, i) => {
    if (i === 0) return [cur]
    return [...acc, ' · ', cur]
  }, [])

  if (layout === 'split') {
    return (
      <footer className="em-footer em-footer-split">
        <div className="em-footer-left">
          {addressLines.map((l, i) => <div key={i} className="em-footer-line">{l}</div>)}
        </div>
        <div className="em-footer-right">
          {contact && <div className="em-footer-line">{contact}</div>}
          {showSocials && socials.length > 0 && (
            <div className="em-footer-line">{socialLine}</div>
          )}
        </div>
      </footer>
    )
  }

  if (layout === 'centered') {
    return (
      <footer className="em-footer em-footer-centered">
        {showBrand && brand?.business_name && (
          <div className="em-footer-brand">{brand.business_name.toUpperCase()}</div>
        )}
        <div className="em-footer-line">
          {[addressLines.join(', '), brand?.phone].filter(Boolean).join(' · ')}
        </div>
        {showSocials && (
          <div className="em-footer-line">
            {[brand?.website, ...socials].filter(Boolean).reduce((acc, cur, i) => {
              if (i === 0) return [cur]
              return [...acc, ' · ', cur]
            }, [])}
          </div>
        )}
      </footer>
    )
  }

  return (
    <footer className="em-footer em-footer-minimal">
      <div className="em-footer-line">
        {[addressLines.join(', '), contact, showSocials && socials.length > 0 ? socialLine : null]
          .filter(Boolean)}
      </div>
    </footer>
  )
}

/** Format money for Ember — "RM 10.00", bare mode omits prefix */
export function emberMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

/**
 * Compute top-N ingredient contributors for the Cost Breakdown bar chart.
 * Returns sorted-desc items with pct = share of the highest cost.
 */
export function topContributors(lines, n = 4) {
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
      pct:  Math.max(8, Math.round((Number(l.cost) / max) * 100)),
    })),
    max,
  }
}

/**
 * Normalize a method array into a flat sequence of { step } or { group } entries.
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
