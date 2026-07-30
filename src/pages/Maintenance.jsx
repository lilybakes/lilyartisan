import Logo from '../components/Logo.jsx'

export default function Maintenance({ message }) {
  return (
    <div className="maintenance-page">
      <div className="maintenance-card">
        <Logo size={64}/>
        <h1>Down for maintenance</h1>
        <p>{message || 'We\'re making improvements. Back shortly.'}</p>
        <button className="ghost" onClick={() => window.location.reload()}>
          Try again
        </button>
        <p className="maintenance-hint">Your data is safe — we haven't touched it. Sign back in once we're done.</p>
      </div>
    </div>
  )
}
