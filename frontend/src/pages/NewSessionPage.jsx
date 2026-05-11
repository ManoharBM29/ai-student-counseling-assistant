import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startSession } from '../services/api'

export default function NewSessionPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [form, setForm] = useState({
    student_goal: '', target_degree: '', target_field: '',
    target_country: '', budget_usd: '', gpa: '',
    english_test: '', english_score: '', work_experience: 0, skills: []
  })

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] })
      setSkillInput('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.student_goal.trim()) { setError('Please describe your goal'); return }
    setLoading(true); setError('')
    try {
      const payload = {
        ...form,
        budget_usd: form.budget_usd ? parseInt(form.budget_usd) : null,
        gpa: form.gpa ? parseFloat(form.gpa) : null,
        english_score: form.english_score ? parseFloat(form.english_score) : null,
        work_experience: parseInt(form.work_experience) || 0,
      }
      const { data } = await startSession(payload)
      navigate(`/counseling/${data.session_id}/live`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start. Is backend running?')
    } finally { setLoading(false) }
  }

  const inputStyle = {width:'100%',background:'#242442',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'11px 14px',color:'#f5f5f5',fontFamily:'DM Sans',fontSize:'14px',outline:'none',boxSizing:'border-box'}
  const labelStyle = {display:'block',fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'7px'}
  const cardStyle = {background:'#1A1A2E',borderRadius:'16px',border:'1px solid rgba(255,255,255,0.05)',padding:'22px',marginBottom:'14px'}
  const sectionLabel = {fontFamily:'JetBrains Mono',fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.12em',color:'rgba(255,255,255,0.35)',marginBottom:'14px',display:'block'}

  return (
    <div style={{maxWidth:'680px',margin:'0 auto',padding:'88px 24px 60px'}}>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Syne',fontWeight:800,fontSize:'26px',marginBottom:'6px'}}>New Counseling Session<span style={{color:'#C8FF00'}}>.</span></h1>
        <p style={{color:'rgba(255,255,255,0.38)',fontSize:'13px',margin:0}}>8 AI agents will analyze your profile and generate a complete action plan</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <span style={sectionLabel}>Your Goal *</span>
          <textarea required rows={3} style={{...inputStyle,resize:'none'}}
            placeholder="e.g. I want to do MS in AI at a top US university. GPA 8.2, IELTS 7.0, budget $40k/year, 1 year ML experience..."
            value={form.student_goal}
            onChange={e => setForm({...form, student_goal: e.target.value})} />
          <p style={{color:'rgba(255,255,255,0.25)',fontSize:'12px',marginTop:'8px',marginBottom:0}}>Be as detailed as possible — AI uses this to personalize everything</p>
        </div>

        <div style={cardStyle}>
          <span style={sectionLabel}>Academic Details</span>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            {[
              {key:'target_degree',label:'Target Degree',type:'select',opts:['','Bachelors','Masters','MBA','PhD']},
              {key:'target_field',label:'Target Field',type:'text',ph:'e.g. Artificial Intelligence'},
              {key:'target_country',label:'Target Country',type:'text',ph:'e.g. USA, UK, Canada'},
              {key:'budget_usd',label:'Budget (USD/year)',type:'number',ph:'e.g. 40000'},
              {key:'gpa',label:'GPA / Percentage',type:'number',ph:'e.g. 8.2'},
              {key:'work_experience',label:'Work Experience (yrs)',type:'number',ph:'0'},
              {key:'english_test',label:'English Test',type:'select',opts:['','IELTS','TOEFL','PTE','Duolingo','None']},
              {key:'english_score',label:'Test Score',type:'number',ph:'e.g. 7.0'},
            ].map(({key,label,type,ph,opts}) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                {type === 'select' ? (
                  <select style={inputStyle} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})}>
                    {opts.map(o => <option key={o} value={o}>{o || 'Select...'}</option>)}
                  </select>
                ) : (
                  <input type={type} style={inputStyle} placeholder={ph} step={type==='number'?'any':undefined}
                    value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <span style={sectionLabel}>Your Skills</span>
          <div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>
            <input style={{...inputStyle,flex:1}} placeholder="e.g. Python, Machine Learning, React"
              value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => {if(e.key==='Enter'){e.preventDefault();addSkill()}}} />
            <button type="button" onClick={addSkill}
              style={{background:'rgba(200,255,0,0.1)',color:'#C8FF00',border:'1px solid rgba(200,255,0,0.2)',borderRadius:'10px',padding:'0 14px',cursor:'pointer',fontSize:'18px',flexShrink:0}}>+</button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
            {form.skills.map((s, i) => (
              <span key={i} style={{display:'flex',alignItems:'center',gap:'5px',background:'#242442',color:'rgba(255,255,255,0.7)',fontSize:'12px',padding:'5px 10px',borderRadius:'100px'}}>
                {s}
                <button type="button" onClick={() => setForm({...form, skills: form.skills.filter((_,idx)=>idx!==i)})}
                  style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',cursor:'pointer',fontSize:'14px',padding:0,lineHeight:1}}>×</button>
              </span>
            ))}
          </div>
        </div>

        {error && <div style={{background:'rgba(255,92,53,0.1)',border:'1px solid rgba(255,92,53,0.3)',borderRadius:'12px',padding:'12px 16px',color:'#FF5C35',fontSize:'13px',marginBottom:'16px'}}>{error}</div>}

        <button type="submit" disabled={loading} className="btn-volt" style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:'15px'}}>
          {loading ? '⏳ Starting agents...' : '🧠 Launch AI Counseling'}
        </button>
      </form>
    </div>
  )
}
