import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  ExternalLink, Link2, BarChart3, Eye, Sparkles, ArrowRight, Copy, Check, Users, Clock, Calendar,
  TrendingUp, Activity, Settings, Palette, Crown, Globe, MousePointerClick, Hash, Shield,
  Zap, LayoutGrid, ChevronRight, Sparkle, Target, Orbit, Rocket
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { linkApi } from '@/lib/api'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
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

export function DashboardPage() {
  const { profile } = useAuth()
  const [copied, setCopied] = useState(false)
  const [linkCount, setLinkCount] = useState<number>(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    linkApi.getAll().then((res) => {
      if (res.success && res.data) {
        setLinkCount(res.data.length)
        setTotalClicks(res.data.reduce((sum, l) => sum + l.clicks, 0))
      }
    })
  }, [])

  const profileUrl = `${window.location.origin}/${profile?.username}`

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!profile) return null

  const visitsValue = profile.total_visits || 0

  const stats = [
    { label: t('dashboard.stats.visits'), value: visitsValue.toLocaleString(), icon: Eye, gradient: 'from-keef-500 to-purple-600' },
    { label: t('dashboard.stats.links'), value: linkCount.toLocaleString(), icon: Link2, gradient: 'from-sky-400 to-cyan-500' },
    { label: 'Clicks', value: totalClicks.toLocaleString(), icon: MousePointerClick, gradient: 'from-pink-500 to-rose-500' },
    { label: t('dashboard.stats.plan'), value: profile.is_premium ? t('dashboard.premium') : t('dashboard.free'), icon: Crown, gradient: 'from-amber-400 to-orange-500' },
  ]

  const quickActions = [
    { to: '/editor', label: 'Editor', desc: 'Crear, editar y reordenar', icon: LayoutGrid, gradient: 'from-keef-500 to-purple-600' },
    { to: '/analytics', label: 'Analytics', desc: 'Estadísticas detalladas', icon: BarChart3, gradient: 'from-emerald-500 to-teal-600' },
    { to: '/personalization', label: 'Personalizar', desc: 'Temas y colores', icon: Palette, gradient: 'from-pink-500 to-rose-600' },
    { to: '/settings', label: 'Ajustes', desc: 'Perfil y dominio', icon: Settings, gradient: 'from-amber-500 to-orange-600' },
  ]

  const todayActivity = [
    { icon: Eye, label: 'Visitas hoy', value: '34', change: '+12%' },
    { icon: MousePointerClick, label: 'Clicks hoy', value: '18', change: '+8%' },
    { icon: Users, label: 'Visitantes únicos', value: '523', change: '+15%' },
    { icon: Hash, label: 'CTR promedio', value: '6.4%', change: '+2.1%' },
  ]

  const recentActivity = [
    { action: 'Nuevo link creado', time: 'Hace 2 horas', icon: Link2 },
    { action: 'Perfil actualizado', time: 'Hace 5 horas', icon: Settings },
    { action: 'Tema cambiado a Midnight', time: 'Ayer', icon: Palette },
    { action: '50 visitas nuevas', time: 'Ayer', icon: Eye },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-keef-400 to-pink-400 bg-clip-text text-transparent">
            {t('dashboard.welcome')}, {profile.display_name || profile.username}
          </h1>
          <p className="text-text-secondary text-sm flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5 text-keef-400" />
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
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

      <motion.div variants={item}
        className="relative flex items-center gap-3 bg-surface-2/60 backdrop-blur-xl border border-white/5 rounded-2xl px-5 py-4 group hover:border-keef-500/25 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-keef-500/5 via-transparent to-pink-500/5 pointer-events-none" />
        <Globe className="w-4 h-4 text-keef-400 shrink-0 relative z-10" />
        <span className="text-sm text-text-secondary shrink-0 relative z-10">{t('dashboard.profileLink')}</span>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer"
          className="text-sm text-keef-400 hover:text-keef-300 transition-colors truncate flex items-center gap-1 relative z-10"
        >
          {profileUrl}
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
        <button onClick={copyProfileUrl} className="ml-auto p-2 hover:bg-white/5 rounded-xl transition-colors shrink-0 relative z-10">
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-secondary" />}
        </button>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <Card key={stat.label}
            className="relative overflow-hidden group hover:border-keef-500/30 hover:shadow-lg hover:shadow-keef-500/5 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-keef-500/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">{stat.label}</span>
                <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center', stat.gradient)}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-keef-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Acceso rápido</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ to, label, desc, icon: Icon, gradient }) => (
              <Link key={to} to={to}
                className="relative group overflow-hidden rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-5 hover:border-keef-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-keef-500/5"
              >
                <div className={cn('absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20', gradient)} />
                <div className="flex items-start gap-3">
                  <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg', gradient)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-center" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-keef-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">{t('dashboard.accountStatus')}</h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm divide-y divide-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">{t('dashboard.currentPlan')}</span>
              <Badge variant={profile.is_premium ? 'premium' : 'default'} className="text-xs">
                {profile.is_premium ? t('dashboard.premium') : t('dashboard.free')}
              </Badge>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">{t('dashboard.username')}</span>
              <span className="text-sm font-mono text-keef-400">@{profile.username}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Verificación
              </span>
              <Badge variant={profile.verification_status === 'verified' ? 'premium' : profile.verification_status === 'pending' ? 'warning' : 'default'} className="text-xs">
                {profile.verification_status === 'verified' ? 'Verificado' : profile.verification_status === 'pending' ? 'Pendiente' : 'Sin verificar'}
              </Badge>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {t('dashboard.memberSince')}
              </span>
              <span className="text-xs text-text-secondary">{new Date(profile.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-5 hover:border-keef-500/25 transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-keef-400" />
            <h3 className="text-sm font-semibold">{t('analytics.quickSummary')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {todayActivity.map(({ icon: Icon, label, value, change }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-3/40 hover:bg-surface-3/60 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-keef-500/20 to-purple-600/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-keef-400" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{label}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold">{value}</span>
                    <span className="text-[10px] text-success font-medium">{change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-surface-2/60 backdrop-blur-sm p-5 hover:border-keef-500/25 transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-keef-400" />
            <h3 className="text-sm font-semibold">Actividad reciente</h3>
          </div>
          <div className="space-y-1">
            {recentActivity.map(({ action, time, icon: Icon }) => (
              <div key={action} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-3/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-surface-3/60 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{action}</p>
                  <p className="text-[10px] text-text-secondary">{time}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {!profile.is_premium && (
        <motion.div variants={scaleIn}
          className="relative rounded-2xl bg-gradient-to-br from-keef-500/15 via-purple-500/10 to-pink-500/15 border border-keef-500/20 p-6 text-center overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-keef-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-keef-500 to-pink-500 mb-3 shadow-lg shadow-keef-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-lg font-semibold bg-gradient-to-r from-white to-keef-300 bg-clip-text text-transparent">Desbloqueá todas las funciones premium</p>
            <p className="text-sm text-text-secondary mt-1 mb-4 max-w-md mx-auto">Temas exclusivos, analytics avanzados, sin marca de agua y más</p>
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
