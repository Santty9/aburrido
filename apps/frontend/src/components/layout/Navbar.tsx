import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { Button } from '@/components/ui/button'
import { Sparkles, LogOut, LayoutDashboard, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { isAuthenticated, profile, logout } = useAuth()
  const { t, lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-surface/80 backdrop-blur-xl">
      <div className="container-main flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold gradient-text">
          Aburrido
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/changelog" className="text-sm text-text-secondary hover:text-white transition-colors">
            {t('nav.changelog')}
          </Link>
          <Link to="/marketplace" className="text-sm text-text-secondary hover:text-white transition-colors">
            Marketplace
          </Link>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-surface-2"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          {isAuthenticated ? (
            <>
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
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">{t('nav.register')}</Button>
              </Link>
            </>
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
          <div className="container-main py-4 space-y-2">
            <Link to="/changelog" className="block px-4 py-2 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
              {t('nav.changelog')}
            </Link>
            <Link to="/marketplace" className="block px-4 py-2 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
              Marketplace
            </Link>
            {/* Language Switcher Mobile */}
            <button
              onClick={() => { setLang(lang === 'es' ? 'en' : 'es'); setIsOpen(false) }}
              className="flex items-center gap-1.5 w-full px-4 py-2 text-sm hover:bg-surface-2 rounded-lg"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'es' ? 'English' : 'Español'}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
                  {t('nav.dashboard')}
                </Link>
                <Link to="/premium" className="block px-4 py-2 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
                  {t('nav.premium')}
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-surface-2 rounded-lg">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="block px-4 py-2 text-sm hover:bg-surface-2 rounded-lg" onClick={() => setIsOpen(false)}>
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
