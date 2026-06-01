import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { es } from '@/i18n/es'
import { en } from '@/i18n/en'
import type { Translations } from '@/i18n/es'

type Language = 'es' | 'en'

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: keyof Translations, params?: Record<string, string | number>) => string
}

const translations: Record<Language, Translations> = { es, en }

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'es'
  const stored = localStorage.getItem('keef_lang') as Language | null
  if (stored === 'es' || stored === 'en') return stored
  const navLang = navigator.language?.startsWith('en') ? 'en' : 'es'
  return navLang as Language
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLanguage)

  const t: LanguageContextValue['t'] = useCallback((key, params) => {
    let text = translations[lang]?.[key]
    if (!text) {
      text = translations.es[key]
      if (!text) return key
    }
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{{${k}}}`, String(v))
      }
    }
    return text
  }, [lang])

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('keef_lang', newLang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
