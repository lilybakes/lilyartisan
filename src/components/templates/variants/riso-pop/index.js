/**
 * Riso Pop variant — dedicated per-template components, mirroring the
 * Kraft/Crisp/BKO/Letterpress/Editorial/Quiet-Minimal/Verdant/Ember/
 * Flour-&-Ink architecture.
 *
 * Importing this module also loads the shared riso-pop CSS.
 */
import './styles.css'

export { RpRecipeCard }         from './RecipeCard.jsx'
export { RpCostBreakdown }      from './CostBreakdown.jsx'
export { RpCareCard }           from './CareCard.jsx'
export { RpProductLabel }       from './ProductLabel.jsx'
export { RpMenuInsert }         from './MenuInsert.jsx'
export { RpWholesalePriceList } from './WholesalePriceList.jsx'
export { RpDeliveryTag }        from './DeliveryTag.jsx'
export { RpSocialMediaCard }    from './SocialMediaCard.jsx'
export { RpBinderPage }         from './BinderPage.jsx'
export { RpCertificate }        from './Certificate.jsx'

import { RpRecipeCard }         from './RecipeCard.jsx'
import { RpCostBreakdown }      from './CostBreakdown.jsx'
import { RpCareCard }           from './CareCard.jsx'
import { RpProductLabel }       from './ProductLabel.jsx'
import { RpMenuInsert }         from './MenuInsert.jsx'
import { RpWholesalePriceList } from './WholesalePriceList.jsx'
import { RpDeliveryTag }        from './DeliveryTag.jsx'
import { RpSocialMediaCard }    from './SocialMediaCard.jsx'
import { RpBinderPage }         from './BinderPage.jsx'
import { RpCertificate }        from './Certificate.jsx'

export const RISO_POP_TEMPLATES = {
  classic:   RpRecipeCard,
  cost:      RpCostBreakdown,
  care:      RpCareCard,
  label:     RpProductLabel,
  menu:      RpMenuInsert,
  wholesale: RpWholesalePriceList,
  delivery:  RpDeliveryTag,
  social:    RpSocialMediaCard,
  binder:    RpBinderPage,
  cert:      RpCertificate,
}
