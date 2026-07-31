/**
 * BakeOnomics Clean variant — dedicated per-template components, mirroring the Kraft
 * pilot architecture.
 *
 * Importing this module also loads the shared bko CSS.
 */
import './styles.css'

export { BkoRecipeCard }        from './RecipeCard.jsx'
export { BkoCostBreakdown }     from './CostBreakdown.jsx'
export { BkoCareCard }          from './CareCard.jsx'
export { BkoProductLabel }      from './ProductLabel.jsx'
export { BkoMenuInsert }        from './MenuInsert.jsx'
export { BkoWholesalePriceList } from './WholesalePriceList.jsx'
export { BkoDeliveryTag }       from './DeliveryTag.jsx'
export { BkoSocialMediaCard }   from './SocialMediaCard.jsx'
export { BkoBinderPage }        from './BinderPage.jsx'
export { BkoCertificate }       from './Certificate.jsx'

// Map of template key → BakeOnomics Clean-specific component.
// Consumed by templates/index.js to resolve the right component per style.
import { BkoRecipeCard } from './RecipeCard.jsx'
import { BkoCostBreakdown } from './CostBreakdown.jsx'
import { BkoCareCard } from './CareCard.jsx'
import { BkoProductLabel } from './ProductLabel.jsx'
import { BkoMenuInsert } from './MenuInsert.jsx'
import { BkoWholesalePriceList } from './WholesalePriceList.jsx'
import { BkoDeliveryTag } from './DeliveryTag.jsx'
import { BkoSocialMediaCard } from './SocialMediaCard.jsx'
import { BkoBinderPage } from './BinderPage.jsx'
import { BkoCertificate } from './Certificate.jsx'

export const BKO_TEMPLATES = {
  classic:   BkoRecipeCard,
  cost:      BkoCostBreakdown,
  care:      BkoCareCard,
  label:     BkoProductLabel,
  menu:      BkoMenuInsert,
  wholesale: BkoWholesalePriceList,
  delivery:  BkoDeliveryTag,
  social:    BkoSocialMediaCard,
  binder:    BkoBinderPage,
  cert:      BkoCertificate,
}
