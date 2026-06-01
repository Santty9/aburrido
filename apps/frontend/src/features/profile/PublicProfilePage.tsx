import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { iconMap, DEFAULT_THEME } from '@aburrido/shared'
import type { PublicProfile } from '@aburrido/shared'
import { profileApi, linkApi } from '@/lib/api'
import { QRCode } from '@/components/QRCode'
import {
  ExternalLink, ChevronDown, Share2, Copy, Check, Eye, MousePointerClick,
  Sparkles, Zap, Heart, Globe, Volume2, VolumeX, Download, Music, Film,
  Loader2, ArrowUpRight, Lock
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

function renderMarkdown(text: string): string {
  let html = text
    .replace(/### (.+)/g, '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>')
    .replace(/## (.+)/g, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    .replace(/# (.+)/g, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-black/20 rounded text-xs">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline opacity-80 hover:opacity-100">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br />')
  html = '<p class="mb-2">' + html + '</p>'
  return html
}

function ParticleField({ count = 20, accent = '#8b5cf6' }: { count?: number; accent?: string }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.3 + 0.05, delay: Math.random() * 5,
    })), [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
            background: accent,
            opacity: p.opacity,
            filter: `blur(${p.size > 2 ? '1px' : '0px'})`,
          }}
          animate={{ y: [0, -40, 0], opacity: [p.opacity, p.opacity * 2.5, p.opacity] }}
          transition={{ duration: 4 + p.speed * 5, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function LoadingScreen({ t }: { t: (key: any) => string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.08),transparent_70%)]" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-[3px] border-aburrido-500/30 border-t-aburrido-500 rounded-full"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-sm text-text-secondary/60 font-medium tracking-wider uppercase"
      >
        {t('profile.loading')}
      </motion.p>
    </div>
  )
}

function Error404({ error, t }: { error: string; t: (key: any) => string }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.06),transparent_70%)]" />
      <div className="text-center relative z-10">
        <motion.h1
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 150 }}
          className="text-9xl font-black gradient-text mb-4"
        >
          404
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <p className="text-text-secondary text-lg">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">🔮</span>
          </div>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05, gap: '12px' }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-aburrido-500/10 border border-aburrido-500/30 text-aburrido-400 font-medium text-sm transition-all hover:bg-aburrido-500/20"
          >
            {t('profile.404.back')} <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}

function MediaBackground({ theme, muted }: { theme: any; muted: boolean }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (imgRef.current && theme.background_type === 'image') {
      imgRef.current.src = theme.background
    }
  }, [theme.background, theme.background_type])

  if (theme.background_type === 'video' && theme.background_video_url) {
    const isDataUrl = theme.background_video_url.startsWith('data:')
    return (
      <>
        <video
          ref={videoRef}
          autoPlay loop playsInline muted={muted}
          onLoadedData={() => setLoaded(true)}
          onCanPlay={() => setLoaded(true)}
          onError={() => setError(true)}
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ filter: `brightness(${1 - (theme.overlay_opacity || 40) / 100 * 0.65}) saturate(1.2)` }}
        >
          <source src={theme.background_video_url} type={isDataUrl ? 'video/mp4' : 'video/mp4'} />
          {!isDataUrl && <source src={theme.background_video_url.replace(/\.mp4/i, '.webm')} type="video/webm" />}
        </video>
        {!loaded && !error && (
          <div className="absolute inset-0 bg-surface flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-text-secondary/30 animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0" style={{ background: theme.background || '#0a0a0f' }} />
        )}
        {loaded && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent pointer-events-none"
            style={{ opacity: (theme.overlay_opacity ?? 40) / 100, background: `linear-gradient(180deg, transparent, ${theme.overlay_color || '#000000'}60)` }}
          />
        )}
      </>
    )
  }

  if (theme.background_type === 'image' && theme.background) {
    return (
      <>
        <img
          ref={imgRef}
          src={theme.background}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: loaded ? 1 : 0, filter: 'brightness(0.5) saturate(1.1)' }}
        />
        {!loaded && !error && (
          <div className="absolute inset-0 bg-surface flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-text-secondary/30 animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0" style={{ background: theme.background || '#0a0a0f' }} />
        )}
        {loaded && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none"
            style={{ opacity: (theme.overlay_opacity ?? 40) / 100 }}
          />
        )}
      </>
    )
  }

  return null
}

