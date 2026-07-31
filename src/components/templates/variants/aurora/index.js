/**
 * Aurora variant — dedicated per-template components. Signature: full-width
 * aurora gradient bands (purple → teal → pink), Manrope extrabold titles,
 * purple letter-tracked eyebrows, gradient-filled pill chips and method
 * markers.
 *
 * Importing this module also loads the shared aurora CSS.
 */
import './styles.css'

export { AuRecipeCard }         from './RecipeCard.jsx'
export { AuCostBreakdown }      from './CostBreakdown.jsx'
export { AuCareCard }           from './CareCard.jsx'
export { AuProductLabel }       from './ProductLabel.jsx'
export { AuMenuInsert }         from './MenuInsert.jsx'
export { AuWholesalePriceList } from './WholesalePriceList.jsx'
export { AuDeliveryTag }        from './DeliveryTag.jsx'
export { AuSocialMediaCard }    from './SocialMediaCard.jsx'
export { AuBinderPage }         from './BinderPage.jsx'
export { AuCertificate }        from './Certificate.jsx'

import { AuRecipeCard } from './RecipeCard.jsx'
import { AuCostBreakdown } from './CostBreakdown.jsx'
import { AuCareCard } from './CareCard.jsx'
import { AuProductLabel } from './ProductLabel.jsx'
import { AuMenuInsert } from './MenuInsert.jsx'
import { AuWholesalePriceList } from './WholesalePriceList.jsx'
import { AuDeliveryTag } from './DeliveryTag.jsx'
import { AuSocialMediaCard } from './SocialMediaCard.jsx'
import { AuBinderPage } from './BinderPage.jsx'
import { AuCertificate } from './Certificate.jsx'

export const AURORA_TEMPLATES = {
  classic:   AuRecipeCard,
  cost:      AuCostBreakdown,
  care:      AuCareCard,
  label:     AuProductLabel,
  menu:      AuMenuInsert,
  wholesale: AuWholesalePriceList,
  delivery:  AuDeliveryTag,
  social:    AuSocialMediaCard,
  binder:    AuBinderPage,
  cert:      AuCertificate,
}
