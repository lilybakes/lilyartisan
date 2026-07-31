export function BrandHeader({ brand, compact = false }) {
  return (
    <header className={'tpl-brand-header' + (compact ? ' tpl-brand-header-compact' : '')}>
      {brand.logo_data_url && (
        <img src={brand.logo_data_url} alt="" className="tpl-brand-logo"/>
      )}
      <div className="tpl-brand-text">
        <div className="tpl-brand-name">{brand.business_name || 'Your Bakery'}</div>
        {brand.tagline && (
          <div className={'tpl-brand-tagline' + (compact ? ' tpl-brand-tagline-small' : '')}>
            {brand.tagline}
          </div>
        )}
      </div>
    </header>
  )
}

export function BrandFooter({ brand }) {
  const contacts = []
  if (brand.contact_phone) contacts.push(brand.contact_phone)
  if (brand.contact_email) contacts.push(brand.contact_email)
  if (brand.website)       contacts.push(brand.website)
  const socials = []
  if (brand.instagram) socials.push('@' + brand.instagram)
  if (brand.facebook)  socials.push('fb/' + brand.facebook)
  if (contacts.length === 0 && socials.length === 0 && !brand.address) return null
  return (
    <footer className="tpl-brand-footer">
      {brand.address && <div className="tpl-brand-address">{brand.address}</div>}
      {(contacts.length > 0 || socials.length > 0) && (
        <div className="tpl-brand-contact">
          {contacts.map((c, i) => <span key={'c'+i}>{c}</span>)}
          {socials.map((s, i)  => <span key={'s'+i} className="tpl-brand-social">{s}</span>)}
        </div>
      )}
    </footer>
  )
}
