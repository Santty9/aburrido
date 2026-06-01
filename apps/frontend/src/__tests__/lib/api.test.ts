import { describe, it, expect, beforeEach } from 'vitest'
import { authApi, profileApi, linkApi, marketplaceApi, changelogApi, premiumApi } from '@/lib/api'

describe('Auth API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should register a new user', async () => {
    const res = await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
    expect(res.success).toBe(true)
    expect(res.data?.profile.username).toBe('testuser')
  })

  it('should login existing user', async () => {
    await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
    const res = await authApi.login({ email: 'test@test.com', password: '123456' })
    expect(res.success).toBe(true)
  })

  it('should return profile via me', async () => {
    await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
    const res = await authApi.me()
    expect(res.success).toBe(true)
    expect(res.data?.username).toBe('testuser')
  })

  it('should fail me without token', async () => {
    const res = await authApi.me()
    expect(res.success).toBe(false)
  })

  it('should handle social login', async () => {
    await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
    const res = await authApi.socialLogin('google')
    expect(res.success).toBe(true)
  })

  it('should handle forgot password', async () => {
    const res = await authApi.forgotPassword('test@test.com')
    expect(res.success).toBe(true)
  })

  it('should handle reset password', async () => {
    const res = await authApi.resetPassword({ token: 'abc', password: 'newpass' })
    expect(res.success).toBe(true)
  })
})

describe('Profile API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return example profile for unknown user', async () => {
    const res = await profileApi.getByUsername('unknown')
    expect(res.success).toBe(true)
    expect(res.data?.display_name).toBe('Usuario Ejemplo')
  })

  it('should return registered user profile', async () => {
    await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
    const res = await profileApi.getByUsername('testuser')
    expect(res.success).toBe(true)
    expect(res.data?.username).toBe('testuser')
  })

  it('should update profile', async () => {
    await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
    const res = await profileApi.update({ display_name: 'New Name' })
    expect(res.success).toBe(true)
    expect(res.data?.display_name).toBe('New Name')
  })

  it('should verify custom domain', async () => {
    await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
    const res = await profileApi.verifyCustomDomain('links.example.com')
    expect(res.success).toBe(true)
    expect(res.data?.verified).toBe(true)
  })

  it('should check username availability', async () => {
    await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
    const res = await profileApi.checkUsername('testuser')
    expect(res.success).toBe(true)
    expect(res.data?.available).toBe(false)
  })
})

describe('Link API', () => {
  beforeEach(async () => {
    localStorage.clear()
    await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
  })

  it('should create a link', async () => {
    const res = await linkApi.create({ title: 'GitHub', url: 'https://github.com', icon: 'globe' })
    expect(res.success).toBe(true)
    expect(res.data?.title).toBe('GitHub')
  })

  it('should get all links', async () => {
    await linkApi.create({ title: 'GitHub', url: 'https://github.com', icon: 'globe' })
    const res = await linkApi.getAll()
    expect(res.success).toBe(true)
    expect(res.data).toHaveLength(1)
  })

  it('should update a link', async () => {
    const created = await linkApi.create({ title: 'GitHub', url: 'https://github.com', icon: 'globe' })
    const res = await linkApi.update(created.data!.id, { title: 'GitLab' })
    expect(res.success).toBe(true)
    expect(res.data?.title).toBe('GitLab')
  })

  it('should delete a link', async () => {
    const created = await linkApi.create({ title: 'GitHub', url: 'https://github.com', icon: 'globe' })
    await linkApi.delete(created.data!.id)
    const all = await linkApi.getAll()
    expect(all.data).toHaveLength(0)
  })

  it('should reorder links', async () => {
    const a = await linkApi.create({ title: 'A', url: 'https://a.com', icon: 'globe' })
    const b = await linkApi.create({ title: 'B', url: 'https://b.com', icon: 'globe' })
    await linkApi.reorder([{ id: a.data!.id, position: 1 }, { id: b.data!.id, position: 0 }])
    const all = await linkApi.getAll()
    expect(all.data![0]?.title).toBe('B')
  })

  it('should create link with scheduled dates', async () => {
    const res = await linkApi.create({
      title: 'Scheduled',
      url: 'https://example.com',
      icon: 'globe',
      scheduled_start: '2026-07-01T00:00:00Z',
      scheduled_end: '2026-08-01T00:00:00Z',
    })
    expect(res.success).toBe(true)
    expect(res.data?.scheduled_start).toBe('2026-07-01T00:00:00Z')
    expect(res.data?.scheduled_end).toBe('2026-08-01T00:00:00Z')
  })

  it('should create link with thumbnail', async () => {
    const res = await linkApi.create({
      title: 'With Thumbnail',
      url: 'https://example.com',
      icon: 'globe',
      thumbnail_url: 'https://example.com/image.jpg',
    })
    expect(res.success).toBe(true)
    expect(res.data?.thumbnail_url).toBe('https://example.com/image.jpg')
  })
})

describe('Changelog API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should get default changelogs', async () => {
    const res = await changelogApi.getAll()
    expect(res.success).toBe(true)
    expect(res.data!.length).toBeGreaterThan(0)
  })

  it('should create a changelog entry', async () => {
    const res = await changelogApi.create({ title: 'Test', content: 'Content', version: '1.0', type: 'feature' })
    expect(res.success).toBe(true)
    expect(res.data?.title).toBe('Test')
  })

  it('should delete a changelog entry', async () => {
    const created = await changelogApi.create({ title: 'Test', content: 'Content', version: '1.0', type: 'feature' })
    await changelogApi.delete(created.data!.id)
    const all = await changelogApi.getAll()
    expect(all.data!.find((e) => e.id === created.data!.id)).toBeUndefined()
  })
})

describe('Marketplace API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return marketplace themes', async () => {
    const res = await marketplaceApi.getAll()
    expect(res.success).toBe(true)
    expect(res.data!.length).toBeGreaterThan(0)
  })
})

describe('Premium API', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return plans', async () => {
    const res = await premiumApi.getPlans()
    expect(res.success).toBe(true)
    expect(res.data!.length).toBe(2)
  })

  it('should activate premium on checkout', async () => {
    await authApi.register({ email: 'test@test.com', password: '123456', username: 'testuser' })
    const res = await premiumApi.createCheckout('price_monthly')
    expect(res.success).toBe(true)
    const me = await authApi.me()
    expect(me.data?.is_premium).toBe(true)
  })
})
