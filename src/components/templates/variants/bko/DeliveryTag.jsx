import { BkoBrandLockup } from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait) — per-order hang tag
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text       — default "Handmade for you"
 *   customization.care_title_text    — default "Keep me happy"
 *   customization.thanks_text        — default "Thank you for supporting a small kitchen."
 *   Care body:  recipe.care_text ↓ recipe.storage_text ↓ brand.default_care_text ↓ brand.default_storage_notes ↓ fallback
 */
export function BkoDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text    || 'Handmade for you'
  const careTitle = customization.care_title_text || 'Keep me happy'
  const thanks    = customization.thanks_text     || 'Thank you for supporting a small kitchen.'
  const careBody  =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best within 4 days under a cake dome at room temperature.'

  return (
    <div className="tpl b-tpl b-delivery printable">
      <div className="b-delivery-topbar"/>
      <div className="b-delivery-hole"/>

      <div className="b-delivery-inner">
        <BkoBrandLockup brand={brand} size="sm" layout="column"/>

        <div className="b-eyebrow b-eyebrow-muted b-delivery-eyebrow">{eyebrow}</div>
        <h2 className="b-delivery-product">{recipe.name || 'Product name'}</h2>

        <div className="b-delivery-care-box">
          <div className="b-eyebrow b-eyebrow-accent">{careTitle}</div>
          <div className="b-delivery-care-body">{careBody}</div>
        </div>

        <div className="b-delivery-thanks">{thanks}</div>

        <div className="b-delivery-footer">
          <div className="b-footer-social">
            {brand.instagram && <>@{brand.instagram}</>}
            {brand.instagram && brand.facebook && <> · </>}
            {brand.facebook && <>fb/{brand.facebook}</>}
          </div>
          <div className="b-delivery-footer-line">
            {[brand.website, brand.phone].filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>
    </div>
  )
}
