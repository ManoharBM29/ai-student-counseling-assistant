// import axios from 'axios'
// import { useAuthStore } from '../store/store'

// const api = axios.create({
//   baseURL: 'https://ai-student-counseling-assistant.onrender.com/api',
//   withCredentials: false
// })

// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// export const register = (d) => api.post('/auth/register', d)
// export const login = (d) => api.post('/auth/login', d)
// export const startSession = (d) => api.post('/counseling/start', d)
// export const getStatus = (id) => api.get(`/counseling/status/${id}`)
// export const getReport = (id) => api.get(`/counseling/report/${id}`)
// export const getSessions = () => api.get('/counseling/sessions')

// export default api


import axios from 'axios'
import { useAuthStore } from '../store/store'

const BACKEND_URL = 'https://ai-student-counseling-assistant.onrender.com'

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
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