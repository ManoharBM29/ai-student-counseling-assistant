import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/store'
import Navbar from './components/shared/Navbar'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import NewSessionPage from './pages/NewSessionPage'
import LiveAgentsPage from './pages/LiveAgentsPage'
import ReportPage from './pages/ReportPage'

function Protected({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

function WithNav({ children }) {
  return <><Navbar />{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Protected><WithNav><DashboardPage /></WithNav></Protected>} />
        <Route path="/counseling/new" element={<Protected><WithNav><NewSessionPage /></WithNav></Protected>} />
        <Route path="/counseling/:id/live" element={<Protected><WithNav><LiveAgentsPage /></WithNav></Protected>} />
        <Route path="/counseling/:id/report" element={<Protected><WithNav><ReportPage /></WithNav></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
