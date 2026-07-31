import { ClassicRecipeCard }  from './ClassicRecipeCard.jsx'
import { CostBreakdown }      from './CostBreakdown.jsx'
import { CareCard }           from './CareCard.jsx'
import { ProductLabel }       from './ProductLabel.jsx'
import { MenuInsert }         from './MenuInsert.jsx'
import { WholesalePriceList } from './WholesalePriceList.jsx'
import { DeliveryTag }        from './DeliveryTag.jsx'
import { SocialMediaCard }    from './SocialMediaCard.jsx'
import { RecipeBinderPage }   from './RecipeBinderPage.jsx'
import { CertificateOfCraft } from './CertificateOfCraft.jsx'

// Per-variant template overrides — loaded lazily so unused variants don't
// pay CSS or JS cost. Each variant module exports a `<VARIANT>_TEMPLATES`
// map: { [templateKey]: React component }.
import { KRAFT_TEMPLATES } from './variants/kraft/index.js'
import { CRISP_TEMPLATES } from './variants/crisp/index.js'
import { BKO_TEMPLATES } from './variants/bko/index.js'
import { LETTERPRESS_TEMPLATES } from './variants/letterpress/index.js'
import { EDITORIAL_TEMPLATES } from './variants/editorial/index.js'
import { QUIET_MINIMAL_TEMPLATES } from './variants/quiet-minimal/index.js'

/**
 * Registry of the 10 shared templates. Each entry is the DEFAULT (non-variant)
 * component; specific style variants can override any subset via the
 * VARIANT_MAP below.
 */
export const TEMPLATES = [
  { key: 'classic',   name: 'Classic Recipe Card',    description: 'Full recipe with ingredients and yield — for your kitchen or to share with staff.', component: ClassicRecipeCard,  ready: true, pageSize: 'A5', multi: false, preview: 'card-lines', gradient: 'linear-gradient(135deg, #7B68EE 0%, #6C5CE7 100%)' },
  { key: 'cost',      name: 'Cost Breakdown Sheet',   description: 'Internal cost analysis with ingredient prices, cost per portion, and suggested selling price.', component: CostBreakdown,      ready: true, pageSize: 'A4', multi: false, preview: 'card-bars',  gradient: 'linear-gradient(135deg, #FDB259 0%, #F5934C 100%)' },
  { key: 'care',      name: 'Care & Storage Card',    description: 'Customer-facing card with storage instructions and allergen notes.',                            component: CareCard,           ready: true, pageSize: 'A6', multi: false, preview: 'card-dots',  gradient: 'linear-gradient(135deg, #4FD1B8 0%, #34C77B 100%)' },
  { key: 'label',     name: 'Product Label',          description: 'Small packaging label with product name, allergens, and contact info.',                          component: ProductLabel,       ready: true, pageSize: 'A7', multi: false, preview: 'card-tag',   gradient: 'linear-gradient(135deg, #6DE398 0%, #48C577 100%)' },
  { key: 'menu',      name: 'Menu Insert',            description: 'Catalog-style menu of your recipes grouped by category.',                                        component: MenuInsert,         ready: true, pageSize: 'A5', multi: true,  preview: 'grid',       gradient: 'linear-gradient(135deg, #FF7A9C 0%, #F5527A 100%)' },
  { key: 'wholesale', name: 'Wholesale Price List',   description: 'Trade prices for wholesale buyers with retail / wholesale / batch columns.',                     component: WholesalePriceList, ready: true, pageSize: 'A4', multi: true,  preview: 'table',      gradient: 'linear-gradient(135deg, #6BB6FF 0%, #4A9DE8 100%)' },
  { key: 'delivery',  name: 'Delivery Tag',           description: 'Hang tag for delivery — product name, care line, thank-you.',                                    component: DeliveryTag,        ready: true, pageSize: 'A7', multi: false, preview: 'card-tag',   gradient: 'linear-gradient(135deg, #FDB259 0%, #E89642 100%)' },
  { key: 'social',    name: 'Social Media Card',      description: '1080×1080 square for Instagram, Facebook, etc.',                                                 component: SocialMediaCard,    ready: true, pageSize: '1:1', multi: false, preview: 'square',    gradient: 'linear-gradient(135deg, #E44FCE 0%, #C93AC0 100%)' },
  { key: 'binder',    name: 'Recipe Binder Page',     description: 'Comprehensive recipe reference: photo, costing, notes.',                                          component: RecipeBinderPage,   ready: true, pageSize: 'A4', multi: false, preview: 'card-lines', gradient: 'linear-gradient(135deg, #7B93AF 0%, #5B7592 100%)' },
  { key: 'cert',      name: 'Certificate of Craft',   description: 'Landscape certificate honoring the product and its maker.',                                       component: CertificateOfCraft, ready: true, pageSize: 'A4', multi: false, preview: 'circle',     gradient: 'linear-gradient(135deg, #E8B948 0%, #D69A2A 100%)' },
]

/**
 * Which variants have per-template dedicated components.
 * Add another entry when a new variant gets its own /variants/{name}/ folder.
 */
const VARIANT_MAP = {
  bko: BKO_TEMPLATES,
  kraft: KRAFT_TEMPLATES,
  crisp: CRISP_TEMPLATES,
  letterpress: LETTERPRESS_TEMPLATES,
  editorial: EDITORIAL_TEMPLATES,
  minimal: QUIET_MINIMAL_TEMPLATES,
}

export function getTemplate(key) {
  return TEMPLATES.find(t => t.key === key)
}

/**
 * Resolve the right component for a given template + style variant.
 *
 * If the variant has a dedicated component for this template key, return it.
 * Otherwise fall back to the shared component from TEMPLATES (which will
 * receive the `styleVariant` prop and style itself via CSS overrides in
 * `styles.css` — the old approach, kept as a graceful fallback).
 *
 * Returns:
 *   { Component, dedicated }  — dedicated=true means variant-specific JSX,
 *                                dedicated=false means the shared component
 */
export function getTemplateComponent(key, styleVariant) {
  const t = getTemplate(key)
  if (!t || !t.ready) return { Component: null, dedicated: false }

  const variantOverride = VARIANT_MAP[styleVariant]?.[key]
  if (variantOverride) {
    return { Component: variantOverride, dedicated: true }
  }
  return { Component: t.component, dedicated: false }
}
