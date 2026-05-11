import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getReport } from '../services/api'

function Section({ title, emoji, children, open: defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{background:'#1A1A2E',borderRadius:'14px',border:'1px solid rgba(255,255,255,0.05)',marginBottom:'10px',overflow:'hidden'}}>
      <button onClick={() => setOpen(!open)}
        style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 18px',background:'none',border:'none',cursor:'pointer',color:'#f5f5f5'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <span style={{fontSize:'16px'}}>{emoji}</span>
          <span style={{fontFamily:'Syne',fontWeight:700,fontSize:'14px'}}>{title}</span>
        </div>
        <span style={{color:'rgba(255,255,255,0.3)',fontSize:'12px'}}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div style={{padding:'4px 18px 18px',borderTop:'1px solid rgba(255,255,255,0.04)'}}>{children}</div>}
    </div>
  )
}

function ScoreRing({ score, size = 44 }) {
  const color = score >= 75 ? '#00C896' : score >= 50 ? '#C8FF00' : '#FF5C35'
  const border = score >= 75 ? 'rgba(0,200,150,0.35)' : score >= 50 ? 'rgba(200,255,0,0.35)' : 'rgba(255,92,53,0.35)'
  const bg = score >= 75 ? 'rgba(0,200,150,0.08)' : score >= 50 ? 'rgba(200,255,0,0.08)' : 'rgba(255,92,53,0.08)'
  return (
    <div style={{width:size,height:size,borderRadius:'50%',border:`2px solid ${border}`,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne',fontWeight:800,fontSize:size>50?22:14,color,flexShrink:0}}>
      {score}
    </div>
  )
}

const catStyle = {
  safe: {background:'rgba(0,200,150,0.06)',border:'1px solid rgba(0,200,150,0.2)',color:'#00C896'},
  target: {background:'rgba(200,255,0,0.06)',border:'1px solid rgba(200,255,0,0.2)',color:'#C8FF00'},
  reach: {background:'rgba(255,92,53,0.06)',border:'1px solid rgba(255,92,53,0.2)',color:'#FF5C35'},
}

export default function ReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReport(id).then(({ data }) => setReport(data)).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.4)'}}>Loading report...</div>
  if (!report || report.error) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'16px'}}>
      <p style={{color:'#FF5C35'}}>Report not available yet. Session may still be processing.</p>
      <button onClick={() => navigate('/dashboard')} className="btn-ghost">Back to Dashboard</button>
    </div>
  )

  const { session, profile, skill_gap, universities, sop, interview_prep, timeline, agent_logs } = report

  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'88px 24px 60px'}}>
      <button onClick={() => navigate('/dashboard')}
        style={{background:'none',border:'none',color:'rgba(255,255,255,0.35)',fontSize:'13px',cursor:'pointer',marginBottom:'18px',fontFamily:'DM Sans'}}>← Dashboard</button>

      {/* Summary */}
      <div style={{background:'#1A1A2E',border:'1px solid rgba(200,255,0,0.18)',borderRadius:'20px',padding:'24px',marginBottom:'18px',display:'flex',alignItems:'center',gap:'20px'}}>
        <ScoreRing score={profile?.readiness_score || 0} size={68} />
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
            <span>🧠</span>
            <span style={{fontFamily:'Syne',fontWeight:700,fontSize:'17px'}}>AI Counseling Report</span>
          </div>
          <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'22px',color:'#C8FF00',marginBottom:'4px'}}>
            {(profile?.readiness_score||0) >= 75 ? 'Excellent — Ready to Apply' : (profile?.readiness_score||0) >= 50 ? 'Good — Almost Ready' : 'Needs Preparation'}
          </div>
          <div style={{color:'rgba(255,255,255,0.4)',fontSize:'13px'}}>{session?.target_degree} · {session?.target_field} · {new Date(session?.created_at).toLocaleDateString()}</div>
        </div>
        <div style={{textAlign:'center',flexShrink:0}}>
          <div style={{color:'rgba(255,255,255,0.25)',fontFamily:'JetBrains Mono',fontSize:'9px',textTransform:'uppercase',marginBottom:'4px'}}>Agents Ran</div>
          <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'28px',color:'#00C896'}}>{agent_logs?.length || 8}</div>
        </div>
      </div>
      {profile?.summary && (
        <div style={{background:'rgba(200,255,0,0.05)',border:'1px solid rgba(200,255,0,0.15)',borderRadius:'12px',padding:'14px 16px',marginBottom:'16px'}}>
          <div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(200,255,0,0.5)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'6px'}}>AI Summary</div>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',margin:0,lineHeight:1.7}}>{profile.summary}</p>
        </div>
      )}

      {/* Profile */}
      <Section title="Profile Analysis" emoji="👤" open={true}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',paddingTop:'12px'}}>
          <div>
            <div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(0,200,150,0.6)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'10px'}}>✓ Strengths</div>
            {(profile?.strengths||[]).map((s,i)=>(
              <div key={i} style={{display:'flex',gap:'8px',marginBottom:'7px',fontSize:'13px',color:'rgba(255,255,255,0.7)'}}>
                <span style={{color:'#00C896',flexShrink:0}}>✓</span>{s}
              </div>
            ))}
          </div>
          <div>
            <div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(255,92,53,0.6)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'10px'}}>⚠ Weak Areas</div>
            {(profile?.weak_areas||[]).map((w,i)=>(
              <div key={i} style={{display:'flex',gap:'8px',marginBottom:'7px',fontSize:'13px',color:'rgba(255,255,255,0.7)'}}>
                <span style={{color:'#FF5C35',flexShrink:0}}>⚠</span>{w}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Skill Gap */}
      <Section title="Skill Gap Analysis" emoji="📊">
        <div style={{paddingTop:'12px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
            <ScoreRing score={skill_gap?.gap_score||0} />
            <div>
              <div style={{fontSize:'13px',color:'rgba(255,255,255,0.7)'}}>Gap Score</div>
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)'}}>{skill_gap?.timeline_weeks||0} weeks to fill all gaps</div>
            </div>
          </div>
          {(skill_gap?.missing_skills||[]).length>0 && (
            <div style={{marginBottom:'14px'}}>
              <div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(255,92,53,0.6)',textTransform:'uppercase',marginBottom:'8px'}}>Missing Skills</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {skill_gap.missing_skills.map((s,i)=>(
                  <span key={i} style={{fontSize:'12px',background:'rgba(255,92,53,0.08)',border:'1px solid rgba(255,92,53,0.2)',color:'rgba(255,92,53,0.85)',padding:'4px 10px',borderRadius:'100px'}}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {(skill_gap?.recommended_courses||[]).length>0 && (
            <div>
              <div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(200,255,0,0.5)',textTransform:'uppercase',marginBottom:'10px'}}>Recommended Courses</div>
              {skill_gap.recommended_courses.map((c,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 14px',background:'#242442',borderRadius:'10px',marginBottom:'7px'}}>
                  <div><div style={{fontSize:'13px',color:'rgba(255,255,255,0.8)'}}>{c.course}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>{c.platform} · {c.duration}</div></div>
                  <span style={{fontSize:'11px',padding:'3px 8px',borderRadius:'100px',fontFamily:'JetBrains Mono',
                    ...(c.priority==='high'?{background:'rgba(255,92,53,0.1)',color:'#FF5C35'}:c.priority==='medium'?{background:'rgba(200,255,0,0.1)',color:'#C8FF00'}:{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.4)'})
                  }}>{c.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Universities */}
      <Section title={`University Matches (${(universities||[]).length})`} emoji="🎓">
        <div style={{paddingTop:'12px'}}>
          {(universities||[]).map((u,i)=>(
            <div key={i} style={{padding:'14px',borderRadius:'12px',marginBottom:'10px',...(catStyle[u.category]||catStyle.target)}}>
              <div style={{display:'flex',alignItems:'start',justifyContent:'space-between',gap:'12px'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap',marginBottom:'4px'}}>
                    <span style={{fontFamily:'Syne',fontWeight:700,fontSize:'14px',color:'#f5f5f5'}}>{u.name}</span>
                    <span style={{fontSize:'10px',padding:'2px 8px',borderRadius:'100px',fontFamily:'JetBrains Mono',textTransform:'capitalize',...catStyle[u.category]}}>{u.category}</span>
                  </div>
                  <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>{u.program} · {u.country} · Rank #{u.ranking}</div>
                  <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',marginTop:'2px'}}>${(u.tuition_usd||0).toLocaleString()}/yr · Deadline: {u.deadline}</div>
                </div>
                <div style={{textAlign:'center',flexShrink:0}}>
                  <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'22px',color:catStyle[u.category]?.color||'#C8FF00'}}>{u.admission_chance}%</div>
                  <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)'}}>chance</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* SOP */}
      <Section title="Statement of Purpose" emoji="✍️">
        <div style={{paddingTop:'12px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px'}}>
            <ScoreRing score={sop?.review_score||0} />
            <div>
              <div style={{fontSize:'13px',color:'rgba(255,255,255,0.7)'}}>SOP Score · {sop?.word_count||0} words</div>
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)'}}>For {sop?.university}</div>
            </div>
          </div>
          {sop?.strengths && <div style={{background:'rgba(0,200,150,0.05)',border:'1px solid rgba(0,200,150,0.18)',borderRadius:'10px',padding:'12px 14px',marginBottom:'8px'}}><div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(0,200,150,0.6)',textTransform:'uppercase',marginBottom:'5px'}}>✓ Strengths</div><p style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',margin:0,lineHeight:1.6}}>{sop.strengths}</p></div>}
          {sop?.improvements && <div style={{background:'rgba(255,92,53,0.05)',border:'1px solid rgba(255,92,53,0.18)',borderRadius:'10px',padding:'12px 14px',marginBottom:'8px'}}><div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(255,92,53,0.6)',textTransform:'uppercase',marginBottom:'5px'}}>⚠ Improvements</div><p style={{fontSize:'13px',color:'rgba(255,255,255,0.7)',margin:0,lineHeight:1.6}}>{sop.improvements}</p></div>}
          {sop?.content && <div style={{background:'#242442',borderRadius:'12px',padding:'16px'}}><div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'10px'}}>SOP Draft</div><p style={{fontSize:'13px',color:'rgba(255,255,255,0.65)',margin:0,lineHeight:1.8,whiteSpace:'pre-wrap'}}>{sop.content}</p></div>}
        </div>
      </Section>

      {/* Interview */}
      <Section title="Interview Preparation" emoji="🎤">
        <div style={{paddingTop:'12px'}}>
          {(interview_prep?.questions||[]).map((q,i)=>(
            <div key={i} style={{background:'#242442',borderRadius:'12px',padding:'14px',marginBottom:'10px'}}>
              <div style={{fontFamily:'JetBrains Mono',fontSize:'10px',color:'rgba(200,255,0,0.5)',textTransform:'uppercase',marginBottom:'6px'}}>{q.type}</div>
              <div style={{fontSize:'14px',color:'rgba(255,255,255,0.85)',fontWeight:500,marginBottom:'6px'}}>Q{i+1}: {q.question}</div>
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',lineHeight:1.5}}>💡 {q.tip}</div>
            </div>
          ))}
          {(interview_prep?.tips||[]).length>0 && (
            <div style={{marginTop:'14px'}}>
              <div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'10px'}}>General Tips</div>
              {interview_prep.tips.map((t,i)=>(
                <div key={i} style={{display:'flex',gap:'8px',marginBottom:'7px',fontSize:'13px',color:'rgba(255,255,255,0.6)'}}>
                  <span style={{color:'#C8FF00',flexShrink:0}}>→</span>{t}
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Timeline */}
      <Section title="Application Timeline" emoji="📅">
        <div style={{paddingTop:'12px'}}>
          {(timeline?.deadlines||[]).length>0 && (
            <div style={{marginBottom:'16px'}}>
              <div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(255,255,255,0.3)',textTransform:'uppercase',marginBottom:'10px'}}>Deadlines</div>
              {timeline.deadlines.map((d,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 14px',background:'#242442',borderRadius:'10px',marginBottom:'7px'}}>
                  <div><div style={{fontSize:'13px',color:'rgba(255,255,255,0.8)'}}>{d.university}</div><div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)'}}>{d.type}</div></div>
                  <span style={{fontFamily:'JetBrains Mono',fontSize:'12px',color:'#C8FF00'}}>{d.deadline}</span>
                </div>
              ))}
            </div>
          )}
          {(timeline?.document_checklist||[]).length>0 && (
            <div>
              <div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(255,255,255,0.3)',textTransform:'uppercase',marginBottom:'10px'}}>Document Checklist</div>
              {timeline.document_checklist.map((d,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',background:'#242442',borderRadius:'10px',marginBottom:'7px',fontSize:'13px',color:'rgba(255,255,255,0.7)'}}>
                  <div style={{width:'15px',height:'15px',borderRadius:'4px',border:'1.5px solid rgba(255,255,255,0.2)',flexShrink:0}} />
                  <div><div>{d.document}</div>{d.notes&&<div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',marginTop:'2px'}}>{d.notes}</div>}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Agent Logs */}
      {(agent_logs||[]).length>0 && (
        <Section title="Agent Execution Log" emoji="🤖">
          <div style={{paddingTop:'12px'}}>
            {agent_logs.map((l,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'#242442',borderRadius:'10px',marginBottom:'6px'}}>
                <span style={{fontFamily:'JetBrains Mono',fontSize:'12px',color:'rgba(255,255,255,0.6)'}}>{l.agent}</span>
                <div style={{display:'flex',gap:'12px'}}>
                  <span style={{fontSize:'11px',color:'#00C896',fontFamily:'JetBrains Mono'}}>{l.status}</span>
                  <span style={{fontSize:'11px',color:'rgba(255,255,255,0.25)',fontFamily:'JetBrains Mono'}}>{l.ms}ms</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div style={{display:'flex',gap:'12px',marginTop:'24px'}}>
        <button onClick={() => navigate('/counseling/new')} className="btn-volt" style={{flex:1,justifyContent:'center'}}>🧠 New Session</button>
        <button onClick={() => navigate('/dashboard')} className="btn-ghost" style={{flex:1,justifyContent:'center'}}>Dashboard</button>
      </div>
    </div>
  )
}
