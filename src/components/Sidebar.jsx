import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSettings } from '../lib/settings.jsx'
import { useAuth } from '../lib/auth.jsx'
import Logo from './Logo.jsx'
import { NavGlyph } from './NavGlyph.jsx'

// ============================================================
// Primary group — collapsible, has a chevron. YOU / SYSADMIN / MAIN.
// ============================================================
function PrimaryGroup({ title, storageKey, defaultOpen = true, children }) {
  const [open, setOpen] = useState(() => {
    try {
      const stored = localStorage.getItem('nav-group:' + storageKey)
      return stored === null ? defaultOpen : stored === '1'
    } catch { return defaultOpen }
  })
  function toggle() {
    const next = !open
    setOpen(next)
    try { localStorage.setItem('nav-group:' + storageKey, next ? '1' : '0') } catch {}
  }
  return (
    <div className={'nav-group' + (open ? ' open' : ' closed')}>
      <button className="nav-group-header nav-group-header-primary" onClick={toggle} type="button">
        <span>{title}</span>
        <svg className="nav-group-caret" width="14" height="14" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className="nav-group-body">{children}</div>}
    </div>
  )
}

// ============================================================
// Sub-group header — lighter, no chevron. BUSINESS / CONTENT & DESIGN / etc.
// ============================================================
function SubGroup({ children }) {
  return <div className="nav-group-header nav-group-header-sub">{children}</div>
}

// ============================================================
export default function Sidebar() {
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const { user, isSysadmin, signOut } = useAuth() || {}
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onOpen  = () => setOpen(true)
    const onClose = () => setOpen(false)
    window.addEventListener('mobile-nav-open',  onOpen)
    window.addEventListener('mobile-nav-close', onClose)
    return () => {
      window.removeEventListener('mobile-nav-open',  onOpen)
      window.removeEventListener('mobile-nav-close', onClose)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  const close = () => setOpen(false)
  const subLabel = isSysadmin ? 'SYSADMIN' : (settings.business_name || 'Member')

  async function handleSignOut() {
    close()
    await signOut?.()
    navigate('/login', { replace: true })
  }

  const item = (to, label, icon) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/app'}
      onClick={close}
      className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
      title={label}
    >
      <span className="chip">
        <NavGlyph name={icon}/>
      </span>
      <span className="nav-label">{label}</span>
    </NavLink>
  )

  return (
    <>
      <div
        className={'nav-backdrop' + (open ? ' visible' : '')}
        onClick={close}
        aria-hidden="true"
      />
      <aside className={open ? 'open' : ''}>
        <Link to="/app" className="brand" style={{textDecoration:'none', color:'inherit'}} onClick={close}>
          <Logo size={40} showWordmark subLabel={subLabel}/>
        </Link>

        {/* ============ MAIN ============ */}
        <PrimaryGroup title="Main" storageKey="main">
          {item('/app',             'Dashboard',    'dashboard')}
          <SubGroup>Recipes &amp; Data</SubGroup>
          {item('/app/ingredients', 'Ingredients',  'ingredients')}
          {item('/app/recipes',     'Recipes',      'recipes')}
          {item('/app/bom',         'Recipe BOM',   'bom')}
          {item('/app/templates',   'Templates',    'templates')}
          <SubGroup>Financials</SubGroup>
          {item('/app/costing',     'Yield & Cost', 'costing')}
          {item('/app/pricing',     'Pricing',      'pricing')}
          <SubGroup>Operations</SubGroup>
          {item('/app/inventory',   'Inventory',    'inventory')}
        </PrimaryGroup>

        {/* ============ YOU ============ */}
        <PrimaryGroup title="You" storageKey="you">
          {item('/app/personalize', 'Personalize', 'personalize')}
          {item('/app/settings',    'Settings',    'settings')}
        </PrimaryGroup>

        {/* ============ SYSADMIN ============ */}
        {isSysadmin && (
          <PrimaryGroup title="Sysadmin" storageKey="sysadmin">
            <SubGroup>Business</SubGroup>
            {item('/app/sysadmin/orders',   'Orders',       'orders')}
            {item('/app/sysadmin/users',    'Users',        'users')}
            {item('/app/sysadmin/billing',  'Billing',      'billing')}
            <SubGroup>Content &amp; Design</SubGroup>
            {item('/app/sysadmin/content',  'Content',      'content')}
            {item('/app/sysadmin/auth',     'Auth & Login', 'auth')}
            {item('/app/sysadmin/gallery',  'Gallery',      'gallery')}
            <SubGroup>Platform</SubGroup>
            {item('/app/sysadmin/platform', 'Platform',     'platform')}
            {item('/app/sysadmin/audit',    'Audit Log',    'audit')}
          </PrimaryGroup>
        )}

        {/* Account block — always pinned to the bottom */}
        <div className="sidebar-account">
          <div className="account-info">
            <div className="account-email" title={user?.email}>{user?.email || '—'}</div>
            <div className="account-role">
              {isSysadmin ? 'System administrator' : 'Subscriber'}
            </div>
          </div>
          <button className="signout-btn" onClick={handleSignOut}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
