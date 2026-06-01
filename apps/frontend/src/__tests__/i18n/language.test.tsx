import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage'
import type { Translations } from '@/i18n/es'

function TestComponent() {
  const { t, lang, setLang } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="t">{t('common.save')}</span>
      <button data-testid="switch-en" onClick={() => setLang('en')}>EN</button>
      <button data-testid="switch-es" onClick={() => setLang('es')}>ES</button>
      <span data-testid="missing-key">{t('nonexistent.key' as keyof Translations)}</span>
    </div>
  )
}

describe('Language Provider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should default to English in jsdom environment', () => {
    render(<LanguageProvider><TestComponent /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('en')
  })

  it('should translate known keys in English by default', () => {
    render(<LanguageProvider><TestComponent /></LanguageProvider>)
    expect(screen.getByTestId('t').textContent).toBe('Save')
  })

  it('should switch to Spanish', () => {
    render(<LanguageProvider><TestComponent /></LanguageProvider>)
    fireEvent.click(screen.getByTestId('switch-es'))
    expect(screen.getByTestId('lang').textContent).toBe('es')
    expect(screen.getByTestId('t').textContent).toBe('Guardar')
  })

  it('should switch back to English', () => {
    render(<LanguageProvider><TestComponent /></LanguageProvider>)
    fireEvent.click(screen.getByTestId('switch-es'))
    fireEvent.click(screen.getByTestId('switch-en'))
    expect(screen.getByTestId('lang').textContent).toBe('en')
    expect(screen.getByTestId('t').textContent).toBe('Save')
  })

  it('should return key for missing translations', () => {
    render(<LanguageProvider><TestComponent /></LanguageProvider>)
    expect(screen.getByTestId('missing-key').textContent).toBe('nonexistent.key')
  })

  it('should persist language in localStorage', () => {
    render(<LanguageProvider><TestComponent /></LanguageProvider>)
    fireEvent.click(screen.getByTestId('switch-es'))
    expect(localStorage.getItem('aburrido_lang')).toBe('es')
  })

  it('should use stored language from localStorage', () => {
    localStorage.setItem('aburrido_lang', 'es')
    render(<LanguageProvider><TestComponent /></LanguageProvider>)
    expect(screen.getByTestId('lang').textContent).toBe('es')
  })
})
