import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { analyticsApi } from '@/lib/api'
import type { AnalyticsOverview } from '@aburrido/shared'
import { useLanguage } from '@/hooks/useLanguage'
import { useWebSocket } from '@/hooks/useWebSocket'
import { Eye, MousePointerClick, Users, TrendingUp, BarChart3, ExternalLink, Globe, Clock, Link2, Hash, Wifi, WifiOff, Activity, Download } from 'lucide-react'

interface LiveEvent {
  id: number
  type: 'visit' | 'click'
  message: string
  timestamp: Date
}

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([])
  const [visitsToday, setVisitsToday] = useState(0)
  const { t } = useLanguage()

  const token = localStorage.getItem('access_token')

  const handleWSEvent = useCallback((event: string, data: unknown) => {
    const d = data as { username?: string; linkTitle?: string; timestamp?: string }
    if (event === 'profile:visit') {
      setLiveEvents((prev) => [
        { id: Date.now(), type: 'visit', message: `Nueva visita de ${d.username || 'alguien'}`, timestamp: new Date(d.timestamp || Date.now()) },
        ...prev.slice(0, 19),
      ])
      setVisitsToday((prev) => prev + 1)
    } else if (event === 'profile:click') {
      setLiveEvents((prev) => [
        { id: Date.now(), type: 'click', message: `Click en ${d.linkTitle || 'un link'}`, timestamp: new Date(d.timestamp || Date.now()) },
        ...prev.slice(0, 19),
      ])
    }
  }, [])

  const ws = useWebSocket({ token, onEvent: handleWSEvent })

  useEffect(() => {
    analyticsApi.getOverview().then((res) => {
      if (res.success && res.data) {
        setAnalytics(res.data as AnalyticsOverview)
      }
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-aburrido-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!analytics) return null

  const totalClicksByLink = analytics.clicks_by_link.reduce((s, l) => s + l.count, 0)

  const stats = [
    { label: 'Visitas totales', value: analytics.total_visits, icon: Eye, change: `+${analytics.visits_today} hoy` },
    { label: 'Clicks totales', value: analytics.total_clicks, icon: MousePointerClick, change: `+${analytics.clicks_today} hoy` },
    { label: 'Visitantes únicos', value: analytics.unique_visitors, icon: Users, change: `${((analytics.unique_visitors / analytics.total_visits) * 100).toFixed(0)}% del total` },
    { label: 'CTR global', value: analytics.total_visits > 0 ? `${((analytics.total_clicks / analytics.total_visits) * 100).toFixed(1)}%` : '0%', icon: TrendingUp, change: 'Click-through rate' },
  ]

  const maxHour = Math.max(...analytics.visits_by_hour.map(h => h.count), 1)
  const currentHour = new Date().getHours()

  const handleExportCSV = () => {
    const rows: string[][] = [
      ['Metrica', 'Valor'],
      ['Visitas totales', String(analytics.total_visits)],
      ['Clicks totales', String(analytics.total_clicks)],
      ['Visitantes unicos', String(analytics.unique_visitors)],
      ['CTR global', analytics.total_visits > 0 ? ((analytics.total_clicks / analytics.total_visits) * 100).toFixed(1) + '%' : '0%'],
      [],
      ['Clicks por link', ''],
      ['Titulo', 'URL', 'Clicks', 'CTR'],
      ...analytics.clicks_by_link.map(l => [l.title, l.url, String(l.count), l.ctr.toFixed(1) + '%']),
      [],
      ['Visitas por hora', ''],
      ['Hora', 'Visitas'],
      ...analytics.visits_by_hour.map(h => [h.hour + ':00', String(h.count)]),
      [],
      ['Referentes', ''],
      ['Fuente', 'Visitas'],
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t('analytics.title')}</h1>
          <p className="text-text-secondary text-sm mt-1">{t('analytics.subtitle')}</p>
        </div>
        <div className="flex gap-2 mb-6">
          <button onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-aburrido-500/10 border border-aburrido-500/20 text-aburrido-400 hover:bg-aburrido-500/20 transition-all">
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>

        {/* Live Analytics */}
        <Card className="mb-6 border-aburrido-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {ws.status === 'connected' ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-yellow-400" />
                )}
                <CardTitle>En vivo ahora</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${ws.status === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                <span className="text-xs text-text-secondary">{ws.status === 'connected' ? 'Conectado' : ws.status === 'connecting' ? 'Conectando...' : 'Desconectado'}</span>
              </div>
            </div>
            <CardDescription>Actividad en tiempo real de tu perfil</CardDescription>
          </CardHeader>
          <div className="max-h-48 overflow-y-auto space-y-1 px-6 pb-4">
            <AnimatePresence initial={false}>
              {liveEvents.length === 0 ? (
                <p className="text-sm text-text-secondary">Esperando actividad...</p>
              ) : (
                liveEvents.map((ev) => (
                  <motion.div key={ev.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-sm">
                    {ev.type === 'visit' ? (
                      <Eye className="w-3.5 h-3.5 text-aburrido-400 shrink-0" />
                    ) : (
                      <MousePointerClick className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    )}
                    <span>{ev.message}</span>
                    <span className="text-[10px] text-text-secondary ml-auto">{ev.timestamp.toLocaleTimeString()}</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map(({ label, value, icon: Icon, change }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="hover:border-aburrido-500/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aburrido-500/20 to-purple-500/20 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-aburrido-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                <p className="text-xs text-text-secondary mt-1">{label}</p>
                <p className="text-[11px] text-aburrido-400 mt-0.5 font-medium">{change}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Hourly Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-aburrido-400" />
                <CardTitle>Actividad por hora</CardTitle>
              </div>
              <CardDescription>Distribución de visitas en las últimas 24h</CardDescription>
            </CardHeader>
            <div className="space-y-0.5">
              {analytics.visits_by_hour.map((h) => (
                <div key={h.hour} className="flex items-center gap-2 text-xs group">
                  <span className="w-6 text-right text-text-secondary font-mono">{h.hour}h</span>
                  <div className="flex-1 h-4 bg-surface-3 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${h.hour === currentHour ? 'bg-gradient-to-r from-aburrido-500 to-purple-500' : 'bg-aburrido-500/40'}`}
                      style={{ width: `${(h.count / maxHour) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-text-secondary">{h.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Referrers */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-aburrido-400" />
                <CardTitle>{t('analytics.referrers')}</CardTitle>
              </div>
              <CardDescription>{t('analytics.referrersDesc')}</CardDescription>
            </CardHeader>
            <div className="space-y-2">
              {analytics.referrers.length === 0 ? (
                <p className="text-sm text-text-secondary">{t('analytics.noData')}</p>
              ) : (
                analytics.referrers.map((ref) => {
                  const pct = analytics.total_visits > 0 ? ((ref.count / analytics.total_visits) * 100).toFixed(1) : '0'
                  return (
                    <div key={ref.source} className="flex items-center justify-between p-2.5 bg-surface-3 rounded-xl group hover:bg-surface-3/80 transition-colors">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm truncate">{ref.source === 'direct' ? `${t('analytics.direct')} ` : ref.source}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-aburrido-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm font-mono text-aburrido-400 w-16 text-right">{ref.count.toLocaleString()}</span>
                        <span className="text-[11px] text-text-secondary w-10 text-right">{pct}%</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </Card>
        </div>

        {/* Clicks by day */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-aburrido-400" />
                <CardTitle>{t('analytics.topLinks')}</CardTitle>
              </div>
              <CardDescription>{t('analytics.topLinksDesc')}</CardDescription>
            </CardHeader>
            <div className="space-y-2">
              {analytics.clicks_by_link.length === 0 ? (
                <p className="text-sm text-text-secondary">{t('analytics.noData')}</p>
              ) : (
                analytics.clicks_by_link.map((link, i) => {
                  const pct = totalClicksByLink > 0 ? ((link.count / totalClicksByLink) * 100).toFixed(1) : '0'
                  return (
                    <div key={link.link_id} className="flex items-center justify-between p-3 bg-surface-3 rounded-xl group hover:bg-surface-3/80 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xs font-mono text-text-secondary w-5">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{link.title}</p>
                          <p className="text-[11px] text-text-secondary truncate">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold">{link.count.toLocaleString()}</p>
                          <p className="text-[10px] text-text-secondary">CTR {link.ctr.toFixed(1)}%</p>
                        </div>
                        <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-aburrido-500 to-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </Card>

          {/* Daily Visits */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-aburrido-400" />
                <CardTitle>Últimos 7 días</CardTitle>
              </div>
              <CardDescription>{t('analytics.lastDays', { count: analytics.visits_by_day.length })}</CardDescription>
            </CardHeader>
            <div className="space-y-1.5">
              {analytics.visits_by_day.slice(-7).map((day) => {
                const maxDay = Math.max(...analytics.visits_by_day.slice(-7).map(d => d.count), 1)
                return (
                  <div key={day.date} className="flex items-center gap-2 text-xs">
                    <span className="w-20 text-text-secondary">
                      {new Date(day.date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 h-5 bg-surface-3 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-aburrido-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${(day.count / maxDay) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-text-secondary">{day.count}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Quick Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-aburrido-400" />
              <CardTitle>{t('analytics.quickSummary')}</CardTitle>
            </div>
            <CardDescription>{t('analytics.quickSummaryDesc')}</CardDescription>
          </CardHeader>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total visitas', value: analytics.total_visits },
              { label: 'Total clicks', value: analytics.total_clicks },
              { label: 'Visitantes únicos', value: analytics.unique_visitors },
              { label: t('analytics.avgPerDay'), value: analytics.visits_by_day.length > 0 ? Math.round(analytics.total_visits / analytics.visits_by_day.length) : 0 },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-surface-3 rounded-xl text-sm">
                <span className="text-text-secondary text-xs">{label}</span>
                <span className="font-mono text-aburrido-400 font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
