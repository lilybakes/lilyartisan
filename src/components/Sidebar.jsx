import { NavLink } from 'react-router-dom'
import { Icon } from '../lib/icons.jsx'

const NAV = [
  { to:'/',            label:'Dashboard',    icon:'dash',        color:'accent' },
  { to:'/ingredients', label:'Ingredients',  icon:'ingredients', color:'info' },
  { to:'/recipes',     label:'Recipes',      icon:'recipes',     color:'pink' },
  { to:'/bom',         label:'Recipe BOM',   icon:'bom',         color:'warn' },
  { to:'/costing',     label:'Yield & Cost', icon:'costing',     color:'success' },
  { to:'/pricing',     label:'Pricing',      icon:'pricing',     color:'accent' },
  { to:'/inventory',   label:'Inventory',    icon:'inventory',   color:'warn' },
]

export default function Sidebar() {
  return (
    <aside>
      <div className="brand">
        <div className="brand-logo">🎂</div>
        <div className="brand-name">Lily<span>Artisan</span></div>
      </div>
      <div className="nav-section">Main</div>
      {NAV.map(n => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/'}
          className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
          data-color={n.color}
        >
          <span className="chip"><Icon name={n.icon} size={15}/></span>
          {n.label}
        </NavLink>
      ))}
      <div className="nav-section">System</div>
      <NavLink to="/settings" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')} data-color="muted">
        <span className="chip"><Icon name="settings" size={15}/></span>
        Settings
      </NavLink>
    </aside>
  )
}
