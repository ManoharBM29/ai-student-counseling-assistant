import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth' }
  )
)

export const useCounselingStore = create((set) => ({
  currentSession: null,
  setSession: (s) => set({ currentSession: s }),
  clearSession: () => set({ currentSession: null }),
}))
