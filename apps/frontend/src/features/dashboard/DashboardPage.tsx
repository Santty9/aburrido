import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  ExternalLink, Link2, Eye, Sparkles, ArrowRight, Copy, Check, Users, Clock, Calendar,
  TrendingUp, Activity, Settings, Palette, Crown, Globe, MousePointerClick, Hash, Shield,
  Zap, ChevronRight, Target, BarChart3, LayoutGrid, Rocket, Star, Gift, Bell,
  Download, Share2, QrCode, Grid3X3, Ticket, Percent, Phone, Mail, MessageCircle,
  Wifi, WifiOff, AlertCircle, CheckCircle, XCircle, HelpCircle, Info, PieChart,
  LineChart, Layers, Server, Github, Twitter, Instagram, Youtube, Music,
  Film, Camera, BookOpen, Coffee, Dumbbell, Gamepad2, Heart, Globe2, Smile
} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { linkApi, analyticsApi } from '@/lib/api'
import type { AnalyticsOverview } from '@aburrido/shared'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
}

type SectionKey = 'overview' | 'quick' | 'account' | 'activity' | 'performance' | 'links' | 'upgrade'

const sections: { key: SectionKey; label: string; icon: typeof Zap }[] = [
  { key: 'overview', label: 'Resumen', icon: Eye },
  { key: 'quick', label: 'Acceso rapido', icon: Zap },
  { key: 'account', label: 'Cuenta', icon: Shield },
  { key: 'performance', label: 'Rendimiento', icon: TrendingUp },
  { key: 'links', label: 'Tus Links', icon: Link2 },
  { key: 'activity', label: 'Actividad', icon: Activity },
]

