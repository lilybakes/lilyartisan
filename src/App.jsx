import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './lib/settings.jsx'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Ingredients from './pages/Ingredients'
import Recipes from './pages/Recipes'
import Bom from './pages/Bom'
import Costing from './pages/Costing'
import Pricing from './pages/Pricing'
import Inventory from './pages/Inventory'
import Settings from './pages/Settings'

export default function App() {
  // Mobile drawer state. Ignored on desktop (aside is a sticky column there).
  const [navOpen, setNavOpen] = useState(false)

  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className="app">
          <Sidebar open={navOpen} onClose={() => setNavOpen(false)}/>
          <div>
            <Topbar onMenuClick={() => setNavOpen(true)}/>
            <main className="content">
              <Routes>
                <Route path="/"            element={<Dashboard/>}/>
                <Route path="/ingredients" element={<Ingredients/>}/>
                <Route path="/recipes"     element={<Recipes/>}/>
                <Route path="/bom"         element={<Bom/>}/>
                <Route path="/costing"     element={<Costing/>}/>
                <Route path="/pricing"     element={<Pricing/>}/>
                <Route path="/inventory"   element={<Inventory/>}/>
                <Route path="/settings"    element={<Settings/>}/>
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  )
}
