import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { NavIcon } from '../lib/nav-icons.jsx'
import { useSettings } from '../lib/settings.jsx'
import { useAuth } from '../lib/auth.jsx'

const NAV = [
  { to:'/app',             label:'Dashboard',    icon:'dash', end:true },
  { to:'/app/ingredients', label:'Ingredients',  icon:'ingredients' },
  { to:'/app/recipes',     label:'Recipes',      icon:'recipes' },
  { to:'/app/bom',         label:'Recipe BOM',   icon:'bom' },
  { to:'/app/costing',     label:'Yield & Cost', icon:'costing' },
  { to:'/app/pricing',     label:'Pricing',      icon:'pricing' },
  { to:'/app/inventory',   label:'Inventory',    icon:'inventory' },
]

// Small inline icon set for sysadmin nav (avoids extending nav-icons.jsx)
function SysIcon({ name }) {
  const props = { width:18, height:18, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.7, strokeLinecap:'round', strokeLinejoin:'round' }
  switch (name) {
    case 'users':    return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    case 'billing':  return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
    case 'content':  return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    case 'auth':     return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    case 'platform': return <svg {...props}><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><line x1="6" y1="7" x2="6.01" y2="7"/><line x1="6" y1="17" x2="6.01" y2="17"/></svg>
    case 'audit':    return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
    default: return null
  }
}

const SYSADMIN_NAV = [
  { to:'/app/sysadmin/users',    label:'Users',           icon:'users' },
  { to:'/app/sysadmin/billing',  label:'Billing',         icon:'billing' },
  { to:'/app/sysadmin/content',  label:'Content',         icon:'content' },
  { to:'/app/sysadmin/auth',     label:'Auth & Login',    icon:'auth' },
  { to:'/app/sysadmin/platform', label:'Platform',        icon:'platform' },
  { to:'/app/sysadmin/audit',    label:'Audit Log',       icon:'audit' },
]

export default function Sidebar() {
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const { user, isSysadmin, signOut } = useAuth() || {}
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onCloseEv = () => setOpen(false)
    window.addEventListener('mobile-nav-open', onOpen)
    window.addEventListener('mobile-nav-close', onCloseEv)
    return () => {
      window.removeEventListener('mobile-nav-open', onOpen)
      window.removeEventListener('mobile-nav-close', onCloseEv)
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

  const [markPart1, markPart2] = (settings.app_name || 'Baker|Nomics').split('|')
  const logoSrc = settings.logo_data_url || '/assets/lily-mark-white.png'
  const kicker = isSysadmin ? 'SYSADMIN' : (settings.business_name || 'Lily Ong Artisan').toUpperCase()

  async function handleSignOut() {
    close()
    await signOut?.()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <div
        className={'nav-backdrop' + (open ? ' visible' : '')}
        onClick={close}
        aria-hidden="true"
      />
      <aside className={open ? 'open' : ''}>
        <Link to="/app" className="brand" style={{textDecoration:'none', color:'inherit'}} onClick={close}>
          <div className="brand-stamp">
            <img src={logoSrc} alt="" />
          </div>
          <div className="brand-text">
            <div className="brand-wordmark">
              <span className="part1">{markPart1}</span>
              {markPart2 && <span className="part2">{markPart2}</span>}
            </div>
            <div className="brand-kicker">{kicker}</div>
          </div>
        </Link>

        <div className="nav-section">Main</div>
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={close}
            className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
          >
            <span className="chip"><NavIcon name={n.icon}/></span>
            {n.label}
          </NavLink>
        ))}

        <div className="nav-section">System</div>
        <NavLink
          to="/app/settings"
          onClick={close}
          className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <span className="chip"><NavIcon name="settings"/></span>
          Settings
        </NavLink>

        {isSysadmin && (
          <>
            <div className="nav-section nav-section-admin">Sysadmin</div>
            {SYSADMIN_NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={close}
                className={({isActive}) => 'nav-item nav-item-admin' + (isActive ? ' active' : '')}
              >
                <span className="chip chip-admin"><SysIcon name={n.icon}/></span>
                {n.label}
              </NavLink>
            ))}
          </>
        )}

        {/* Account block at bottom */}
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
