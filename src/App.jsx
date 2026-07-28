import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Ingredients from './pages/Ingredients'
import Recipes from './pages/Recipes'
import Bom from './pages/Bom'
import Costing from './pages/Costing'
import Pricing from './pages/Pricing'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'

const TABS = [
  { to: '/ingredients', label: 'Ingredient Master', n: '01' },
  { to: '/recipes',     label: 'Recipe Master',     n: '02' },
  { to: '/bom',         label: 'Recipe BOM',        n: '03' },
  { to: '/costing',     label: 'Yield & Costing',   n: '04' },
  { to: '/pricing',     label: 'Selling Price',     n: '05' },
  { to: '/inventory',   label: 'Inventory',         n: '06' },
  { to: '/reports',     label: 'Reports',           n: '07' },
]

export default function App() {
  return (
    <>
      <header className="app">
        <h1>Cake Costing &amp; BOM</h1>
        <span className="tag">Netlify · Supabase · React</span>
      </header>
      <nav className="tabs">
        {TABS.map(t => (
          <NavLink key={t.to} to={t.to} className={({isActive}) => isActive ? 'active' : ''}>
            <span className="n">{t.n}</span>{t.label}
          </NavLink>
        ))}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/ingredients" replace />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/recipes"     element={<Recipes />} />
          <Route path="/bom"         element={<Bom />} />
          <Route path="/costing"     element={<Costing />} />
          <Route path="/pricing"     element={<Pricing />} />
          <Route path="/inventory"   element={<Inventory />} />
          <Route path="/reports"     element={<Reports />} />
        </Routes>
      </main>
    </>
  )
}
