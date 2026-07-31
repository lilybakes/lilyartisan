import { KraftBrandLockup } from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait) — per-order hang tag
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text       — default "Handmade for you"
 *   customization.care_title_text    — default "Keep me happy"
 *   customization.thanks_text        — default "Thank you for supporting a small kitchen."
 *   Care body:  recipe.care_text ↓ recipe.storage_text ↓ brand.default_care_text ↓ brand.default_storage_notes ↓ fallback
 */
export function KraftDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow    = customization.eyebrow_text    || 'Handmade for you'
  const careTitle  = customization.care_title_text || 'Keep me happy'
  const thanks     = customization.thanks_text     || 'Thank you for supporting a small kitchen.'
  const careBody   =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best within 4 days under a cake dome at room temperature.'

  return (
    <div className="tpl k-tpl k-delivery printable">
      <div className="k-delivery-inner">
        <div className="k-delivery-hole"/>
        <KraftBrandLockup brand={brand} size="md" layout="column"/>

        <div className="k-eyebrow k-delivery-eyebrow">{eyebrow}</div>
        <h2 className="k-delivery-product">{recipe.name || 'Product name'}</h2>

        <div className="k-delivery-care-box">
          <div className="k-delivery-care-title">{careTitle}</div>
          <div className="k-delivery-care-body">{careBody}</div>
        </div>

        <div className="k-delivery-thanks">{thanks}</div>

        <div className="k-delivery-social">
          {brand.instagram && <>@{brand.instagram}</>}
          {brand.instagram && brand.facebook && <> · </>}
          {brand.facebook && <>fb/{brand.facebook}</>}
        </div>
      </div>
    </div>
  )
}
