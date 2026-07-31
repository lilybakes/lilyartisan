/**
 * Shared primitives used across all 10 Verdant templates.
 *
 * The Verdant voice is: cream paper, deep forest green accent, soft mint
 * pills and callouts, DM Serif Display titles + Manrope body. Decorative
 * light-green circles float at page edges. Method steps use numbered
 * mint circles; the FINAL step in each recipe gets a dark-green fill to
 * visually emphasise the crucial finishing action.
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
 * Brand lockup — bold serif brand name + muted sans tagline.
 * tone='ink' (default, on cream backgrounds) or tone='cream' (on green blocks).
 * size='sm' | 'md' | 'lg'
 */
export function VerdantBrandLockup({ brand, size = 'md', tone = 'ink' }) {
  return (
    <div className={`v-brand-lockup v-brand-lockup-${size}`}>
      <h1 className={`v-brand-name v-brand-${tone}`}>
        {brand?.business_name || 'Your Bakery'}
      </h1>
      {brand?.tagline && (
        <p className={`v-brand-tagline v-brand-tagline-${tone}`}>{brand.tagline}</p>
      )}
    </div>
  )
}

/**
 * Small-caps eyebrow — letter-spaced Manrope, workhorse label.
 * tone='green' (default) — dark forest green for section titles
 * tone='muted'  — muted gray-green for meta/subtitles
 * tone='cream'  — cream for use on dark green backgrounds
 */
export function VerdantEyebrow({ children, tone = 'green', className = '' }) {
  return <div className={`v-eyebrow v-eyebrow-${tone} ${className}`}>{children}</div>
}

/**
 * Rounded pill chip — used for meta on Recipe Card (BREAD, YIELD 1 LOAF, 240°C)
 * and for allergens on Care Card. tone='mint' (default) or 'green'.
 */
export function VerdantChip({ children, tone = 'mint', size = 'md' }) {
  return <span className={`v-chip v-chip-${tone} v-chip-${size}`}>{children}</span>
}

/**
 * Numbered method chip — circular filled chip with the step number centered.
 * variant='normal' — mint fill, green number (default)
 * variant='accent' — dark green fill, cream number (for the final step)
 */
export function VerdantMethodChip({ number, variant = 'normal' }) {
  return (
    <span className={`v-method-chip v-method-chip-${variant}`}>
      {number}
    </span>
  )
}

/** Thick horizontal green rule — signature structural divider */
export function VerdantRule({ tone = 'green', weight = 'thick', marginTop, marginBottom }) {
  return <div className={`v-rule v-rule-${weight} v-rule-${tone}`} style={{ marginTop, marginBottom }}/>
}

/** Very thin hairline rule for zebra separators, footer separators */
export function VerdantHairRule({ marginTop, marginBottom }) {
  return <div className="v-rule v-rule-hair" style={{ marginTop, marginBottom }}/>
}

/**
 * Rounded filled seal — dark green circle with cream small-caps text lines.
 * Used on Certificate ("MADE BY HAND") and Care Card corner accent.
 */
export function VerdantSeal({ text, size = 90, subtle = false }) {
  const lines = text.split('/').map(s => s.trim())
  return (
    <div className={`v-seal ${subtle ? 'v-seal-subtle' : ''}`} style={{ width: size, height: size }}>
      <div className="v-seal-inner">
        {lines.map((l, i) => <span key={i} className="v-seal-line">{l}</span>)}
      </div>
    </div>
  )
}

/**
 * Decorative light-green circle — positioned absolutely, clipped by the
 * template's overflow: hidden. Used for the soft background flourishes
 * that appear in corners of most templates.
 */
export function VerdantDecorCircle({ size = 200, top, right, bottom, left, tone = 'mint', outlined = false }) {
  return (
    <div
      className={`v-decor-circle ${outlined ? 'v-decor-circle-outlined' : ''} v-decor-circle-${tone}`}
      style={{
        width: size, height: size,
        top, right, bottom, left,
      }}
      aria-hidden="true"
    />
  )
}

/**
 * Footer — split by default (address left, contact + socials right).
 * Verdant footers keep the @handle in bold green as the visual accent.
 * layout='split' | 'centered' | 'minimal'
 */
export function VerdantFooter({ brand, layout = 'split', showSocials = true }) {
  const addressLines = [brand?.address_line1, brand?.address_line2].filter(Boolean)
  const contact = [brand?.phone, brand?.website].filter(Boolean).join(' · ')

  const socials = []
  if (brand?.instagram) socials.push(<span key="ig" className="v-footer-social">@{brand.instagram}</span>)
  if (brand?.facebook)  socials.push(<span key="fb">fb/{brand.facebook}</span>)

  const socialLine = socials.reduce((acc, cur, i) => {
    if (i === 0) return [cur]
    return [...acc, ' · ', cur]
  }, [])

  if (layout === 'split') {
    return (
      <footer className="v-footer v-footer-split">
        <div className="v-footer-left">
          {addressLines.map((l, i) => <div key={i} className="v-footer-line">{l}</div>)}
        </div>
        <div className="v-footer-right">
          {contact && <div className="v-footer-line">{contact}</div>}
          {showSocials && socials.length > 0 && (
            <div className="v-footer-line">{socialLine}</div>
          )}
        </div>
      </footer>
    )
  }

  if (layout === 'centered') {
    return (
      <footer className="v-footer v-footer-centered">
        <div className="v-footer-line">
          {[addressLines.join(', '), brand?.phone].filter(Boolean).join(' · ')}
        </div>
        {showSocials && (
          <div className="v-footer-line">
            {[brand?.website, ...socials.map((_, i) => socials[i])].filter(Boolean).reduce((acc, cur, i) => {
              if (i === 0) return [cur]
              return [...acc, ' · ', cur]
            }, [])}
          </div>
        )}
      </footer>
    )
  }

  return (
    <footer className="v-footer v-footer-minimal">
      <div className="v-footer-line">
        {[addressLines.join(', '), contact, showSocials && socials.length > 0 ? socialLine : null]
          .filter(Boolean)}
      </div>
    </footer>
  )
}

/** Format money for Verdant — "RM 10.00", bare mode omits prefix */
export function verdantMoney(value, { bare = false, currency = 'RM' } = {}) {
  const n = Number(value) || 0
  const s = n.toFixed(2)
  return bare ? s : `${currency} ${s}`
}

/**
 * Compute top-N ingredient contributors for the Cost Breakdown bar chart.
 * Returns sorted-desc items with pct = share of the highest cost (for bar width).
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
 * Normalize a method array into a flat sequence of { step } or { group }
 * entries, so the templates can render the numbered list with sub-group
 * headers uniformly across all variants.
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
