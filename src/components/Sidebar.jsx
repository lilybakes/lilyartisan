import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { NavIcon } from '../lib/nav-icons.jsx'
import { useSettings } from '../lib/settings.jsx'
import { useAuth } from '../lib/auth.jsx'
import Logo from './Logo.jsx'

// ============================================================
// Sysadmin section icons
// ============================================================
function SysIcon({ name }) {
  const props = { width:18, height:18, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.7, strokeLinecap:'round', strokeLinejoin:'round' }
  switch (name) {
    case 'users':    return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    case 'billing':  return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
    case 'content':  return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    case 'auth':     return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    case 'gallery':  return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    case 'platform': return <svg {...props}><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><line x1="6" y1="7" x2="6.01" y2="7"/><line x1="6" y1="17" x2="6.01" y2="17"/></svg>
    case 'audit':    return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
    case 'orders':   return <svg {...props}><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>
    case 'palette':  return <svg {...props}><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
    default: return null
  }
}

// ============================================================
// Collapsible section — remembers open/closed in localStorage
// ============================================================
function NavGroup({ title, storageKey, defaultOpen = true, children }) {
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
      <button className="nav-group-header" onClick={toggle} type="button">
        <span>{title}</span>
        <svg className="nav-group-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className="nav-group-body">{children}</div>}
    </div>
  )
}

function SubHeader({ children }) {
  return <div className="nav-subheader">{children}</div>
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

  // Sub-label under the wordmark is the only editable text piece:
  //   sysadmin → 'SYSADMIN'
  //   user     → their business name (or 'MEMBER' as fallback)
  const subLabel = isSysadmin ? 'SYSADMIN' : (settings.business_name || 'Member')

  async function handleSignOut() {
    close()
    await signOut?.()
    navigate('/login', { replace: true })
  }

  const item = (to, label, icon, iconType = 'nav') => (
    <NavLink
      key={to}
      to={to}
      end={to === '/app'}
      onClick={close}
      className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
    >
      <span className={'chip' + (iconType === 'sys' ? ' chip-admin' : '')}>
        {iconType === 'sys' ? <SysIcon name={icon}/> : <NavIcon name={icon}/>}
      </span>
      {label}
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
        <NavGroup title="Main" storageKey="main">
          {item('/app',             'Dashboard',    'dash')}
          <SubHeader>Recipes & Data</SubHeader>
          {item('/app/ingredients', 'Ingredients',  'ingredients')}
          {item('/app/recipes',     'Recipes',      'recipes')}
          {item('/app/bom',         'Recipe BOM',   'bom')}
          <SubHeader>Financials</SubHeader>
          {item('/app/costing',     'Yield & Cost', 'costing')}
          {item('/app/pricing',     'Pricing',      'pricing')}
          <SubHeader>Operations</SubHeader>
          {item('/app/inventory',   'Inventory',    'inventory')}
        </NavGroup>

        {/* ============ YOU ============ */}
        <NavGroup title="You" storageKey="you">
          {item('/app/personalize', 'Personalize', 'palette', 'sys')}
          {item('/app/settings',    'Settings',    'settings')}
        </NavGroup>

        {/* ============ SYSADMIN ============ */}
        {isSysadmin && (
          <NavGroup title="Sysadmin" storageKey="sysadmin">
            <SubHeader>Business</SubHeader>
            {item('/app/sysadmin/orders',   'Orders',       'orders',   'sys')}
            {item('/app/sysadmin/users',    'Users',        'users',    'sys')}
            {item('/app/sysadmin/billing',  'Billing',      'billing',  'sys')}
            <SubHeader>Content & Design</SubHeader>
            {item('/app/sysadmin/content',  'Content',      'content',  'sys')}
            {item('/app/sysadmin/auth',     'Auth & Login', 'auth',     'sys')}
            {item('/app/sysadmin/gallery',  'Gallery',      'gallery',  'sys')}
            <SubHeader>Platform</SubHeader>
            {item('/app/sysadmin/platform', 'Platform',     'platform', 'sys')}
            {item('/app/sysadmin/audit',    'Audit Log',    'audit',    'sys')}
          </NavGroup>
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
