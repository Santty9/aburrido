import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { profileApi, blockApi, linkApi } from '@/lib/api'
import type { ThemeConfig, ThemeType, Block } from '@aburrido/shared'
import { DEFAULT_THEME, THEMES, iconMap } from '@aburrido/shared'
import { Save, Palette, Eye, Image, Sliders, Code, Check, Monitor, Smartphone, Undo2, Music, Volume2, Film, ExternalLink, ChevronDown, MousePointerClick, Globe, Sparkles, Zap, Heart, VolumeX, Sparkle, Paintbrush, Plus, Trash2, MoveUp, MoveDown, Type, Link2, Video, LayoutGrid, Wand2 } from 'lucide-react'

const FONTS = ['Inter', 'JetBrains Mono', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Trebuchet MS', 'Impact']

function Toggle({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <label className="flex items-center justify-between p-3 bg-surface-3 rounded-xl cursor-pointer group hover:bg-surface-3/80 transition-colors">
      <div>
        <span className="text-sm font-medium">{label}</span>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>
      <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-aburrido-500' : 'bg-border'} shrink-0 ml-3`}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      </div>
    </label>
  )
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-secondary w-28 shrink-0">{label}</span>
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent p-0.5"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm font-mono focus:outline-none focus:border-aburrido-500"
      />
    </div>
  )
}

