/**
 * Ember variant — dedicated per-template components, mirroring the
 * Kraft/Crisp/BKO/Letterpress/Editorial/Quiet-Minimal/Verdant architecture.
 *
 * Importing this module also loads the shared ember CSS.
 */
import './styles.css'

export { EmberRecipeCard }         from './RecipeCard.jsx'
export { EmberCostBreakdown }      from './CostBreakdown.jsx'
export { EmberCareCard }           from './CareCard.jsx'
export { EmberProductLabel }       from './ProductLabel.jsx'
export { EmberMenuInsert }         from './MenuInsert.jsx'
export { EmberWholesalePriceList } from './WholesalePriceList.jsx'
export { EmberDeliveryTag }        from './DeliveryTag.jsx'
export { EmberSocialMediaCard }    from './SocialMediaCard.jsx'
export { EmberBinderPage }         from './BinderPage.jsx'
export { EmberCertificate }        from './Certificate.jsx'

import { EmberRecipeCard } from './RecipeCard.jsx'
import { EmberCostBreakdown } from './CostBreakdown.jsx'
import { EmberCareCard } from './CareCard.jsx'
import { EmberProductLabel } from './ProductLabel.jsx'
import { EmberMenuInsert } from './MenuInsert.jsx'
import { EmberWholesalePriceList } from './WholesalePriceList.jsx'
import { EmberDeliveryTag } from './DeliveryTag.jsx'
import { EmberSocialMediaCard } from './SocialMediaCard.jsx'
import { EmberBinderPage } from './BinderPage.jsx'
import { EmberCertificate } from './Certificate.jsx'

export const EMBER_TEMPLATES = {
  classic:   EmberRecipeCard,
  cost:      EmberCostBreakdown,
  care:      EmberCareCard,
  label:     EmberProductLabel,
  menu:      EmberMenuInsert,
  wholesale: EmberWholesalePriceList,
  delivery:  EmberDeliveryTag,
  social:    EmberSocialMediaCard,
  binder:    EmberBinderPage,
  cert:      EmberCertificate,
}
