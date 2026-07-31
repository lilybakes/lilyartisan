/**
 * Vintage Letterpress variant — dedicated per-template components,
 * mirroring the Kraft/Crisp/BakeOnomics Clean pilot architecture.
 *
 * Importing this module also loads the shared letterpress CSS.
 */
import './styles.css'

export { LetterpressRecipeCard }        from './RecipeCard.jsx'
export { LetterpressCostBreakdown }     from './CostBreakdown.jsx'
export { LetterpressCareCard }          from './CareCard.jsx'
export { LetterpressProductLabel }      from './ProductLabel.jsx'
export { LetterpressMenuInsert }        from './MenuInsert.jsx'
export { LetterpressWholesalePriceList } from './WholesalePriceList.jsx'
export { LetterpressDeliveryTag }       from './DeliveryTag.jsx'
export { LetterpressSocialMediaCard }   from './SocialMediaCard.jsx'
export { LetterpressBinderPage }        from './BinderPage.jsx'
export { LetterpressCertificate }       from './Certificate.jsx'

// Map of template key → Letterpress-specific component.
// Consumed by templates/index.js to resolve the right component per style.
import { LetterpressRecipeCard } from './RecipeCard.jsx'
import { LetterpressCostBreakdown } from './CostBreakdown.jsx'
import { LetterpressCareCard } from './CareCard.jsx'
import { LetterpressProductLabel } from './ProductLabel.jsx'
import { LetterpressMenuInsert } from './MenuInsert.jsx'
import { LetterpressWholesalePriceList } from './WholesalePriceList.jsx'
import { LetterpressDeliveryTag } from './DeliveryTag.jsx'
import { LetterpressSocialMediaCard } from './SocialMediaCard.jsx'
import { LetterpressBinderPage } from './BinderPage.jsx'
import { LetterpressCertificate } from './Certificate.jsx'

export const LETTERPRESS_TEMPLATES = {
  classic:   LetterpressRecipeCard,
  cost:      LetterpressCostBreakdown,
  care:      LetterpressCareCard,
  label:     LetterpressProductLabel,
  menu:      LetterpressMenuInsert,
  wholesale: LetterpressWholesalePriceList,
  delivery:  LetterpressDeliveryTag,
  social:    LetterpressSocialMediaCard,
  binder:    LetterpressBinderPage,
  cert:      LetterpressCertificate,
}
