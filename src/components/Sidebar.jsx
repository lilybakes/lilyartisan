import { useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
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

export default function Sidebar({ open = false, onClose }) {
  const { settings } = useSettings()
  const location = useLocation()

  // On mobile, closing the drawer when the route changes is the expected UX.
  useEffect(() => {
    if (onClose) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Esc closes the drawer.
  useEffect(() => {
    if (!open) return
    const onEsc = (e) => { if (e.key === 'Escape' && onClose) onClose() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  // Prevent body scroll while drawer is open on mobile.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  const [markPart1, markPart2] = (settings.app_name || 'Baker|Nomics').split('|')
  const logoSrc = settings.logo_data_url || '/assets/lily-mark-white.png'
  const kicker = (settings.business_name || 'Lily Ong Artisan').toUpperCase()

  return (
    <>
      <div
        className={'nav-backdrop' + (open ? ' visible' : '')}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={open ? 'open' : ''}>
        <Link to="/" className="brand" style={{textDecoration:'none', color:'inherit'}}>
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
            className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
          >
            <span className="chip"><NavIcon name={n.icon}/></span>
            {n.label}
          </NavLink>
        ))}

        <div className="nav-section">System</div>
        <NavLink to="/settings" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
          <span className="chip"><NavIcon name="settings"/></span>
          Settings
        </NavLink>
      </aside>
    </>
  )
}
