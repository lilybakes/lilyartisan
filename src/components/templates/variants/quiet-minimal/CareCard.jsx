import { QuietBrandLockup, QuietEyebrow, QuietDot, QuietRule, QuietFooter } from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Top: textonly brand (no DC) left, tiny rust dot right. Generous space.
 * THANK YOU mono muted eyebrow, product name in light sans, then STORAGE
 * and ALLERGENS blocks — mono muted eyebrows + sans body copy. Hairline
 * before the split footer.
 */
export function QuietCareCard({ recipe = {}, brand = {} }) {
  const careText =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best day of baking. Store in an airtight container up to 3 days.'

  const allergensText =
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    'See label for allergens.'

  return (
    <div className="tpl q-tpl q-care printable">
      <header className="q-care-header">
        <QuietBrandLockup brand={brand} layout="textonly"/>
        <QuietDot/>
      </header>

      <div className="q-care-title-block">
        <QuietEyebrow>Thank you</QuietEyebrow>
        <h2 className="q-title q-care-product">{recipe.name || 'Product name'}</h2>
      </div>

      <section className="q-care-section">
        <QuietEyebrow>Storage</QuietEyebrow>
        <p className="q-care-text">{careText}</p>
      </section>

      <section className="q-care-section">
        <QuietEyebrow>Allergens</QuietEyebrow>
        <p className="q-care-text">{allergensText}</p>
      </section>

      <div className="q-care-footer-wrap">
        <QuietRule marginBottom="4mm"/>
        <QuietFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
