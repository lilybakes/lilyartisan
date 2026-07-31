/**
 * Patisserie variant — dedicated per-template components, mirroring the
 * Kraft/Crisp/BKO/Letterpress/Editorial/Quiet-Minimal/Verdant/Ember/
 * Flour-Ink architecture.
 *
 * Importing this module also loads the shared Patisserie CSS.
 */
import './styles.css'

export { PaRecipeCard }         from './RecipeCard.jsx'
export { PaCostBreakdown }      from './CostBreakdown.jsx'
export { PaCareCard }           from './CareCard.jsx'
export { PaProductLabel }       from './ProductLabel.jsx'
export { PaMenuInsert }         from './MenuInsert.jsx'
export { PaWholesalePriceList } from './WholesalePriceList.jsx'
export { PaDeliveryTag }        from './DeliveryTag.jsx'
export { PaSocialMediaCard }    from './SocialMediaCard.jsx'
export { PaBinderPage }         from './BinderPage.jsx'
export { PaCertificate }        from './Certificate.jsx'

import { PaRecipeCard } from './RecipeCard.jsx'
import { PaCostBreakdown } from './CostBreakdown.jsx'
import { PaCareCard } from './CareCard.jsx'
import { PaProductLabel } from './ProductLabel.jsx'
import { PaMenuInsert } from './MenuInsert.jsx'
import { PaWholesalePriceList } from './WholesalePriceList.jsx'
import { PaDeliveryTag } from './DeliveryTag.jsx'
import { PaSocialMediaCard } from './SocialMediaCard.jsx'
import { PaBinderPage } from './BinderPage.jsx'
import { PaCertificate } from './Certificate.jsx'

export const PATISSERIE_TEMPLATES = {
  classic:   PaRecipeCard,
  cost:      PaCostBreakdown,
  care:      PaCareCard,
  label:     PaProductLabel,
  menu:      PaMenuInsert,
  wholesale: PaWholesalePriceList,
  delivery:  PaDeliveryTag,
  social:    PaSocialMediaCard,
  binder:    PaBinderPage,
  cert:      PaCertificate,
}
