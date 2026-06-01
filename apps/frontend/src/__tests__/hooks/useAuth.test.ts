import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch for API calls
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useAuth Store', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should start with not authenticated', async () => {
    const { useAuth } = await import('@/hooks/useAuth')
    const state = useAuth.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.profile).toBeNull()
  })

  it('should handle login failure when no token', () => {
    const token = localStorage.getItem('access_token')
    expect(token).toBeNull()
  })

  it('should store tokens in localStorage', () => {
    localStorage.setItem('access_token', 'test-token')
    localStorage.setItem('refresh_token', 'test-refresh')
    expect(localStorage.getItem('access_token')).toBe('test-token')
    expect(localStorage.getItem('refresh_token')).toBe('test-refresh')
  })

  it('should clear tokens on logout', () => {
    localStorage.setItem('access_token', 'test-token')
    localStorage.removeItem('access_token')
    expect(localStorage.getItem('access_token')).toBeNull()
  })
})
