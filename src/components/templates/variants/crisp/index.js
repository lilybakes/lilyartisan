/**
 * Crisp variant — dedicated per-template components, mirroring the Kraft
 * pilot architecture.
 *
 * Importing this module also loads the shared crisp CSS.
 */
import './styles.css'

export { CrispRecipeCard }        from './RecipeCard.jsx'
export { CrispCostBreakdown }     from './CostBreakdown.jsx'
export { CrispCareCard }          from './CareCard.jsx'
export { CrispProductLabel }      from './ProductLabel.jsx'
export { CrispMenuInsert }        from './MenuInsert.jsx'
export { CrispWholesalePriceList } from './WholesalePriceList.jsx'
export { CrispDeliveryTag }       from './DeliveryTag.jsx'
export { CrispSocialMediaCard }   from './SocialMediaCard.jsx'
export { CrispBinderPage }        from './BinderPage.jsx'
export { CrispCertificate }       from './Certificate.jsx'

// Map of template key → Crisp-specific component.
// Consumed by templates/index.js to resolve the right component per style.
import { CrispRecipeCard } from './RecipeCard.jsx'
import { CrispCostBreakdown } from './CostBreakdown.jsx'
import { CrispCareCard } from './CareCard.jsx'
import { CrispProductLabel } from './ProductLabel.jsx'
import { CrispMenuInsert } from './MenuInsert.jsx'
import { CrispWholesalePriceList } from './WholesalePriceList.jsx'
import { CrispDeliveryTag } from './DeliveryTag.jsx'
import { CrispSocialMediaCard } from './SocialMediaCard.jsx'
import { CrispBinderPage } from './BinderPage.jsx'
import { CrispCertificate } from './Certificate.jsx'

export const CRISP_TEMPLATES = {
  classic:   CrispRecipeCard,
  cost:      CrispCostBreakdown,
  care:      CrispCareCard,
  label:     CrispProductLabel,
  menu:      CrispMenuInsert,
  wholesale: CrispWholesalePriceList,
  delivery:  CrispDeliveryTag,
  social:    CrispSocialMediaCard,
  binder:    CrispBinderPage,
  cert:      CrispCertificate,
}
