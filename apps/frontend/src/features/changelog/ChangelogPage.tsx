import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { changelogApi } from '@/lib/api'
import type { ChangelogEntry } from '@aburrido/shared'
import { Newspaper, Sparkles, GitCommit } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export function ChangelogPage() {
  const { t } = useLanguage()

  const typeConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'default' | 'premium' }> = {
    feature: { label: t('changelog.type.feature'), variant: 'success' },
    fix: { label: t('changelog.type.fix'), variant: 'warning' },
    improvement: { label: t('changelog.type.improvement'), variant: 'default' },
  }

  const [entries, setEntries] = useState<ChangelogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    changelogApi.getAll().then((res) => {
      if (res.success && res.data) {
        setEntries(res.data as ChangelogEntry[])
      }
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-keef-500/30 border-t-keef-500 rounded-full animate-spin" />
          <span className="text-sm text-text-secondary">{t('common.loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-keef-500/10 to-pink-500/10 border border-keef-500/20 rounded-full text-sm text-keef-400 mb-4"
          >
            <Newspaper className="w-4 h-4" />
            {t('changelog.badge')}
          </motion.div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-keef-300 via-white to-pink-300 bg-clip-text text-transparent mb-3">{t('changelog.title')}</h1>
          <p className="text-text-secondary text-lg">{t('changelog.subtitle')}</p>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 0.6 }}
            className="absolute left-[19px] top-2 w-px bg-gradient-to-b from-keef-500/50 via-keef-500/20 to-transparent"
          />

          {entries.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-surface-3 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GitCommit className="w-8 h-8 text-text-secondary" />
                  </div>
                  <p className="text-text-secondary">{t('changelog.empty')}</p>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {entries.map((entry, i) => {
                const config = (typeConfig[entry.type] || typeConfig.improvement)!
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, type: 'spring', damping: 20 }}
                    className="relative pl-14"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.08 + 0.1, type: 'spring', damping: 15 }}
                      className="absolute left-[13px] top-2 w-3 h-3 rounded-full border-[3px] border-keef-500 bg-surface shadow-lg shadow-keef-500/20 z-10"
                    />
                    <div className="relative group">
                      <motion.div
                        className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06), transparent 70%)`,
                        }}
                      />
                      <Card className="relative hover:border-keef-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-keef-500/5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="flex items-center gap-2 flex-wrap">
                              <span className="truncate">{entry.title}</span>
                              {entry.is_premium && (
                                <Badge variant="premium" className="shrink-0">
                                  <Sparkles className="w-3 h-3" />
                                  {t('changelog.premium')}
                                </Badge>
                              )}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-3 text-text-secondary font-mono">v{entry.version}</span>
                              <span className="text-xs text-text-secondary">
                                {new Date(entry.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          <Badge variant={config.variant as any} className="shrink-0 ml-3">{config.label}</Badge>
                        </div>
                        <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                          {entry.content}
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
