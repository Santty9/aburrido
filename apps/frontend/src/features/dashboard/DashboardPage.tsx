import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ExternalLink, Link2, BarChart3, Eye, Sparkles, ArrowRight, Copy, Check, Users, Clock, Calendar, TrendingUp, Activity, Settings, Palette, Zap, Shield, Crown, Globe, MousePointerClick, Hash } from 'lucide-react'
import { useState, useEffect } from 'react'
import { linkApi } from '@/lib/api'

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

  const stats = [
    { label: t('dashboard.stats.visits'), value: profile.total_visits || 0, icon: Eye, suffix: '' },
    { label: t('dashboard.stats.links'), value: linkCount, icon: Link2, suffix: '' },
    { label: 'Clicks', value: totalClicks, icon: MousePointerClick, suffix: '' },
    { label: t('dashboard.stats.plan'), value: profile.is_premium ? t('dashboard.premium') : t('dashboard.free'), icon: Crown, suffix: '' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-text-secondary text-sm mt-1">{t('dashboard.welcome')}, {profile.display_name || profile.username}</p>
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

      {/* Profile URL Bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl px-4 py-3 group hover:border-aburrido-500/30 transition-colors"
      >
        <Globe className="w-4 h-4 text-text-secondary shrink-0" />
        <span className="text-sm text-text-secondary shrink-0">{t('dashboard.profileLink')}</span>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer"
          className="text-sm text-aburrido-400 hover:text-aburrido-300 transition-colors truncate flex items-center gap-1"
        >
          {profileUrl}
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
        <button onClick={copyProfileUrl} className="ml-auto p-2 hover:bg-surface-3 rounded-lg transition-colors shrink-0">
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-secondary" />}
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {stats.map((stat, i) => (
          <Card key={stat.label} className="relative overflow-hidden group hover:border-aburrido-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-aburrido-500/5 to-transparent rounded-bl-full" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">{stat.label}</span>
                <div className="w-8 h-8 rounded-lg bg-aburrido-500/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-aburrido-400" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2 space-y-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-aburrido-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Acceso rápido</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/editor', label: 'Editor de Links', desc: 'Crear, editar y reordenar', icon: Link2, color: 'from-aburrido-500 to-purple-600' },
              { to: '/analytics', label: 'Analytics', desc: 'Estadísticas detalladas', icon: BarChart3, color: 'from-emerald-500 to-teal-600' },
              { to: '/personalization', label: 'Personalizar', desc: 'Temas y colores', icon: Palette, color: 'from-pink-500 to-rose-600' },
              { to: '/settings', label: 'Ajustes', desc: 'Perfil y dominio', icon: Settings, color: 'from-amber-500 to-orange-600' },
            ].map(({ to, label, desc, icon: Icon, color }) => (
              <Link key={to} to={to}
                className="relative group overflow-hidden rounded-xl border border-border bg-surface-2 p-4 hover:border-aburrido-500/30 transition-all duration-300"
              >
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${color} opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20`} />
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Account Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-aburrido-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">{t('dashboard.accountStatus')}</h2>
          </div>
          <div className="rounded-xl border border-border bg-surface-2 divide-y divide-border">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">{t('dashboard.currentPlan')}</span>
              <Badge variant={profile.is_premium ? 'premium' : 'default'} className="text-xs">
                {profile.is_premium ? t('dashboard.premium') : t('dashboard.free')}
              </Badge>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">{t('dashboard.username')}</span>
              <span className="text-sm font-mono text-aburrido-400">@{profile.username}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Verificación
              </span>
              <Badge variant={profile.verification_status === 'verified' ? 'premium' : 'default'} className="text-xs">
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

      {/* Activity Row */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <div className="rounded-xl border border-border bg-surface-2 p-4 hover:border-aburrido-500/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-aburrido-400" />
            <h3 className="text-sm font-semibold">Resumen rápido</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Eye, label: 'Visitas hoy', value: '34', change: '+12%' },
              { icon: MousePointerClick, label: 'Clicks hoy', value: '18', change: '+8%' },
              { icon: Users, label: 'Visitantes únicos', value: '523', change: '+15%' },
              { icon: Hash, label: 'CTR promedio', value: '6.4%', change: '+2.1%' },
            ].map(({ icon: Icon, label, value, change }) => (
              <div key={label} className="flex items-center gap-3 p-2 rounded-lg bg-surface-3/50">
                <div className="w-9 h-9 rounded-lg bg-aburrido-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-aburrido-400" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{label}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">{value}</span>
                    <span className="text-[10px] text-success font-medium">{change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-4 hover:border-aburrido-500/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-aburrido-400" />
            <h3 className="text-sm font-semibold">Actividad reciente</h3>
          </div>
          <div className="space-y-2">
            {[
              { action: 'Nuevo link creado', time: 'Hace 2 horas', icon: Link2 },
              { action: 'Perfil actualizado', time: 'Hace 5 horas', icon: Settings },
              { action: 'Tema cambiado a Midnight', time: 'Ayer', icon: Palette },
              { action: '50 visitas nuevas', time: 'Ayer', icon: Eye },
            ].map(({ action, time, icon: Icon }) => (
              <div key={action} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-3/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{action}</p>
                  <p className="text-[10px] text-text-secondary">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA for free users */}
      {!profile.is_premium && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl bg-gradient-to-r from-aburrido-500/10 via-purple-500/10 to-pink-500/10 border border-aburrido-500/20 p-5 text-center"
        >
          <Sparkles className="w-6 h-6 text-aburrido-400 mx-auto mb-2" />
          <p className="text-sm font-semibold">Desbloqueá todas las funciones premium</p>
          <p className="text-xs text-text-secondary mt-1 mb-3">Temas exclusivos, analytics avanzados, sin marca de agua y más</p>
          <Link to="/premium">
            <Button variant="premium" size="sm">
              <Crown className="w-4 h-4" />
              Actualizar a Premium
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}