function ProfilePreview({ theme, profile }: { theme: ThemeConfig; profile: { username: string; display_name: string | null; bio: string | null } }) {
  const isGradient = theme.background_type === 'gradient'
  const isVideo = theme.background_type === 'video'
  const isImage = theme.background_type === 'image'
  const isGlass = theme.button_style === 'glass'
  const blurMap = { none: '0px', light: '8px', medium: '16px', strong: '24px' }
  const glassBlur = blurMap[theme.glass_blur || 'medium']
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const btnRadius = theme.button_style === 'pill' ? '9999px' : theme.button_style === 'sharp' ? '10px' : '16px'

  const demoLinks = [
    { id: '1', title: 'GitHub', url: '#', icon: 'github', clicks: 42 },
    { id: '2', title: 'Twitter / X', url: '#', icon: 'twitter', clicks: 28 },
    { id: '3', title: 'Website', url: '#', icon: 'globe', clicks: 15 },
  ]

  return (
    <div
      className="min-h-[500px] flex flex-col items-center justify-center p-4 relative overflow-hidden rounded-xl"
      style={{
        background: isVideo ? undefined : isGradient ? theme.background : isImage ? `url(${theme.background}) center/cover` : theme.background,
        color: theme.text_color,
        fontFamily: theme.font,
      }}
    >
      {/* Video background in preview */}
      {isVideo && theme.background_video_url && (
        <>
          <video autoPlay loop playsInline muted className="absolute inset-0 w-full h-full object-cover" style={{ filter: `brightness(${1 - (theme.overlay_opacity || 40) / 100 * 0.65}) saturate(1.2)` }}>
            <source src={theme.background_video_url} type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent, rgba(0,0,0,${((theme.overlay_opacity || 40) / 100) * 0.6}))`, pointerEvents: 'none' }} />
        </>
      )}

        {/* Particles */}
      {theme.show_particles && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                opacity: Math.random() * 0.3 + 0.05,
              }}
              animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {/* Corner decorations */}
      {theme.corner_decoration !== 'none' && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {theme.corner_decoration === 'dots' && (
            <>
              <div className="absolute top-4 left-4 flex gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent_color, opacity: 0.5 }} /><span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent_color, opacity: 0.3 }} /></div>
              <div className="absolute top-4 right-4 flex gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent_color, opacity: 0.5 }} /><span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent_color, opacity: 0.3 }} /></div>
              <div className="absolute bottom-4 left-4 flex gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent_color, opacity: 0.3 }} /><span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent_color, opacity: 0.5 }} /></div>
              <div className="absolute bottom-4 right-4 flex gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent_color, opacity: 0.3 }} /><span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent_color, opacity: 0.5 }} /></div>
            </>
          )}
          {theme.corner_decoration === 'lines' && (
            <>
              <div className="absolute top-4 left-4 w-8 h-px" style={{ background: `linear-gradient(90deg, ${theme.accent_color}60, transparent)` }} />
              <div className="absolute top-4 left-4 w-px h-8" style={{ background: `linear-gradient(180deg, ${theme.accent_color}60, transparent)` }} />
              <div className="absolute top-4 right-4 w-8 h-px" style={{ background: `linear-gradient(270deg, ${theme.accent_color}60, transparent)` }} />
              <div className="absolute top-4 right-4 w-px h-8" style={{ background: `linear-gradient(180deg, ${theme.accent_color}60, transparent)` }} />
              <div className="absolute bottom-4 left-4 w-8 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent_color}60)` }} />
              <div className="absolute bottom-4 left-4 w-px h-8" style={{ background: `linear-gradient(0deg, ${theme.accent_color}60, transparent)` }} />
              <div className="absolute bottom-4 right-4 w-8 h-px" style={{ background: `linear-gradient(270deg, transparent, ${theme.accent_color}60)` }} />
              <div className="absolute bottom-4 right-4 w-px h-8" style={{ background: `linear-gradient(0deg, ${theme.accent_color}60, transparent)` }} />
            </>
          )}
          {theme.corner_decoration === 'ornate' && (
            <>
              <svg className="absolute top-3 left-3 w-10 h-10" viewBox="0 0 40 40" fill="none"><path d="M2 2L38 2M2 2L2 38M2 2L10 2M2 2L2 10" stroke={theme.accent_color} strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <svg className="absolute top-3 right-3 w-10 h-10" viewBox="0 0 40 40" fill="none"><path d="M38 2L2 2M38 2L38 38M38 2L30 2M38 2L38 10" stroke={theme.accent_color} strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <svg className="absolute bottom-3 left-3 w-10 h-10" viewBox="0 0 40 40" fill="none"><path d="M2 38L38 38M2 38L2 2M2 38L10 38M2 38L2 30" stroke={theme.accent_color} strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <svg className="absolute bottom-3 right-3 w-10 h-10" viewBox="0 0 40 40" fill="none"><path d="M38 38L2 38M38 38L38 2M38 38L30 38M38 38L38 30" stroke={theme.accent_color} strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </>
          )}
        </div>
      )}

      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 relative z-10 py-6">
        {/* Avatar */}
        {theme.show_avatar && (
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: [`0 0 20px ${theme.accent_color}40, 0 0 40px ${theme.accent_color}20`, `0 0 30px ${theme.accent_color}60, 0 0 60px ${theme.accent_color}30`, `0 0 20px ${theme.accent_color}40, 0 0 40px ${theme.accent_color}20`] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className={`rounded-full overflow-hidden relative ${theme.avatar_size === 'lg' ? 'w-28 h-28' : theme.avatar_size === 'sm' ? 'w-16 h-16' : 'w-20 h-20'}`} style={{ boxShadow: `0 0 30px ${theme.accent_color}40`, border: `3px solid ${theme.accent_color}60` }}>
              <div className="w-full h-full flex items-center justify-center text-3xl font-black select-none" style={{ background: `linear-gradient(135deg, ${theme.accent_color}, ${theme.accent_color}88)` }}>
                {profile.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-center space-y-1">
          <h1 className={`${
            theme.title_font_size === 'sm' ? 'text-lg sm:text-xl' :
            theme.title_font_size === 'md' ? 'text-xl sm:text-2xl' :
            theme.title_font_size === 'lg' ? 'text-2xl sm:text-3xl' :
            'text-3xl sm:text-4xl'
          } font-black tracking-tight ${theme.title_style === 'gradient' ? 'bg-gradient-to-r from-white via-aburrido-300 to-white bg-clip-text text-transparent' : theme.title_style === 'shadow' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : theme.title_style === 'outline' ? 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.8)]' : ''}`} style={theme.show_gradient_text ? { background: `linear-gradient(135deg, ${theme.accent_color}, #ffffff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}}>{profile.display_name || profile.username}</h1>
          {theme.show_bio && profile.bio && (
            <p className="text-xs leading-relaxed max-w-sm mx-auto" style={{ opacity: 0.75 }}>{profile.bio}</p>
          )}
        </div>

        {/* Stats */}
        {theme.show_stats && (
          <div className="flex items-center gap-4 px-4 py-2 rounded-full text-xs" style={{ background: `${theme.text_color}08`, border: `1px solid ${theme.text_color}10` }}>
            <span className="flex items-center gap-1.5" style={{ opacity: 0.6 }}>
              <Eye className="w-3 h-3" /> 1.2k visits
            </span>
            <span className="w-px h-3" style={{ background: theme.text_color + '20' }} />
            <span className="flex items-center gap-1.5" style={{ opacity: 0.6 }}>
              <MousePointerClick className="w-3 h-3" /> 847 clicks
            </span>
            <span className="w-px h-3" style={{ background: theme.text_color + '20' }} />
            <span className="flex items-center gap-1.5" style={{ opacity: 0.6 }}>
              <Globe className="w-3 h-3" /> 3 links
            </span>
          </div>
        )}

        {/* Links */}
        <div className="w-full space-y-2 mt-1">
          {demoLinks.map((link, i) => (
            <div key={link.id}>
              <div
                className="relative flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-300 group cursor-default"
                style={{
                  background: isGlass ? 'rgba(255,255,255,0.06)' : theme.button_color,
                  color: theme.button_text_color,
                  borderRadius: btnRadius,
                  backdropFilter: isGlass ? `blur(${glassBlur})` : undefined,
                  border: isGlass ? '1px solid rgba(255,255,255,0.08)' : `1px solid transparent`,
                  boxShadow: theme.glow_intensity === 'strong' ? `0 0 20px ${theme.accent_color}15` : theme.glow_intensity === 'subtle' ? 'none' : undefined,
                }}
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className="relative text-lg">{iconMap[link.icon] || '🌐'}</span>
                <span className="relative flex-1 font-semibold tracking-tight truncate" style={{ fontSize: theme.link_font_size === 'xs' ? '0.75rem' : theme.link_font_size === 'base' ? '1rem' : '0.875rem' }}>{link.title}</span>
                <motion.span className="relative text-[10px] font-mono" style={{ opacity: 0.3 }} animate={{ opacity: hoveredLink === link.id ? 0.6 : 0.3 }}>
                  {link.clicks} clicks
                </motion.span>
                <motion.div className="relative" animate={{ x: hoveredLink === link.id ? 2 : 0, opacity: hoveredLink === link.id ? 0.8 : 0.3 }}>
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.div>
              </div>
              {i < demoLinks.length - 1 && theme.link_divider !== 'none' && (
                <div className="flex justify-center py-1">
                  {theme.link_divider === 'line' && <div className="w-8 h-px" style={{ background: theme.text_color + '15' }} />}
                  {theme.link_divider === 'dots' && <div className="flex gap-1"><div className="w-1 h-1 rounded-full" style={{ background: theme.text_color + '30' }} /><div className="w-1 h-1 rounded-full" style={{ background: theme.text_color + '15' }} /></div>}
                  {theme.link_divider === 'glow' && <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent_color}30, transparent)` }} />}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lead Form Preview */}
        {theme.lead_form_enabled && (
          <div className="w-full p-4 rounded-2xl space-y-3"
            style={{
              background: isGlass ? 'rgba(255,255,255,0.04)' : `${theme.text_color}06`,
              border: `1px solid ${theme.text_color}10`,
              borderRadius: btnRadius,
              backdropFilter: isGlass ? `blur(${glassBlur})` : undefined,
            }}
          >
            <p className="text-sm font-semibold" style={{ color: theme.text_color }}>
              {theme.lead_form_title || 'Suscribite'}
            </p>
            <div className="flex gap-2">
              <input type="email" placeholder="tu@email.com"
                className="flex-1 px-3 py-2 rounded-xl text-sm bg-black/20 border"
                style={{ borderColor: theme.text_color + '15', color: theme.text_color }}
                disabled />
              <button className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: theme.accent_color, color: '#fff' }}>
                {theme.lead_form_button_text || 'Enviar'}
              </button>
            </div>
          </div>
        )}

        {/* Brand Footer */}
        {theme.show_brand_footer && (
          <div className="flex flex-col items-center gap-2 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-medium tracking-wider uppercase" style={{ opacity: 0.3 }}>
              <Heart className="w-3 h-3" /> Creado con Aburrido
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function PersonalizationPage() {
  const { profile, checkAuth } = useAuth()
  const [theme, setTheme] = useState<ThemeConfig>(() => ({ ...DEFAULT_THEME, ...(profile?.theme || {}) }) as ThemeConfig)
  const [blocks, setBlocks] = useState<Block[]>(() => [...(profile?.blocks || [])])
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingBlocks, setIsSavingBlocks] = useState(false)
  const [blocksMessage, setBlocksMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'layout' | 'decorations' | 'advanced' | 'blocks'>('presets')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const { t } = useLanguage()

  const BUTTON_STYLES = [
    { value: 'rounded' as const, label: t('personalization.buttonStyle.rounded'), preview: 'rounded-2xl' },
    { value: 'pill' as const, label: t('personalization.buttonStyle.pill'), preview: 'rounded-full' },
    { value: 'sharp' as const, label: t('personalization.buttonStyle.sharp'), preview: 'rounded-lg' },
    { value: 'glass' as const, label: t('personalization.buttonStyle.glass'), preview: 'rounded-2xl glass' },
  ]

  const BG_TYPES = [
    { value: 'solid' as const, label: t('personalization.bgType.solid'), icon: '#' },
    { value: 'gradient' as const, label: t('personalization.bgType.gradient'), icon: '↗' },
    { value: 'image' as const, label: t('personalization.bgType.image'), icon: '🖼' },
    { value: 'video' as const, label: t('personalization.bgType.video'), icon: '🎬' },
  ]

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile?.theme) setTheme({ ...DEFAULT_THEME, ...profile.theme } as ThemeConfig)
    if (profile?.blocks) setBlocks([...profile.blocks])
  }, [profile?.theme, profile?.blocks])

  const applyThemePreset = (type: ThemeType) => {
    const preset = THEMES[type]
    if (preset) setTheme((prev) => ({ ...prev, ...preset, type }))
  }

  const updateTheme = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    setTheme((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const url = ev.target?.result as string
        updateTheme('background', url)
        updateTheme('background_type', 'image')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const url = ev.target?.result as string
        updateTheme('background_video_url', url)
        updateTheme('background_type', 'video')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await profileApi.update({ theme: theme as any })
    await checkAuth()
    setIsSaving(false)
  }

  const handleReset = () => {
    setTheme({ ...DEFAULT_THEME })
  }

  if (!profile) return null

  const tabs = [
    { id: 'presets' as const, label: t('personalization.tab.presets'), icon: Palette },
    { id: 'colors' as const, label: t('personalization.tab.colors'), icon: Eye },
    { id: 'layout' as const, label: t('personalization.tab.layout'), icon: Sliders },
    { id: 'decorations' as const, label: 'Decoraciones', icon: Sparkle },
    { id: 'advanced' as const, label: t('personalization.tab.advanced'), icon: Code },
    { id: 'blocks' as const, label: 'Bloques', icon: LayoutGrid },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('personalization.title')}</h1>
            <p className="text-text-secondary text-sm mt-1">{t('personalization.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-border text-text-secondary hover:text-white hover:border-aburrido-500/50 transition-all">
              <ExternalLink className="w-4 h-4" />
              Ver perfil
            </a>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <Undo2 className="w-4 h-4" />
              {t('personalization.reset')}
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              <Save className="w-4 h-4" />
              {t('common.save')}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab bar */}
            <div className="flex gap-1 bg-surface-2 border border-border rounded-xl p-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === id ? 'bg-aburrido-500 text-white shadow-lg' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab: Presets */}
            {activeTab === 'presets' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('personalization.presets.title')}</CardTitle>
                  <CardDescription>{t('personalization.presets.apply')}</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(Object.entries(THEMES) as [ThemeType, Partial<ThemeConfig>][]).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => applyThemePreset(key)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        theme.type === key ? 'border-aburrido-500 scale-105 shadow-lg shadow-aburrido-500/20' : 'border-border hover:border-aburrido-500/50'
                      }`}
                      style={{ background: config.background_type === 'gradient' ? config.background : config.background }}
                    >
                      {theme.type === key && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-aburrido-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className="text-xs font-medium capitalize block text-center mt-6" style={{ color: config.text_color }}>{key}</span>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Tab: Colors */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalization.colors.background')}</CardTitle>
                    <CardDescription>{t('personalization.colors.backgroundType')}</CardDescription>
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {BG_TYPES.map(({ value, label, icon }) => (
                        <button
                          key={value}
                          onClick={() => updateTheme('background_type', value)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            theme.background_type === value
                              ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400'
                              : 'border-border text-text-secondary hover:border-aburrido-500/50'
                          }`}
                        >
                          <span>{icon}</span> {label}
                        </button>
                      ))}
                    </div>

                    {theme.background_type === 'solid' && (
                      <ColorInput label={t('personalization.bgType.solid')} value={theme.background} onChange={(v) => updateTheme('background', v)} />
                    )}

                    {theme.background_type === 'gradient' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-text-secondary">{t('personalization.bgType.gradient')} CSS</label>
                        <input
                          type="text"
                          value={theme.background}
                          onChange={(e) => updateTheme('background', e.target.value)}
                          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-white font-mono text-sm focus:outline-none focus:border-aburrido-500"
                          placeholder="linear-gradient(135deg, #000, #purple)"
                        />
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-text-secondary shrink-0">Ángulo</label>
                          <input
                            type="range"
                            min={0} max={360}
                            value={theme.gradient_angle}
                            onChange={(e) => updateTheme('gradient_angle', Number(e.target.value))}
                            className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-aburrido-500"
                          />
                          <span className="text-sm font-mono text-text-secondary w-10 text-right">{theme.gradient_angle}°</span>
                        </div>
                        <div className="h-16 rounded-xl border border-border" style={{ background: theme.background }} />
                      </div>
                    )}

                    {theme.background_type === 'image' && (
                      <div className="space-y-2">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="w-full">
                          <Image className="w-4 h-4" />
                          {t('personalization.bgType.image')}
                        </Button>
                        {theme.background && (
                          <div className="h-32 rounded-xl border border-border bg-cover bg-center" style={{ backgroundImage: `url(${theme.background})` }} />
                        )}
                      </div>
                    )}

                    {theme.background_type === 'video' && (
                      <div className="space-y-3">
                        <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                        <Button variant="secondary" onClick={() => videoInputRef.current?.click()} className="w-full">
                          <Film className="w-4 h-4" />
                          {t('personalization.video.upload')}
                        </Button>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-xs text-text-secondary">{t('personalization.video.videoUrl')}</span>
                          <div className="flex-1 h-px bg-border" />
                        </div>

                        <input
                          type="url"
                          value={theme.background_video_url || ''}
                          onChange={(e) => updateTheme('background_video_url', e.target.value || null)}
                          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-white text-sm focus:outline-none focus:border-aburrido-500"
                          placeholder="https://example.com/background.mp4"
                        />
                        <Toggle
                          label={t('personalization.video.videoSound')}
                          description={t('personalization.video.videoSound')}
                          checked={theme.background_video_sound}
                          onChange={(v) => updateTheme('background_video_sound', v)}
                        />
                        {theme.background_video_url && (
                          <>
                            <div className="h-32 rounded-xl border border-border overflow-hidden bg-black relative">
                              <video className="w-full h-full object-cover" autoPlay loop playsInline muted>
                                <source src={theme.background_video_url} type="video/mp4" />
                              </video>
                              <Film className="absolute bottom-2 right-2 w-5 h-5 text-white/50" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm text-text-secondary">Opacidad de superposición</label>
                              <input
                                type="range"
                                min={0} max={100}
                                value={theme.overlay_opacity}
                                onChange={(e) => updateTheme('overlay_opacity', Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-aburrido-500"
                              />
                              <div className="flex justify-between text-[10px] text-text-secondary">
                                <span>Transparente</span>
                                <span>{theme.overlay_opacity}%</span>
                                <span>Opaco</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm text-text-secondary">Color de superposición</label>
                              <div className="flex items-center gap-3">
                                <input type="color" value={theme.overlay_color}
                                  onChange={(e) => updateTheme('overlay_color', e.target.value)}
                                  className="w-10 h-10 rounded-xl border border-border cursor-pointer" />
                                <input type="text" value={theme.overlay_color}
                                  onChange={(e) => updateTheme('overlay_color', e.target.value)}
                                  className="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm font-mono focus:outline-none focus:border-aburrido-500" />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalization.tab.colors')}</CardTitle>
                    <CardDescription>{t('personalization.colors.text')}</CardDescription>
                  </CardHeader>
                  <div className="space-y-3">
                    <ColorInput label={t('personalization.colors.text')} value={theme.text_color} onChange={(v) => updateTheme('text_color', v)} />
                    <ColorInput label={t('personalization.colors.accent')} value={theme.accent_color} onChange={(v) => updateTheme('accent_color', v)} />
                    <ColorInput label={t('personalization.colors.buttonBg')} value={theme.button_color} onChange={(v) => updateTheme('button_color', v)} />
                    <ColorInput label={t('personalization.colors.buttonText')} value={theme.button_text_color} onChange={(v) => updateTheme('button_text_color', v)} />
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalization.layout.buttonStyle')}</CardTitle>
                    <CardDescription>{t('personalization.layout.linkEffect')}</CardDescription>
                  </CardHeader>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BUTTON_STYLES.map(({ value, label, preview }) => (
                      <button
                        key={value}
                        onClick={() => updateTheme('button_style', value)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          theme.button_style === value ? 'border-aburrido-500 bg-aburrido-500/10' : 'border-border hover:border-aburrido-500/50'
                        }`}
                      >
                        <div className={`h-10 ${preview} bg-white/10 border border-white/20 flex items-center justify-center mb-2`}>
                          <span className="text-[10px] text-white">Link</span>
                        </div>
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Tab: Layout */}
            {activeTab === 'layout' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalization.layout.font')}</CardTitle>
                    <CardDescription>{t('personalization.layout.font')}</CardDescription>
                  </CardHeader>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FONTS.map((font) => (
                      <button
                        key={font}
                        onClick={() => updateTheme('font', font)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                          theme.font === font ? 'border-aburrido-500 bg-aburrido-500/10' : 'border-border hover:border-aburrido-500/50'
                        }`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalization.visibility')}</CardTitle>
                    <CardDescription>{t('personalization.visibility')}</CardDescription>
                  </CardHeader>
                  <div className="space-y-2">
                    <Toggle label={t('personalization.visibility.avatar')} description={t('personalization.visibility.avatar')} checked={theme.show_avatar} onChange={(v) => updateTheme('show_avatar', v)} />
                    <Toggle label={t('personalization.visibility.bio')} description={t('personalization.visibility.bio')} checked={theme.show_bio} onChange={(v) => updateTheme('show_bio', v)} />
                    <Toggle label={t('personalization.visibility.stats')} description={t('personalization.visibility.stats')} checked={theme.show_stats} onChange={(v) => updateTheme('show_stats', v)} />
                    <Toggle label={t('personalization.visibility.particles')} description={t('personalization.visibility.particles')} checked={theme.show_particles} onChange={(v) => updateTheme('show_particles', v)} />
                    <Toggle label={t('personalization.visibility.brandFooter')} description={t('personalization.visibility.brandFooter')} checked={theme.show_brand_footer} onChange={(v) => updateTheme('show_brand_footer', v)} />
                    <Toggle label="Contador en vivo" description="Mostrar cuántas personas están viendo el perfil ahora" checked={theme.show_online_count} onChange={(v) => updateTheme('show_online_count', v)} />
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalization.layout.avatar')}</CardTitle>
                    <CardDescription>{t('personalization.layout.avatarShape')}</CardDescription>
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">{t('personalization.layout.avatarShape')}</label>
                      <div className="flex gap-2">
                        {([['circle', '●'], ['rounded', '⬟'], ['square', '■']] as const).map(([value, icon]) => (
                          <button key={value} onClick={() => updateTheme('avatar_shape', value)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme.avatar_shape === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                            }`}>
                            <span>{icon}</span> {value === 'circle' ? t('personalization.avatarShape.circle') : value === 'rounded' ? t('personalization.avatarShape.rounded') : t('personalization.avatarShape.square')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">{t('personalization.layout.avatarBorder')}</label>
                      <div className="flex gap-2">
                        {([['thin', t('personalization.avatarBorder.thin')], ['medium', t('personalization.avatarBorder.medium')], ['thick', t('personalization.avatarBorder.thick')]] as const).map(([value, label]) => (
                          <button key={value} onClick={() => updateTheme('avatar_border_width', value)}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme.avatar_border_width === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                            }`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">Tamaño del avatar</label>
                      <div className="flex gap-2">
                        {([['sm', 'Pequeño'], ['md', 'Mediano'], ['lg', 'Grande']] as const).map(([value, label]) => (
                          <button key={value} onClick={() => updateTheme('avatar_size', value)}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme.avatar_size === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                            }`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalization.layout.linkEffect')}</CardTitle>
                    <CardDescription>{t('personalization.layout.linkSpacing')}</CardDescription>
                  </CardHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">{t('personalization.layout.linkEffect')}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([['scale', t('personalization.linkEffect.scale')], ['glow', t('personalization.linkEffect.glow')], ['lift', t('personalization.linkEffect.lift')], ['none', t('personalization.linkEffect.none')]] as const).map(([value, label]) => (
                          <button key={value} onClick={() => updateTheme('link_hover_effect', value)}
                            className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme.link_hover_effect === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                            }`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">{t('personalization.layout.linkSpacing')}</label>
                      <div className="flex gap-2">
                        {([['compact', t('personalization.linkSpacing.compact')], ['normal', t('personalization.linkSpacing.normal')], ['comfortable', t('personalization.linkSpacing.comfortable')]] as const).map(([value, label]) => (
                          <button key={value} onClick={() => updateTheme('link_spacing', value)}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme.link_spacing === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                            }`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">Tamaño de texto en links</label>
                      <div className="flex gap-2">
                        {([['xs', 'Pequeño'], ['sm', 'Normal'], ['base', 'Grande']] as const).map(([value, label]) => (
                          <button key={value} onClick={() => updateTheme('link_font_size', value)}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme.link_font_size === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                            }`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {theme.button_style === 'glass' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Intensidad del vidrio (glass)</label>
                        <div className="flex gap-2">
                          {([['none', 'Ninguno'], ['light', 'Ligero'], ['medium', 'Medio'], ['strong', 'Fuerte']] as const).map(([value, label]) => (
                            <button key={value} onClick={() => updateTheme('glass_blur', value)}
                              className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                theme.glass_blur === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                              }`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-secondary">{t('personalization.layout.borderRadius')}</label>
                      <div className="flex gap-2">
                        {([['small', t('personalization.borderRadiusScale.small')], ['medium', t('personalization.borderRadiusScale.medium')], ['large', t('personalization.borderRadiusScale.large')]] as const).map(([value, label]) => (
                          <button key={value} onClick={() => updateTheme('border_radius_scale', value)}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                              theme.border_radius_scale === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                            }`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalization.layout.statsStyle')}</CardTitle>
                    <CardDescription>{t('personalization.layout.statsStyle')}</CardDescription>
                  </CardHeader>
                  <div className="flex gap-2">
                    {([['minimal', t('personalization.statsStyle.minimal')], ['detailed', t('personalization.statsStyle.detailed')], ['badges', t('personalization.statsStyle.badges')]] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateTheme('stats_style', value)}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          theme.stats_style === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Borde de Links</CardTitle>
                    <CardDescription>Estilo del borde alrededor de cada link</CardDescription>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-2">
                    {([['none', 'Sin borde'], ['thin', 'Borde sutil'], ['glow', 'Resplandor'], ['gradient', 'Degradado']] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateTheme('link_border_style', value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          theme.link_border_style === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sombra de Links</CardTitle>
                    <CardDescription>Profundidad visual de los botones</CardDescription>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-2">
                    {([['none', 'Sin sombra'], ['soft', 'Suave'], ['medium', 'Media'], ['strong', 'Fuerte']] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateTheme('link_shadow', value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          theme.link_shadow === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  {theme.link_shadow !== 'none' && (
                    <div className="mt-3">
                      <ColorInput label="Color de sombra" value={theme.shadow_color} onChange={(v) => updateTheme('shadow_color', v)} />
                    </div>
                  )}
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Velocidad de Animación</CardTitle>
                    <CardDescription>Qué tan rápido entran los elementos</CardDescription>
                  </CardHeader>
                  <div className="flex gap-2">
                    {([['slow', 'Lenta'], ['normal', 'Normal'], ['fast', 'Rápida']] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateTheme('animation_speed', value)}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          theme.animation_speed === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Programación de Tema</CardTitle>
                    <CardDescription>Cambiá el tema automáticamente según la hora del día</CardDescription>
                  </CardHeader>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-surface-3 rounded-xl">
                      <div>
                        <span className="text-sm font-medium">Activar cambio día/noche</span>
                        <p className="text-xs text-text-secondary">El perfil cambiará de tema según el horario</p>
                      </div>
                      <div className={`relative w-11 h-6 rounded-full transition-colors ${theme.schedule.enabled ? 'bg-aburrido-500' : 'bg-border'} shrink-0 ml-3`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${theme.schedule.enabled ? 'translate-x-5' : ''}`} />
                        <input type="checkbox" checked={theme.schedule.enabled}
                          onChange={(e) => updateTheme('schedule', { ...theme.schedule, enabled: e.target.checked })}
                          className="sr-only" />
                      </div>
                    </div>
                    {theme.schedule.enabled && (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-surface-3 rounded-xl">
                          <span className="text-sm font-medium w-20">Tema día</span>
                          <select
                            value={theme.schedule.day_theme || ''}
                            onChange={(e) => updateTheme('schedule', { ...theme.schedule, day_theme: (e.target.value || null) as ThemeType | null })}
                            className="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500"
                          >
                            <option value="">Sin cambiar</option>
                            {Object.keys(THEMES).map((key) => (
                              <option key={key} value={key}>{key}</option>
                            ))}
                          </select>
                          <input type="time" value={theme.schedule.day_start}
                            onChange={(e) => updateTheme('schedule', { ...theme.schedule, day_start: e.target.value })}
                            className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500"
                          />
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-surface-3 rounded-xl">
                          <span className="text-sm font-medium w-20">Tema noche</span>
                          <select
                            value={theme.schedule.night_theme || ''}
                            onChange={(e) => updateTheme('schedule', { ...theme.schedule, night_theme: (e.target.value || null) as ThemeType | null })}
                            className="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500"
                          >
                            <option value="">Sin cambiar</option>
                            {Object.keys(THEMES).map((key) => (
                              <option key={key} value={key}>{key}</option>
                            ))}
                          </select>
                          <input type="time" value={theme.schedule.night_start}
                            onChange={(e) => updateTheme('schedule', { ...theme.schedule, night_start: e.target.value })}
                            className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Insignia de Verificación</CardTitle>
                    <CardDescription>Mostrar badge de verificado en el perfil público</CardDescription>
                  </CardHeader>
                  <Toggle
                    label="Mostrar insignia de verificación"
                    description="Aparece junto al nombre en el perfil público"
                    checked={theme.show_verification_badge}
                    onChange={(v) => updateTheme('show_verification_badge', v)}
                  />
                </Card>
              </div>
            )}

            {/* Tab: Decorations */}
            {activeTab === 'decorations' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkle className="w-5 h-5 text-aburrido-400" />
                      <CardTitle>Decoraciones de esquina</CardTitle>
                    </div>
                    <CardDescription>Agregá ornamentos en las esquinas del perfil</CardDescription>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-2">
                    {([['none', 'Sin decoración'], ['dots', 'Puntos'], ['lines', 'Líneas'], ['ornate', 'Ornamental']] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateTheme('corner_decoration', value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          theme.corner_decoration === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Paintbrush className="w-5 h-5 text-aburrido-400" />
                      <CardTitle>Estilo del título</CardTitle>
                    </div>
                    <CardDescription>Efecto visual del nombre principal</CardDescription>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-2">
                    {([['normal', 'Normal'], ['gradient', 'Gradiente'], ['shadow', 'Sombra'], ['outline', 'Contorno']] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateTheme('title_style', value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          theme.title_style === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 space-y-3">
                    <Toggle
                      label="Texto del nombre con gradiente"
                      description="Usa el color de acento como gradiente en el nombre"
                      checked={theme.show_gradient_text}
                      onChange={(v) => updateTheme('show_gradient_text', v)}
                    />
                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1.5 block">Tamaño del título</label>
                      <div className="flex gap-2">
                        {([['sm', 'Chico'], ['md', 'Mediano'], ['lg', 'Grande'], ['xl', 'Extra']] as const).map(([value, label]) => (
                          <button key={value} onClick={() => updateTheme('title_font_size', value)}
                            className={`flex-1 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all ${
                              theme.title_font_size === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                            }`}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-aburrido-400" />
                      <CardTitle>Animación de entrada</CardTitle>
                    </div>
                    <CardDescription>Cómo aparece el contenido al cargar el perfil</CardDescription>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-2">
                    {([['fade', 'Desvanecer'], ['slide-up', 'Deslizar'], ['zoom', 'Zoom'], ['none', 'Ninguna']] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateTheme('entrance_animation', value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          theme.entrance_animation === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-aburrido-400" />
                      <CardTitle>Intensidad de brillo</CardTitle>
                    </div>
                    <CardDescription>Qué tanto brillan los elementos al hacer hover</CardDescription>
                  </CardHeader>
                  <div className="flex gap-2">
                    {([['subtle', 'Sutil'], ['normal', 'Normal'], ['strong', 'Fuerte']] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateTheme('glow_intensity', value)}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          theme.glow_intensity === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-aburrido-400" />
                      <CardTitle>Insignia de verificación</CardTitle>
                    </div>
                    <CardDescription>Estilo del badge de verificado</CardDescription>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-2">
                    {([['standard', 'Estándar'], ['glow', 'Brillante'], ['minimal', 'Minimal'], ['none', 'Oculto']] as const).map(([value, label]) => (
                      <button key={value} onClick={() => updateTheme('badge_style', value)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          theme.badge_style === value ? 'border-aburrido-500 bg-aburrido-500/10 text-aburrido-400' : 'border-border text-text-secondary hover:border-aburrido-500/50'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-aburrido-400" />
                      <CardTitle>Vista previa de links</CardTitle>
                    </div>
                    <CardDescription>Mostrar la URL al hacer hover sobre un link</CardDescription>
                  </CardHeader>
                  <Toggle
                    label="Mostrar URL al hacer hover"
                    description="Al pasar el mouse por un link, se muestra la dirección debajo"
                    checked={theme.show_link_url_preview}
                    onChange={(v) => updateTheme('show_link_url_preview', v)}
                  />
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-aburrido-400" />
                      <CardTitle>Formulario de contacto</CardTitle>
                    </div>
                    <CardDescription>Agregá un formulario de suscripción por email</CardDescription>
                  </CardHeader>
                  <div className="space-y-3">
                    <Toggle
                      label="Habilitar formulario de leads"
                      description="Los visitantes pueden dejar su email"
                      checked={theme.lead_form_enabled}
                      onChange={(v) => updateTheme('lead_form_enabled', v)}
                    />
                    {theme.lead_form_enabled && (
                      <>
                        <div>
                          <label className="text-xs text-text-secondary block mb-1">Título del formulario</label>
                          <input type="text" value={theme.lead_form_title}
                            onChange={(e) => updateTheme('lead_form_title', e.target.value)}
                            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500" />
                        </div>
                        <div>
                          <label className="text-xs text-text-secondary block mb-1">Texto del botón</label>
                          <input type="text" value={theme.lead_form_button_text}
                            onChange={(e) => updateTheme('lead_form_button_text', e.target.value)}
                            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500" />
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Tab: Advanced */}
            {activeTab === 'advanced' && (
              <div className="space-y-4">
                {/* Music */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-aburrido-400" />
                      <CardTitle>{t('personalization.video.music')}</CardTitle>
                    </div>
                    <CardDescription>{t('personalization.video.musicUrl')}</CardDescription>
                  </CardHeader>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={theme.background_music_url || ''}
                      onChange={(e) => updateTheme('background_music_url', e.target.value || null)}
                      className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-white text-sm focus:outline-none focus:border-aburrido-500"
                      placeholder="https://example.com/song.mp3"
                    />
                    {theme.background_music_url && (
                      <audio controls className="w-full rounded-xl" style={{ filter: 'invert(0.85)' }}>
                        <source src={theme.background_music_url} />
                      </audio>
                    )}
                  </div>
                </Card>

                {/* CSS */}
                {profile.is_premium ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('personalization.advanced.customCss')}</CardTitle>
                      <CardDescription>{t('personalization.advanced.customCssDesc')}</CardDescription>
                    </CardHeader>
                    <textarea
                      value={theme.custom_css || ''}
                      onChange={(e) => updateTheme('custom_css', e.target.value)}
                      className="w-full h-48 px-4 py-3 bg-surface-2 border border-border rounded-xl text-white font-mono text-sm focus:outline-none focus:border-aburrido-500 resize-none"
                      placeholder={t('personalization.advanced.customCssPlaceholder')}
                    />
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('personalization.advanced.customCss')}</CardTitle>
                      <CardDescription>{t('personalization.advanced.customCssDesc')}</CardDescription>
                    </CardHeader>
                    <div className="py-8 text-center">
                      <Code className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                      <p className="text-text-secondary text-sm mb-4">{t('personalization.advanced.customCssDesc')}</p>
                      <a href="/premium"><Button variant="premium">{t('premium.cta')}</Button></a>
                    </div>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings.profileInfo')}</CardTitle>
                    <CardDescription>{t('settings.profileInfoDesc')}</CardDescription>
                  </CardHeader>
                  <div className="space-y-3">
                    <Input label={t('settings.displayName')} value={profile.display_name || ''} onChange={() => {}} placeholder={profile.username} />
                    <Input label={t('settings.bio')} value={profile.bio || ''} onChange={() => {}} placeholder={t('settings.bioPlaceholder')} />
                    <p className="text-xs text-text-secondary">{t('settings.bio')} <a href="/settings" className="text-aburrido-400 hover:underline">{t('settings.personalization')}</a></p>
                  </div>
                </Card>
              </div>
            )}

            {/* Tab: Blocks */}
            {activeTab === 'blocks' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Bloques</CardTitle>
                        <CardDescription>Agregá y organizá secciones de tu perfil</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={async () => {
                            const res = await linkApi.getAll()
                            if (!res.success || !res.data) return
                            const links = res.data
                            const catMap: Record<string, string> = {
                              'github.com': 'Desarrollo', 'youtube.com': 'Video', 'twitter.com': 'Social',
                              'instagram.com': 'Social', 'tiktok.com': 'Video', 'linkedin.com': 'Profesional',
                              'spotify.com': 'Música', 'twitch.tv': 'Streaming', 'discord.com': 'Comunidad',
                            }
                            const iconSuggestion: Record<string, string> = {
                              'github.com': '🐙', 'youtube.com': '📺', 'twitter.com': '🐦',
                              'instagram.com': '📷', 'tiktok.com': '🎵', 'linkedin.com': '💼',
                              'spotify.com': '🎧', 'twitch.tv': '🎮', 'discord.com': '💬',
                            }
                            for (const link of links) {
                              const url = link.url.toLowerCase()
                              let category = ''
                              let icon = ''
                              for (const [domain, cat] of Object.entries(catMap)) {
                                if (url.includes(domain)) { category = cat; icon = iconSuggestion[domain] || ''; break }
                              }
                              await linkApi.update(link.id, { category, icon: icon ? 'custom' as any : link.icon, icon_url: icon || link.icon_url })
                            }
                            const cats = [...new Set(links.map((l) => {
                              const url = l.url.toLowerCase()
                              for (const [domain, cat] of Object.entries(catMap)) { if (url.includes(domain)) return cat }
                              return ''
                            }).filter(Boolean))]
                            if (cats.length) await profileApi.update({} as any)
                            setBlocksMessage('Links organizados automáticamente')
                            setTimeout(() => setBlocksMessage(null), 3000)
                          }}
                        >
                          <Wand2 className="w-4 h-4" />
                          Auto-organizar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <div className="space-y-3">
                    {blocksMessage && (
                      <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl text-sm text-green-400">
                        {blocksMessage}
                      </div>
                    )}
                    {blocks.length === 0 ? (
                      <div className="py-8 text-center">
                        <LayoutGrid className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                        <p className="text-text-secondary text-sm">No hay bloques todavía. Agregá tu primer bloque.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {blocks.sort((a, b) => a.position - b.position).map((block, index) => (
                          <div key={block.id} className="p-4 bg-surface-3 rounded-xl border border-border space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-text-secondary w-5">{index + 1}</span>
                                <span className="text-sm font-medium capitalize">{block.type}</span>
                                {!block.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Inactivo</span>}
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    const updated = [...blocks]
                                    const idx = updated.findIndex((b) => b.id === block.id)
                                    if (idx > 0) { const a = updated[idx - 1]; const b = updated[idx]; if (a && b) { updated[idx - 1] = b; updated[idx] = a; updated.forEach((bi, i) => (bi.position = i)); setBlocks(updated) } }
                                  }}
                                  disabled={index === 0}
                                  className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-surface-2 disabled:opacity-30 transition-all"
                                >
                                  <MoveUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    const updated = [...blocks]
                                    const idx = updated.findIndex((b) => b.id === block.id)
                                    if (idx < updated.length - 1) { const a = updated[idx]; const b = updated[idx + 1]; if (a && b) { updated[idx] = b; updated[idx + 1] = a; updated.forEach((bi, i) => (bi.position = i)); setBlocks(updated) } }
                                  }}
                                  disabled={index === blocks.length - 1}
                                  className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-surface-2 disabled:opacity-30 transition-all"
                                >
                                  <MoveDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    const idx = blocks.findIndex((b) => b.id === block.id)
                                    setBlocks((prev) => { const updated = prev.filter((_, i) => i !== idx); updated.forEach((b, i) => (b.position = i)); return updated })
                                  }}
                                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={block.type}
                                onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, type: e.target.value as Block['type'], data: {} } : b))}
                                className="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500"
                              >
                                <option value="hero">Hero</option>
                                <option value="links">Links</option>
                                <option value="gallery">Galería</option>
                                <option value="embed">Embed</option>
                                <option value="text">Texto</option>
                                <option value="cta">CTA</option>
                                <option value="divider">Divisor</option>
                              </select>
                              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                                <div className={`relative w-9 h-5 rounded-full transition-colors ${block.is_active ? 'bg-aburrido-500' : 'bg-border'}`}>
                                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${block.is_active ? 'translate-x-4' : ''}`} />
                                  <input type="checkbox" checked={block.is_active} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, is_active: e.target.checked } : b))} className="sr-only" />
                                </div>
                                Activo
                              </label>
                            </div>
                            {/* Block type-specific data editors */}
                            {block.type === 'hero' && (
                              <div className="space-y-2 pt-1">
                                <input type="text" placeholder="URL del avatar" value={(block.data.avatarUrl as string) || ''} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, avatarUrl: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500" />
                                <input type="text" placeholder="Nombre a mostrar" value={(block.data.displayName as string) || ''} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, displayName: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500" />
                                <textarea placeholder="Biografía" value={(block.data.bio as string) || ''} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, bio: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500 resize-none" rows={2} />
                              </div>
                            )}
                            {block.type === 'links' && (
                              <div className="space-y-2 pt-1">
                                <input type="text" placeholder="Título de la sección" value={(block.data.title as string) || ''} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, title: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500" />
                                <p className="text-xs text-text-secondary">Los links se mostrarán automáticamente desde tu lista de links.</p>
                              </div>
                            )}
                            {block.type === 'gallery' && (
                              <div className="space-y-2 pt-1">
                                <div className="flex items-center gap-2">
                                  <input type="text" placeholder="URL de imagen" className="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500"
                                    value={''}
                                    onChange={(e) => {
                                      const input = e.target
                                      const val = input.value
                                      if (val && val.endsWith('.') === false && val.length > 5) {
                                        setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, images: [...((b.data.images as string[]) || []), val] } } : b))
                                        input.value = ''
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        const val = e.currentTarget.value.trim()
                                        setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, images: [...((b.data.images as string[]) || []), val] } } : b))
                                        e.currentTarget.value = ''
                                      }
                                    }}
                                  />
                                  <Image className="w-4 h-4 text-text-secondary shrink-0" />
                                </div>
                                {(block.data.images as string[] || []).length > 0 && (
                                  <div className="grid grid-cols-4 gap-2">
                                    {(block.data.images as string[] || []).map((img, i) => (
                                      <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-surface-2 border border-border">
                                        <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                        <button onClick={() => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, images: (b.data.images as string[] || []).filter((_, j) => j !== i) } } : b))} className="absolute top-0.5 right-0.5 p-0.5 bg-red-500/80 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            {block.type === 'embed' && (
                              <div className="space-y-2 pt-1">
                                <input type="url" placeholder="URL del embed (YouTube, Spotify, etc.)" value={(block.data.url as string) || ''} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, url: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500" />
                              </div>
                            )}
                            {block.type === 'text' && (
                              <div className="space-y-2 pt-1">
                                <textarea placeholder="Contenido del texto (Markdown)" value={(block.data.content as string) || ''} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, content: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500 resize-none" rows={3} />
                              </div>
                            )}
                            {block.type === 'cta' && (
                              <div className="space-y-2 pt-1">
                                <input type="text" placeholder="Texto del botón" value={(block.data.text as string) || ''} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, text: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500" />
                                <input type="url" placeholder="URL de destino" value={(block.data.url as string) || ''} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, url: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500" />
                                <select value={(block.data.style as string) || 'primary'} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, style: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500">
                                  <option value="primary">Primario</option>
                                  <option value="secondary">Secundario</option>
                                  <option value="outline">Outline</option>
                                </select>
                              </div>
                            )}
                            {block.type === 'divider' && (
                              <div className="space-y-2 pt-1">
                                <select value={(block.data.style as string) || 'line'} onChange={(e) => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, data: { ...b.data, style: e.target.value } } : b))} className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-white text-sm focus:outline-none focus:border-aburrido-500">
                                  <option value="line">Línea</option>
                                  <option value="dots">Puntos</option>
                                  <option value="glow">Brillo</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        const newBlock: Block = {
                          id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                          type: 'hero',
                          position: blocks.length,
                          data: {},
                          is_active: true,
                        }
                        setBlocks((prev) => [...prev, newBlock])
                      }}
                    >
                      <Plus className="w-4 h-4" /> Agregar bloque
                    </Button>
                  </div>
                </Card>
                <div className="flex justify-end">
                  <Button
                    isLoading={isSavingBlocks}
                    onClick={async () => {
                      setIsSavingBlocks(true)
                      await blockApi.update(blocks)
                      setIsSavingBlocks(false)
                      setBlocksMessage('Bloques guardados correctamente')
                      setTimeout(() => setBlocksMessage(null), 3000)
                    }}
                  >
                    <Save className="w-4 h-4" /> Guardar bloques
                  </Button>
                </div>
              </div>
            )}

          </div>
          {/* Right: Real Preview */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('personalization.preview')}</CardTitle>
                  <div className="flex gap-1 bg-surface-3 rounded-lg p-0.5">
                    <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded-md transition-colors ${previewDevice === 'desktop' ? 'bg-aburrido-500 text-white' : 'text-text-secondary'}`}>
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded-md transition-colors ${previewDevice === 'mobile' ? 'bg-aburrido-500 text-white' : 'text-text-secondary'}`}>
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <CardDescription>{t('personalization.preview')}</CardDescription>
              </CardHeader>
              <div className={`${previewDevice === 'mobile' ? 'max-w-[360px] mx-auto' : ''}`}>
                <ProfilePreview theme={theme} profile={profile} />
              </div>
              <div className="mt-4 p-3 bg-surface-3 rounded-xl space-y-1">
                <p className="text-xs text-text-secondary">
                  <span className="font-medium text-white">{t('personalization.tab.presets')}:</span> {theme.type}
                </p>
                <p className="text-xs text-text-secondary">
                  <span className="font-medium text-white">{t('personalization.colors.background')}:</span> {theme.background_type}
                  {theme.background_type === 'video' && theme.background_video_url && ' · ' + t('personalization.bgType.video')}
                  {theme.background_video_sound && ' + ' + t('personalization.video.videoSound')}
                  {theme.background_music_url && ' · ' + t('personalization.video.music')}
                </p>
                <p className="text-xs text-text-secondary">
                  <span className="font-medium text-white">{t('personalization.layout.buttonStyle')}:</span> {theme.button_style}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