export function PublicProfilePage() {
  const { t } = useLanguage()
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['__default__']))
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [totalViews] = useState(() => Math.floor(Math.random() * 5000) + 500)
  const [muted, setMuted] = useState(true)
  const [volume, setVolume] = useState(50)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [avatarLoaded, setAvatarLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const profileUrl = window.location.href

  useEffect(() => {
    if (!username) return
    setProfile(null); setError(null)
    profileApi.getByUsername(username).then((res) => {
      if (res.success && res.data) {
        const data = res.data as PublicProfile
        setProfile(data)
        const cats = [...new Set<string>(data.links?.map((l: any) => l.category).filter(Boolean) || [])]
        setExpandedCategories(new Set<string>(['__default__', ...cats]))
      } else {
        setError(res.error || 'Perfil no encontrado')
      }
    }).catch(() => {
      setError('Error al cargar el perfil')
    })
    document.title = `${username} | Aburrido`
    return () => { document.title = 'Aburrido - Tu perfil de links' }
  }, [username])

  useEffect(() => {
    const setMeta = (prop: string, name: string, content: string) => {
      let el = document.querySelector(`meta[${prop}="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(prop, name); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    if (!profile) return
    const desc = profile.bio || `Mira el perfil de ${username} en Aburrido`
    const title = `${profile.display_name || username} | Aburrido`
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', profileUrl)
    setMeta('property', 'og:type', 'profile')
    setMeta('property', 'og:image', profile.avatar_url || '')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', profile.avatar_url || '')
  }, [profile, username, profileUrl])

  const handleClick = useCallback(async (linkId: string) => {
    await linkApi.trackClick(linkId)
  }, [])

  const copyProfileLink = useCallback(() => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [profileUrl])

  const hasMedia = profile && (profile.theme.background_type === 'video' || profile.theme.background_music_url)

  useEffect(() => {
    if (audioRef.current) { audioRef.current.volume = muted ? 0 : volume / 100; audioRef.current.muted = muted }
  }, [volume, muted])

  const groupedLinks = useMemo(() => {
    if (!profile) return {}
    const groups: Record<string, typeof profile.links> = { __default__: [] }
    for (const link of profile.links) {
      const cat = (link as any).category || '__default__'
      if (!groups[cat]) groups[cat] = []
      groups[cat]!.push(link)
    }
    return groups
  }, [profile])

  const toggleCategory = useCallback((cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat); else next.add(cat)
      return next
    })
  }, [])

  const totalClicks = useMemo(() =>
    profile?.links.reduce((s, l) => s + l.clicks, 0) || 0,
  [profile])

  if (error) return <Error404 error={error} t={t} />
  if (!profile) return <LoadingScreen t={t} />

  const theme = { ...DEFAULT_THEME, ...(profile.theme || {}) }
  const isGradient = theme.background_type === 'gradient'
  const isVideo = theme.background_type === 'video'
  const isImage = theme.background_type === 'image'
  const isPremium = profile.is_premium
  const isGlass = theme.button_style === 'glass'
  const blurMap = { none: '0px', light: '8px', medium: '16px', strong: '24px' }
  const glassBlur = blurMap[(theme.glass_blur || 'medium') as keyof typeof blurMap]

  const btnRadius = theme.button_style === 'pill' ? '9999px' : theme.button_style === 'sharp' ? '10px' : '16px'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-hidden"
      style={{
        background: isVideo || isImage ? undefined : isGradient ? theme.background : theme.background,
        color: theme.text_color,
      }}
    >
      {/* Media Background */}
      {(isVideo || isImage) && <MediaBackground theme={theme} muted={muted} />}

      {/* Gradient Fallback for video/image backgrounds */}
      {(isVideo || isImage) && (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${theme.text_color}02, ${theme.text_color}08 40%, ${theme.text_color}15)` }}
        />
      )}

      {/* Music */}
      {theme.background_music_url && (
        <audio ref={audioRef} autoPlay loop playsInline hidden>
          <source src={theme.background_music_url} />
        </audio>
      )}

      {/* Volume Controller */}
      {hasMedia && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-5 right-5 z-50"
        >
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ width: 0, opacity: 0, x: 20 }}
                  animate={{ width: 140, opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-2xl overflow-hidden"
                  style={{
                    background: `${theme.text_color}08`,
                    border: `1px solid ${theme.text_color}12`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setMuted(!muted) }}
                    className="shrink-0 transition-all"
                    style={{ color: muted ? theme.text_color + '40' : theme.text_color }}
                  >
                    {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={muted ? 0 : volume}
                    onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false) }}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(90deg, ${theme.accent_color} ${muted ? 0 : volume}%, rgba(255,255,255,0.08) ${muted ? 0 : volume}%)`,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-2xl ml-2"
              style={{
                background: `${theme.text_color}10`,
                border: `1px solid ${theme.text_color}15`,
                color: muted ? theme.text_color + '50' : theme.text_color,
                boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
              }}
            >
              {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {theme.background_music_url && !isVideo && <Music className="w-3 h-3 absolute -top-0.5 -right-0.5 opacity-60" />}
              {isVideo && <Film className="w-3 h-3 absolute -top-0.5 -right-0.5 opacity-60" />}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Particles */}
      {theme.show_particles && <ParticleField count={isPremium ? 40 : 20} accent={theme.accent_color} />}

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

      {/* Main Content */}
      <motion.div
        initial={{ opacity: theme.entrance_animation === 'none' ? 1 : theme.entrance_animation === 'slide-up' ? 0 : theme.entrance_animation === 'zoom' ? 0 : 0,
                   y: theme.entrance_animation === 'slide-up' ? 40 : 0,
                   scale: theme.entrance_animation === 'zoom' ? 0.85 : 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: theme.animation_speed === 'fast' ? 0.3 : theme.animation_speed === 'slow' ? 0.8 : 0.5 }}
        className="w-full max-w-md mx-auto flex flex-col items-center gap-5 relative z-10 py-8 sm:py-12"
      >
        <div style={{ display: theme.profile_password && !(window as any).__profileUnlocked ? 'none' : '' }}>
        {/* Password Gate */}
        {theme.profile_password && !(window as any).__profileUnlocked && (
          <div className="w-full flex flex-col items-center gap-4 p-8">
            <div className="w-16 h-16 rounded-2xl bg-aburrido-500/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-aburrido-400" />
            </div>
            <h2 className="text-lg font-bold">Perfil protegido</h2>
            <p className="text-sm text-text-secondary text-center">Este perfil está protegido con contraseña</p>
            <form onSubmit={(e) => { e.preventDefault(); if (passwordInput === theme.profile_password) { setPasswordError(false); (window as any).__profileUnlocked = true; setPasswordInput('') } else { setPasswordError(true) } }} className="w-full max-w-xs space-y-3">
              <input type="password" value={passwordInput} placeholder="Contraseña"
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false) }}
                className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-white text-sm text-center focus:outline-none focus:border-aburrido-500"
                autoFocus />
              {passwordError && <p className="text-xs text-red-400 text-center">Contraseña incorrecta</p>}
              <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold" style={{ background: theme.accent_color, color: '#fff' }}>
                Entrar
              </button>
            </form>
          </div>
        )}
        {theme.show_avatar && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
            className="relative group"
          >
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  `0 0 25px ${theme.accent_color}30, 0 0 50px ${theme.accent_color}10`,
                  `0 0 35px ${theme.accent_color}50, 0 0 70px ${theme.accent_color}20`,
                  `0 0 25px ${theme.accent_color}30, 0 0 50px ${theme.accent_color}10`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Avatar container */}
            <div
              className={`rounded-full overflow-hidden relative ${theme.avatar_size === 'lg' ? 'w-28 h-28' : theme.avatar_size === 'sm' ? 'w-16 h-16' : 'w-24 h-24'}`}
              style={{
                boxShadow: `0 0 40px ${theme.accent_color}30, 0 0 80px ${theme.accent_color}10`,
                border: `3px solid ${theme.accent_color}50`,
              }}
            >
              {profile.avatar_url ? (
                <>
                  <motion.img
                    src={profile.avatar_url}
                    alt={profile.display_name || username}
                    className="w-full h-full object-cover"
                    style={{ opacity: avatarLoaded ? 1 : 0 }}
                    onLoad={() => setAvatarLoaded(true)}
                    initial={{ scale: 1.1 }}
                    animate={avatarLoaded ? { scale: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  />
                  {!avatarLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.accent_color}, ${theme.accent_color}66)` }}>
                      <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-4xl font-black select-none"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent_color}, ${theme.accent_color}77)`,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  {(profile.display_name || username || '?')[0]?.toUpperCase()}
                </div>
              )}
              {/* Premium badge */}
              {isPremium && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, #f59e0b, #d97706)`,
                    border: '2px solid rgba(0,0,0,0.3)',
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-2">
            <h1
              className={`${
                theme.title_font_size === 'sm' ? 'text-xl sm:text-2xl' :
                theme.title_font_size === 'md' ? 'text-2xl sm:text-3xl' :
                theme.title_font_size === 'lg' ? 'text-3xl sm:text-4xl' :
                'text-4xl sm:text-5xl'
              } font-black tracking-tight leading-tight ${
                theme.title_style === 'gradient' ? 'bg-gradient-to-r from-white via-aburrido-300 to-white bg-clip-text text-transparent' :
                theme.title_style === 'shadow' ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' :
                theme.title_style === 'outline' ? 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.8)]' : ''
              }`}
              style={{
                ...(theme.show_gradient_text ? { background: `linear-gradient(135deg, ${theme.accent_color}, #ffffff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}),
                textShadow: `0 2px 20px rgba(0,0,0,0.3)`,
                fontFamily: theme.font,
              }}
            >
              {profile.display_name || username}
            </h1>
            {profile.is_verified && theme.show_verification_badge && theme.badge_style !== 'none' && (
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
                className={`${theme.badge_style === 'glow' ? 'w-7 h-7 shadow-lg shadow-aburrido-500/60 animate-pulse' : theme.badge_style === 'minimal' ? 'w-5 h-5 bg-aburrido-500/80' : 'w-6 h-6 shadow-lg shadow-aburrido-500/40'} rounded-full bg-aburrido-500 flex items-center justify-center`}
                title="Verificado"
              >
                <Check className="w-3.5 h-3.5 text-white" />
              </motion.div>
            )}
          </div>

          {theme.show_bio && profile.bio && (
            <motion.div
              className="text-sm leading-relaxed max-w-xs mx-auto font-light"
              style={{ opacity: 0.75, fontFamily: theme.font }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.75, y: 0 }}
              transition={{ delay: 0.35 }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(profile.bio) }}
            />
          )}

          {isPremium && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: `linear-gradient(135deg, ${theme.accent_color}25, ${theme.accent_color}08)`,
                border: `1px solid ${theme.accent_color}35`,
                color: theme.accent_color,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Sparkles className="w-3 h-3" />
              {t('profile.premium.badge')}
            </motion.div>
          )}
        </motion.div>

        {/* Share + QR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-2"
        >
          <motion.button
            onClick={copyProfileLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all backdrop-blur-sm"
            style={{
              background: copied ? '#22c55e18' : `${theme.text_color}06`,
              border: `1px solid ${copied ? '#22c55e30' : theme.text_color + '12'}`,
              color: copied ? '#22c55e' : theme.text_color,
            }}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t('profile.copied') : t('profile.copyLink')}
          </motion.button>
          <motion.button
            onClick={() => setShowQR(!showQR)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all backdrop-blur-sm"
            style={{
              background: `${theme.text_color}06`,
              border: `1px solid ${theme.text_color}12`,
              color: theme.text_color,
              opacity: 0.7,
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
            {t('profile.qr')}
          </motion.button>
          <motion.button
            onClick={() => {
              const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.display_name || username}
NICKNAME:${username}
URL:${profileUrl}
${profile.bio ? `NOTE:${profile.bio.replace(/\n/g, '\\n')}` : ''}
END:VCARD`
              const blob = new Blob([vcard], { type: 'text/vcard' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = `${username}.vcf`; a.click()
              URL.revokeObjectURL(url)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all backdrop-blur-sm"
            style={{
              background: `${theme.text_color}06`,
              border: `1px solid ${theme.text_color}12`,
              color: theme.text_color,
              opacity: 0.7,
            }}
          >
            <Download className="w-3.5 h-3.5" />
            vCard
          </motion.button>
        </motion.div>

        {/* QR Panel */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden w-full"
            >
              <motion.div
                className="p-5 rounded-2xl backdrop-blur-2xl"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                }}
              >
                <QRCode url={profileUrl} title={profile.display_name || username} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badges */}
        {profile.badges && profile.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 flex-wrap justify-center"
          >
            {profile.badges.map((badge) => (
              <motion.div
                key={badge.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                style={{
                  background: badge.background,
                  border: `1px solid ${badge.color}30`,
                  color: badge.color,
                }}
                whileHover={{ scale: 1.08, y: -1 }}
                title={badge.name}
              >
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="w-full space-y-3 mt-1"
        >
          {Object.entries(groupedLinks).map(([category, links]) => {
            const isDefault = category === '__default__'
            const isExpanded = expandedCategories.has(category)

            if (isDefault) {
              return (
                <div key="__default" className="space-y-2.5">
                  {links.map((link, i) => (
                    <div key={link.id}>
                      <motion.a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleClick(link.id)}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.06, type: 'spring', damping: 20 }}
                        whileHover={{ scale: link.featured ? 1.03 : 1.02, y: link.featured ? -2 : -1 }}
                        whileTap={{ scale: 0.98 }}
                        onHoverStart={() => setHoveredLink(link.id)}
                        onHoverEnd={() => setHoveredLink(null)}
                        className="relative flex items-center gap-3.5 w-full px-5 py-4 overflow-hidden group transition-shadow"
                        style={{
                          background: isGlass ? 'rgba(255,255,255,0.06)' : theme.button_color,
                          color: theme.button_text_color,
                          borderRadius: btnRadius,
                          backdropFilter: isGlass ? `blur(${glassBlur})` : 'none',
                          border: isGlass ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${theme.text_color}08`,
                          boxShadow: hoveredLink === link.id ? `0 4px 20px ${theme.shadow_color || theme.accent_color}30` : (theme.link_shadow && theme.link_shadow !== 'none' ? `0 4px 12px ${theme.shadow_color || '#000'}${theme.link_shadow === 'soft' ? '15' : theme.link_shadow === 'medium' ? '25' : '40'}` : `0 1px 4px rgba(0,0,0,0.1)${theme.glow_intensity === 'strong' ? ', 0 0 20px ' + theme.accent_color + '15' : ''}`),
                          fontFamily: theme.font,
                        }}
                      >
                        {/* Hover glow effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl transition-all duration-300"
                          style={{
                            background: isPremium
                              ? `linear-gradient(135deg, ${theme.accent_color}12, transparent 60%)`
                              : `${theme.text_color}03`,
                            opacity: hoveredLink === link.id ? 1 : 0,
                          }}
                        />

                        {/* Premium animated border */}
                        {isPremium && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            animate={{
                              background: [
                                `linear-gradient(135deg, ${theme.accent_color}00, ${theme.accent_color}18, ${theme.accent_color}00)`,
                                `linear-gradient(135deg, ${theme.accent_color}18, ${theme.accent_color}00, ${theme.accent_color}18)`,
                                `linear-gradient(135deg, ${theme.accent_color}00, ${theme.accent_color}18, ${theme.accent_color}00)`,
                              ],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ padding: '1px' }}
                          >
                            <div className="w-full h-full rounded-2xl" style={{ background: 'inherit' }} />
                          </motion.div>
                        )}

                        {/* Thumbnail */}
                            {link.thumbnail_url ? (
                              <img src={link.thumbnail_url} alt="" className="w-6 h-6 rounded object-cover" />
                            ) : (
                              <span className="text-base">{iconMap[link.icon as keyof typeof iconMap] || '🌐'}</span>
                            )}

                        {/* Featured badge */}
                        {link.featured && (
                          <div className="absolute -top-1 left-0 right-0 flex justify-center z-20">
                            <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: theme.accent_color, color: '#fff' }}>
                              Destacado
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <div className="relative flex-1 z-10 min-w-0">
                          <span className="block font-semibold tracking-tight truncate" style={{ fontSize: theme.link_font_size === 'xs' ? '0.75rem' : theme.link_font_size === 'base' ? '1rem' : '0.875rem' }}>
                            {link.title}
                          </span>
                          {theme.show_link_url_preview && hoveredLink === link.id && (
                            <span className="block text-[10px] truncate mt-0.5 font-mono" style={{ opacity: 0.4 }}>
                              {link.url}
                            </span>
                          )}
                        </div>

                        {/* Clicks counter */}
                        <motion.span
                          className="relative text-[10px] font-mono z-10"
                          style={{ opacity: 0.25 }}
                          animate={{ opacity: hoveredLink === link.id ? 0.6 : 0.25 }}
                        >
                          {link.clicks}
                        </motion.span>

                        {/* External icon */}
                        <motion.div
                          className="relative z-10"
                          animate={{ x: hoveredLink === link.id ? 3 : 0, opacity: hoveredLink === link.id ? 0.6 : 0.2 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </motion.div>
                      </motion.a>
                      {i < links.length - 1 && theme.link_divider !== 'none' && (
                        <div className="flex justify-center py-1">
                          {theme.link_divider === 'line' && <div className="w-8 h-px" style={{ background: theme.text_color + '15' }} />}
                          {theme.link_divider === 'dots' && <div className="flex gap-1"><div className="w-1 h-1 rounded-full" style={{ background: theme.text_color + '30' }} /><div className="w-1 h-1 rounded-full" style={{ background: theme.text_color + '15' }} /></div>}
                          {theme.link_divider === 'glow' && <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent_color}30, transparent)` }} />}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            }

            return (
              <div key={category} className="space-y-2">
                <motion.button
                  onClick={() => toggleCategory(category)}
                  className="flex items-center gap-2 w-full text-left py-2 transition-all"
                  style={{ color: theme.text_color }}
                  whileHover={{ opacity: 0.8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${theme.text_color}25, transparent)` }} />
                  <div className="flex items-center gap-1.5 px-3 text-xs font-semibold" style={{ opacity: 0.45 }}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                    {category}
                  </div>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, ${theme.text_color}25, transparent)` }} />
                </motion.button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden space-y-2"
                    >
                      {links.map((link, i) => (
                        <div key={link.id}>
                          <motion.a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleClick(link.id)}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.015, x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            onHoverStart={() => setHoveredLink(link.id)}
                            onHoverEnd={() => setHoveredLink(null)}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group"
                            style={{
                              background: isGlass ? 'rgba(255,255,255,0.04)' : theme.button_color,
                              color: theme.button_text_color,
                              borderRadius: theme.button_style === 'pill' ? '9999px' : theme.button_style === 'sharp' ? '8px' : '14px',
                              backdropFilter: isGlass ? `blur(${glassBlur})` : undefined,
                              border: isGlass ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${theme.text_color}06`,
                              fontFamily: theme.font,
                            }}
                          >
                            {link.thumbnail_url ? (
                              <img src={link.thumbnail_url} alt="" className="w-6 h-6 rounded object-cover" />
        ) : (
                              <span className="text-base">{iconMap[link.icon as keyof typeof iconMap] || '🌐'}</span>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="block text-sm font-medium truncate">{link.title}</span>
                              {theme.show_link_url_preview && hoveredLink === link.id && (
                                <span className="block text-[10px] truncate mt-0.5 font-mono" style={{ opacity: 0.4 }}>
                                  {link.url}
                                </span>
                              )}
                            </div>
                            <motion.span
                              className="text-[10px] font-mono"
                              style={{ opacity: 0.2 }}
                              animate={{ opacity: hoveredLink === link.id ? 0.5 : 0.2 }}
                            >
                              {link.clicks}
                            </motion.span>
                            <ExternalLink className="w-3 h-3 shrink-0" style={{ opacity: 0.25 }} />
                          </motion.a>
                          {i < links.length - 1 && theme.link_divider !== 'none' && (
                            <div className="flex justify-center py-1">
                              {theme.link_divider === 'line' && <div className="w-8 h-px" style={{ background: theme.text_color + '15' }} />}
                              {theme.link_divider === 'dots' && <div className="flex gap-1"><div className="w-1 h-1 rounded-full" style={{ background: theme.text_color + '30' }} /><div className="w-1 h-1 rounded-full" style={{ background: theme.text_color + '15' }} /></div>}
                              {theme.link_divider === 'glow' && <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent_color}30, transparent)` }} />}
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>

        {/* Lead Form */}
        {theme.lead_form_enabled && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={(e) => { e.preventDefault(); const input = (e.target as HTMLFormElement).querySelector('input'); if (input) { input.value = ''; } }}
            className="w-full p-4 rounded-2xl space-y-3"
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
              <input
                type="email" placeholder="tu@email.com" required
                className="flex-1 px-3 py-2 rounded-xl text-sm bg-black/20 border"
                style={{ borderColor: theme.text_color + '15', color: theme.text_color }}
              />
              <button type="submit"
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: theme.accent_color, color: '#fff' }}
              >
                {theme.lead_form_button_text || 'Enviar'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Stats Bar */}
        {theme.show_stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-5 sm:gap-6 px-5 py-2.5 rounded-full text-xs backdrop-blur-sm"
            style={{
              background: `${theme.text_color}06`,
              border: `1px solid ${theme.text_color}10`,
            }}
          >
            <div className="flex items-center gap-1.5" style={{ opacity: 0.6 }}>
              <Eye className="w-3.5 h-3.5" />
              <span className="font-medium">{totalViews.toLocaleString()}</span>
              <span className="hidden sm:inline">{t('profile.visits')}</span>
            </div>
            <div className="w-px h-3.5" style={{ background: theme.text_color + '18' }} />
            <div className="flex items-center gap-1.5" style={{ opacity: 0.6 }}>
              <MousePointerClick className="w-3.5 h-3.5" />
              <span className="font-medium">{totalClicks.toLocaleString()}</span>
              <span className="hidden sm:inline">{t('profile.clicks')}</span>
            </div>
            <div className="w-px h-3.5" style={{ background: theme.text_color + '18' }} />
            <div className="flex items-center gap-1.5" style={{ opacity: 0.6 }}>
              <Globe className="w-3.5 h-3.5" />
              <span className="font-medium">{profile.links.length}</span>
              <span className="hidden sm:inline">{t('profile.links')}</span>
            </div>
            {theme.show_online_count && (
              <>
                <div className="w-px h-3.5" style={{ background: theme.text_color + '18' }} />
                <div className="flex items-center gap-1.5" style={{ opacity: 0.6 }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-medium">En vivo</span>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Brand Footer */}
        {theme.show_brand_footer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-3 pt-4"
          >
            <motion.a
              href={isPremium ? '/premium' : '/'}
              className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase backdrop-blur-sm px-4 py-2 rounded-full"
              style={{
                opacity: 0.25,
                border: `1px solid ${theme.text_color}08`,
              }}
              whileHover={{ opacity: 0.5, scale: 1.02 }}
            >
              {isPremium ? (
                <><Zap className="w-3 h-3" /> {t('profile.footer.powered')}</>
              ) : (
                <><Heart className="w-3 h-3" /> {t('profile.footer.created')}</>
              )}
            </motion.a>
            {!isPremium && (
              <motion.a
                href="/premium"
                className="text-[10px] px-3 py-1.5 rounded-full transition-all backdrop-blur-sm"
                style={{
                  background: `${theme.accent_color}12`,
                  border: `1px solid ${theme.accent_color}20`,
                  color: theme.accent_color,
                  opacity: 0.5,
                }}
                whileHover={{ opacity: 0.8, scale: 1.05 }}
              >
                {t('profile.premium.cta')}
              </motion.a>
            )}
          </motion.div>
          )}
          </div>
        </motion.div>
      </div>
  )
}

