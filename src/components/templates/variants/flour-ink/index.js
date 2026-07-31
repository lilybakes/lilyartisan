/**
 * Flour & Ink variant — dedicated per-template components, mirroring the
 * Kraft/Crisp/BKO/Letterpress/Editorial/Quiet-Minimal/Verdant/Ember
 * architecture.
 *
 * Importing this module also loads the shared flour-ink CSS.
 */
import './styles.css'

export { FiRecipeCard }         from './RecipeCard.jsx'
export { FiCostBreakdown }      from './CostBreakdown.jsx'
export { FiCareCard }           from './CareCard.jsx'
export { FiProductLabel }       from './ProductLabel.jsx'
export { FiMenuInsert }         from './MenuInsert.jsx'
export { FiWholesalePriceList } from './WholesalePriceList.jsx'
export { FiDeliveryTag }        from './DeliveryTag.jsx'
export { FiSocialMediaCard }    from './SocialMediaCard.jsx'
export { FiBinderPage }         from './BinderPage.jsx'
export { FiCertificate }        from './Certificate.jsx'

import { FiRecipeCard } from './RecipeCard.jsx'
import { FiCostBreakdown } from './CostBreakdown.jsx'
import { FiCareCard } from './CareCard.jsx'
import { FiProductLabel } from './ProductLabel.jsx'
import { FiMenuInsert } from './MenuInsert.jsx'
import { FiWholesalePriceList } from './WholesalePriceList.jsx'
import { FiDeliveryTag } from './DeliveryTag.jsx'
import { FiSocialMediaCard } from './SocialMediaCard.jsx'
import { FiBinderPage } from './BinderPage.jsx'
import { FiCertificate } from './Certificate.jsx'

export const FLOUR_INK_TEMPLATES = {
  classic:   FiRecipeCard,
  cost:      FiCostBreakdown,
  care:      FiCareCard,
  label:     FiProductLabel,
  menu:      FiMenuInsert,
  wholesale: FiWholesalePriceList,
  delivery:  FiDeliveryTag,
  social:    FiSocialMediaCard,
  binder:    FiBinderPage,
  cert:      FiCertificate,
}
