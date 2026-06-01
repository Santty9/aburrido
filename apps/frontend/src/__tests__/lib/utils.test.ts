import { describe, it, expect } from 'vitest'
import { cn, formatDate, formatNumber, truncate, getInitials, getDomainFromUrl, isValidUrl } from '@/lib/utils'

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('should merge tailwind classes', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })
})

describe('formatNumber', () => {
  it('should format thousands', () => {
    expect(formatNumber(1500)).toBe('1.5K')
  })

  it('should format millions', () => {
    expect(formatNumber(2500000)).toBe('2.5M')
  })

  it('should return string for small numbers', () => {
    expect(formatNumber(999)).toBe('999')
  })
})

describe('truncate', () => {
  it('should truncate long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...')
  })

  it('should not truncate short strings', () => {
    expect(truncate('Hi', 5)).toBe('Hi')
  })
})

describe('getInitials', () => {
  it('should get initials from name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should handle single name', () => {
    expect(getInitials('John')).toBe('J')
  })
})

describe('getDomainFromUrl', () => {
  it('should extract domain from URL', () => {
    expect(getDomainFromUrl('https://www.github.com')).toBe('github.com')
    expect(getDomainFromUrl('https://google.com/search')).toBe('google.com')
  })
})

describe('isValidUrl', () => {
  it('should validate URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('not-a-url')).toBe(false)
  })
})
