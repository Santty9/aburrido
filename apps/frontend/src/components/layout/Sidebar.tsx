import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Link2, BarChart3, Sparkles, Settings, Newspaper, Palette, Shield } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export function Sidebar() {
  const { t } = useLanguage()

  const links = [
    { to: '/dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { to: '/editor', label: t('sidebar.editor'), icon: Link2 },
    { to: '/analytics', label: t('sidebar.analytics'), icon: BarChart3 },
    { to: '/premium', label: t('sidebar.premium'), icon: Sparkles },
    { to: '/changelog', label: t('sidebar.changelog'), icon: Newspaper },
    { to: '/personalization', label: t('sidebar.personalization'), icon: Palette },
    { to: '/settings', label: t('sidebar.settings'), icon: Settings },
    { to: '/admin', label: t('sidebar.admin'), icon: Shield },
  ]

  return (
    <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 border-r border-border/50 bg-surface-2/50 backdrop-blur-xl flex-col p-4">
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-aburrido-500/10 text-aburrido-400 border border-aburrido-500/20'
                  : 'text-text-secondary hover:text-white hover:bg-surface-3'
              )
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
