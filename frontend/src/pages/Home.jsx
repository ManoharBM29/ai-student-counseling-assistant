import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const agents = [
    {e:'🧠',n:'OrchestratorAgent',d:'Master brain — coordinates all 7 agents'},
    {e:'👤',n:'ProfilerAgent',d:'Analyzes academic background & readiness'},
    {e:'📊',n:'SkillGapAgent',d:'Identifies missing skills + course recommendations'},
    {e:'🎓',n:'UniversityAgent',d:'Matches Safe / Target / Reach universities'},
    {e:'✍️',n:'SOPWriterAgent',d:'Writes personalized Statement of Purpose'},
    {e:'🔍',n:'SOPReviewerAgent',d:'Reviews & scores SOP with improvement tips'},
    {e:'🎤',n:'InterviewCoachAgent',d:'Generates interview questions + prep guide'},
    {e:'📅',n:'TrackerAgent',d:'Builds deadline calendar & document checklist'},
  ]
  return (
    <div style={{minHeight:'100vh',background:'#0D0D0D'}}>
      <nav style={{position:'fixed',top:0,left:0,right:0,height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',background:'rgba(13,13,13,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.05)',zIndex:100}}>
        <span style={{fontFamily:'Syne',fontWeight:800,fontSize:'17px'}}>EduPath <span style={{color:'#C8FF00',fontFamily:'JetBrains Mono',fontSize:'11px',fontWeight:400}}>AI Counseling</span></span>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={() => navigate('/login')} style={{background:'none',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.6)',padding:'8px 18px',borderRadius:'10px',cursor:'pointer',fontSize:'13px'}}>Sign In</button>
          <button onClick={() => navigate('/register')} style={{background:'#C8FF00',color:'#0D0D0D',padding:'8px 18px',borderRadius:'10px',cursor:'pointer',fontSize:'13px',fontWeight:700,border:'none'}}>Get Started</button>
        </div>
      </nav>

      <section style={{paddingTop:'140px',paddingBottom:'60px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'80px',left:'50%',transform:'translateX(-50%)',width:'500px',height:'300px',background:'radial-gradient(ellipse,rgba(200,255,0,0.06) 0%,transparent 70%)',pointerEvents:'none'}} />
        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(200,255,0,0.08)',border:'1px solid rgba(200,255,0,0.2)',color:'#C8FF00',padding:'6px 14px',borderRadius:'100px',fontSize:'11px',fontFamily:'JetBrains Mono',marginBottom:'24px'}}>
          <span style={{width:'6px',height:'6px',background:'#C8FF00',borderRadius:'50%',animation:'pulse 1.5s infinite'}} />
          Module · EduPath University Management Platform · 8 AI Agents
        </div>
        <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.5}}`}</style>
        <h1 style={{fontFamily:'Syne',fontWeight:800,fontSize:'clamp(36px,6vw,64px)',lineHeight:1.05,margin:'0 0 18px'}}>
          AI Student<br/><span style={{color:'#C8FF00'}}>Counseling</span><br/>Assistant
        </h1>
        <p style={{color:'rgba(255,255,255,0.45)',fontSize:'16px',maxWidth:'480px',margin:'0 auto 32px',lineHeight:1.7}}>
          A multi-agent GenAI system that automates the entire student counseling workflow — university matching, SOP writing, interview prep and more.
        </p>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={() => navigate('/register')} style={{background:'#C8FF00',color:'#0D0D0D',padding:'13px 32px',borderRadius:'12px',fontSize:'15px',fontWeight:700,border:'none',cursor:'pointer'}}>🧠 Start Counseling →</button>
          <button onClick={() => navigate('/login')} style={{background:'none',border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.6)',padding:'13px 32px',borderRadius:'12px',fontSize:'15px',cursor:'pointer'}}>Sign In</button>
        </div>
      </section>

      <section style={{padding:'20px 24px 40px'}}>
        <div style={{maxWidth:'700px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
          {[{v:'8',l:'AI Agents'},{v:'9',l:'DB Tables'},{v:'2 min',l:'Full Counseling'},{v:'9 hrs',l:'Saved/Student'}].map(({v,l})=>(
            <div key={l} style={{background:'#1A1A2E',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'14px',padding:'18px',textAlign:'center'}}>
              <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'28px',color:'#C8FF00',marginBottom:'4px'}}>{v}</div>
              <div style={{color:'rgba(255,255,255,0.35)',fontSize:'12px'}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'20px 24px 40px'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <p style={{textAlign:'center',fontFamily:'JetBrains Mono',fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.12em',color:'rgba(255,255,255,0.25)',marginBottom:'18px'}}>8 Specialized AI Agents</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            {agents.map((a,i)=>(
              <div key={a.n} style={{background:'#1A1A2E',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'12px',padding:'16px',display:'flex',gap:'12px'}}>
                <div style={{fontSize:'22px',flexShrink:0}}>{a.e}</div>
                <div>
                  <div style={{fontFamily:'JetBrains Mono',fontSize:'9px',color:'rgba(200,255,0,0.5)',marginBottom:'3px'}}>Agent {i+1}</div>
                  <div style={{fontFamily:'Syne',fontWeight:700,fontSize:'13px',marginBottom:'3px'}}>{a.n}</div>
                  <div style={{fontSize:'12px',color:'rgba(255,255,255,0.38)'}}>{a.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'40px 24px 60px',textAlign:'center'}}>
        <h2 style={{fontFamily:'Syne',fontWeight:800,fontSize:'28px',marginBottom:'12px'}}>Ready to get started?</h2>
        <p style={{color:'rgba(255,255,255,0.4)',marginBottom:'24px'}}>Free. No credit card. Complete counseling in 2 minutes.</p>
        <button onClick={() => navigate('/register')} style={{background:'#C8FF00',color:'#0D0D0D',padding:'14px 40px',borderRadius:'12px',fontSize:'15px',fontWeight:700,border:'none',cursor:'pointer'}}>🧠 Start AI Counseling</button>
      </section>

      <footer style={{borderTop:'1px solid rgba(255,255,255,0.05)',padding:'20px 24px',textAlign:'center'}}>
        <p style={{color:'rgba(255,255,255,0.2)',fontSize:'12px',fontFamily:'JetBrains Mono',margin:0}}>AI Student Counseling Assistant · Module contribution to EduPath University Management Platform</p>
      </footer>
    </div>
  )
}
