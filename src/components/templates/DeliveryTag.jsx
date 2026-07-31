import { TagGrommet, TwineArc } from './ornaments.jsx'

/**
 * Delivery Tag — "Kraft Paper Stamp"
 * Kraft brown paper, rubber-stamp typography, grommet + twine.
 */
export function DeliveryTag({ recipe, brand }) {
  const storage = recipe.storage_notes || brand.default_storage_notes

  return (
    <div className="tpl tpl-delivery-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Twine at very top */}
      <div className="tpl-delivery-v2-twine">
        <TwineArc width={90} color="#5D4530"/>
      </div>

      {/* Grommet */}
      <div className="tpl-delivery-v2-grommet">
        <TagGrommet size={10}/>
      </div>

      <div className="tpl-delivery-v2-body">
        {/* Rubber-stamp brand */}
        <div className="tpl-delivery-v2-stamp">
          <div className="tpl-delivery-v2-stamp-inner">
            {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-delivery-v2-logo"/>}
            <div className="tpl-delivery-v2-stamp-name">{brand.business_name || 'Your Bakery'}</div>
            {brand.tagline && <div className="tpl-delivery-v2-stamp-tag">{brand.tagline}</div>}
          </div>
        </div>

        <div className="tpl-delivery-v2-eyebrow">HAND — DELIVERED</div>
        <div className="tpl-delivery-v2-product">{recipe.name}</div>

        {storage && (
          <div className="tpl-delivery-v2-storage">
            <div className="tpl-delivery-v2-storage-label">Care instructions</div>
            <div>{storage}</div>
          </div>
        )}

        <div className="tpl-delivery-v2-signoff">
          <em>with gratitude,</em><br/>
          {brand.owner_name && <span className="tpl-delivery-v2-signoff-name">— {brand.owner_name}</span>}
        </div>

        <div className="tpl-delivery-v2-footer">
          {brand.instagram && <span>@{brand.instagram}</span>}
          {brand.facebook  && <span>fb/{brand.facebook}</span>}
          {brand.contact_phone && <span>{brand.contact_phone}</span>}
        </div>
      </div>
    </div>
  )
}
