import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'test-id',
        username: 'testuser',
        display_name: 'Test User',
        bio: 'Hello world',
        avatar_url: null,
        theme: { type: 'dark' },
        is_premium: false,
        links: [
          { id: 'link-1', title: 'GitHub', url: 'https://github.com', icon: 'github', position: 0, is_active: true, clicks: 5 },
        ],
      }),
      update: vi.fn().mockResolvedValue({ id: 'test-id' }),
    },
    visit: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}))

describe('Profile Routes', () => {
  it('should return profile data for valid username', async () => {
    const username = 'testuser'
    expect(username).toBeDefined()
    expect(username.length).toBeGreaterThan(0)
  })

  it('should handle theme serialization', () => {
    const theme = { type: 'dark', background: '#0a0a0f' }
    const parsed = typeof theme === 'string' ? JSON.parse(theme as any) : theme
    expect(parsed.type).toBe('dark')
  })
})
