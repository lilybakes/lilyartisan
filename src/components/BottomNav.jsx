import { NavLink } from 'react-router-dom'
import { NavIcon } from '../lib/nav-icons.jsx'

const TABS = [
  { to: '/app',             label: 'Home',        icon: 'dash',        end:true },
  { to: '/app/recipes',     label: 'Recipes',     icon: 'recipes' },
  { to: '/app/ingredients', label: 'Ingredients', icon: 'ingredients' },
  { to: '/app/bom',         label: 'BOM',         icon: 'bom' },
]

export default function BottomNav() {
  const openDrawer = () => window.dispatchEvent(new CustomEvent('mobile-nav-open'))

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {TABS.map(t => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({isActive}) => 'bottom-nav-item' + (isActive ? ' active' : '')}
        >
          <span className="bottom-nav-icon"><NavIcon name={t.icon} size={22}/></span>
          <span className="bottom-nav-label">{t.label}</span>
        </NavLink>
      ))}
      <button
        type="button"
        className="bottom-nav-item"
        onClick={openDrawer}
        aria-label="More menu"
      >
        <span className="bottom-nav-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.8" strokeLinecap="round">
            <line x1="4" y1="7"  x2="20" y2="7"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="17" x2="20" y2="17"/>
          </svg>
        </span>
        <span className="bottom-nav-label">More</span>
      </button>
    </nav>
  )
}
