import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
        <path d="M12 6v2M12 16v2"/>
      </svg>
    ),
    title: 'Real ingredient costs, always current.',
    body: 'Change a butter price once, and every recipe using it updates instantly. No spreadsheet gymnastics.',
    tone: 'a',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10"/>
        <path d="M18 20V4"/>
        <path d="M6 20v-6"/>
      </svg>
    ),
    title: 'Auto-suggested selling prices.',
    body: 'Set your target food-cost %, and BakerNomics calculates the price that hits your margin every time.',
    tone: 'b',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'Recipe BOMs with unit-smart conversions.',
    body: 'Grams to cups, tablespoons to liters — density-aware where it matters. No more "close enough".',
    tone: 'c',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="3"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: 'Works on your phone.',
    body: 'Update stock at the market. Price a new cake at the pop-up. Full app on any screen. No app to install.',
    tone: 'd',
  },
]

const FAQ = [
  {
    q: 'Do I need a credit card to try it?',
    a: 'No. The 14-day trial is completely free with just an email address. No card required.',
  },
  {
    q: 'How do I pay after the trial?',
    a: 'DuitNow QR or Maybank bank transfer. Once we verify your payment, we send you a proper invoice and receipt to your email.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Yes. BakerNomics is fully mobile-optimized. There\'s nothing to install — just open your browser and sign in.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your data is kept safe. You can renew anytime and pick up right where you left off — recipes, ingredients, costings, all intact.',
  },
  {
    q: 'Can I export my recipes?',
    a: 'Yes. CSV export is built in, so you can back up your recipes and ingredient master anytime.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Every user\'s data is completely isolated at the database level. No other baker on the platform can see your recipes, costs, or pricing.',
  },
]