export function DashboardPage() {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [links, setLinks] = useState<{ id: string; title: string; url: string; icon: string; clicks: number; is_active: boolean; category?: string; featured?: boolean }[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null)
  const [activeSection, setActiveSection] = useState<SectionKey>('overview')
  const [showAllLinks, setShowAllLinks] = useState(false)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('Buenos dias')
    else if (h < 18) setGreeting('Buenas tardes')
    else setGreeting('Buenas noches')
  }, [])

  useEffect(() => {
    linkApi.getAll().then((res) => {
      if (res.success && res.data) {
        setLinks(res.data as typeof links)
      }
    })
    analyticsApi.getOverview().then((res) => {
      if (res.success && res.data) {
        setAnalytics(res.data)
      }
    })
  }, [])

  if (!profile) return null

  const profileUrl = `${window.location.origin}/${profile.username}`

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const visitsValue = profile.total_visits || 0
  const activeLinks = links.filter((l) => l.is_active).length
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0)
  const ctr = visitsValue > 0 ? ((totalClicks / visitsValue) * 100).toFixed(1) : '0.0'
  const uniqueVisitors = analytics?.unique_visitors || 0
  const visitsToday = analytics?.visits_today || 0
  const clicksToday = analytics?.clicks_today || 0
  const inactiveLinks = links.filter((l) => !l.is_active).length

  const stats = [
    { label: 'Visitas totales', value: visitsValue.toLocaleString(), icon: Eye, change: '+23%', gradient: 'from-keef-500 to-purple-600' },
    { label: 'Links activos', value: `${activeLinks}/${links.length}`, icon: Link2, change: `${inactiveLinks} inactivos`, gradient: 'from-sky-400 to-cyan-500' },
    { label: 'Clicks totales', value: totalClicks.toLocaleString(), icon: MousePointerClick, change: `${ctr}% CTR`, gradient: 'from-pink-500 to-rose-500' },
    { label: 'Visitantes unicos', value: uniqueVisitors.toLocaleString(), icon: Users, change: `+${visitsToday} hoy`, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Plan', value: profile.is_premium ? 'Premium' : 'Gratuito', icon: Crown, change: profile.is_premium ? 'Desde ' + (profile.premium_since ? new Date(profile.premium_since).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : 'siempre') : 'Mejorar', gradient: 'from-amber-400 to-orange-500' },
    { label: 'Confianza', value: `${profile.trust_score || 0}/100`, icon: Shield, change: profile.verification_status === 'verified' ? 'Verificado' : profile.verification_status === 'pending' ? 'Pendiente' : 'Sin verificar', gradient: 'from-violet-500 to-indigo-500' },
  ]

  const quickActions = [
    { to: '/editor', label: 'Editor', desc: 'Crear y organizar links', icon: LayoutGrid, gradient: 'from-keef-500 to-purple-600', color: 'text-keef-400' },
    { to: '/analytics', label: 'Analytics', desc: 'Estadisticas detalladas', icon: BarChart3, gradient: 'from-emerald-500 to-teal-600', color: 'text-emerald-400' },
    { to: '/personalization', label: 'Personalizar', desc: 'Temas, colores y fuentes', icon: Palette, gradient: 'from-pink-500 to-rose-600', color: 'text-pink-400' },
    { to: '/settings', label: 'Ajustes', desc: 'Perfil, dominio y mas', icon: Settings, gradient: 'from-amber-500 to-orange-600', color: 'text-amber-400' },
    { to: '/premium', label: 'Premium', desc: 'Funciones exclusivas', icon: Crown, gradient: 'from-amber-400 to-yellow-500', color: 'text-amber-300' },
    { to: '/marketplace', label: 'Tienda', desc: 'Temas y badges', icon: Gift, gradient: 'from-rose-500 to-pink-600', color: 'text-rose-400' },
  ]

  const displayedLinks = showAllLinks ? links : links.slice(0, 4)

  const performanceMetrics = [
    { label: 'Visitas Hoy', value: visitsToday, icon: Eye, color: 'text-keef-400', bg: 'bg-keef-500/10' },
    { label: 'Clicks Hoy', value: clicksToday, icon: MousePointerClick, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'CTR Global', value: `${ctr}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Links Creados', value: links.length, icon: Link2, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  ]

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    links.forEach((l) => {
      const cat = l.category || 'Sin categoria'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [links])

  const categories = Object.keys(categoryCounts)

  const linkSocialIcons: Record<string, typeof Github> = {
    github: Github, twitter: Twitter, instagram: Instagram, youtube: Youtube,
    discord: MessageCircle, tiktok: Film, twitch: Gamepad2, linkedin: Users,
    spotify: Music, globe: Globe, custom: Link2,
  }

  const renderSectionNav = () => (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {sections.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveSection(key)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border',
            activeSection === key
              ? 'bg-keef-500/10 border-keef-500/30 text-keef-300 shadow-sm'
              : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2'
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  )

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-5 pb-8">
      <motion.div variants={item} className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-keef-400 to-pink-400 bg-clip-text text-transparent">
              {greeting}, {profile.display_name || profile.username}
            </h1>
            {profile.verification_status === 'verified' && (
              <Shield className="w-5 h-5 text-keef-400 fill-keef-400/20" />
            )}
          </div>
          <p className="text-sm text-text-secondary flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-keef-400" />
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {profile.verification_status === 'unverified' && profile.is_premium && (
            <Link to="/settings">
              <Button variant="secondary" size="sm">
                <Shield className="w-4 h-4" />
                Verificar perfil
              </Button>
            </Link>
          )}
          {!profile.is_premium && (
            <Link to="/premium">
              <Button variant="premium" size="sm">
                <Sparkles className="w-4 h-4" />
                {t('dashboard.upgradePremium')}
              </Button>
            </Link>
          )}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="relative flex items-center gap-3 bg-surface-2/60 backdrop-blur-xl border border-white/5 rounded-2xl px-5 py-4 group hover:border-keef-500/25 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-keef-500/5 via-transparent to-pink-500/5 pointer-events-none" />
          <Globe className="w-4 h-4 text-keef-400 shrink-0 relative z-10" />
          <span className="text-xs text-text-secondary shrink-0 relative z-10">{t('dashboard.profileLink')}</span>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-keef-400 hover:text-keef-300 transition-colors truncate flex items-center gap-1 relative z-10"
          >
            {profileUrl}
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
          <div className="flex items-center gap-1 ml-auto shrink-0 relative z-10">
            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors" title="Compartir">
              <Share2 className="w-4 h-4 text-text-secondary" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors" title="Codigo QR">
              <QrCode className="w-4 h-4 text-text-secondary" />
            </button>
            <button onClick={copyProfileUrl} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-secondary" />}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        {renderSectionNav()}
      </motion.div>

      {activeSection === 'overview' && (
        <>
          <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {stats.map((stat) => (
              <Card key={stat.label}
                className="relative overflow-hidden group hover:border-keef-500/30 hover:shadow-lg hover:shadow-keef-500/5 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-keef-500/5 to-transparent rounded-bl-full pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">{stat.label}</span>
                    <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center', stat.gradient)}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">{stat.change}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-5">
            <motion.div variants={item} className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-keef-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Acceso rapido</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {quickActions.map(({ to, label, desc, icon: Icon, gradient, color }) => (
                  <Link key={to} to={to}
                    className="relative group overflow-hidden rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-4 hover:border-keef-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-keef-500/5"
                  >
                    <div className={cn('absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20', gradient)} />
                    <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2.5 shadow-lg', gradient)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5 leading-tight">{desc}</p>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item} className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-keef-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">{t('dashboard.accountStatus')}</h2>
              </div>
              <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm divide-y divide-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-text-secondary">{t('dashboard.currentPlan')}</span>
                  <Badge variant={profile.is_premium ? 'premium' : 'default'} className="text-[10px]">
                    {profile.is_premium ? t('dashboard.premium') : t('dashboard.free')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-text-secondary">{t('dashboard.username')}</span>
                  <span className="text-xs font-mono text-keef-400">@{profile.username}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Shield className="w-3 h-3" />
                    Verificacion
                  </span>
                  <Badge variant={profile.verification_status === 'verified' ? 'premium' : profile.verification_status === 'pending' ? 'warning' : 'default'} className="text-[10px]">
                    {profile.verification_status === 'verified' ? 'Verificado' : profile.verification_status === 'pending' ? 'Pendiente' : 'Sin verificar'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {t('dashboard.memberSince')}
                  </span>
                  <span className="text-[10px] text-text-secondary">{new Date(profile.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                {profile.is_premium && profile.premium_since && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-text-secondary flex items-center gap-1.5">
                      <Crown className="w-3 h-3 text-amber-400" />
                      Premium desde
                    </span>
                    <span className="text-[10px] text-amber-400">{new Date(profile.premium_since).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}</span>
                  </div>
                )}
                {profile.custom_domain && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-text-secondary flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />
                      Dominio
                    </span>
                    <span className="text-[10px] text-emerald-400">{profile.custom_domain}</span>
                  </div>
                )}
              </div>
              <Link to="/settings" className="block text-center text-xs text-keef-400 hover:text-keef-300 transition-colors py-1">
                Gestionar cuenta
              </Link>
            </motion.div>
          </div>
        </>
      )}

      {activeSection === 'quick' && (
        <motion.div variants={item}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map(({ to, label, desc, icon: Icon, gradient, color }) => (
              <Link key={to} to={to}
                className="relative group overflow-hidden rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-5 hover:border-keef-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-keef-500/5 text-center"
              >
                <div className={cn('absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20', gradient)} />
                <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-3 shadow-lg', gradient)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[10px] text-text-secondary mt-1">{desc}</p>
                <div className="mt-3 text-[10px] text-keef-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ir &rarr;
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {activeSection === 'account' && (
        <motion.div variants={item}>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Informacion de la cuenta</h3>
              <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm divide-y divide-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-text-secondary">Nombre</span>
                  <span className="text-sm">{profile.display_name || profile.username}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-text-secondary">Usuario</span>
                  <span className="text-sm font-mono text-keef-400">@{profile.username}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-text-secondary">Bio</span>
                  <span className="text-sm text-right truncate max-w-[200px]">{profile.bio || 'Sin bio'}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-text-secondary">Plan</span>
                  <Badge variant={profile.is_premium ? 'premium' : 'default'} className="text-[10px]">
                    {profile.is_premium ? 'Premium' : 'Gratuito'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-text-secondary">Verificacion</span>
                  <Badge variant={profile.verification_status === 'verified' ? 'premium' : profile.verification_status === 'pending' ? 'warning' : 'default'} className="text-[10px]">
                    {profile.verification_status === 'verified' ? 'Verificado' : profile.verification_status === 'pending' ? 'Pendiente' : 'Sin verificar'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Shield className="w-3 h-3" />
                    Trust Score
                  </span>
                  <span className="text-sm">{profile.trust_score || 0}/100</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Configuracion</h3>
              <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm divide-y divide-white/5 overflow-hidden">
                {profile.custom_domain ? (
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <span className="text-xs text-text-secondary flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />
                      Dominio personalizado
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-emerald-400">{profile.custom_domain}</span>
                      {profile.custom_domain_verified ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-warning" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <span className="text-xs text-text-secondary flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />
                      Dominio personalizado
                    </span>
                    <Link to="/settings" className="text-xs text-keef-400 hover:text-keef-300">Configurar</Link>
                  </div>
                )}
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Palette className="w-3 h-3" />
                    Tema actual
                  </span>
                  <span className="text-sm capitalize">{profile.theme?.type || 'Default'}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    Miembro desde
                  </span>
                  <span className="text-xs text-text-secondary">{new Date(profile.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Ultima actualizacion
                  </span>
                  <span className="text-xs text-text-secondary">{new Date(profile.updated_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/settings" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Settings className="w-4 h-4" />
                    Ajustes
                  </Button>
                </Link>
                <Link to="/personalization" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Palette className="w-4 h-4" />
                    Personalizar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeSection === 'performance' && (
        <motion.div variants={item} className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {performanceMetrics.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-4 hover:border-keef-500/25 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
                    <Icon className={cn('w-5 h-5', color)} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">{label}</p>
                    <p className="text-xl font-bold">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-keef-400" />
                <h3 className="text-sm font-semibold">Visitas por dia</h3>
              </div>
              {analytics && analytics.visits_by_day.length > 0 ? (
                <div className="space-y-2">
                  {analytics.visits_by_day.slice(-7).map((day) => {
                    const maxCount = Math.max(...analytics.visits_by_day.map((d) => d.count))
                    const pct = maxCount > 0 ? (day.count / maxCount) * 100 : 0
                    return (
                      <div key={day.date} className="flex items-center gap-3">
                        <span className="text-[10px] text-text-secondary w-20 shrink-0">
                          {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex-1 h-5 bg-surface-3/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-keef-500 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{day.count}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-text-secondary text-center py-4">Sin datos de visitas</p>
              )}
            </div>

            <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-4 h-4 text-keef-400" />
                <h3 className="text-sm font-semibold">Referentes</h3>
              </div>
              {analytics && analytics.referrers.length > 0 ? (
                <div className="space-y-2">
                  {analytics.referrers.map((ref) => {
                    const total = analytics.referrers.reduce((s, r) => s + r.count, 0)
                    const pct = total > 0 ? (ref.count / total) * 100 : 0
                    return (
                      <div key={ref.source} className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary flex-1 capitalize">{ref.source}</span>
                        <div className="w-24 h-2 bg-surface-3/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-keef-500 to-pink-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10 text-right">{ref.count}</span>
                        <span className="text-[10px] text-text-secondary w-10 text-right">{pct.toFixed(0)}%</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-text-secondary text-center py-4">Sin datos de referentes</p>
              )}
            </div>
          </div>

          {analytics && analytics.visits_by_hour.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-keef-400" />
                <h3 className="text-sm font-semibold">Actividad por hora (24h)</h3>
              </div>
              <div className="flex items-end gap-1 h-24">
                {analytics.visits_by_hour.map((h) => {
                  const maxCount = Math.max(...analytics.visits_by_hour.map((x) => x.count), 1)
                  const height = (h.count / maxCount) * 100
                  const isPeak = h.count === maxCount
                  return (
                    <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-2 border border-border px-2 py-1 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {h.count} visits
                      </div>
                      <div
                        className={cn(
                          'w-full rounded-sm transition-all duration-300',
                          isPeak ? 'bg-keef-500' : 'bg-keef-500/30 hover:bg-keef-500/50'
                        )}
                        style={{ height: `${Math.max(height, 2)}%` }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-text-secondary">00:00</span>
                <span className="text-[10px] text-text-secondary">12:00</span>
                <span className="text-[10px] text-text-secondary">23:00</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {activeSection === 'links' && (
        <motion.div variants={item} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-keef-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Tus Links</h2>
              <Badge variant="default" className="text-[10px]">{links.length} total</Badge>
            </div>
            <div className="flex items-center gap-2">
              {categories.length > 0 && (
                <div className="flex gap-1">
                  {categories.map((cat) => (
                    <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-text-secondary">
                      {cat} ({categoryCounts[cat]})
                    </span>
                  ))}
                </div>
              )}
              <Link to="/editor">
                <Button variant="secondary" size="sm">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Ir al Editor
                </Button>
              </Link>
            </div>
          </div>

          {links.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-surface-2/30 backdrop-blur-sm p-10 text-center">
              <Link2 className="w-10 h-10 text-text-secondary/30 mx-auto mb-3" />
              <p className="text-sm text-text-secondary">No tenes links todavia</p>
              <p className="text-xs text-text-secondary/60 mt-1">Crea tu primer link en el editor</p>
              <Link to="/editor" className="inline-block mt-4">
                <Button variant="primary" size="sm">
                  <Sparkles className="w-4 h-4" />
                  Crear link
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-2.5">
                {displayedLinks.map((link) => {
                  const IconComponent = linkSocialIcons[link.icon as keyof typeof linkSocialIcons] || Link2
                  return (
                    <div key={link.id}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-200',
                        link.is_active
                          ? 'border-white/5 bg-surface-2/60 hover:border-keef-500/25 hover:shadow-sm'
                          : 'border-white/5 bg-surface-2/30 opacity-60'
                      )}
                    >
                      <div className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                        link.is_active ? 'bg-keef-500/10 text-keef-400' : 'bg-surface-3 text-text-secondary/40'
                      )}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium truncate">{link.title}</p>
                          {link.featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          {!link.is_active && <Badge variant="default" className="text-[8px] px-1 py-0">Inactivo</Badge>}
                        </div>
                        <p className="text-[10px] text-text-secondary truncate">{link.url}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-bold">{link.clicks}</p>
                          <p className="text-[8px] text-text-secondary">clicks</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
                      </div>
                    </div>
                  )
                })}
              </div>
              {links.length > 4 && (
                <button
                  onClick={() => setShowAllLinks(!showAllLinks)}
                  className="text-xs text-keef-400 hover:text-keef-300 transition-colors mx-auto block"
                >
                  {showAllLinks ? 'Mostrar menos' : `Mostrar todos (${links.length})`}
                </button>
              )}
            </>
          )}
        </motion.div>
      )}

      {activeSection === 'activity' && (
        <motion.div variants={item} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-4 h-4 text-keef-400" />
                <h3 className="text-sm font-semibold">Actividad reciente</h3>
              </div>
              <div className="space-y-1">
                {[
                  { action: 'Nuevo link creado: "GitHub"', time: 'Hace 2 horas', icon: Link2, color: 'text-sky-400' },
                  { action: 'Perfil actualizado', time: 'Hace 5 horas', icon: Settings, color: 'text-amber-400' },
                  { action: 'Tema cambiado a Midnight', time: 'Ayer', icon: Palette, color: 'text-pink-400' },
                  { action: '50 visitas nuevas', time: 'Ayer', icon: Eye, color: 'text-keef-400' },
                  { action: 'Click en link "Portfolio"', time: 'Hace 2 dias', icon: MousePointerClick, color: 'text-rose-400' },
                  { action: 'Nuevo seguidor', time: 'Hace 3 dias', icon: Users, color: 'text-emerald-400' },
                ].map(({ action, time, icon: Icon, color }) => (
                  <div key={action} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-3/40 transition-colors">
                    <div className={cn('w-8 h-8 rounded-lg bg-surface-3/60 flex items-center justify-center', color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{action}</p>
                      <p className="text-[10px] text-text-secondary">{time}</p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-text-secondary/40 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-keef-400" />
                <h3 className="text-sm font-semibold">Hoy</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3/40">
                  <div className="w-10 h-10 rounded-xl bg-keef-500/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-keef-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary">Visitas hoy</p>
                    <p className="text-lg font-bold">{visitsToday}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3/40">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <MousePointerClick className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary">Clicks hoy</p>
                    <p className="text-lg font-bold">{clicksToday}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3/40">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary">CTR</p>
                    <p className="text-lg font-bold">{ctr}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3/40">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary">Unicos</p>
                    <p className="text-lg font-bold">{uniqueVisitors.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <Link to="/analytics" className="block text-center text-xs text-keef-400 hover:text-keef-300 transition-colors mt-4">
                Ver analytics completos
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {activeSection === 'upgrade' && !profile.is_premium && (
        <motion.div variants={scaleIn}
          className="relative rounded-2xl bg-gradient-to-br from-keef-500/15 via-purple-500/10 to-pink-500/15 border border-keef-500/20 p-6 text-center overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-keef-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-keef-500 to-pink-500 mb-3 shadow-lg shadow-keef-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-lg font-semibold bg-gradient-to-r from-white to-keef-300 bg-clip-text text-transparent">Desbloquea todas las funciones premium</p>
            <p className="text-sm text-text-secondary mt-1 mb-4 max-w-md mx-auto">Temas exclusivos, analytics avanzados, dominio personalizado, sin marca de agua y mucho mas</p>
            <div className="flex flex-wrap justify-center gap-3 mb-5">
              {['Temas exclusivos', 'Analytics avanzados', 'Dominio propio', 'Sin marca de agua', 'Badges', 'Soporte priority'].map((f) => (
                <span key={f} className="flex items-center gap-1 text-xs text-text-secondary bg-white/5 px-3 py-1.5 rounded-full">
                  <Check className="w-3 h-3 text-keef-400" />
                  {f}
                </span>
              ))}
            </div>
            <Link to="/premium">
              <Button variant="premium" size="md">
                <Crown className="w-4 h-4" />
                Actualizar a Premium
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
