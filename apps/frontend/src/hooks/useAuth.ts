import { create } from 'zustand'
import type { Profile } from '@aburrido/shared'
import { authApi } from '@/lib/api'

interface AuthState {
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (email: string, password: string, username: string) => Promise<string | null>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const res = await authApi.login({ email, password })
    if (res.success && res.data) {
      localStorage.setItem('access_token', res.data.session.access_token)
      localStorage.setItem('refresh_token', res.data.session.refresh_token)
      set({ profile: res.data.profile, isAuthenticated: true, isLoading: false })
      return null
    }
    return res.error || 'Error al iniciar sesión'
  },

  register: async (email, password, username) => {
    const res = await authApi.register({ email, password, username })
    if (res.success && res.data) {
      localStorage.setItem('access_token', res.data.session.access_token)
      localStorage.setItem('refresh_token', res.data.session.refresh_token)
      set({ profile: res.data.profile, isAuthenticated: true, isLoading: false })
      return null
    }
    return res.error || 'Error al registrarse'
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ profile: null, isAuthenticated: false, isLoading: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, profile: null })
      return
    }
    try {
      const res = await authApi.me()
      if (res.success && res.data) {
        set({ profile: res.data as Profile, isAuthenticated: true, isLoading: false })
      } else {
        localStorage.removeItem('access_token')
        set({ isLoading: false, isAuthenticated: false, profile: null })
      }
    } catch {
      set({ isLoading: false, isAuthenticated: false, profile: null })
    }
  },
}))
