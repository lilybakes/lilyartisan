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
  const { settings } = useSettings()

  // Wordmark: split on "|" — first part navy, second part violet.
  const [markPart1, markPart2] = (settings.app_name || 'Baker|Nomics').split('|')

  // Logo: user-uploaded logo overrides bundled Lily mark.
  const logoSrc = settings.logo_data_url || '/assets/lily-mark-white.png'

  const kicker = (settings.business_name || 'Lily Ong Artisan').toUpperCase()

  return (
    <aside>
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
  )
}
