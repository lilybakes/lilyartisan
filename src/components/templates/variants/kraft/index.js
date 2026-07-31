/**
 * Kraft variant — dedicated per-template components, per the pilot architecture.
 *
 * Importing this module also loads the shared kraft CSS.
 */
import './styles.css'

export { KraftRecipeCard }        from './RecipeCard.jsx'
export { KraftCostBreakdown }     from './CostBreakdown.jsx'
export { KraftCareCard }          from './CareCard.jsx'
export { KraftProductLabel }      from './ProductLabel.jsx'
export { KraftMenuInsert }        from './MenuInsert.jsx'
export { KraftWholesalePriceList } from './WholesalePriceList.jsx'
export { KraftDeliveryTag }       from './DeliveryTag.jsx'
export { KraftSocialMediaCard }   from './SocialMediaCard.jsx'
export { KraftBinderPage }        from './BinderPage.jsx'
export { KraftCertificate }       from './Certificate.jsx'

// Map of template key → Kraft-specific component.
// Consumed by templates/index.js to resolve the right component per style.
import { KraftRecipeCard } from './RecipeCard.jsx'
import { KraftCostBreakdown } from './CostBreakdown.jsx'
import { KraftCareCard } from './CareCard.jsx'
import { KraftProductLabel } from './ProductLabel.jsx'
import { KraftMenuInsert } from './MenuInsert.jsx'
import { KraftWholesalePriceList } from './WholesalePriceList.jsx'
import { KraftDeliveryTag } from './DeliveryTag.jsx'
import { KraftSocialMediaCard } from './SocialMediaCard.jsx'
import { KraftBinderPage } from './BinderPage.jsx'
import { KraftCertificate } from './Certificate.jsx'

export const KRAFT_TEMPLATES = {
  classic:   KraftRecipeCard,
  cost:      KraftCostBreakdown,
  care:      KraftCareCard,
  label:     KraftProductLabel,
  menu:      KraftMenuInsert,
  wholesale: KraftWholesalePriceList,
  delivery:  KraftDeliveryTag,
  social:    KraftSocialMediaCard,
  binder:    KraftBinderPage,
  cert:      KraftCertificate,
}
