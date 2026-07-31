/**
 * Verdant variant — dedicated per-template components, mirroring the
 * Kraft/Crisp/BKO/Letterpress/Editorial/Quiet-Minimal architecture.
 *
 * Importing this module also loads the shared verdant CSS.
 */
import './styles.css'

export { VerdantRecipeCard }         from './RecipeCard.jsx'
export { VerdantCostBreakdown }      from './CostBreakdown.jsx'
export { VerdantCareCard }           from './CareCard.jsx'
export { VerdantProductLabel }       from './ProductLabel.jsx'
export { VerdantMenuInsert }         from './MenuInsert.jsx'
export { VerdantWholesalePriceList } from './WholesalePriceList.jsx'
export { VerdantDeliveryTag }        from './DeliveryTag.jsx'
export { VerdantSocialMediaCard }    from './SocialMediaCard.jsx'
export { VerdantBinderPage }         from './BinderPage.jsx'
export { VerdantCertificate }        from './Certificate.jsx'

import { VerdantRecipeCard } from './RecipeCard.jsx'
import { VerdantCostBreakdown } from './CostBreakdown.jsx'
import { VerdantCareCard } from './CareCard.jsx'
import { VerdantProductLabel } from './ProductLabel.jsx'
import { VerdantMenuInsert } from './MenuInsert.jsx'
import { VerdantWholesalePriceList } from './WholesalePriceList.jsx'
import { VerdantDeliveryTag } from './DeliveryTag.jsx'
import { VerdantSocialMediaCard } from './SocialMediaCard.jsx'
import { VerdantBinderPage } from './BinderPage.jsx'
import { VerdantCertificate } from './Certificate.jsx'

export const VERDANT_TEMPLATES = {
  classic:   VerdantRecipeCard,
  cost:      VerdantCostBreakdown,
  care:      VerdantCareCard,
  label:     VerdantProductLabel,
  menu:      VerdantMenuInsert,
  wholesale: VerdantWholesalePriceList,
  delivery:  VerdantDeliveryTag,
  social:    VerdantSocialMediaCard,
  binder:    VerdantBinderPage,
  cert:      VerdantCertificate,
}
