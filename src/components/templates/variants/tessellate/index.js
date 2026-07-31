/**
 * Tessellate variant — dedicated per-template components, mirroring the
 * Kraft / Crisp / BKO / Letterpress / Editorial / Quiet-Minimal /
 * Verdant / Ember / Flour-Ink architecture.
 *
 * Importing this module also loads the shared tessellate CSS.
 */
import './styles.css'

export { TeRecipeCard }         from './RecipeCard.jsx'
export { TeCostBreakdown }      from './CostBreakdown.jsx'
export { TeCareCard }           from './CareCard.jsx'
export { TeProductLabel }       from './ProductLabel.jsx'
export { TeMenuInsert }         from './MenuInsert.jsx'
export { TeWholesalePriceList } from './WholesalePriceList.jsx'
export { TeDeliveryTag }        from './DeliveryTag.jsx'
export { TeSocialMediaCard }    from './SocialMediaCard.jsx'
export { TeBinderPage }         from './BinderPage.jsx'
export { TeCertificate }        from './Certificate.jsx'

import { TeRecipeCard } from './RecipeCard.jsx'
import { TeCostBreakdown } from './CostBreakdown.jsx'
import { TeCareCard } from './CareCard.jsx'
import { TeProductLabel } from './ProductLabel.jsx'
import { TeMenuInsert } from './MenuInsert.jsx'
import { TeWholesalePriceList } from './WholesalePriceList.jsx'
import { TeDeliveryTag } from './DeliveryTag.jsx'
import { TeSocialMediaCard } from './SocialMediaCard.jsx'
import { TeBinderPage } from './BinderPage.jsx'
import { TeCertificate } from './Certificate.jsx'

export const TESSELLATE_TEMPLATES = {
  classic:   TeRecipeCard,
  cost:      TeCostBreakdown,
  care:      TeCareCard,
  label:     TeProductLabel,
  menu:      TeMenuInsert,
  wholesale: TeWholesalePriceList,
  delivery:  TeDeliveryTag,
  social:    TeSocialMediaCard,
  binder:    TeBinderPage,
  cert:      TeCertificate,
}
