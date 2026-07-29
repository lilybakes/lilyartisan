import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Ingredients from './pages/Ingredients.jsx'
import Recipes from './pages/Recipes.jsx'
import Bom from './pages/Bom.jsx'
import Costing from './pages/Costing.jsx'
import Pricing from './pages/Pricing.jsx'
import Inventory from './pages/Inventory.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <div className="app">
      <Sidebar/>
      <main>
        <Topbar/>
        <div className="content">
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
        </div>
      </main>
      <BottomNav/>
    </div>
  )
}
