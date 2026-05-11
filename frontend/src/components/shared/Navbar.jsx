import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/store'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const navStyle = (path) => ({
    display:'flex',alignItems:'center',gap:'6px',
    padding:'7px 14px',borderRadius:'8px',fontSize:'13px',
    textDecoration:'none',transition:'all 0.2s',
    background: location.pathname===path ? 'rgba(200,255,0,0.1)' : 'transparent',
    color: location.pathname===path ? '#C8FF00' : 'rgba(255,255,255,0.45)'
  })

  return (
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',background:'rgba(13,13,13,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
      <Link to={user ? '/dashboard' : '/'} style={{fontFamily:'Syne',fontWeight:800,fontSize:'17px',color:'#f5f5f5',textDecoration:'none'}}>
        EduPath <span style={{color:'#C8FF00',fontFamily:'JetBrains Mono',fontSize:'11px',fontWeight:400}}>AI Counseling</span>
      </Link>
      {user && (
        <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
          <Link to="/dashboard" style={navStyle('/dashboard')}>📊 Dashboard</Link>
          <Link to="/counseling/new" style={navStyle('/counseling/new')}>🧠 New Session</Link>
          <span style={{color:'rgba(255,255,255,0.25)',fontSize:'13px',margin:'0 8px',display:'none'}}>{user.name}</span>
          <button onClick={() => { logout(); navigate('/login') }}
            style={{background:'none',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)',padding:'6px 12px',borderRadius:'8px',cursor:'pointer',fontSize:'12px',marginLeft:'4px'}}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
