import { describe, it, expect } from 'vitest'

describe('Input Validation', () => {
  const validUsername = (username: string): boolean => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username)
  }

  const validUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  it('should validate usernames correctly', () => {
    expect(validUsername('testuser')).toBe(true)
    expect(validUsername('user_123')).toBe(true)
    expect(validUsername('ab')).toBe(false)
    expect(validUsername('')).toBe(false)
    expect(validUsername('user name')).toBe(false)
    expect(validUsername('user@name')).toBe(false)
    expect(validUsername('a'.repeat(21))).toBe(false)
  })

  it('should validate URLs correctly', () => {
    expect(validUrl('https://github.com')).toBe(true)
    expect(validUrl('http://example.com')).toBe(true)
    expect(validUrl('not-a-url')).toBe(false)
    expect(validUrl('')).toBe(false)
    expect(validUrl('https://google.com/search?q=test')).toBe(true)
  })
})
