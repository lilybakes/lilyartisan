import {
  AuEyebrow, AuChip, AuFooter, parseAllergens,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Full-width gradient band at the top (~50mm — about 35% of the card)
 * carries a white "THANK YOU FOR CHOOSING US" eyebrow and a huge white
 * Manrope extrabold product title. Below on lavender paper: STORAGE
 * body copy in a soft glass-purple rounded box (labeled with purple
 * eyebrow), then ALLERGENS as gradient-filled pill chips.
 */
export function AuCareCard({ recipe = {}, brand = {} }) {
  const careText =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best on the day of baking. Keep in an airtight container up to three days.'

  const allergensRaw =
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    ''

  const allergenList = parseAllergens(allergensRaw)

  return (
    <div className="tpl au-tpl au-care printable">
      <header className="au-care-header">
        <div className="au-care-eyebrow">THANK YOU FOR CHOOSING US</div>
        <h2 className="au-title au-care-product">{(recipe.name || 'Product name').toUpperCase()}</h2>
      </header>

      <div className="au-care-body">
        <section className="au-care-glass">
          <AuEyebrow tone="purple">Storage</AuEyebrow>
          <p className="au-care-text">{careText}</p>
        </section>

        <section className="au-care-section">
          <AuEyebrow tone="purple">Allergens</AuEyebrow>
          {allergenList.length > 0 ? (
            <div className="au-care-allergen-chips">
              {allergenList.map((a, i) => <AuChip key={i}>{a}</AuChip>)}
            </div>
          ) : (
            <p className="au-care-text">{allergensRaw || 'See label for allergens.'}</p>
          )}
        </section>
      </div>

      <div className="au-care-footer-wrap">
        <AuFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
