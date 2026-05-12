import axios from 'axios'
import { useAuthStore } from '../store/store'

const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api'
  baseURL: 'https://ai-student-counseling-assistant.onrender.com/api'
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const register = (d) => api.post('/auth/register', d)
export const login = (d) => api.post('/auth/login', d)
export const startSession = (d) => api.post('/counseling/start', d)
export const getStatus = (id) => api.get(`/counseling/status/${id}`)
export const getReport = (id) => api.get(`/counseling/report/${id}`)
export const getSessions = () => api.get('/counseling/sessions')

export default api
