import { KraftBrandLockup, kraftMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL CARD  (1080×1080, drawn 148×148mm) — screen only
 *
 * Matches Image 3 (Chocolate Fudge Cake social card):
 *   • Kraft-warm background
 *   • Centered stack: monogram + brand + tagline
 *   • Vertical space
 *   • "FRESH FROM OUR KITCHEN" tracked-caps brown eyebrow
 *   • HUGE slab-serif product name (wraps 2 lines)
 *   • Italic muted description
 *   • Rounded-pill brown outline "From RM 10.00"
 *   • Footer row: @handle · fb/handle (left), website (right)
 */
export function KraftSocialMediaCard({ recipe = {}, brand = {} }) {
  const suggested = recipe.suggested_price ?? recipe.suggestedPrice ?? 0

  return (
    <div className="tpl k-tpl k-social printable">
      <div className="k-social-top">
        <KraftBrandLockup brand={brand} size="md" layout="column"/>
      </div>

      <div className="k-social-center">
        <div className="k-eyebrow k-social-eyebrow">Fresh from our kitchen</div>
        <h2 className="k-social-name">{recipe.name || 'Product name'}</h2>
        {recipe.description && (
          <div className="k-social-desc">{recipe.description}</div>
        )}
        {suggested > 0 && (
          <div className="k-social-price-pill">From {kraftMoney(suggested)}</div>
        )}
      </div>

      <div className="k-social-bottom">
        <div className="k-social-handles">
          {brand.instagram && <>@{brand.instagram}</>}
          {brand.instagram && brand.facebook && <> · </>}
          {brand.facebook && <>fb/{brand.facebook}</>}
        </div>
        <div>{brand.website || ''}</div>
      </div>
    </div>
  )
}
