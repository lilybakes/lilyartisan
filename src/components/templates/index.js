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
    description: 'Multi-recipe compact menu insert with prices, grouped by category.',
    component: MenuInsert,
    ready: true,
    pageSize: 'A5',
    multi: true,
    preview: 'grid',
    gradient: 'linear-gradient(135deg, #FF7E9C 0%, #F5546E 100%)',
  },
  {
    key: 'wholesale',
    name: 'Wholesale Price Sheet',
    description: 'Multi-recipe wholesale sheet for B2B customers — retail, wholesale, batch pricing.',
    component: WholesalePriceList,
    ready: true,
    pageSize: 'A4',
    multi: true,
    preview: 'table',
    gradient: 'linear-gradient(135deg, #6BA5FF 0%, #4785FF 100%)',
  },
  {
    key: 'delivery',
    name: 'Delivery Tag',
    description: 'Small hang-tag for delivery orders with care info and thank-you.',
    component: DeliveryTag,
    ready: true,
    pageSize: 'A7',
    multi: false,
    preview: 'card-lines',
    gradient: 'linear-gradient(135deg, #D8A66F 0%, #B08555 100%)',
  },
  {
    key: 'social',
    name: 'Social Media Card',
    description: 'Square Instagram-ready card — screenshot to post; brand color background.',
    component: SocialMediaCard,
    ready: true,
    pageSize: '1:1',
    multi: false,
    preview: 'square',
    gradient: 'linear-gradient(135deg, #E17BEE 0%, #C25FDA 100%)',
  },
  {
    key: 'binder',
    name: 'Recipe Binder Page',
    description: 'Detailed A4 kitchen page with photo slot, full cost table, method, and notes.',
    component: RecipeBinderPage,
    ready: true,
    pageSize: 'A4',
    multi: false,
    preview: 'card-lines',
    gradient: 'linear-gradient(135deg, #8FA3BC 0%, #607089 100%)',
  },
  {
    key: 'cert',
    name: 'Certificate of Craft',
    description: 'Decorative landscape certificate for premium orders and gift packaging.',
    component: CertificateOfCraft,
    ready: true,
    pageSize: 'A4',
    multi: false,
    preview: 'circle',
    gradient: 'linear-gradient(135deg, #E8BB57 0%, #D0A03A 100%)',
  },
]

export function getTemplate(key) {
  return TEMPLATES.find(t => t.key === key)
}
