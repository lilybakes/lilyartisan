import { ClassicRecipeCard }  from './ClassicRecipeCard.jsx'
import { CostBreakdown }      from './CostBreakdown.jsx'
import { CareCard }           from './CareCard.jsx'
import { ProductLabel }       from './ProductLabel.jsx'
import { MenuInsert }         from './MenuInsert.jsx'
import { WholesalePriceList } from './WholesalePriceList.jsx'
import { DeliveryTag }        from './DeliveryTag.jsx'
import { SocialMediaCard }    from './SocialMediaCard.jsx'
import { RecipeBinderPage }   from './RecipeBinderPage.jsx'
import { CertificateOfCraft } from './CertificateOfCraft.jsx'

/**
 * Template registry.
 *
 * To un-hide any of the 6 "in the works" templates, flip `ready: false` to
 * `ready: true` — the component files are already in this folder and wired up.
 */
export const TEMPLATES = [
  {
    key: 'classic',
    name: 'Classic Recipe Card',
    description: 'Full recipe with ingredients and yield — for your kitchen or to share with staff.',
    component: ClassicRecipeCard,
    ready: true,
    pageSize: 'A5',
    multi: false,
    preview: 'card-lines',
    gradient: 'linear-gradient(135deg, #7B68EE 0%, #6C5CE7 100%)',
  },
  {
    key: 'cost',
    name: 'Cost Breakdown Sheet',
    description: 'Internal cost analysis with ingredient prices, cost per portion, and suggested selling price.',
    component: CostBreakdown,
    ready: true,
    pageSize: 'A4',
    multi: false,
    preview: 'card-bars',
    gradient: 'linear-gradient(135deg, #FDB259 0%, #F5934C 100%)',
  },
  {
    key: 'care',
    name: 'Care & Storage Card',
    description: 'Customer-facing card with storage instructions and best-by guidance.',
    component: CareCard,
    ready: true,
    pageSize: 'A6',
    multi: false,
    preview: 'card-dots',
    gradient: 'linear-gradient(135deg, #4EDDE0 0%, #22BEC4 100%)',
  },
  {
    key: 'label',
    name: 'Product Label',
    description: 'Compact label with allergens, ingredients list, and best-by date. For packaging.',
    component: ProductLabel,
    ready: true,
    pageSize: 'A7',
    multi: false,
    preview: 'card-tag',
    gradient: 'linear-gradient(135deg, #5FD98F 0%, #34C77B 100%)',
  },
  {
    key: 'menu',
    name: 'Menu Insert',
    description: 'Multi-recipe compact menu insert with prices.',
    component: MenuInsert,
    ready: false,
    pageSize: 'A5',
    multi: true,
    preview: 'grid',
  },
  {
    key: 'wholesale',
    name: 'Wholesale Price Sheet',
    description: 'Multi-recipe wholesale sheet for B2B customers.',
    component: WholesalePriceList,
    ready: false,
    pageSize: 'A4',
    multi: true,
    preview: 'table',
  },
  {
    key: 'delivery',
    name: 'Delivery Tag',
    description: 'Small tag for delivery orders with customer name and care info.',
    component: DeliveryTag,
    ready: false,
    pageSize: 'A7',
    multi: false,
    preview: 'card-lines',
  },
  {
    key: 'social',
    name: 'Social Media Card',
    description: 'Instagram-sized square recipe teaser for posts.',
    component: SocialMediaCard,
    ready: false,
    pageSize: '1:1',
    multi: false,
    preview: 'square',
  },
  {
    key: 'binder',
    name: 'Recipe Binder Page',
    description: 'Detailed A4 page with photo slot for your recipe binder.',
    component: RecipeBinderPage,
    ready: false,
    pageSize: 'A4',
    multi: false,
    preview: 'card-lines',
  },
  {
    key: 'cert',
    name: 'Certificate of Care',
    description: 'Decorative "made with care" certificate for premium orders.',
    component: CertificateOfCraft,
    ready: false,
    pageSize: 'A4',
    multi: false,
    preview: 'circle',
  },
]

export function getTemplate(key) {
  return TEMPLATES.find(t => t.key === key)
}
