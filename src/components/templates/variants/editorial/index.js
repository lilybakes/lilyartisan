/**
 * Editorial Magazine variant — dedicated per-template components,
 * mirroring the Kraft/Crisp/BakeOnomics Clean/Letterpress architecture.
 *
 * Importing this module also loads the shared editorial CSS.
 */
import './styles.css'

export { EditorialRecipeCard }        from './RecipeCard.jsx'
export { EditorialCostBreakdown }     from './CostBreakdown.jsx'
export { EditorialCareCard }          from './CareCard.jsx'
export { EditorialProductLabel }      from './ProductLabel.jsx'
export { EditorialMenuInsert }        from './MenuInsert.jsx'
export { EditorialWholesalePriceList } from './WholesalePriceList.jsx'
export { EditorialDeliveryTag }       from './DeliveryTag.jsx'
export { EditorialSocialMediaCard }   from './SocialMediaCard.jsx'
export { EditorialBinderPage }        from './BinderPage.jsx'
export { EditorialCertificate }       from './Certificate.jsx'

import { EditorialRecipeCard } from './RecipeCard.jsx'
import { EditorialCostBreakdown } from './CostBreakdown.jsx'
import { EditorialCareCard } from './CareCard.jsx'
import { EditorialProductLabel } from './ProductLabel.jsx'
import { EditorialMenuInsert } from './MenuInsert.jsx'
import { EditorialWholesalePriceList } from './WholesalePriceList.jsx'
import { EditorialDeliveryTag } from './DeliveryTag.jsx'
import { EditorialSocialMediaCard } from './SocialMediaCard.jsx'
import { EditorialBinderPage } from './BinderPage.jsx'
import { EditorialCertificate } from './Certificate.jsx'

export const EDITORIAL_TEMPLATES = {
  classic:   EditorialRecipeCard,
  cost:      EditorialCostBreakdown,
  care:      EditorialCareCard,
  label:     EditorialProductLabel,
  menu:      EditorialMenuInsert,
  wholesale: EditorialWholesalePriceList,
  delivery:  EditorialDeliveryTag,
  social:    EditorialSocialMediaCard,
  binder:    EditorialBinderPage,
  cert:      EditorialCertificate,
}
