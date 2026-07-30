import { Route, Routes } from 'react-router-dom'
import AuthGuard from './components/AuthGuard.jsx'
import SysadminGuard from './components/SysadminGuard.jsx'
import AppLayout from './components/AppLayout.jsx'
import ImpersonationBanner from './components/ImpersonationBanner.jsx'
import AnnouncementBanner from './components/AnnouncementBanner.jsx'
import MaintenanceGate from './components/MaintenanceGate.jsx'
import { PersonalizationProvider } from './lib/personalization.jsx'

// Public pages
import Landing from './pages/Landing.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Maintenance from './pages/Maintenance.jsx'
import Checkout from './pages/Checkout.jsx'
import CheckoutPending from './pages/CheckoutPending.jsx'

// Protected app pages
import Dashboard from './pages/Dashboard.jsx'
import Ingredients from './pages/Ingredients.jsx'
import Recipes from './pages/Recipes.jsx'
import Bom from './pages/Bom.jsx'
import Costing from './pages/Costing.jsx'
import Pricing from './pages/Pricing.jsx'
import Inventory from './pages/Inventory.jsx'
import Settings from './pages/Settings.jsx'
import Personalize from './pages/Personalize.jsx'
import Templates from './pages/Templates.jsx'

// Sysadmin
import Users from './pages/sysadmin/Users.jsx'
import Billing from './pages/sysadmin/Billing.jsx'
import Content from './pages/sysadmin/Content.jsx'
import AuthSettings from './pages/sysadmin/AuthSettings.jsx'
import Gallery from './pages/sysadmin/Gallery.jsx'
import Platform from './pages/sysadmin/Platform.jsx'
import AuditLog from './pages/sysadmin/AuditLog.jsx'
import Orders from './pages/sysadmin/Orders.jsx'

export default function App() {
  return (
    <>
      <ImpersonationBanner/>
      <Routes>
        {/* Public */}
        <Route path="/"                    element={<Landing/>}/>
        <Route path="/signup"              element={<Signup/>}/>
        <Route path="/login"               element={<Login/>}/>
        <Route path="/forgot-password"     element={<ForgotPassword/>}/>
        <Route path="/reset-password"      element={<ResetPassword/>}/>
        <Route path="/checkout"            element={<Checkout/>}/>
        <Route path="/checkout/:orderId"   element={<CheckoutPending/>}/>

        {/* Protected */}
        <Route path="/app/*" element={
          <AuthGuard>
            <MaintenanceGate>
              <PersonalizationProvider>
                <AnnouncementBanner/>
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
                    <Route path="personalize"   element={<Personalize/>}/>
                    <Route path="templates"     element={<Templates/>}/>

                    <Route path="sysadmin/orders"   element={<SysadminGuard><Orders/></SysadminGuard>}/>
                    <Route path="sysadmin/users"    element={<SysadminGuard><Users/></SysadminGuard>}/>
                    <Route path="sysadmin/billing"  element={<SysadminGuard><Billing/></SysadminGuard>}/>
                    <Route path="sysadmin/content"  element={<SysadminGuard><Content/></SysadminGuard>}/>
                    <Route path="sysadmin/auth"     element={<SysadminGuard><AuthSettings/></SysadminGuard>}/>
                    <Route path="sysadmin/gallery"  element={<SysadminGuard><Gallery/></SysadminGuard>}/>
                    <Route path="sysadmin/platform" element={<SysadminGuard><Platform/></SysadminGuard>}/>
                    <Route path="sysadmin/audit"    element={<SysadminGuard><AuditLog/></SysadminGuard>}/>
                  </Routes>
                </AppLayout>
              </PersonalizationProvider>
            </MaintenanceGate>
          </AuthGuard>
        }/>
      </Routes>
    </>
  )
}
