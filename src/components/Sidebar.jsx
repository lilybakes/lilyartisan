import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { NavIcon } from '../lib/nav-icons.jsx'
import { useSettings } from '../lib/settings.jsx'
import { useAuth } from '../lib/auth.jsx'

const NAV = [
  { to:'/',            label:'Dashboard',    icon:'dash' },
  { to:'/ingredients', label:'Ingredients',  icon:'ingredients' },
  { to:'/recipes',     label:'Recipes',      icon:'recipes' },
  { to:'/bom',         label:'Recipe BOM',   icon:'bom' },
  { to:'/costing',     label:'Yield & Cost', icon:'costing' },
  { to:'/pricing',     label:'Pricing',      icon:'pricing' },
  { to:'/inventory',   label:'Inventory',    icon:'inventory' },
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
  const kicker = (settings.business_name || 'Lily Ong Artisan').toUpperCase()

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
        <Link to="/" className="brand" style={{textDecoration:'none', color:'inherit'}} onClick={close}>
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
            end={n.to === '/'}
            onClick={close}
            className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
          >
            <span className="chip"><NavIcon name={n.icon}/></span>
            {n.label}
          </NavLink>
        ))}

        <div className="nav-section">System</div>
        <NavLink
          to="/settings"
          onClick={close}
          className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <span className="chip"><NavIcon name="settings"/></span>
          Settings
        </NavLink>

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
