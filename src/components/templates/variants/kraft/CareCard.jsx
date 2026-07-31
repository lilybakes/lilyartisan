import { KraftBrandLockup, KraftFooter } from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer, in box
 *
 * Matches Image 8 (Blueberry Muffins care card):
 *   • Dashed rectangle border around the whole content
 *   • Centered layout throughout
 *   • Centered brand lockup (monogram above brand+tagline)
 *   • Italic "Thank you, truly." warm greeting
 *   • Big slab-serif product name
 *   • Short brown horizontal rule
 *   • "HOW TO KEEP IT" section: eyebrow + centered body sentence
 *   • "ALLERGENS" section: eyebrow + centered allergens sentence
 *   • Centered footer: address, contact, socials
 */
export function KraftCareCard({ recipe = {}, brand = {} }) {
  const storageText = recipe.storage_text || recipe.storageText ||
    'Best day of baking. Store in an airtight container up to 3 days.'
  const allergens = recipe.allergens || []
  const allergensText = Array.isArray(allergens) && allergens.length
    ? `Contains: ${allergens.join(', ')}.`
    : (typeof allergens === 'string' ? allergens : 'See label for allergens.')

  return (
    <div className="tpl k-tpl k-care printable">
      <div className="k-care-inner">
        <KraftBrandLockup brand={brand} size="md" layout="column"/>

        <div className="k-care-thanks">Thank you, truly.</div>
        <h2 className="k-care-product">{recipe.name || 'Product name'}</h2>
        <div className="k-care-short-rule"/>

        <div className="k-care-section-lbl">How to keep it</div>
        <div className="k-care-body-text">{storageText}</div>

        <div className="k-care-section-lbl">Allergens</div>
        <div className="k-care-body-text">{allergensText}</div>

        <KraftFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
