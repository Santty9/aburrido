import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { analyticsApi } from '@/lib/api'
import type { AnalyticsOverview } from '@aburrido/shared'
import { useLanguage } from '@/hooks/useLanguage'
import { useWebSocket } from '@/hooks/useWebSocket'
import { Eye, MousePointerClick, Users, TrendingUp, BarChart3, ExternalLink, Globe, Clock, Link2, Hash, Wifi, WifiOff, Activity, Download, Zap, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LiveEvent {
  id: number
  type: 'visit' | 'click'
  message: string
  timestamp: Date
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([])
  const [visitsToday, setVisitsToday] = useState(0)
  const { t } = useLanguage()

  const token = localStorage.getItem('access_token')

  const handleWSEvent = useCallback((event: string, data: unknown) => {
    const d = data as { username?: string; linkTitle?: string; timestamp?: string }
    if (event === 'profile:visit') {
      setLiveEvents((prev) => [
        { id: Date.now(), type: 'visit', message: `${"Nueva visita de"} ${d.username || "alguien"}`, timestamp: new Date(d.timestamp || Date.now()) },
        ...prev.slice(0, 19),
      ])
      setVisitsToday((prev) => prev + 1)
    } else if (event === 'profile:click') {
      setLiveEvents((prev) => [
        { id: Date.now(), type: 'click', message: `${"Click en"} ${d.linkTitle || "un link"}`, timestamp: new Date(d.timestamp || Date.now()) },
        ...prev.slice(0, 19),
      ])
    }
  }, [t])

  const ws = useWebSocket({ token, onEvent: handleWSEvent })

  useEffect(() => {
    analyticsApi.getOverview().then((res) => {
      if (res.success && res.data) {
        setAnalytics(res.data as AnalyticsOverview)
      } else {
        setError(res.error || "Error al cargar los datos")
      }
      setIsLoading(false)
    })
  }, [t])

  const handleExportCSV = () => {
    if (!analytics) return
    const rows: string[][] = [
      ["Metrica", "Valor"],
      [t('analytics.totalVisits'), String(analytics.total_visits)],
      [t('analytics.totalClicks'), String(analytics.total_clicks)],
      [t('analytics.uniqueVisitors'), String(analytics.unique_visitors)],
      ["CTR Global", analytics.total_visits > 0 ? ((analytics.total_clicks / analytics.total_visits) * 100).toFixed(1) + '%' : '0%'],
      [],
      ["Clicks por link", ''],
      ["Titulo", "URL", "Clicks", "CTR"],
      ...analytics.clicks_by_link.map(l => [l.title, l.url, String(l.count), l.ctr.toFixed(1) + '%']),
      [],
      ["Visitas por hora", ''],
      ["Hora", "Visitas"],
      ...analytics.visits_by_hour.map(h => [h.hour + ':00', String(h.count)]),
      [],
      [t('analytics.referrers'), ''],
      ["Fuente", "Visitas"],
      ...analytics.referrers.map(r => [r.source, String(r.count)]),
    ]
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-keef-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">{"Cargando datos..."}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="max-w-md text-center">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-error" />
          </div>
          <CardTitle>{"Error al cargar analytics"}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </Card>
      </div>
    )
  }

  if (!analytics) return null

  const totalClicksByLink = analytics.clicks_by_link.reduce((s, l) => s + l.count, 0)
  const currentHour = new Date().getHours()
  const maxHour = Math.max(...analytics.visits_by_hour.map(h => h.count), 1)
  const maxDay = Math.max(...analytics.visits_by_day.slice(-7).map(d => d.count), 1)

  const stats = [
    { label: t('analytics.totalVisits'), value: analytics.total_visits, change: `+${analytics.visits_today} ${"hoy"}`, changeUp: true, icon: Eye, gradient: 'from-keef-500 to-purple-500' },
    { label: t('analytics.totalClicks'), value: analytics.total_clicks, change: `+${analytics.clicks_today} ${"hoy"}`, changeUp: true, icon: MousePointerClick, gradient: 'from-pink-500 to-rose-500' },
    { label: t('analytics.uniqueVisitors'), value: analytics.unique_visitors, change: `${((analytics.unique_visitors / analytics.total_visits) * 100).toFixed(0)}% ${"del total"}`, changeUp: true, icon: Users, gradient: 'from-sky-500 to-cyan-500' },
    { label: "CTR Global", value: analytics.total_visits > 0 ? `${((analytics.total_clicks / analytics.total_visits) * 100).toFixed(1)}%` : '0%', change: "Click-through rate", changeUp: null, icon: TrendingUp, gradient: 'from-amber-500 to-orange-500' },
  ] as const

  const weekdayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">{t('analytics.title')}</h1>
          <p className="text-text-secondary text-sm mt-1">{t('analytics.subtitle')}</p>
        </div>
        <button onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl bg-keef-500/10 border border-keef-500/20 text-keef-400 hover:bg-keef-500/20 transition-all">
          <Download className="w-4 h-4" />
          {"Exportar CSV"}
        </button>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

        <motion.div variants={itemVariants}>
          <Card variant="glass" className="border-keef-500/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-keef-500/5 to-transparent pointer-events-none" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    ws.status === 'connected' ? 'bg-green-500/10' : 'bg-amber-500/10'
                  )}>
                    {ws.status === 'connected' ? (
                      <Wifi className="w-5 h-5 text-green-400" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle>{"En vivo ahora"}</CardTitle>
                    <CardDescription>{"Actividad en tiempo real de tu perfil"}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-3 border border-border">
                    <Zap className="w-3.5 h-3.5 text-keef-400" />
                    <span className="text-xs font-medium text-text-secondary">{visitsToday} {"hoy".toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-3 border border-border">
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      ws.status === 'connected' ? 'bg-green-400 animate-pulse' : ws.status === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-text-tertiary'
                    )} />
                    <span className="text-xs text-text-secondary">
                      {ws.status === 'connected' ? "Conectado" : ws.status === 'connecting' ? "Conectando..." : "Desconectado"}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <div className="max-h-48 overflow-y-auto space-y-1 px-6 pb-4 custom-scrollbar">
              <AnimatePresence initial={false}>
                {liveEvents.length === 0 ? (
                  <div className="flex items-center gap-2 py-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-pulse" />
                    <p className="text-sm text-text-tertiary">{"Esperando actividad..."}</p>
                  </div>
                ) : (
                  liveEvents.map((ev, i) => (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i === 0 ? 0 : 0 }}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl bg-surface-3/50 hover:bg-surface-3 transition-all group"
                    >
                      <div className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        ev.type === 'visit' ? 'bg-green-400' : 'bg-amber-400'
                      )} />
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                        ev.type === 'visit' ? 'bg-green-500/10' : 'bg-keef-500/10'
                      )}>
                        {ev.type === 'visit' ? (
                          <Eye className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <MousePointerClick className="w-3.5 h-3.5 text-keef-400" />
                        )}
                      </div>
                      <span className="text-sm flex-1">{ev.message}</span>
                      <span className="text-[10px] text-text-tertiary font-mono shrink-0">{ev.timestamp.toLocaleTimeString()}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, change, changeUp: up, icon: Icon, gradient }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="relative overflow-hidden group hover:border-keef-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-full -translate-y-8 translate-x-8 group-hover:opacity-10 transition-opacity" />
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center', gradient)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {up !== null && (
                    <span className={cn(
                      'flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-lg',
                      up ? 'text-green-400 bg-green-500/10' : 'text-error bg-error/10'
                    )}>
                      {up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {change.split(' ')[0]}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                <p className="text-xs text-text-secondary mt-1">{label}</p>
                <p className="text-[11px] text-keef-400/80 mt-0.5 font-medium">{change}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-keef-400" />
                  <CardTitle>{"Actividad por hora"}</CardTitle>
                </div>
                <CardDescription>{"Distribucion de visitas en las ultimas 24h"}</CardDescription>
              </CardHeader>
              <div className="space-y-1">
                {analytics.visits_by_hour.map((h) => {
                  const isCurrent = h.hour === currentHour
                  const pct = (h.count / maxHour) * 100
                  return (
                    <div key={h.hour} className="flex items-center gap-2 text-xs group">
                      <span className={cn(
                        'w-8 text-right font-mono transition-colors',
                        isCurrent ? 'text-keef-400 font-bold' : 'text-text-secondary'
                      )}>{h.hour}h</span>
                      <div className="flex-1 h-5 bg-surface-3 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: h.hour * 0.01 }}
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            isCurrent ? 'bg-gradient-to-r from-keef-500 via-purple-500 to-pink-500' : 'bg-keef-500/30'
                          )}
                        />
                        {isCurrent && (
                          <div className="absolute inset-y-0 right-0 w-1 bg-white/40 rounded-full animate-pulse" />
                        )}
                      </div>
                      <span className={cn(
                        'w-8 text-right font-mono',
                        isCurrent ? 'text-keef-400 font-bold' : 'text-text-secondary'
                      )}>{h.count}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-keef-400" />
                  <CardTitle>{t('analytics.referrers')}</CardTitle>
                </div>
                <CardDescription>{t('analytics.referrersDesc')}</CardDescription>
              </CardHeader>
              <div className="space-y-2">
                {analytics.referrers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Globe className="w-8 h-8 text-text-tertiary mb-2" />
                    <p className="text-sm text-text-tertiary">{"Sin referentes"}</p>
                  </div>
                ) : (
                  analytics.referrers.map((ref, i) => {
                    const pct = analytics.total_visits > 0 ? ((ref.count / analytics.total_visits) * 100) : 0
                    return (
                      <motion.div
                        key={ref.source}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-surface-3 rounded-xl group hover:bg-surface-3/80 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface-4 flex items-center justify-center shrink-0">
                          <Globe className="w-4 h-4 text-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{ref.source === 'direct' ? t('analytics.direct') : ref.source}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-surface-4 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(pct, 100)}%` }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                className="h-full bg-gradient-to-r from-keef-500 to-purple-500 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-mono font-bold">{ref.count.toLocaleString()}</p>
                          <p className="text-[10px] text-text-tertiary">{pct.toFixed(1)}%</p>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-keef-400" />
                  <CardTitle>{t('analytics.topLinks')}</CardTitle>
                </div>
                <CardDescription>{t('analytics.topLinksDesc')}</CardDescription>
              </CardHeader>
              <div className="space-y-2">
                {analytics.clicks_by_link.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Link2 className="w-8 h-8 text-text-tertiary mb-2" />
                    <p className="text-sm text-text-tertiary">{"Sin datos de links"}</p>
                  </div>
                ) : (
                  analytics.clicks_by_link.map((link, i) => {
                    const pct = totalClicksByLink > 0 ? ((link.count / totalClicksByLink) * 100) : 0
                    return (
                      <motion.div
                        key={link.link_id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-3 bg-surface-3 rounded-xl group hover:bg-surface-3/80 transition-colors"
                      >
                        <div className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                          i === 0 ? 'bg-amber-500/20 text-amber-400' :
                          i === 1 ? 'bg-slate-400/20 text-slate-400' :
                          i === 2 ? 'bg-orange-700/20 text-orange-700' :
                          'bg-surface-4 text-text-tertiary'
                        )}>
                          {i + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{link.title}</p>
                          <p className="text-[11px] text-text-tertiary truncate">{link.url}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-mono font-bold">{link.count.toLocaleString()}</p>
                            <p className="text-[10px] text-text-tertiary">CTR {link.ctr.toFixed(1)}%</p>
                          </div>
                          <div className="w-16 h-1.5 bg-surface-4 rounded-full overflow-hidden hidden sm:block">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(pct, 100)}%` }}
                              transition={{ duration: 0.8, delay: i * 0.04 }}
                              className="h-full bg-gradient-to-r from-keef-500 to-purple-500 rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-keef-400" />
                  <CardTitle>{t('analytics.lastDays', { count: analytics.visits_by_day.length })}</CardTitle>
                </div>
                <CardDescription>{"Visitas de los ultimos dias"}</CardDescription>
              </CardHeader>
              <div className="space-y-2 h-[calc(100%-5rem)] flex flex-col justify-end">
                {analytics.visits_by_day.slice(-7).map((day, i) => {
                  const d = new Date(day.date + 'T12:00:00')
                  const pct = (day.count / maxDay) * 100
                  const label = weekdayLabels[d.getDay()]
                  return (
                    <div key={day.date} className="flex items-center gap-2 text-xs group">
                      <span className="w-16 text-text-secondary shrink-0">{label} {d.getDate()}</span>
                      <div className="flex-1 h-6 bg-surface-3 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: i * 0.06 }}
                          className="h-full bg-gradient-to-r from-keef-500 via-purple-500 to-pink-500 rounded-full relative"
                        />
                        {pct > 15 && (
                          <span className="absolute inset-0 flex items-center px-3 text-[10px] text-white font-mono font-bold">
                            {day.count}
                          </span>
                        )}
                      </div>
                      {pct <= 15 && (
                        <span className="w-8 text-right font-mono text-text-secondary">{day.count}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-keef-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-keef-400" />
                <CardTitle>{t('analytics.quickSummary')}</CardTitle>
              </div>
              <CardDescription>{t('analytics.quickSummaryDesc')}</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: t('analytics.totalVisits'), value: analytics.total_visits, icon: Eye },
                { label: t('analytics.totalClicks'), value: analytics.total_clicks, icon: MousePointerClick },
                { label: t('analytics.uniqueVisitors'), value: analytics.unique_visitors, icon: Users },
                { label: t('analytics.avgPerDay'), value: analytics.visits_by_day.length > 0 ? Math.round(analytics.total_visits / analytics.visits_by_day.length) : 0, icon: BarChart3 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-surface-3 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-keef-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-keef-400" />
                  </div>
                  <div>
                    <p className="text-xs text-text-tertiary">{label}</p>
                    <p className="text-lg font-bold font-mono">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  )
}
