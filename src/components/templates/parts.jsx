/**
 * Shared brand pieces used across templates.
 * Placing them here keeps every template visually consistent while
 * letting each template control its own layout below.
 */

export function BrandHeader({ brand, compact = false }) {
  return (
    <header className={'tpl-brand-header' + (compact ? ' tpl-brand-header-compact' : '')}>
      {brand.logo_data_url && (
        <img src={brand.logo_data_url} alt="" className="tpl-brand-logo"/>
      )}
      <div className="tpl-brand-text">
        <div className="tpl-brand-name">{brand.business_name || 'Your Bakery'}</div>
        {brand.tagline && !compact && (
          <div className="tpl-brand-tagline">{brand.tagline}</div>
        )}
      </div>
    </header>
  )
}

export function BrandFooter({ brand }) {
  const bits = []
  if (brand.contact_phone) bits.push(brand.contact_phone)
  if (brand.contact_email) bits.push(brand.contact_email)
  if (brand.website)       bits.push(brand.website)
  if (brand.instagram)     bits.push('@' + brand.instagram)

  if (bits.length === 0 && !brand.address) return null

  return (
    <footer className="tpl-brand-footer">
      {brand.address && <div className="tpl-brand-address">{brand.address}</div>}
      {bits.length > 0 && (
        <div className="tpl-brand-contact">
          {bits.map((b, i) => (
            <span key={i}>{b}</span>
          ))}
        </div>
      )}
    </footer>
  )
}
