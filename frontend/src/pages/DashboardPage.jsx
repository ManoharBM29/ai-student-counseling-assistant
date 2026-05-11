import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/store'
import { getSessions } from '../services/api'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions()
      .then(({ data }) => setSessions(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const completed = sessions.filter(s => s.status === 'completed').length
  const processing = sessions.filter(s => s.status === 'processing').length

  const pillStyle = (status) => {
    if (status === 'completed') return {background:'rgba(0,200,150,0.12)',color:'#00C896',border:'1px solid rgba(0,200,150,0.25)'}
    if (status === 'processing') return {background:'rgba(200,255,0,0.1)',color:'#C8FF00',border:'1px solid rgba(200,255,0,0.25)'}
    return {background:'rgba(255,92,53,0.1)',color:'#FF5C35',border:'1px solid rgba(255,92,53,0.25)'}
  }

  return (
    <div style={{maxWidth:'900px',margin:'0 auto',padding:'88px 24px 60px'}}>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'28px'}}>
        <div>
          <p style={{color:'rgba(255,255,255,0.3)',fontSize:'13px',marginBottom:'4px'}}>Welcome back</p>
          <h1 style={{fontFamily:'Syne',fontWeight:800,fontSize:'30px',margin:0}}>{user?.name?.split(' ')[0]}<span style={{color:'#C8FF00'}}>.</span></h1>
        </div>
        <button onClick={() => navigate('/counseling/new')} className="btn-volt">
          + New Session
        </button>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'20px'}}>
        {[
          {label:'Total Sessions',value:sessions.length,color:'#C8FF00'},
          {label:'Completed',value:completed,color:'#00C896'},
          {label:'Processing',value:processing,color:'#FF5C35'},
        ].map(({label,value,color}) => (
          <div key={label} style={{background:'#1A1A2E',borderRadius:'16px',border:'1px solid rgba(255,255,255,0.05)',padding:'20px',textAlign:'center'}}>
            <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'32px',color,marginBottom:'4px'}}>{value}</div>
            <div style={{color:'rgba(255,255,255,0.35)',fontSize:'12px'}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Sessions */}
      <div style={{background:'#1A1A2E',borderRadius:'20px',border:'1px solid rgba(255,255,255,0.05)',padding:'24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
          <h2 style={{fontFamily:'Syne',fontWeight:700,fontSize:'16px',margin:0}}>Counseling Sessions</h2>
          <button onClick={() => navigate('/counseling/new')} style={{background:'none',border:'none',color:'#C8FF00',fontSize:'12px',cursor:'pointer',fontFamily:'JetBrains Mono'}}>+ New</button>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,0.3)'}}>Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div style={{textAlign:'center',padding:'48px 0'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>🧠</div>
            <p style={{color:'rgba(255,255,255,0.4)',marginBottom:'6px'}}>No sessions yet</p>
            <p style={{color:'rgba(255,255,255,0.25)',fontSize:'13px',marginBottom:'20px'}}>Start your first AI counseling session</p>
            <button onClick={() => navigate('/counseling/new')} className="btn-volt">Start Now</button>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {sessions.map(s => (
              <div key={s.id}
                onClick={() => s.status === 'completed' ? navigate(`/counseling/${s.id}/report`) : navigate(`/counseling/${s.id}/live`)}
                style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.05)',cursor:'pointer',transition:'all 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,255,0,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'}
              >
                <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'#242442',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',flexShrink:0}}>🧠</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:'13px',color:'rgba(255,255,255,0.8)',margin:'0 0 3px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.student_goal}</p>
                  <p style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',margin:0,fontFamily:'JetBrains Mono'}}>
                    {s.target_degree || 'Degree'} · {s.target_field || 'Field'} · {new Date(s.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span style={{fontSize:'11px',padding:'3px 10px',borderRadius:'100px',fontFamily:'JetBrains Mono',flexShrink:0,...pillStyle(s.status)}}>{s.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
