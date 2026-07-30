import { Route, Routes } from 'react-router-dom'
import AuthGuard from './components/AuthGuard.jsx'
import SysadminGuard from './components/SysadminGuard.jsx'
import AppLayout from './components/AppLayout.jsx'
import ImpersonationBanner from './components/ImpersonationBanner.jsx'

// Public pages
import Landing from './pages/Landing.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

// Protected app pages
import Dashboard from './pages/Dashboard.jsx'
import Ingredients from './pages/Ingredients.jsx'
import Recipes from './pages/Recipes.jsx'
import Bom from './pages/Bom.jsx'
import Costing from './pages/Costing.jsx'
import Pricing from './pages/Pricing.jsx'
import Inventory from './pages/Inventory.jsx'
import Settings from './pages/Settings.jsx'

// Sysadmin
import Users from './pages/sysadmin/Users.jsx'
import Billing from './pages/sysadmin/Billing.jsx'
import SysadminPlaceholder from './pages/sysadmin/Placeholder.jsx'

export default function App() {
  return (
    <>
      <ImpersonationBanner/>
      <Routes>
        {/* ============ Public ============ */}
        <Route path="/"                element={<Landing/>}/>
        <Route path="/signup"          element={<Signup/>}/>
        <Route path="/login"           element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password"  element={<ResetPassword/>}/>

        {/* ============ Protected app ============ */}
        <Route path="/app/*" element={
          <AuthGuard>
            <AppLayout>
              <Routes>
                <Route index                element={<Dashboard/>}/>
                <Route path="ingredients"   element={<Ingredients/>}/>
                <Route path="recipes"       element={<Recipes/>}/>
                <Route path="bom"           element={<Bom/>}/>
                <Route path="costing"       element={<Costing/>}/>
                <Route path="pricing"       element={<Pricing/>}/>
                <Route path="inventory"     element={<Inventory/>}/>
                <Route path="settings"      element={<Settings/>}/>

                {/* Sysadmin — real pages */}
                <Route path="sysadmin/users"    element={<SysadminGuard><Users/></SysadminGuard>}/>
                <Route path="sysadmin/billing"  element={<SysadminGuard><Billing/></SysadminGuard>}/>

                {/* Sysadmin — placeholders */}
                <Route path="sysadmin/content"  element={<SysadminGuard><SysadminPlaceholder title="Content" description="Landing page copy, Coming Soon widget editor, marketing images, FAQ."/></SysadminGuard>}/>
                <Route path="sysadmin/auth"     element={<SysadminGuard><SysadminPlaceholder title="Auth & Login" description="Email templates (invite, welcome, reset), session length, signup rules, allow/deny lists."/></SysadminGuard>}/>
                <Route path="sysadmin/platform" element={<SysadminGuard><SysadminPlaceholder title="Platform Settings" description="Feature flags, maintenance mode, platform announcements, backup schedule."/></SysadminGuard>}/>
                <Route path="sysadmin/audit"    element={<SysadminGuard><SysadminPlaceholder title="Audit Log" description="Who did what, when. Especially useful for impersonation events and subscription date changes."/></SysadminGuard>}/>
              </Routes>
            </AppLayout>
          </AuthGuard>
        }/>
      </Routes>
    </>
  )
}
