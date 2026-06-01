import { NavLink, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Link2, BarChart3, Sparkles, Settings, Newspaper, Palette, Shield, User, ChevronRight, LogOut } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'

const mainLinks = [
  { to: '/dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
  { to: '/editor', labelKey: 'sidebar.editor', icon: Link2 },
  { to: '/analytics', labelKey: 'sidebar.analytics', icon: BarChart3 },
]

const customizeLinks = [
  { to: '/personalization', labelKey: 'sidebar.personalization', icon: Palette },
  { to: '/settings', labelKey: 'sidebar.settings', icon: Settings },
]

const infoLinks = [
  { to: '/changelog', labelKey: 'sidebar.changelog', icon: Newspaper },
  { to: '/premium', labelKey: 'sidebar.premium', icon: Sparkles },
  { to: '/admin', labelKey: 'sidebar.admin', icon: Shield },
]

export function Sidebar() {
  const { t } = useLanguage()
  const { profile, logout } = useAuth()

  const currentPlan = profile?.is_premium ? 'Premium' : 'Free'

  const renderLinks = (links: { to: string; labelKey: string; icon: any }[]) => links.map(({ to, labelKey, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-keef-500/10 text-keef-400 border border-keef-500/20 shadow-sm'
            : 'text-text-secondary hover:text-white hover:bg-surface-3'
        )
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{t(labelKey as any)}</span>
    </NavLink>
  ))

  return (
    <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 border-r border-border/50 bg-surface-2/50 backdrop-blur-xl flex-col py-4">
      {/* Brand */}
      <div className="px-4 mb-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-keef-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-keef-500/20">
            K
          </div>
          <div>
            <span className="text-base font-bold">Keef</span>
            <p className="text-[10px] text-text-secondary leading-none mt-0.5">{t('sidebar.dashboard')}</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="px-3 mb-6">
        <p className="px-3 text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-2">{t('sidebar.dashboard')}</p>
        <nav className="space-y-1">
          {renderLinks(mainLinks)}
        </nav>
      </div>

      {/* Customize */}
      <div className="px-3 mb-6">
        <p className="px-3 text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-2">{t('sidebar.personalization')}</p>
        <nav className="space-y-1">
          {renderLinks(customizeLinks)}
        </nav>
      </div>

      {/* Info */}
      <div className="px-3 mb-6">
        <p className="px-3 text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-2">{t('sidebar.changelog')}</p>
        <nav className="space-y-1">
          {renderLinks(infoLinks)}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Premium Upsell */}
      {!profile?.is_premium && (
        <div className="mx-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-keef-500/10 to-pink-500/10 border border-keef-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-keef-400" />
            <span className="text-sm font-semibold">{t('dashboard.upgradePremium')}</span>
          </div>
          <p className="text-xs text-text-secondary mb-3">{t('home.premium.subtitle')}</p>
          <Link
            to="/premium"
            className="flex items-center justify-between w-full px-3 py-2 bg-keef-500 hover:bg-keef-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {t('home.premium.cta')}
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* User Section */}
      <div className="border-t border-border/50 pt-3 mx-3">
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-keef-500/20 flex items-center justify-center">
            <User className="w-4 h-4 text-keef-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.username || 'User'}</p>
            <p className="text-xs text-text-secondary">{currentPlan}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-surface-3 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
