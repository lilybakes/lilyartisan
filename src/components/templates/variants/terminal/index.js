/**
 * Terminal variant — dedicated per-template components in the CLI/CRT
 * dark-mode aesthetic. Mirrors the Flour & Ink / Editorial / Bauhaus
 * architecture.
 *
 * Importing this module also loads the shared terminal CSS.
 */
import './styles.css'

export { TrRecipeCard }         from './RecipeCard.jsx'
export { TrCostBreakdown }      from './CostBreakdown.jsx'
export { TrCareCard }           from './CareCard.jsx'
export { TrProductLabel }       from './ProductLabel.jsx'
export { TrMenuInsert }         from './MenuInsert.jsx'
export { TrWholesalePriceList } from './WholesalePriceList.jsx'
export { TrDeliveryTag }        from './DeliveryTag.jsx'
export { TrSocialMediaCard }    from './SocialMediaCard.jsx'
export { TrBinderPage }         from './BinderPage.jsx'
export { TrCertificate }        from './Certificate.jsx'

import { TrRecipeCard }         from './RecipeCard.jsx'
import { TrCostBreakdown }      from './CostBreakdown.jsx'
import { TrCareCard }           from './CareCard.jsx'
import { TrProductLabel }       from './ProductLabel.jsx'
import { TrMenuInsert }         from './MenuInsert.jsx'
import { TrWholesalePriceList } from './WholesalePriceList.jsx'
import { TrDeliveryTag }        from './DeliveryTag.jsx'
import { TrSocialMediaCard }    from './SocialMediaCard.jsx'
import { TrBinderPage }         from './BinderPage.jsx'
import { TrCertificate }        from './Certificate.jsx'

export const TERMINAL_TEMPLATES = {
  classic:   TrRecipeCard,
  cost:      TrCostBreakdown,
  care:      TrCareCard,
  label:     TrProductLabel,
  menu:      TrMenuInsert,
  wholesale: TrWholesalePriceList,
  delivery:  TrDeliveryTag,
  social:    TrSocialMediaCard,
  binder:    TrBinderPage,
  cert:      TrCertificate,
}
