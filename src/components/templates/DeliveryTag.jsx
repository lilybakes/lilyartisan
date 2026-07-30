/**
 * Delivery tag — small hang-tag or box-topper for delivery orders.
 * A7 sized, punchable for string.
 */
export function DeliveryTag({ recipe, brand }) {
  return (
    <div className="tpl tpl-delivery printable" style={{ '--brand': brand.brand_color }}>
      <div className="tpl-delivery-punch"/>

      <div className="tpl-delivery-header">
        {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-delivery-logo"/>}
        <div className="tpl-delivery-brand">{brand.business_name || 'Your Bakery'}</div>
      </div>

      <div className="tpl-delivery-hand">Handmade for you</div>
      <div className="tpl-delivery-product">{recipe.name}</div>

      {recipe.storage_notes && (
        <div className="tpl-delivery-storage">
          <div className="tpl-delivery-storage-label">Keep me happy</div>
          <div>{recipe.storage_notes}</div>
        </div>
      )}

      <div className="tpl-delivery-thanks">
        Thank you for supporting a small kitchen.
      </div>

      <div className="tpl-delivery-contact">
        {brand.instagram && <span>@{brand.instagram}</span>}
        {brand.contact_phone && <span>{brand.contact_phone}</span>}
      </div>
    </div>
  )
}
