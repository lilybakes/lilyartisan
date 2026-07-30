import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { supabase } from '../lib/supabase'
import { FeatureIcon } from '../components/FeatureIcon.jsx'
import {
  CONTENT_DEFAULTS,
  HERO_DEFAULT, FEATURES_HEAD_DEFAULT, FEATURES_DEFAULT,
  PRICING_HEAD_DEFAULT, PRICING_DEFAULT, FAQ_HEAD_DEFAULT, FAQ_DEFAULT,
  CTA_DEFAULT,
} from '../lib/content-defaults'

export default function Landing() {
  const { session } = useAuth() || {}
  const [content, setContent] = useState(CONTENT_DEFAULTS)

  useEffect(() => {
    supabase.from('content_blocks').select('*').then(({ data }) => {
      if (!data) return
      const map = { ...CONTENT_DEFAULTS }
      for (const row of data) if (row?.key && row?.content !== null) map[row.key] = row.content
      setContent(map)
    })
  }, [])

  const hero          = { ...HERO_DEFAULT,          ...(content['landing.hero'] || {}) }
  const featuresHead  = { ...FEATURES_HEAD_DEFAULT, ...(content['landing.features_head'] || {}) }
  const features      = Array.isArray(content['landing.features']) && content['landing.features'].length > 0 ? content['landing.features'] : FEATURES_DEFAULT
  const pricingHead   = { ...PRICING_HEAD_DEFAULT,  ...(content['landing.pricing_head'] || {}) }
  const pricing       = { ...PRICING_DEFAULT,       ...(content['landing.pricing'] || {}) }
  const faqHead       = { ...FAQ_HEAD_DEFAULT,      ...(content['landing.faq_head'] || {}) }
  const faq           = Array.isArray(content['landing.faq']) && content['landing.faq'].length > 0 ? content['landing.faq'] : FAQ_DEFAULT
  const cta           = { ...CTA_DEFAULT,           ...(content['landing.cta'] || {}) }

  const pricingFeatures = Array.isArray(pricing.features) && pricing.features.length > 0 ? pricing.features : PRICING_DEFAULT.features

  return (
    <div className="landing">
      {/* Sticky header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link to="/" className="landing-brand" style={{textDecoration:'none'}}>
            <div className="brand-stamp"><img src="/assets/lily-mark-white.png" alt=""/></div>
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
            {hero.eyebrow && <div className="landing-eyebrow">{hero.eyebrow}</div>}
            <h1 className="landing-hero-title">
              {hero.title_line_1}<br/>
              <span className="landing-hero-title-accent">{hero.title_line_2}</span>
            </h1>
            {hero.tagline && <p className="landing-hero-tagline">{hero.tagline}</p>}
            <p className="landing-hero-body">{hero.body}</p>
            <div className="landing-hero-ctas">
              <Link to="/signup" className="landing-btn landing-btn-primary landing-btn-lg">{hero.cta_primary}</Link>
              <Link to="/login" className="landing-btn-ghost landing-btn-lg">{hero.cta_secondary}</Link>
            </div>
            {hero.fineprint && <p className="landing-hero-fineprint">{hero.fineprint}</p>}
          </div>

          <div className="landing-hero-visual">
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
                  <div className="preview-stat preview-stat-1"><div className="preview-stat-lbl">Recipes</div><div className="preview-stat-val">12</div></div>
                  <div className="preview-stat preview-stat-2"><div className="preview-stat-lbl">Avg Cost</div><div className="preview-stat-val">RM8.40</div></div>
                  <div className="preview-stat preview-stat-3"><div className="preview-stat-lbl">Margin</div><div className="preview-stat-val">62%</div></div>
                </div>
                <div className="preview-panel">
                  <div className="preview-panel-title">Cost Breakdown</div>
                  <div className="preview-bar-row"><div className="preview-bar-name">Butter</div><div className="preview-bar-track"><div className="preview-bar-fill" style={{width:'82%', background:'#7367f0'}}/></div></div>
                  <div className="preview-bar-row"><div className="preview-bar-name">Flour</div><div className="preview-bar-track"><div className="preview-bar-fill" style={{width:'64%', background:'#00cfe8'}}/></div></div>
                  <div className="preview-bar-row"><div className="preview-bar-name">Sugar</div><div className="preview-bar-track"><div className="preview-bar-fill" style={{width:'46%', background:'#ff9f43'}}/></div></div>
                  <div className="preview-bar-row"><div className="preview-bar-name">Eggs</div><div className="preview-bar-track"><div className="preview-bar-fill" style={{width:'32%', background:'#28c76f'}}/></div></div>
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
            {featuresHead.eyebrow && <div className="landing-eyebrow-mono">{featuresHead.eyebrow}</div>}
            <h2 className="landing-section-title">{featuresHead.title}</h2>
            {featuresHead.subtitle && <p className="landing-section-sub">{featuresHead.subtitle}</p>}
          </div>
          <div className="feature-grid">
            {features.map((f, i) => (
              <div className={`feature-card feature-card-${f.tone}`} key={i}>
                <div className={`feature-icn feature-icn-${f.tone}`}><FeatureIcon name={f.icon}/></div>
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
            {pricingHead.eyebrow && <div className="landing-eyebrow-mono">{pricingHead.eyebrow}</div>}
            <h2 className="landing-section-title">{pricingHead.title}</h2>
            {pricingHead.subtitle && <p className="landing-section-sub">{pricingHead.subtitle}</p>}
          </div>
          <div className="pricing-card">
            <div className="pricing-plan-name">{pricing.plan_name}</div>
            <div className="pricing-price">
              <span className="pricing-currency">{pricing.currency}</span>
              <span className="pricing-amount">{pricing.amount}</span>
              <span className="pricing-period">{pricing.period}</span>
            </div>
            {pricing.per_note && <div className="pricing-per">{pricing.per_note}</div>}
            <ul className="pricing-features">
              {pricingFeatures.map((feat, i) => <li key={i}>{feat}</li>)}
            </ul>
            <Link to="/signup" className="landing-btn landing-btn-primary landing-btn-lg landing-btn-full">
              {pricing.cta}
            </Link>
            {pricing.fineprint && <p className="pricing-fineprint">{pricing.fineprint}</p>}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section" id="faq">
        <div className="landing-container landing-container-narrow">
          <div className="landing-section-head">
            {faqHead.eyebrow && <div className="landing-eyebrow-mono">{faqHead.eyebrow}</div>}
            <h2 className="landing-section-title">{faqHead.title}</h2>
          </div>
          <div className="faq-list">
            {faq.map((item, i) => (
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
          <h2 className="landing-cta-title">{cta.title}</h2>
          <p className="landing-cta-sub">{cta.subtitle}</p>
          <Link to="/signup" className="landing-btn landing-btn-primary landing-btn-lg">{cta.cta}</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <div>
            <div className="landing-footer-brand">
              <span className="part1">Baker</span><span className="part2">Nomics</span>
            </div>
            <div className="landing-footer-tag">Made with care in Malaysia 🇲🇾</div>
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
