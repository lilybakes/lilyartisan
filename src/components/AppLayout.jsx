import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import BottomNav from './BottomNav.jsx'

export default function AppLayout({ children }) {
  return (
    <div className="app">
      <Sidebar/>
      <main>
        <Topbar/>
        <div className="content">
          {children}
        </div>
      </main>
      <BottomNav/>
    </div>
  )
}