export default function Landing() {
  const { session } = useAuth() || {}

  return (
    <div className="landing">
      {/* Sticky header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link to="/" className="landing-brand" style={{textDecoration:'none'}}>
            <div className="brand-stamp">
              <img src="/assets/lily-mark-white.png" alt=""/>
            </div>
            <div className="brand-text">
              <div className="brand-wordmark">
                <span className="part1">Baker</span><span className="part2">Nomics</span>
              </div>
            </div>
          </Link>
          <nav className="landing-nav">
            <a href="#features" className="landing-navlink">Features</a>
            <a href="#pricing"  className="landing-navlink">Pricing</a>
            <a href="#faq"      className="landing-navlink">FAQ</a>
            {session ? (
              <Link to="/app" className="landing-btn landing-btn-primary">Open App →</Link>
            ) : (
              <>
                <Link to="/login"  className="landing-navlink landing-navlink-strong">Log in</Link>
                <Link to="/signup" className="landing-btn landing-btn-primary">Start Free Trial</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-blob landing-hero-blob-1"/>
        <div className="landing-hero-blob landing-hero-blob-2"/>
        <div className="landing-container landing-hero-inner">
          <div className="landing-hero-copy">
            <div className="landing-eyebrow">
              <span>🎂</span> Made for artisan bakers
            </div>
            <h1 className="landing-hero-title">
              Bake more.<br/>
              <span className="landing-hero-title-accent">Guess less.</span>
            </h1>
            <p className="landing-hero-tagline">
              Price with confidence. Bake with joy.
            </p>
            <p className="landing-hero-body">
              BakerNomics is for artisan and boutique bakers who love the craft but hate the guesswork.
              Track every ingredient cost, understand your true margin per portion, and know exactly what to charge — without a spreadsheet in sight.
            </p>
            <div className="landing-hero-ctas">
              <Link to="/signup" className="landing-btn landing-btn-primary landing-btn-lg">
                Start 14-day Free Trial
              </Link>
              <Link to="/login" className="landing-btn-ghost landing-btn-lg">
                Sign in
              </Link>
            </div>
            <p className="landing-hero-fineprint">
              No credit card required · Cancel anytime · Made in Malaysia 🇲🇾
            </p>
          </div>

          <div className="landing-hero-visual">
            {/* Stylized dashboard preview mockup — real screenshots come later */}
            <div className="preview-window">
              <div className="preview-window-bar">
                <span className="preview-dot preview-dot-r"/>
                <span className="preview-dot preview-dot-y"/>
                <span className="preview-dot preview-dot-g"/>
              </div>
              <div className="preview-window-inner">
                <div className="preview-hero">
                  <div className="preview-hero-title">Welcome back 👋</div>
                  <div className="preview-hero-sub">Your bakery costing dashboard</div>
                </div>
                <div className="preview-stats">
                  <div className="preview-stat preview-stat-1">
                    <div className="preview-stat-lbl">Recipes</div>
                    <div className="preview-stat-val">12</div>
                  </div>
                  <div className="preview-stat preview-stat-2">
                    <div className="preview-stat-lbl">Avg Cost</div>
                    <div className="preview-stat-val">RM8.40</div>
                  </div>
                  <div className="preview-stat preview-stat-3">
                    <div className="preview-stat-lbl">Margin</div>
                    <div className="preview-stat-val">62%</div>
                  </div>
                </div>
                <div className="preview-panel">
                  <div className="preview-panel-title">Cost Breakdown</div>
                  <div className="preview-bar-row">
                    <div className="preview-bar-name">Butter</div>
                    <div className="preview-bar-track"><div className="preview-bar-fill" style={{width:'82%', background:'#7367f0'}}/></div>
                  </div>
                  <div className="preview-bar-row">
                    <div className="preview-bar-name">Flour</div>
                    <div className="preview-bar-track"><div className="preview-bar-fill" style={{width:'64%', background:'#00cfe8'}}/></div>
                  </div>
                  <div className="preview-bar-row">
                    <div className="preview-bar-name">Sugar</div>
                    <div className="preview-bar-track"><div className="preview-bar-fill" style={{width:'46%', background:'#ff9f43'}}/></div>
                  </div>
                  <div className="preview-bar-row">
                    <div className="preview-bar-name">Eggs</div>
                    <div className="preview-bar-track"><div className="preview-bar-fill" style={{width:'32%', background:'#28c76f'}}/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section" id="features">
        <div className="landing-container">
          <div className="landing-section-head">
            <div className="landing-eyebrow-mono">FEATURES</div>
            <h2 className="landing-section-title">Everything you need. Nothing you don't.</h2>
            <p className="landing-section-sub">
              Purpose-built for how small bakers actually work — one hand on the mixer, one on the phone.
            </p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <div className={`feature-card feature-card-${f.tone}`} key={i}>
                <div className={`feature-icn feature-icn-${f.tone}`}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="landing-section landing-section-alt" id="pricing">
        <div className="landing-container">
          <div className="landing-section-head">
            <div className="landing-eyebrow-mono">PRICING</div>
            <h2 className="landing-section-title">One plan. All features. No surprises.</h2>
            <p className="landing-section-sub">
              No hidden tiers, no per-user fees. One price for the whole year.
            </p>
          </div>
          <div className="pricing-card">
            <div className="pricing-plan-name">BakerNomics Yearly</div>
            <div className="pricing-price">
              <span className="pricing-currency">RM</span>
              <span className="pricing-amount">149</span>
              <span className="pricing-period">/year</span>
            </div>
            <div className="pricing-per">Works out to about RM12.42 a month.</div>
            <ul className="pricing-features">
              <li>Unlimited recipes and ingredients</li>
              <li>Automatic price recalculation</li>
              <li>Recipe BOMs with unit conversion</li>
              <li>Mobile-optimized on any device</li>
              <li>CSV export for backups</li>
              <li>Email support from the maker</li>
            </ul>
            <Link to="/signup" className="landing-btn landing-btn-primary landing-btn-lg landing-btn-full">
              Start 14-day Free Trial
            </Link>
            <p className="pricing-fineprint">
              No credit card · Pay after trial via DuitNow or bank transfer
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section" id="faq">
        <div className="landing-container landing-container-narrow">
          <div className="landing-section-head">
            <div className="landing-eyebrow-mono">FAQ</div>
            <h2 className="landing-section-title">Frequently asked</h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <details className="faq-item" key={i}>
                <summary className="faq-question">
                  {item.q}
                  <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </summary>
                <p className="faq-answer">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-cta">
        <div className="landing-container">
          <h2 className="landing-cta-title">Stop guessing. Start pricing.</h2>
          <p className="landing-cta-sub">Your best batch deserves an honest price.</p>
          <Link to="/signup" className="landing-btn landing-btn-primary landing-btn-lg">
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <div>
            <div className="landing-footer-brand">
              <span className="part1">Baker</span><span className="part2">Nomics</span>
            </div>
            <div className="landing-footer-tag">
              Made with care in Malaysia 🇲🇾
            </div>
          </div>
          <div className="landing-footer-info">
            <div style={{fontWeight:600, color:'var(--ink)'}}>Swim Revelation Trading</div>
            <div>(JR0164533-V)</div>
            <div>18 Lingkaran Meru Valley 2, Meru Valley Resort</div>
            <div>30020 Ipoh, Perak</div>
          </div>
          <div className="landing-footer-links">
            <Link to="/login">Log in</Link>
            <Link to="/signup">Start Free Trial</Link>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
