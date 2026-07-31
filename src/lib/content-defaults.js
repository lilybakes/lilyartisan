// Default content. Used by Landing.jsx as fallback when DB is empty,
// and by the sysadmin Content editor as the "reset to defaults" seed.

export const CONTENT_KEYS = [
  'landing.hero',
  'landing.features_head',
  'landing.features',
  'landing.pricing_head',
  'landing.pricing',
  'landing.faq_head',
  'landing.faq',
  'landing.cta',
  'coming_soon',
  'dashboard.greeting',
]

export const HERO_DEFAULT = {
  eyebrow: '🎂 Made for artisan bakers',
  title_line_1: 'Bake more.',
  title_line_2: 'Guess less.',
  tagline: 'Price with confidence. Bake with joy.',
  body: 'BakeOnomics is for artisan and boutique bakers who love the craft but hate the guesswork. Track every ingredient cost, understand your true margin per portion, and know exactly what to charge — without a spreadsheet in sight.',
  cta_primary: 'Start 14-day Free Trial',
  cta_secondary: 'Sign in',
  fineprint: 'No credit card required · Cancel anytime · Made in Malaysia 🇲🇾',
}

export const FEATURES_HEAD_DEFAULT = {
  eyebrow: 'FEATURES',
  title: "Everything you need. Nothing you don't.",
  subtitle: 'Purpose-built for how small bakers actually work — one hand on the mixer, one on the phone.',
}

export const FEATURES_DEFAULT = [
  { icon: 'cost',    tone: 'a', title: 'Real ingredient costs, always current.',      body: 'Change a butter price once, and every recipe using it updates instantly. No spreadsheet gymnastics.' },
  { icon: 'chart',   tone: 'b', title: 'Auto-suggested selling prices.',              body: 'Set your target food-cost %, and BakeOnomics calculates the price that hits your margin every time.' },
  { icon: 'measure', tone: 'c', title: 'Recipe BOMs with unit-smart conversions.',    body: 'Grams to cups, tablespoons to liters — density-aware where it matters. No more "close enough".' },
  { icon: 'mobile',  tone: 'd', title: 'Works on your phone.',                        body: 'Update stock at the market. Price a new cake at the pop-up. Full app on any screen. No app to install.' },
]

export const PRICING_HEAD_DEFAULT = {
  eyebrow: 'PRICING',
  title: 'One plan. All features. No surprises.',
  subtitle: 'No hidden tiers, no per-user fees. One price for the whole year.',
}

export const PRICING_DEFAULT = {
  plan_name: 'BakeOnomics Yearly',
  currency: 'RM',
  amount: '149',
  period: '/year',
  per_note: 'Works out to about RM12.42 a month.',
  features: [
    'Unlimited recipes and ingredients',
    'Automatic price recalculation',
    'Recipe BOMs with unit conversion',
    'Mobile-optimized on any device',
    'CSV export for backups',
    'Email support from the maker',
  ],
  cta: 'Start 14-day Free Trial',
  fineprint: 'No credit card · Pay after trial via DuitNow or bank transfer',
}

export const FAQ_HEAD_DEFAULT = {
  eyebrow: 'FAQ',
  title: 'Frequently asked',
}

export const FAQ_DEFAULT = [
  { q: 'Do I need a credit card to try it?',           a: 'No. The 14-day trial is completely free with just an email address. No card required.' },
  { q: 'How do I pay after the trial?',                a: 'DuitNow QR or Maybank bank transfer. Once we verify your payment, we send you a proper invoice and receipt to your email.' },
  { q: 'Can I use it on my phone?',                    a: 'Yes. BakeOnomics is fully mobile-optimized. There\'s nothing to install — just open your browser and sign in.' },
  { q: 'What happens to my data if I cancel?',         a: 'Your data is kept safe. You can renew anytime and pick up right where you left off — recipes, ingredients, costings, all intact.' },
  { q: 'Can I export my recipes?',                     a: 'Yes. CSV export is built in, so you can back up your recipes and ingredient master anytime.' },
  { q: 'Is my data private?',                          a: 'Yes. Every user\'s data is completely isolated at the database level. No other baker on the platform can see your recipes, costs, or pricing.' },
]

export const CTA_DEFAULT = {
  title: 'Stop guessing. Start pricing.',
  subtitle: 'Your best batch deserves an honest price.',
  cta: 'Start Free Trial →',
}

export const COMING_SOON_DEFAULT = []

/**
 * Dashboard "Welcome back" hero — the greeting + body text at the top of the
 * signed-in Dashboard. `{name}` in the title is substituted with the user's
 * owner_name from their settings. Emoji is safe to include.
 */
export const DASHBOARD_GREETING_DEFAULT = {
  title:    'Welcome back, {name} 👋',
  body:     'Your bakery costing dashboard. Change any ingredient price and it ripples through every recipe and suggested selling price automatically.',
  cta:      'Manage Recipes →',
}

export const CONTENT_DEFAULTS = {
  'landing.hero':          HERO_DEFAULT,
  'landing.features_head': FEATURES_HEAD_DEFAULT,
  'landing.features':      FEATURES_DEFAULT,
  'landing.pricing_head':  PRICING_HEAD_DEFAULT,
  'landing.pricing':       PRICING_DEFAULT,
  'landing.faq_head':      FAQ_HEAD_DEFAULT,
  'landing.faq':           FAQ_DEFAULT,
  'landing.cta':           CTA_DEFAULT,
  'coming_soon':           COMING_SOON_DEFAULT,
  'dashboard.greeting':    DASHBOARD_GREETING_DEFAULT,
}

// ---------- Feature icon presets (used by editor dropdown + Landing render) ----------
export const FEATURE_ICON_OPTIONS = [
  { value: 'cost',    label: '💰 Money / cost' },
  { value: 'chart',   label: '📊 Chart / analytics' },
  { value: 'measure', label: '📐 Measuring / precision' },
  { value: 'mobile',  label: '📱 Mobile / device' },
  { value: 'export',  label: '📤 Export / share' },
  { value: 'private', label: '🔒 Privacy / security' },
  { value: 'clock',   label: '⏱ Time / speed' },
  { value: 'sparkle', label: '✨ Magic / new' },
]

export const FEATURE_TONE_OPTIONS = [
  { value: 'a', label: 'Violet' },
  { value: 'b', label: 'Cyan' },
  { value: 'c', label: 'Orange' },
  { value: 'd', label: 'Green' },
]
