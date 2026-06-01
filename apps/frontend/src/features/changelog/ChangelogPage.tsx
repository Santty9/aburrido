import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { changelogApi } from '@/lib/api'
import type { ChangelogEntry } from '@aburrido/shared'
import { Newspaper, Sparkles } from 'lucide-react'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-keef-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-keef-500/10 border border-keef-500/20 rounded-full text-sm text-keef-400 mb-4">
            <Newspaper className="w-4 h-4" />
            {t('changelog.badge')}
          </div>
          <h1 className="text-4xl font-black mb-4">{t('changelog.title')}</h1>
          <p className="text-text-secondary">{t('changelog.subtitle')}</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          {entries.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Newspaper className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">{t('changelog.empty')}</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {entries.map((entry, i) => {
                const config = (typeConfig[entry.type] || typeConfig.improvement)!
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-surface-3 border-2 border-keef-500" />
                    <Card className="hover:border-keef-500/30 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {entry.title}
                            {entry.is_premium && (
                              <Badge variant="premium">
                                <Sparkles className="w-3 h-3" />
                                {t('changelog.premium')}
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-xs text-text-secondary mt-1">
                            v{entry.version} • {new Date(entry.created_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Badge variant={config.variant as any}>{config.label}</Badge>
                      </div>
                      <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                        {entry.content}
                      </div>
                    </Card>
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
