import {
  VerdantEyebrow, VerdantHairRule, VerdantDecorCircle,
} from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Top ~30% is a filled dark-green header block with a decorative mint-tinted
 * circle overlapping the top-right corner. Brand line small caps cream +
 * big serif product title cream inside the block.
 *
 * Below on cream: INGREDIENTS eyebrow + sans list, then a rounded mint
 * ALLERGEN NOTICE callout box. Thin hairline + tiny centered footer with
 * the @handle in bold green as the accent.
 */
export function VerdantProductLabel({ recipe = {}, brand = {} }) {
  const lines = recipe.lines || []

  const ingredientsSentence =
    (recipe.label_ingredients_text && recipe.label_ingredients_text.trim()) ||
    (lines.length > 0
      ? lines.map(l => l.ingredient_name).filter(Boolean).join(', ') + '.'
      : 'See recipe.')

  const allergensText =
    recipe.label_allergens_text ||
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    'See label for allergens.'

  const brandLine = `${brand?.business_name || 'Your Bakery'}${
    brand?.city ? ` · ${brand.city}` : (brand?.address_line2 ? ` · ${brand.address_line2.split(',').pop().trim()}` : '')
  }`

  const contactBits = [brand.phone, brand.website].filter(Boolean)

  return (
    <div className="tpl v-tpl v-label printable">
      <header className="v-label-header">
        <VerdantDecorCircle size={130} top={-50} right={-40} tone="green-tint" />
        <VerdantEyebrow tone="cream" className="v-label-brand-line">{brandLine}</VerdantEyebrow>
        <h2 className="v-title v-label-product">{recipe.name || 'Product name'}</h2>
      </header>

      <div className="v-label-body">
        <section className="v-label-section">
          <VerdantEyebrow>Ingredients</VerdantEyebrow>
          <p className="v-label-ingredients">{ingredientsSentence}</p>
        </section>

        <div className="v-label-allergen">
          <VerdantEyebrow>Allergen Notice</VerdantEyebrow>
          <p className="v-label-allergen-body">{allergensText}</p>
        </div>
      </div>

      <div className="v-label-footer-wrap">
        <VerdantHairRule marginTop="auto"/>
        <div className="v-label-footer">
          {contactBits.map((b, i) => (
            <span key={i}>{i > 0 && ' · '}{b}</span>
          ))}
          {brand.instagram && (
            <> · <span className="v-footer-social">@{brand.instagram}</span></>
          )}
        </div>
      </div>
    </div>
  )
}
