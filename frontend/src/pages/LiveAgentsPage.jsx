import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getStatus } from '../services/api'

const AGENTS = [
  { key: 'OrchestratorAgent', name: 'OrchestratorAgent', emoji: '🧠', desc: 'Coordinating all agents and planning pipeline...' },
  { key: 'ProfilerAgent', name: 'ProfilerAgent', emoji: '👤', desc: 'Analyzing your academic background and strengths...' },
  { key: 'SkillGapAgent', name: 'SkillGapAgent', emoji: '📊', desc: 'Identifying skill gaps and recommending courses...' },
  { key: 'UniversityAgent', name: 'UniversityAgent', emoji: '🎓', desc: 'Researching and matching best-fit universities...' },
  { key: 'SOPWriterAgent', name: 'SOPWriterAgent', emoji: '✍️', desc: 'Writing your personalized Statement of Purpose...' },
  { key: 'SOPReviewerAgent', name: 'SOPReviewerAgent', emoji: '🔍', desc: 'Reviewing and scoring your SOP draft...' },
  { key: 'InterviewCoachAgent', name: 'InterviewCoachAgent', emoji: '🎤', desc: 'Generating interview questions and prep guide...' },
  { key: 'TrackerAgent', name: 'TrackerAgent', emoji: '📅', desc: 'Building application timeline and checklist...' },
]

export default function LiveAgentsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing')
  const [completedAgents, setCompletedAgents] = useState([])
  const [dots, setDots] = useState('...')
  const intervalRef = useRef(null)
  const dotsRef = useRef(null)

  useEffect(() => {
    dotsRef.current = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    intervalRef.current = setInterval(async () => {
      try {
        const { data } = await getStatus(id)
        const done = (data.agents_completed || []).map(a => a.agent)
        setCompletedAgents(done)
        if (data.status === 'completed') {
          clearInterval(intervalRef.current)
          clearInterval(dotsRef.current)
          setStatus('completed')
          setTimeout(() => navigate(`/counseling/${id}/report`), 1500)
        } else if (data.status === 'failed') {
          clearInterval(intervalRef.current)
          clearInterval(dotsRef.current)
          setStatus('failed')
        }
      } catch (e) { console.error(e) }
    }, 2000)
    return () => { clearInterval(intervalRef.current); clearInterval(dotsRef.current) }
  }, [id])

  const progress = Math.round((completedAgents.length / AGENTS.length) * 100)
  const getAgentStatus = (name) => {
    if (completedAgents.includes(name)) return 'done'
    if (completedAgents.length < AGENTS.length && AGENTS[completedAgents.length]?.key === name) return 'running'
    return 'pending'
  }

  return (
    <div style={{maxWidth:'640px',margin:'0 auto',padding:'88px 24px 60px'}}>
      <div style={{textAlign:'center',marginBottom:'32px'}}>
        <div style={{position:'relative',width:'72px',height:'72px',margin:'0 auto 20px'}}>
          <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'2px solid rgba(200,255,0,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px'}}>🧠</div>
          <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'2px solid transparent',borderTopColor:'#C8FF00',animation:'spin 1s linear infinite'}}></div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        {status === 'completed' ? (
          <><h2 style={{fontFamily:'Syne',fontWeight:800,fontSize:'22px',color:'#00C896',margin:'0 0 6px'}}>All agents completed! ✅</h2>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px',margin:0}}>Redirecting to your report...</p></>
        ) : status === 'failed' ? (
          <><h2 style={{fontFamily:'Syne',fontWeight:800,fontSize:'22px',color:'#FF5C35',margin:'0 0 6px'}}>Something went wrong</h2>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px',margin:0}}>Check backend terminal for errors and try again</p></>
        ) : (
          <><h2 style={{fontFamily:'Syne',fontWeight:800,fontSize:'22px',margin:'0 0 6px'}}>AI Agents Running<span style={{color:'#C8FF00'}}>{dots}</span></h2>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px',margin:0}}>Your personalized counseling plan is being generated</p></>
        )}
      </div>

      <div style={{marginBottom:'24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',fontFamily:'JetBrains Mono',fontSize:'11px',color:'rgba(255,255,255,0.3)',marginBottom:'8px'}}>
          <span>{completedAgents.length} / {AGENTS.length} agents</span>
          <span>{progress}%</span>
        </div>
        <div style={{height:'4px',background:'rgba(255,255,255,0.06)',borderRadius:'2px',overflow:'hidden'}}>
          <div style={{height:'100%',background:'#C8FF00',borderRadius:'2px',width:`${progress}%`,transition:'width 0.6s ease'}} />
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
        {AGENTS.map((agent, i) => {
          const s = getAgentStatus(agent.key)
          return (
            <div key={agent.key} style={{
              display:'flex',alignItems:'center',gap:'14px',padding:'14px 16px',
              borderRadius:'12px',transition:'all 0.4s',
              background: s==='done' ? 'rgba(0,200,150,0.04)' : s==='running' ? 'rgba(200,255,0,0.04)' : 'transparent',
              border: s==='done' ? '1px solid rgba(0,200,150,0.2)' : s==='running' ? '1px solid rgba(200,255,0,0.35)' : '1px solid rgba(255,255,255,0.04)'
            }}>
              <div style={{fontSize:'18px',width:'24px',textAlign:'center',flexShrink:0}}>{agent.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'2px'}}>
                  <span style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(255,255,255,0.28)'}}>Agent {i+1}</span>
                  {s==='running' && <span style={{fontSize:'10px',background:'rgba(200,255,0,0.12)',color:'#C8FF00',padding:'1px 7px',borderRadius:'100px',fontFamily:'JetBrains Mono'}}>running</span>}
                </div>
                <div style={{fontFamily:'Syne',fontWeight:700,fontSize:'13px',color:'rgba(255,255,255,0.85)'}}>{agent.name}</div>
                {s==='running' && <div style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',marginTop:'2px'}}>{agent.desc}</div>}
              </div>
              <div style={{flexShrink:0,fontSize:'16px'}}>
                {s==='done' && '✅'}
                {s==='running' && <div style={{width:'16px',height:'16px',borderRadius:'50%',border:'2px solid transparent',borderTopColor:'#C8FF00',animation:'spin 1s linear infinite'}} />}
                {s==='pending' && <div style={{width:'14px',height:'14px',borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.15)'}} />}
              </div>
            </div>
          )
        })}
      </div>

      {status === 'completed' && (
        <button onClick={() => navigate(`/counseling/${id}/report`)} className="btn-volt"
          style={{width:'100%',justifyContent:'center',padding:'13px',marginTop:'24px',fontSize:'15px'}}>
          View Full Report →
        </button>
      )}
    </div>
  )
}
