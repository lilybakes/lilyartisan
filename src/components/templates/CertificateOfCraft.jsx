/**
 * Certificate of Craft — decorative landscape A4 certificate.
 * For premium orders, gifts, or press features.
 */
export function CertificateOfCraft({ recipe, brand }) {
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  const contacts = []
  if (brand.website)   contacts.push(brand.website)
  if (brand.instagram) contacts.push('@' + brand.instagram)
  if (brand.facebook)  contacts.push('fb/' + brand.facebook)
  if (brand.contact_phone) contacts.push(brand.contact_phone)

  return (
    <div className="tpl tpl-cert printable" style={{ '--brand': brand.brand_color }}>
      <div className="tpl-cert-inner">
        <div className="tpl-cert-corner tpl-cert-corner-tl"/>
        <div className="tpl-cert-corner tpl-cert-corner-tr"/>
        <div className="tpl-cert-corner tpl-cert-corner-bl"/>
        <div className="tpl-cert-corner tpl-cert-corner-br"/>

        <div className="tpl-cert-content">
          {brand.logo_data_url && (
            <img src={brand.logo_data_url} alt="" className="tpl-cert-logo"/>
          )}

          <div className="tpl-cert-eyebrow">Certificate of Craft</div>

          <div className="tpl-cert-body">
            This is to certify that
          </div>

          <div className="tpl-cert-product">{recipe.name}</div>

          <div className="tpl-cert-body">
            was crafted with care in the kitchen of
          </div>

          <div className="tpl-cert-brand">{brand.business_name || 'Your Bakery'}</div>

          {brand.tagline && (
            <div className="tpl-cert-tagline">— {brand.tagline} —</div>
          )}

          <div className="tpl-cert-signature-row">
            <div className="tpl-cert-signature">
              <div className="tpl-cert-signature-line"/>
              <div className="tpl-cert-signature-label">Head Baker</div>
            </div>
            <div className="tpl-cert-seal">
              <div className="tpl-cert-seal-ring">
                <div className="tpl-cert-seal-inner">
                  <div className="tpl-cert-seal-label">Baked with</div>
                  <div className="tpl-cert-seal-heart">♡</div>
                  <div className="tpl-cert-seal-label">Care</div>
                </div>
              </div>
            </div>
            <div className="tpl-cert-signature">
              <div className="tpl-cert-signature-line"/>
              <div className="tpl-cert-signature-label">{today}</div>
            </div>
          </div>

          {(brand.address || contacts.length > 0) && (
            <div className="tpl-cert-address-block">
              {brand.address && <div className="tpl-cert-address">{brand.address}</div>}
              {contacts.length > 0 && (
                <div className="tpl-cert-contact">
                  {contacts.map((c, i) => <span key={i}>{c}</span>)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
