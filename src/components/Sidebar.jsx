import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NavIcon } from '../lib/nav-icons.jsx'
import { useSettings } from '../lib/settings.jsx'

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
  // Defensive: works even if the SettingsProvider hasn't populated yet.
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const [open, setOpen] = useState(false)

  // Listen for the open event from Topbar's hamburger.
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

  // Esc closes the drawer.
  useEffect(() => {
    if (!open) return
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open])

  // Lock body scroll while drawer is open.
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
      </aside>
    </>
  )
}
