/**
 * Quiet Minimal variant — dedicated per-template components, mirroring the
 * Kraft/Crisp/BKO/Letterpress/Editorial architecture.
 *
 * Importing this module also loads the shared quiet-minimal CSS.
 */
import './styles.css'

export { QuietRecipeCard }        from './RecipeCard.jsx'
export { QuietCostBreakdown }     from './CostBreakdown.jsx'
export { QuietCareCard }          from './CareCard.jsx'
export { QuietProductLabel }      from './ProductLabel.jsx'
export { QuietMenuInsert }        from './MenuInsert.jsx'
export { QuietWholesalePriceList } from './WholesalePriceList.jsx'
export { QuietDeliveryTag }       from './DeliveryTag.jsx'
export { QuietSocialMediaCard }   from './SocialMediaCard.jsx'
export { QuietBinderPage }        from './BinderPage.jsx'
export { QuietCertificate }       from './Certificate.jsx'

import { QuietRecipeCard } from './RecipeCard.jsx'
import { QuietCostBreakdown } from './CostBreakdown.jsx'
import { QuietCareCard } from './CareCard.jsx'
import { QuietProductLabel } from './ProductLabel.jsx'
import { QuietMenuInsert } from './MenuInsert.jsx'
import { QuietWholesalePriceList } from './WholesalePriceList.jsx'
import { QuietDeliveryTag } from './DeliveryTag.jsx'
import { QuietSocialMediaCard } from './SocialMediaCard.jsx'
import { QuietBinderPage } from './BinderPage.jsx'
import { QuietCertificate } from './Certificate.jsx'

export const QUIET_MINIMAL_TEMPLATES = {
  classic:   QuietRecipeCard,
  cost:      QuietCostBreakdown,
  care:      QuietCareCard,
  label:     QuietProductLabel,
  menu:      QuietMenuInsert,
  wholesale: QuietWholesalePriceList,
  delivery:  QuietDeliveryTag,
  social:    QuietSocialMediaCard,
  binder:    QuietBinderPage,
  cert:      QuietCertificate,
}
