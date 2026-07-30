import { ClassicRecipeCard } from './ClassicRecipeCard.jsx'
import { CostBreakdown }    from './CostBreakdown.jsx'
import { CareCard }         from './CareCard.jsx'
import { ProductLabel }     from './ProductLabel.jsx'

export const TEMPLATES = [
  {
    key: 'classic',
    name: 'Classic Recipe Card',
    description: 'Full recipe with ingredients and yield — for your kitchen or to share with staff.',
    icon: '📖',
    component: ClassicRecipeCard,
    ready: true,
    pageSize: 'A5',
  },
  {
    key: 'cost',
    name: 'Cost Breakdown Sheet',
    description: 'Internal cost analysis with ingredient prices, cost per portion, and suggested selling price.',
    icon: '💰',
    component: CostBreakdown,
    ready: true,
    pageSize: 'A4',
  },
  {
    key: 'care',
    name: 'Care & Storage Card',
    description: 'Customer-facing card with storage instructions and best-by guidance.',
    icon: '🏷️',
    component: CareCard,
    ready: true,
    pageSize: 'A6',
  },
  {
    key: 'label',
    name: 'Product Label',
    description: 'Compact label with allergens, ingredients list, and best-by date. For packaging.',
    icon: '🏷️',
    component: ProductLabel,
    ready: true,
    pageSize: 'A7',
  },
  {
    key: 'menu',
    name: 'Menu Insert',
    description: 'Multi-recipe compact menu insert with prices.',
    icon: '📋',
    component: null,
    ready: false,
  },
  {
    key: 'wholesale',
    name: 'Wholesale Price List',
    description: 'Multi-recipe wholesale sheet for B2B customers.',
    icon: '🧾',
    component: null,
    ready: false,
  },
  {
    key: 'delivery',
    name: 'Delivery Tag',
    description: 'Small tag for delivery orders with customer name and care info.',
    icon: '📦',
    component: null,
    ready: false,
  },
  {
    key: 'social',
    name: 'Social Media Card',
    description: 'Instagram-sized square recipe teaser for posts.',
    icon: '📱',
    component: null,
    ready: false,
  },
  {
    key: 'binder',
    name: 'Recipe Binder Page',
    description: 'Detailed A4 page with photo slot for your recipe binder.',
    icon: '📓',
    component: null,
    ready: false,
  },
  {
    key: 'cert',
    name: 'Certificate of Craft',
    description: 'Decorative "made with care" certificate for premium orders.',
    icon: '🎖️',
    component: null,
    ready: false,
  },
]

export function getTemplate(key) {
  return TEMPLATES.find(t => t.key === key)
}
