import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Link2, BarChart3, Shield, Palette, Settings, Eye, MousePointerClick,
  Users, Crown, Sparkles, ArrowRight, Copy, Check, ExternalLink, Globe, Zap, ChevronRight,
  Activity, TrendingUp, Clock, Calendar, Star, Hash, Target, Rocket, Bell, QrCode, Share2,
  Download, Wifi, WifiOff, AlertCircle, CheckCircle, XCircle, HelpCircle, Info, PieChart,
  LineChart, Layers, Server, Github, Twitter, Instagram, Youtube, Music, Film, Gamepad2,
  MessageCircle, Gift, Search, Plus, Trash2, Edit3, ToggleLeft, ToggleRight, Lock,
  Key, Fingerprint, Smartphone, Monitor, LogOut, UserPlus, Upload, Image, Type,
  Grid3X3, List, SlidersHorizontal, RefreshCw, MoreHorizontal, Globe2, Bookmark,
  ThumbsUp, HeartHandshake, Award, Medal, Trophy, Swords, ScanLine, Atom,
  Orbit, Waves, Sunset, Snowflake, Cloud, Wind, Droplets, Flame, ZapOff
} from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { linkApi, analyticsApi } from '@/lib/api'
import type { AnalyticsOverview } from '@aburrido/shared'

type NavItem = {
  id: string
  label: string
  icon: typeof LayoutDashboard
  badge?: string | number
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'links', label: 'Links', icon: Link2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'security', label: 'Seguridad', icon: Shield },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'settings', label: 'Ajustes', icon: Settings },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 22 } },
}

const cardClass = 'rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm transition-all duration-300'
const cardHover = 'hover:border-keef-500/25 hover:shadow-lg hover:shadow-keef-500/5'

const linkSocialIconMap: Record<string, typeof Link2> = {
  github: Github, twitter: Twitter, instagram: Instagram, youtube: Youtube,
  discord: MessageCircle, tiktok: Film, twitch: Gamepad2, linkedin: Users,
  spotify: Music, globe: Globe, custom: Link2,
}

