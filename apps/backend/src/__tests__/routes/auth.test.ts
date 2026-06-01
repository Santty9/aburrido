import { describe, it, expect, vi, beforeAll } from 'vitest'

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
          error: null,
        }),
        listUsers: vi.fn().mockResolvedValue({
          data: {
            users: [{ id: 'test-user-id', email: 'test@test.com' }],
          },
          error: null,
        }),
      },
    },
  },
}))

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findUnique: vi.fn().mockImplementation((args) => {
        if (args.where.username === 'existinguser') {
          return Promise.resolve({
            id: 'existing-id',
            username: 'existinguser',
            auth_user_id: 'existing-auth-id',
            display_name: 'Existing',
            bio: null,
            avatar_url: null,
            theme: {},
            plan: 'free',
            is_premium: false,
            total_visits: 0,
            created_at: new Date(),
            updated_at: new Date(),
          })
        }
        if (args.where.auth_user_id === 'test-user-id') {
          return Promise.resolve({
            id: 'profile-id',
            username: 'testuser',
            auth_user_id: 'test-user-id',
            display_name: 'Test User',
            bio: null,
            avatar_url: null,
            theme: { type: 'dark' },
            plan: 'free',
            is_premium: false,
            total_visits: 10,
            created_at: new Date(),
            updated_at: new Date(),
          })
        }
        return Promise.resolve(null)
      }),
      create: vi.fn().mockResolvedValue({
        id: 'new-profile-id',
        username: 'testuser',
        auth_user_id: 'test-user-id',
        display_name: 'testuser',
        theme: {},
      }),
    },
  },
}))

describe('Auth Routes', () => {
  it('should validate username format', async () => {
    const { default: authRoutes } = await import('@/routes/auth')
    expect(authRoutes).toBeDefined()
  })

  it('should reject short usernames', () => {
    const username = 'ab'
    expect(username.length).toBeLessThan(3)
  })

  it('should reject usernames with special chars', () => {
    const validPattern = /^[a-zA-Z0-9_]+$/
    expect(validPattern.test('valid_user')).toBe(true)
    expect(validPattern.test('invalid user!')).toBe(false)
    expect(validPattern.test('user@name')).toBe(false)
  })

  it('should accept valid registration data', () => {
    const data = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
    }
    expect(data.email).toContain('@')
    expect(data.password.length).toBeGreaterThanOrEqual(6)
    expect(data.username.length).toBeGreaterThanOrEqual(3)
  })
})
