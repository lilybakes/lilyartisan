import { Route, Routes } from 'react-router-dom'
import AuthGuard from './components/AuthGuard.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
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
    <Routes>
      {/* Public auth routes */}
      <Route path="/login"           element={<Login/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password"  element={<ResetPassword/>}/>

      {/* Everything else is protected */}
      <Route path="/*" element={
        <AuthGuard>
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
        </AuthGuard>
      }/>
    </Routes>
  )
}
