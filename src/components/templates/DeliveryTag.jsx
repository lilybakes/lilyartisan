/**
 * Delivery tag — small hang-tag or box-topper for delivery orders.
 * A7 sized, punchable for string.
 */
export function DeliveryTag({ recipe, brand, styleVariant = 'clean-modern' }) {
  const storage = recipe.storage_notes || brand.default_storage_notes

  return (
    <div className={`tpl tpl-delivery printable variant-${styleVariant}`} style={{ '--brand': brand.brand_color }}>
      <div className="tpl-delivery-punch"/>

      <div className="tpl-delivery-header">
        {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-delivery-logo"/>}
        <div className="tpl-delivery-brand-block">
          <div className="tpl-delivery-brand">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <div className="tpl-delivery-tagline">{brand.tagline}</div>}
        </div>
      </div>

      <div className="tpl-delivery-hand">Handmade for you</div>
      <div className="tpl-delivery-product">{recipe.name}</div>

      {storage && (
        <div className="tpl-delivery-storage">
          <div className="tpl-delivery-storage-label">Keep me happy</div>
          <div>{storage}</div>
        </div>
      )}

      <div className="tpl-delivery-thanks">
        Thank you for supporting a small kitchen.
      </div>

      <div className="tpl-delivery-contact">
        {brand.instagram && <span>@{brand.instagram}</span>}
        {brand.facebook  && <span>fb/{brand.facebook}</span>}
        {brand.website   && <span>{brand.website}</span>}
        {brand.contact_phone && <span>{brand.contact_phone}</span>}
      </div>
    </div>
  )
}
