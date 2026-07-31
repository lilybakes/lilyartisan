import { KraftBrandLockup, KraftFooter } from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per order, has punch hole
 *
 * Matches Image 2 (Chocolate Fudge Cake delivery tag):
 *   • Punch-hole circle at top (subtle brown outline)
 *   • Centered dashed monogram + brand + italic tagline
 *   • "HANDMADE FOR YOU" tracked-caps brown eyebrow
 *   • Big slab-serif product name (may wrap to 2 lines)
 *   • Dashed rectangle box: "KEEP ME HAPPY" + care sentence, centered
 *   • Italic muted "Thank you for supporting a small kitchen."
 *   • Social handles brown centered at bottom
 */
export function KraftDeliveryTag({ recipe = {}, brand = {} }) {
  const careText = recipe.care_text || recipe.careText ||
    recipe.storage_text ||
    'Best within 4 days under a cake dome at room temperature.'

  return (
    <div className="tpl k-tpl k-delivery printable">
      <div className="k-delivery-inner">
        <div className="k-delivery-hole"/>
        <KraftBrandLockup brand={brand} size="md" layout="column"/>

        <div className="k-eyebrow k-delivery-eyebrow">Handmade for you</div>
        <h2 className="k-delivery-product">{recipe.name || 'Product name'}</h2>

        <div className="k-delivery-care-box">
          <div className="k-delivery-care-title">Keep me happy</div>
          <div className="k-delivery-care-body">{careText}</div>
        </div>

        <div className="k-delivery-thanks">Thank you for supporting a small kitchen.</div>

        <div className="k-delivery-social">
          {brand.instagram && <>@{brand.instagram}</>}
          {brand.instagram && brand.facebook && <> · </>}
          {brand.facebook && <>fb/{brand.facebook}</>}
        </div>
      </div>
    </div>
  )
}
