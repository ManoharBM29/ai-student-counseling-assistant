import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import { useAuthStore } from '../store/store'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await register(form)
      setAuth(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',background:'#0D0D0D'}}>
      <div style={{width:'100%',maxWidth:'420px'}}>
        <div style={{textAlign:'center',marginBottom:'36px'}}>
          <p style={{color:'rgba(255,255,255,0.3)',fontFamily:'JetBrains Mono',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'8px'}}>EduPath AI Counseling</p>
          <h1 style={{fontFamily:'Syne',fontWeight:800,fontSize:'36px',margin:'0 0 8px'}}>Get started<span style={{color:'#C8FF00'}}>.</span></h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:'14px',margin:0}}>Create your free account</p>
        </div>
        <div style={{background:'#1A1A2E',borderRadius:'20px',border:'1px solid rgba(255,255,255,0.07)',padding:'32px'}}>
          <form onSubmit={handleSubmit}>
            {[
              {key:'name',label:'Full Name',type:'text',ph:'Ravi Kumar'},
              {key:'email',label:'Email',type:'email',ph:'you@example.com'},
              {key:'password',label:'Password',type:'password',ph:'••••••••'},
            ].map(({key,label,type,ph}) => (
              <div key={key} style={{marginBottom:'18px'}}>
                <label style={{display:'block',fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'8px'}}>{label}</label>
                <input type={type} required className="input-field" placeholder={ph}
                  value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} />
              </div>
            ))}
            {error && <div style={{background:'rgba(255,92,53,0.1)',border:'1px solid rgba(255,92,53,0.3)',borderRadius:'10px',padding:'12px 14px',color:'#FF5C35',fontSize:'13px',marginBottom:'16px'}}>{error}</div>}
            <button type="submit" disabled={loading} className="btn-volt" style={{width:'100%',justifyContent:'center',padding:'13px'}}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={{textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:'13px',marginTop:'20px'}}>
            Already have account? <Link to="/login" style={{color:'#C8FF00',textDecoration:'none'}}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
