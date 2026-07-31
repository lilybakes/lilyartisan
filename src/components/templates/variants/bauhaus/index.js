/**
 * Bauhaus variant — dedicated per-template components. Mirrors the shape
 * of every other variant: 10 templates, a shared _parts.jsx, and a
 * self-contained styles.css. Importing this module also loads the CSS.
 *
 * The signature is solid primary color shape compositions (blue, yellow,
 * red, black) on warm cream paper, with Archivo Black super-heavy titles.
 */
import './styles.css'

export { BhRecipeCard }         from './RecipeCard.jsx'
export { BhCostBreakdown }      from './CostBreakdown.jsx'
export { BhCareCard }           from './CareCard.jsx'
export { BhProductLabel }       from './ProductLabel.jsx'
export { BhMenuInsert }         from './MenuInsert.jsx'
export { BhWholesalePriceList } from './WholesalePriceList.jsx'
export { BhDeliveryTag }        from './DeliveryTag.jsx'
export { BhSocialMediaCard }    from './SocialMediaCard.jsx'
export { BhBinderPage }         from './BinderPage.jsx'
export { BhCertificate }        from './Certificate.jsx'

import { BhRecipeCard } from './RecipeCard.jsx'
import { BhCostBreakdown } from './CostBreakdown.jsx'
import { BhCareCard } from './CareCard.jsx'
import { BhProductLabel } from './ProductLabel.jsx'
import { BhMenuInsert } from './MenuInsert.jsx'
import { BhWholesalePriceList } from './WholesalePriceList.jsx'
import { BhDeliveryTag } from './DeliveryTag.jsx'
import { BhSocialMediaCard } from './SocialMediaCard.jsx'
import { BhBinderPage } from './BinderPage.jsx'
import { BhCertificate } from './Certificate.jsx'

export const BAUHAUS_TEMPLATES = {
  classic:   BhRecipeCard,
  cost:      BhCostBreakdown,
  care:      BhCareCard,
  label:     BhProductLabel,
  menu:      BhMenuInsert,
  wholesale: BhWholesalePriceList,
  delivery:  BhDeliveryTag,
  social:    BhSocialMediaCard,
  binder:    BhBinderPage,
  cert:      BhCertificate,
}