export function DashboardPage() {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const [activeNav, setActiveNav] = useState('overview')
  const [links, setLinks] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null)
  const [copied, setCopied] = useState(false)
  const [greeting, setGreeting] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('Buenos dias')
    else if (h < 18) setGreeting('Buenas tardes')
    else setGreeting('Buenas noches')
  }, [])

  useEffect(() => {
    linkApi.getAll().then((res: any) => {
      if (res.success && res.data) setLinks(res.data)
    })
    analyticsApi.getOverview().then((res: any) => {
      if (res.success && res.data) setAnalytics(res.data)
    })
  }, [])

  if (!profile) return null

  const profileUrl = `${window.location.origin}/${profile.username}`
  const visitsValue = profile.total_visits || 0
  const activeLinks = links.filter((l: any) => l.is_active).length
  const totalClicks = links.reduce((sum: number, l: any) => sum + (l.clicks || 0), 0)
  const ctr = visitsValue > 0 ? ((totalClicks / visitsValue) * 100).toFixed(1) : '0.0'
  const uniqueVisitors = analytics?.unique_visitors || 0
  const visitsToday = analytics?.visits_today || 0
  const clicksToday = analytics?.clicks_today || 0

  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const overviewStats = [
    { label: 'Visitas totales', value: visitsValue.toLocaleString(), icon: Eye, change: `+${visitsToday} hoy`, gradient: 'from-keef-500 to-purple-600' },
    { label: 'Links activos', value: `${activeLinks}/${links.length}`, icon: Link2, change: `${links.length - activeLinks} inactivos`, gradient: 'from-sky-400 to-cyan-500' },
    { label: 'Clicks totales', value: totalClicks.toLocaleString(), icon: MousePointerClick, change: `${ctr}% CTR`, gradient: 'from-pink-500 to-rose-500' },
    { label: 'Visitantes unicos', value: uniqueVisitors.toLocaleString(), icon: Users, change: `+${clicksToday} clicks hoy`, gradient: 'from-emerald-500 to-teal-500' },
  ]

  const quickActions = [
    { to: '/editor', label: 'Editor de links', icon: LayoutDashboard, desc: 'Crear y organizar', gradient: 'from-keef-500 to-purple-600' },
    { to: '/personalization', label: 'Personalizar', icon: Palette, desc: 'Temas y colores', gradient: 'from-pink-500 to-rose-600' },
    { to: '/analytics', label: 'Ver analytics', icon: BarChart3, desc: 'Estadisticas', gradient: 'from-emerald-500 to-teal-600' },
    { to: '/premium', label: 'Premium', icon: Crown, desc: 'Funciones exclusivas', gradient: 'from-amber-400 to-orange-500' },
  ]

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    links.forEach((l: any) => {
      const cat = l.category || 'Sin categoria'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [links])

  const renderSidebar = () => (
    <aside className={cn(
      'hidden lg:flex flex-col border-r border-white/5 bg-surface/90 backdrop-blur-xl transition-all duration-300 shrink-0',
      sidebarCollapsed ? 'w-16' : 'w-56'
    )}>
      <div className="flex items-center gap-2.5 h-16 px-4 border-b border-white/5">
        <img src="/logo-keef.png" alt="Keef" className="w-7 h-7 shrink-0" />
        {!sidebarCollapsed && <span className="font-bold text-sm">Keef</span>}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="ml-auto p-1 hover:bg-white/5 rounded-lg transition-colors">
          <ChevronRight className={cn('w-3.5 h-3.5 text-text-secondary transition-transform', sidebarCollapsed && 'rotate-180')} />
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200',
              activeNav === item.id
                ? 'bg-keef-500/10 text-keef-300 border border-keef-500/20'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-transparent'
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full bg-keef-500/20 text-[9px] text-keef-400">{item.badge}</span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>
      <div className="p-2 border-t border-white/5">
        {!sidebarCollapsed && (
          <div className="px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-keef-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                {(profile.display_name || profile.username || 'U')!.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{profile.display_name || profile.username}</p>
                <p className="text-[9px] text-text-secondary truncate">@{profile.username}</p>
              </div>
              <Badge variant={profile.is_premium ? 'premium' : 'default'} className="text-[8px] px-1 py-0">
                {profile.is_premium ? 'PRO' : 'FREE'}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </aside>
  )

  const renderOverview = () => (
    <motion.div key="overview" variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={fadeItem}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{greeting}, {profile.display_name || profile.username}</h1>
              {profile.verification_status === 'verified' && (
                <Shield className="w-4 h-4 text-keef-400 fill-keef-400/20" />
              )}
            </div>
            <p className="text-sm text-text-secondary mt-0.5">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {profile.verification_status === 'unverified' && profile.is_premium && (
              <Link to="/settings">
                <Button variant="secondary" size="sm">
                  <Shield className="w-3.5 h-3.5" /> Verificar
                </Button>
              </Link>
            )}
            {!profile.is_premium && (
              <Link to="/premium">
                <Button variant="premium" size="sm">
                  <Sparkles className="w-3.5 h-3.5" /> {t('dashboard.upgradePremium')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeItem}>
        <div className={cn(cardClass, cardHover, 'relative flex items-center gap-3 px-5 py-3.5 overflow-hidden')}>
          <div className="absolute inset-0 bg-gradient-to-r from-keef-500/5 via-transparent to-pink-500/5 pointer-events-none" />
          <Globe className="w-4 h-4 text-keef-400 shrink-0 relative z-10" />
          <span className="text-xs text-text-secondary shrink-0 relative z-10">{t('dashboard.profileLink')}</span>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-keef-400 hover:text-keef-300 transition-colors truncate flex items-center gap-1 relative z-10">
            {profileUrl} <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
          <div className="flex items-center gap-1 ml-auto shrink-0 relative z-10">
            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><Share2 className="w-3.5 h-3.5 text-text-secondary" /></button>
            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><QrCode className="w-3.5 h-3.5 text-text-secondary" /></button>
            <button onClick={copyUrl} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-text-secondary" />}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeItem} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {overviewStats.map((s) => (
          <div key={s.label} className={cn(cardClass, cardHover, 'relative overflow-hidden p-4 group')}>
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-keef-500/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">{s.label}</span>
                <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center', s.gradient)}>
                  <s.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xl font-bold tracking-tight">{s.value}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">{s.change}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div variants={fadeItem} className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-keef-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Acceso rapido</h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map(({ to, label, icon: Icon, desc, gradient }) => (
              <Link key={to} to={to} className={cn(cardClass, cardHover, 'relative group overflow-hidden p-4')}>
                <div className={cn('absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20', gradient)} />
                <div className="flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg', gradient)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">{desc}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeItem} className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-keef-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Estado de cuenta</h2>
          </div>
          <div className={cn(cardClass, 'divide-y divide-white/5 overflow-hidden')}>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-text-secondary">Plan</span>
              <Badge variant={profile.is_premium ? 'premium' : 'default'} className="text-[10px]">
                {profile.is_premium ? 'Premium' : 'Gratuito'}
              </Badge>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-text-secondary">Usuario</span>
              <span className="text-xs font-mono text-keef-400">@{profile.username}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-text-secondary flex items-center gap-1.5">
                <Shield className="w-3 h-3" /> Verificacion
              </span>
              <Badge variant={profile.verification_status === 'verified' ? 'premium' : profile.verification_status === 'pending' ? 'warning' : 'default'} className="text-[10px]">
                {profile.verification_status === 'verified' ? 'Verificado' : profile.verification_status === 'pending' ? 'Pendiente' : 'Sin verificar'}
              </Badge>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-text-secondary flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Miembro desde
              </span>
              <span className="text-[10px] text-text-secondary">{new Date(profile.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}</span>
            </div>
            {profile.is_premium && profile.premium_since && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-text-secondary flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-amber-400" /> Premium desde
                </span>
                <span className="text-[10px] text-amber-400">{new Date(profile.premium_since).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {!profile.is_premium && (
        <motion.div variants={fadeItem} className={cn(cardClass, 'relative bg-gradient-to-br from-keef-500/10 via-purple-500/5 to-pink-500/10 border-keef-500/20 p-5 text-center overflow-hidden group')}>
          <div className="absolute inset-0 bg-gradient-to-r from-keef-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-keef-500 to-pink-500 flex items-center justify-center shadow-lg shadow-keef-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Desbloquea premium</p>
                <p className="text-[11px] text-text-secondary">Temas exclusivos, analytics avanzados y mas</p>
              </div>
            </div>
            <Link to="/premium">
              <Button variant="premium" size="sm">
                <Crown className="w-3.5 h-3.5" /> Ver planes
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  )

  const renderLinks = () => (
    <motion.div key="links" variants={container} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeItem} className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">Tus Links</h2>
          <p className="text-xs text-text-secondary">{links.length} links ({activeLinks} activos)</p>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-text-secondary">
              {cat} ({count})
            </span>
          ))}
          <Link to="/editor">
            <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" /> Nuevo link
            </Button>
          </Link>
        </div>
      </motion.div>

      {links.length === 0 ? (
        <motion.div variants={fadeItem} className={cn(cardClass, 'p-10 text-center border-dashed border-white/10')}>
          <Link2 className="w-8 h-8 text-text-secondary/30 mx-auto mb-3" />
          <p className="text-sm text-text-secondary">No tenes links todavia</p>
          <p className="text-xs text-text-secondary/60 mt-1">Crea tu primer link en el editor</p>
          <Link to="/editor" className="inline-block mt-4">
            <Button variant="primary" size="sm"><Sparkles className="w-3.5 h-3.5" /> Crear link</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={fadeItem} className="space-y-2">
          {links.map((link: any, i: number) => {
            const IconComp = linkSocialIconMap[link.icon as string] || Link2
            return (
              <div key={link.id} className={cn(cardClass, cardHover, 'flex items-center gap-3 px-4 py-3')}>
                <span className="text-[10px] text-text-secondary/40 w-4 shrink-0">{i + 1}</span>
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', link.is_active ? 'bg-keef-500/10 text-keef-400' : 'bg-surface-3 text-text-secondary/40')}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium truncate">{link.title}</p>
                    {link.featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                    {!link.is_active && <Badge variant="default" className="text-[8px] px-1 py-0">Inactivo</Badge>}
                  </div>
                  <p className="text-[10px] text-text-secondary truncate">{link.url}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold">{link.clicks || 0}</p>
                    <p className="text-[8px] text-text-secondary">clicks</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><Edit3 className="w-3.5 h-3.5 text-text-secondary/60" /></button>
                    <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-text-secondary/60" /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )

  const renderAnalytics = () => (
    <motion.div key="analytics" variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={fadeItem}>
        <h2 className="text-lg font-bold">Analytics</h2>
        <p className="text-xs text-text-secondary">Estadisticas detalladas de tu perfil</p>
      </motion.div>

      <motion.div variants={fadeItem} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Visitas hoy', value: visitsToday, icon: Eye, color: 'text-keef-400', bg: 'bg-keef-500/10' },
          { label: 'Clicks hoy', value: clicksToday, icon: MousePointerClick, color: 'text-pink-400', bg: 'bg-pink-500/10' },
          { label: 'CTR Global', value: `${ctr}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Visitantes unicos', value: uniqueVisitors, icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={cn(cardClass, cardHover, 'p-4')}>
            <div className="flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', bg)}>
                <Icon className={cn('w-4.5 h-4.5', color)} />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary">{label}</p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div variants={fadeItem} className={cn(cardClass, 'p-5')}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-keef-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Visitas por dia</h3>
          </div>
          {analytics && analytics.visits_by_day.length > 0 ? (
            <div className="space-y-2">
              {analytics.visits_by_day.slice(-7).map((day: any) => {
                const maxCount = Math.max(...analytics.visits_by_day.map((d: any) => d.count), 1)
                const pct = (day.count / maxCount) * 100
                return (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-[10px] text-text-secondary w-16 shrink-0">
                      {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 h-5 bg-surface-3/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-keef-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium w-6 text-right">{day.count}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-text-secondary text-center py-6">Sin datos de visitas</p>
          )}
        </motion.div>

        <motion.div variants={fadeItem} className={cn(cardClass, 'p-5')}>
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-keef-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Referentes</h3>
          </div>
          {analytics && analytics.referrers.length > 0 ? (
            <div className="space-y-2">
              {analytics.referrers.map((ref: any) => {
                const total = analytics.referrers.reduce((s: number, r: any) => s + r.count, 0)
                const pct = total > 0 ? (ref.count / total) * 100 : 0
                return (
                  <div key={ref.source} className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary flex-1 capitalize">{ref.source}</span>
                    <div className="w-20 h-2 bg-surface-3/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-keef-500 to-pink-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{ref.count}</span>
                    <span className="text-[10px] text-text-secondary w-8 text-right">{pct.toFixed(0)}%</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-text-secondary text-center py-6">Sin datos de referentes</p>
          )}
        </motion.div>
      </div>

      {analytics && analytics.visits_by_hour.length > 0 && (
        <motion.div variants={fadeItem} className={cn(cardClass, 'p-5')}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-keef-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Actividad por hora (24h)</h3>
          </div>
          <div className="flex items-end gap-1 h-24">
            {analytics.visits_by_hour.map((h: any) => {
              const maxCount = Math.max(...analytics.visits_by_hour.map((x: any) => x.count), 1)
              const height = (h.count / maxCount) * 100
              const isPeak = h.count === maxCount
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-2 border border-border px-2 py-1 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    {h.count} visitas
                  </div>
                  <div className={cn('w-full rounded-sm transition-all duration-300', isPeak ? 'bg-keef-500' : 'bg-keef-500/30 hover:bg-keef-500/50')}
                    style={{ height: `${Math.max(height, 2)}%` }} />
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-text-secondary">00:00</span>
            <span className="text-[10px] text-text-secondary">12:00</span>
            <span className="text-[10px] text-text-secondary">23:00</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )

  const renderSecurity = () => (
    <motion.div key="security" variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={fadeItem}>
        <h2 className="text-lg font-bold">Seguridad</h2>
        <p className="text-xs text-text-secondary">Protege tu cuenta y revisa tu actividad</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-keef-500/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-keef-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Contrasena</h3>
              <p className="text-[10px] text-text-secondary">Ultimo cambio hace 3 meses</p>
            </div>
            <Button variant="secondary" size="sm">Cambiar</Button>
          </div>
        </motion.div>

        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">2FA / Autenticacion</h3>
              <p className="text-[10px] text-text-secondary">Protege tu cuenta con 2FA</p>
            </div>
            <Badge variant="default" className="text-[10px]">Desactivado</Badge>
          </div>
        </motion.div>

        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Sesiones activas</h3>
              <p className="text-[10px] text-text-secondary">2 sesiones activas</p>
            </div>
            <Button variant="secondary" size="sm">Ver</Button>
          </div>
        </motion.div>

        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Cerrar sesion</h3>
              <p className="text-[10px] text-text-secondary">Cerrar sesion en todos los dispositivos</p>
            </div>
            <Button variant="secondary" size="sm">Cerrar</Button>
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeItem} className={cn(cardClass, 'p-5')}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-keef-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Historial de actividad</h3>
        </div>
        <div className="space-y-2">
          {[
            { action: 'Inicio de sesion', detail: 'Chrome - Windows', time: 'Hace 2 horas', icon: Monitor, color: 'text-emerald-400' },
            { action: 'Cambio de contrasena', detail: 'Solicitado desde IP 192.168.x.x', time: 'Hace 3 meses', icon: Key, color: 'text-amber-400' },
            { action: 'Nuevo link creado', detail: 'GitHub', time: 'Hace 1 dia', icon: Link2, color: 'text-keef-400' },
            { action: 'Perfil actualizado', detail: 'Cambio de bio y tema', time: 'Hace 2 dias', icon: Settings, color: 'text-sky-400' },
          ].map(({ action, detail, time, icon: Icon, color }) => (
            <div key={action} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-3/40 transition-colors">
              <div className={cn('w-8 h-8 rounded-lg bg-surface-3/60 flex items-center justify-center', color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{action}</p>
                <p className="text-[10px] text-text-secondary">{detail}</p>
              </div>
              <span className="text-[10px] text-text-secondary/60 shrink-0">{time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )

  const renderAppearance = () => (
    <motion.div key="appearance" variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={fadeItem}>
        <h2 className="text-lg font-bold">Apariencia</h2>
        <p className="text-xs text-text-secondary">Personaliza la apariencia de tu perfil</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-keef-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Tema actual</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-keef-500 to-pink-500" />
            <div>
              <p className="text-sm font-semibold capitalize">{profile.theme?.type || 'Default'}</p>
              <p className="text-[10px] text-text-secondary">Tema oscuro por defecto</p>
            </div>
            <Link to="/personalization" className="ml-auto">
              <Button variant="secondary" size="sm">Cambiar</Button>
            </Link>
          </div>
        </motion.div>

        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-keef-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Fuente</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center">
              <span className="text-lg font-bold text-text-secondary">T</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Inter (Default)</p>
              <p className="text-[10px] text-text-secondary">Fuente del sistema</p>
            </div>
            <Link to="/personalization" className="ml-auto">
              <Button variant="secondary" size="sm">Cambiar</Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeItem} className={cn(cardClass, 'p-5')}>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-keef-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Previsualizacion rapida</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Default', gradient: 'from-keef-500 to-purple-600', active: true },
            { name: 'Midnight', gradient: 'from-sky-600 to-indigo-700', active: false },
            { name: 'Rose', gradient: 'from-pink-500 to-rose-600', active: false },
            { name: 'Emerald', gradient: 'from-emerald-500 to-teal-600', active: false },
          ].map(({ name, gradient, active }) => (
            <button key={name} className={cn('relative rounded-xl p-3 border text-center transition-all duration-200', active ? 'border-keef-500/40 bg-keef-500/5' : 'border-white/5 bg-surface-3/40 hover:border-white/10')}>
              <div className={cn('w-full h-8 rounded-lg bg-gradient-to-br mb-2', gradient)} />
              <p className="text-xs font-medium">{name}</p>
              {active && <Check className="w-3 h-3 text-keef-400 absolute top-1 right-1" />}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )

  const renderSettings = () => (
    <motion.div key="settings" variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={fadeItem}>
        <h2 className="text-lg font-bold">Ajustes</h2>
        <p className="text-xs text-text-secondary">Administra tu cuenta y preferencias</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-keef-500/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-keef-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Perfil</h3>
              <p className="text-[10px] text-text-secondary">Nombre, bio, avatar</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary/40" />
          </div>
        </motion.div>

        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Dominio personalizado</h3>
              <p className="text-[10px] text-text-secondary">{profile.custom_domain || 'No configurado'}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary/40" />
          </div>
        </motion.div>

        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Notificaciones</h3>
              <p className="text-[10px] text-text-secondary">Configura tus alertas</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary/40" />
          </div>
        </motion.div>

        <motion.div variants={fadeItem} className={cn(cardClass, cardHover, 'p-5')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Exportar datos</h3>
              <p className="text-[10px] text-text-secondary">Descarga tus datos</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary/40" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeNav) {
      case 'overview': return renderOverview()
      case 'links': return renderLinks()
      case 'analytics': return renderAnalytics()
      case 'security': return renderSecurity()
      case 'appearance': return renderAppearance()
      case 'settings': return renderSettings()
      default: return renderOverview()
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {renderSidebar()}

      <div className="flex-1 overflow-y-auto">
        <div className="lg:hidden flex items-center gap-2.5 h-14 px-4 border-b border-white/5">
          <img src="/logo-keef.png" alt="Keef" className="w-6 h-6" />
          <div className="flex gap-1 overflow-x-auto flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all shrink-0',
                  activeNav === item.id ? 'bg-keef-500/10 text-keef-300' : 'text-text-secondary'
                )}
              >
                <item.icon className="w-3 h-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
