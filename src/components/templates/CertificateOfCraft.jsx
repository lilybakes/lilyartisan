import { BotanicalBranch, WaxSeal } from './ornaments.jsx'

/**
 * Certificate of Craft — "Traditional Botanical, Elegant"
 * A4 landscape. Cream paper, botanical branches at corners, wax seal centre.
 */
export function CertificateOfCraft({ recipe, brand }) {
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  const contacts = []
  if (brand.website)       contacts.push(brand.website)
  if (brand.instagram)     contacts.push('@' + brand.instagram)
  if (brand.facebook)      contacts.push('fb/' + brand.facebook)
  if (brand.contact_phone) contacts.push(brand.contact_phone)

  return (
    <div className="tpl tpl-cert-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Botanical corners */}
      <div className="tpl-cert-v2-branch tpl-cert-v2-branch-tl">
        <BotanicalBranch size={140}/>
      </div>
      <div className="tpl-cert-v2-branch tpl-cert-v2-branch-tr">
        <BotanicalBranch size={140} mirror/>
      </div>
      <div className="tpl-cert-v2-branch tpl-cert-v2-branch-bl">
        <BotanicalBranch size={140} mirror/>
      </div>
      <div className="tpl-cert-v2-branch tpl-cert-v2-branch-br">
        <BotanicalBranch size={140}/>
      </div>

      {/* Double frame */}
      <div className="tpl-cert-v2-frame">
        <div className="tpl-cert-v2-content">
          {brand.logo_data_url && (
            <img src={brand.logo_data_url} alt="" className="tpl-cert-v2-logo"/>
          )}

          <div className="tpl-cert-v2-eyebrow">Certificate of Craft</div>
          <div className="tpl-cert-v2-eyebrow-rule"/>

          <div className="tpl-cert-v2-line">This is to certify that</div>

          <div className="tpl-cert-v2-product">{recipe.name}</div>

          <div className="tpl-cert-v2-line">was crafted with care in the kitchen of</div>

          <div className="tpl-cert-v2-brand">{brand.business_name || 'Your Bakery'}</div>

          {brand.tagline && (
            <div className="tpl-cert-v2-tagline">
              <span>· </span>{brand.tagline}<span> ·</span>
            </div>
          )}

          <div className="tpl-cert-v2-signature-row">
            <div className="tpl-cert-v2-sig">
              <div className="tpl-cert-v2-sig-line"/>
              <div className="tpl-cert-v2-sig-label">
                {brand.owner_name || 'Head Baker'}
              </div>
            </div>
            <div className="tpl-cert-v2-seal-holder">
              <WaxSeal size={72} initials={brand.business_name}/>
            </div>
            <div className="tpl-cert-v2-sig">
              <div className="tpl-cert-v2-sig-line"/>
              <div className="tpl-cert-v2-sig-label">{today}</div>
            </div>
          </div>

          {(brand.address || contacts.length > 0) && (
            <div className="tpl-cert-v2-address-block">
              {brand.address && <div className="tpl-cert-v2-address">{brand.address}</div>}
              {contacts.length > 0 && (
                <div className="tpl-cert-v2-contact">
                  {contacts.map((c, i) => (
                    <span key={i}>
                      {i > 0 && <span className="tpl-cert-v2-contact-sep">·</span>}
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
