import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { Button } from '@/components/ui/button'
import { Sparkles, LogOut, LayoutDashboard, Menu, X, Globe, ChevronDown, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { isAuthenticated, profile, logout } = useAuth()
  const { t, lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-surface/80 backdrop-blur-xl">
      <div className="container-main flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="gradient-text">Keef</span>
          <span className="hidden sm:inline text-text-secondary font-normal text-sm">/ {t('nav.tagline')}</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/changelog" className="px-3 py-2 text-sm text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-surface-2">
            {t('nav.changelog')}
          </Link>
          <Link to="/marketplace" className="px-3 py-2 text-sm text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-surface-2">
            Marketplace
          </Link>

          <div className="w-px h-5 bg-border mx-2" />

          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-surface-2"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          {isAuthenticated ? (
            <div className="relative flex items-center gap-2 ml-2" ref={menuRef}>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.dashboard')}
                </Button>
              </Link>
              {!profile?.is_premium && (
                <Link to="/premium">
                  <Button variant="premium" size="sm">
                    <Sparkles className="w-4 h-4" />
                    {t('nav.premium')}
                  </Button>
                </Link>
              )}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-2 transition-colors border border-transparent hover:border-border"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-keef-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                  {(profile?.display_name || profile?.username || 'U')!.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className={cn('w-3.5 h-3.5 text-text-secondary transition-transform', userMenuOpen && 'rotate-180')} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-2 border border-border rounded-xl shadow-2xl shadow-black/40 py-1 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium truncate">{profile?.display_name || profile?.username}</p>
                    <p className="text-xs text-text-tertiary truncate">@{profile?.username}</p>
                  </div>
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-surface-3 transition-colors" onClick={() => setUserMenuOpen(false)}>
                    <User className="w-3.5 h-3.5" />
                    {t('nav.settings')}
                  </Link>
                  <button onClick={() => { handleLogout(); setUserMenuOpen(false) }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-text-secondary hover:text-error hover:bg-error/5 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">{t('nav.register')}</Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 hover:bg-surface-2 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border/50 bg-surface/95 backdrop-blur-xl">
          <div className="container-main py-4 space-y-1">
            <Link to="/changelog" className="block px-4 py-2.5 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
              {t('nav.changelog')}
            </Link>
            <Link to="/marketplace" className="block px-4 py-2.5 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
              Marketplace
            </Link>
            <button
              onClick={() => { setLang(lang === 'es' ? 'en' : 'es'); setIsOpen(false) }}
              className="flex items-center gap-1.5 w-full px-4 py-2.5 text-sm hover:bg-surface-2 rounded-lg"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'es' ? 'English' : 'Español'}
            </button>
            <div className="border-t border-border my-2" />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2.5 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
                  {t('nav.dashboard')}
                </Link>
                <Link to="/premium" className="block px-4 py-2.5 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
                  {t('nav.premium')}
                </Link>
                <Link to="/settings" className="block px-4 py-2.5 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
                  {t('nav.settings')}
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false) }} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-surface-2 rounded-lg text-error">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2.5 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="block px-4 py-2.5 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
