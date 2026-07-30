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

export const TEMPLATES = [
  {
    key: 'classic',
    name: 'Classic Recipe Card',
    description: 'Full recipe with ingredients and yield — for your kitchen or to share with staff.',
    icon: '📖',
    component: ClassicRecipeCard,
    ready: true,
    multi: false,
    pageSize: 'A5',
  },
  {
    key: 'cost',
    name: 'Cost Breakdown Sheet',
    description: 'Internal cost analysis with ingredient prices, cost per portion, and suggested selling price.',
    icon: '💰',
    component: CostBreakdown,
    ready: true,
    multi: false,
    pageSize: 'A4',
  },
  {
    key: 'care',
    name: 'Care & Storage Card',
    description: 'Customer-facing card with storage instructions and best-by guidance.',
    icon: '🏷️',
    component: CareCard,
    ready: true,
    multi: false,
    pageSize: 'A6',
  },
  {
    key: 'label',
    name: 'Product Label',
    description: 'Compact label with allergens, ingredients list, and best-by date. For packaging.',
    icon: '📇',
    component: ProductLabel,
    ready: true,
    multi: false,
    pageSize: 'A7',
  },
  {
    key: 'menu',
    name: 'Menu Insert',
    description: 'Multi-recipe compact menu insert with prices, grouped by category.',
    icon: '📋',
    component: MenuInsert,
    ready: true,
    multi: true,
    pageSize: 'A5',
  },
  {
    key: 'wholesale',
    name: 'Wholesale Price List',
    description: 'Multi-recipe wholesale sheet for B2B customers — retail, wholesale, batch pricing.',
    icon: '🧾',
    component: WholesalePriceList,
    ready: true,
    multi: true,
    pageSize: 'A4',
  },
  {
    key: 'delivery',
    name: 'Delivery Tag',
    description: 'Small hang-tag for delivery orders with care info and thank-you.',
    icon: '📦',
    component: DeliveryTag,
    ready: true,
    multi: false,
    pageSize: 'A7',
  },
  {
    key: 'social',
    name: 'Social Media Card',
    description: 'Square Instagram-ready card. Screenshot to post; brand color background.',
    icon: '📱',
    component: SocialMediaCard,
    ready: true,
    multi: false,
    pageSize: '1:1',
  },
  {
    key: 'binder',
    name: 'Recipe Binder Page',
    description: 'Detailed A4 kitchen page with photo slot, full cost table, method, and notes.',
    icon: '📓',
    component: RecipeBinderPage,
    ready: true,
    multi: false,
    pageSize: 'A4',
  },
  {
    key: 'cert',
    name: 'Certificate of Craft',
    description: 'Decorative landscape certificate for premium orders and gift packaging.',
    icon: '🎖️',
    component: CertificateOfCraft,
    ready: true,
    multi: false,
    pageSize: 'A4 ↔',
  },
]

export function getTemplate(key) {
  return TEMPLATES.find(t => t.key === key)
}
