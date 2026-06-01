import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, Check, Palette, User, Sparkles, Search, Star, Filter, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { profileApi, marketplaceApi } from '@/lib/api'
import type { ThemeConfig, MarketplaceTheme } from '@aburrido/shared'
import { useEffect } from 'react'

const CATEGORIES = [
  { value: '', label: 'Todas', icon: '🎨' },
  { value: 'dark', label: 'Oscuras', icon: '🌙' },
  { value: 'light', label: 'Claras', icon: '☀️' },
  { value: 'colorful', label: 'Coloridas', icon: '🌈' },
  { value: 'minimal', label: 'Minimalistas', icon: '◻️' },
  { value: 'gradient', label: 'Degradados', icon: '🎨' },
  { value: 'nature', label: 'Naturaleza', icon: '🌿' },
  { value: 'retro', label: 'Retro', icon: '📼' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
] as const

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-border'}`} />
      ))}
      <span className="text-xs text-text-secondary ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function ThemePreview({ theme }: { theme: ThemeConfig }) {
  const isGradient = theme.background_type === 'gradient'
  return (
    <div className="w-full h-28 rounded-xl overflow-hidden relative flex items-center justify-center group"
      style={{
        background: isGradient ? theme.background : theme.background,
        fontFamily: theme.font,
      }}
    >
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      <div className="flex flex-col items-center gap-1 relative z-10">
        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
          style={{ borderColor: theme.accent_color + '60', background: theme.accent_color + '20', color: theme.text_color }}>
          A
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-2 rounded-full"
              style={{ background: theme.button_color, border: `1px solid ${theme.button_text_color}10` }} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2"
        style={{ background: theme.accent_color, borderColor: theme.text_color + '30' }} />
    </div>
  )
}

export function ThemeMarketplacePage() {
  const { t } = useLanguage()
  const { profile, checkAuth } = useAuth()
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [themes, setThemes] = useState<MarketplaceTheme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'newest'>('downloads')

  useEffect(() => {
    marketplaceApi.getAll().then((res) => {
      if (res.success && res.data) setThemes(res.data)
      setIsLoading(false)
    })
  }, [])

  const filteredThemes = useMemo(() => {
    let result = [...themes]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags?.some((tag) => tag.includes(q)))
    }
    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory)
    }
    if (sortBy === 'downloads') result.sort((a, b) => b.downloads - a.downloads)
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return result
  }, [themes, searchQuery, selectedCategory, sortBy])

  const currentThemeType = profile?.theme?.type

  const handleApply = async (theme: ThemeConfig) => {
    setApplyingId(theme.type)
    await profileApi.update({ theme: theme as any })
    await checkAuth()
    setApplyingId(null)
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-keef-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="w-6 h-6 text-keef-400" />
          <h1 className="text-2xl font-bold">{t('marketplace.title')}</h1>
          <Badge variant="premium" className="text-[10px]">{themes.length} temas</Badge>
        </div>
        <p className="text-text-secondary text-sm">{t('marketplace.subtitle')}</p>
      </motion.div>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar temas..."
            className="w-full pl-10 pr-4 py-3 bg-surface-2 border border-border rounded-xl text-white text-sm focus:outline-none focus:border-keef-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-text-secondary" />
          {CATEGORIES.map(({ value, label, icon }) => (
            <button key={value}
              onClick={() => setSelectedCategory(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedCategory === value
                  ? 'border-keef-500 bg-keef-500/10 text-keef-400'
                  : 'border-border text-text-secondary hover:border-keef-500/50'
              }`}
            >
              <span>{icon}</span> {label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-text-secondary" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-text-secondary border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-keef-500"
            >
              <option value="downloads">Más descargados</option>
              <option value="rating">Mejor valorados</option>
              <option value="newest">Más recientes</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <p className="text-xs text-text-secondary">
        {filteredThemes.length} de {themes.length} temas {selectedCategory && `en ${CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
        {searchQuery && ` para "${searchQuery}"`}
      </p>

      {/* Grid */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {filteredThemes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Palette className="w-12 h-12 text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No se encontraron temas</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('') }}
              className="text-keef-400 text-sm mt-2 hover:underline">
              Limpiar filtros
            </button>
          </div>
        ) : (
          filteredThemes.map((communityTheme) => {
            const isApplied = currentThemeType === communityTheme.theme.type
            const isLoading = applyingId === communityTheme.theme.type

            return (
              <motion.div key={communityTheme.id} variants={item} layout>
                <Card className={cn('h-full flex flex-col transition-all duration-200 group',
                  isApplied && 'ring-2 ring-keef-500'
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {communityTheme.name}
                        {isApplied && (
                          <Badge variant="success" className="text-[10px]">
                            <Check className="w-3 h-3" /> Aplicado
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StarRating rating={communityTheme.rating} />
                      {communityTheme.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-3 text-text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardHeader>

                  <ThemePreview theme={communityTheme.theme} />

                  <div className="px-6 py-2.5 flex items-center gap-3 text-xs text-text-secondary">
                    <User className="w-3 h-3" />
                    <span>{communityTheme.author}</span>
                    <span className="ml-auto flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {communityTheme.downloads.toLocaleString()}
                    </span>
                  </div>

                  <div className="px-6 pb-6 mt-auto">
                    <Button className="w-full group-hover:shadow-lg group-hover:shadow-keef-500/10 transition-all"
                      variant={isApplied ? 'secondary' : 'primary'}
                      onClick={() => handleApply(communityTheme.theme)}
                      isLoading={isLoading}
                      disabled={isApplied}
                      size="sm"
                    >
                      {isApplied ? (
                        <><Check className="w-4 h-4" /> Aplicado</>
                      ) : (
                        <><Sparkles className="w-4 h-4" /> Aplicar tema</>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })
        )}
      </motion.div>
    </div>
  )
}
