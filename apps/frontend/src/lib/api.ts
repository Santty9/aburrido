import type {
  ApiResponse,
  Profile,
  PublicProfile,
  Link,
  Block,
  CreateLinkInput,
  UpdateLinkInput,
  ChangelogEntry,
  AnalyticsOverview,
  Subscription,
  PremiumPlan,
  Badge,
  MarketplaceTheme,
  ThemeConfig,
} from '@aburrido/shared'
import { DEFAULT_THEME } from '@aburrido/shared'

const LOCAL_KEY = 'keef_data'
const CL_KEY = 'keef_changelogs'
const BADGE_KEY = 'keef_badges'
const REG_COUNT_KEY = 'keef_reg_count'
const MARKETPLACE_KEY = 'keef_marketplace'

function getData(): { profile: Profile; links: Link[] } {
  const raw = localStorage.getItem(LOCAL_KEY)
  if (raw) return JSON.parse(raw)
  return { profile: null as any, links: [] }
}

function saveData(profile: Profile, links: Link[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify({ profile, links }))
}

function getChangelogs(): ChangelogEntry[] {
  const raw = localStorage.getItem(CL_KEY)
  if (raw) return JSON.parse(raw)

  const defaults: ChangelogEntry[] = [
    { id: 'cl-1', title: '🚀 Lanzamiento de Keef', content: 'Bienvenido a **Keef** — la forma más elegante de compartir tus links.\n\n## Features\n- Perfil público personalizable\n- Drag & drop para organizar links\n- 8 temas visuales únicos\n- Analytics en tiempo real', version: '1.0.0', type: 'feature', is_premium: false, created_at: '2026-05-15T10:00:00Z' },
    { id: 'cl-2', title: '🎨 Temas Premium', content: 'Añadidos **temas exclusivos** para usuarios premium:\n\n- **Cyberpunk** — Colores neón vibrantes\n- **Sunset** — Degradado atardecer\n- **Ocean** — Azul profundo', version: '1.1.0', type: 'feature', is_premium: true, created_at: '2026-05-20T14:00:00Z' },
    { id: 'cl-3', title: '🐛 Fix: Analytics incorrectos', content: 'Corregido un bug donde los analytics mostraban conteos duplicados en visitas.', version: '1.1.1', type: 'fix', is_premium: false, created_at: '2026-05-25T09:00:00Z' },
    { id: 'cl-4', title: '⚡ Mejora de rendimiento', content: 'Optimizaciones:\n- Carga 60% más rápida\n- Lazy loading de imágenes\n- Reducción de bundle', version: '1.2.0', type: 'improvement', is_premium: false, created_at: '2026-05-28T16:00:00Z' },
    { id: 'cl-5', title: '📱 PWA — App Instalable', content: 'Ahora Keef es una **Progressive Web App**.\n\n## Qué incluye\n- Instalación en tu móvil/escritorio como app nativa\n- Icono personalizado en home screen\n- Carga offline básica\n- Experiencia sin navegador (standalone)', version: '2.0.0', type: 'feature', is_premium: false, created_at: '2026-05-30T10:00:00Z' },
    { id: 'cl-6', title: '📊 QR Code para compartir perfil', content: 'Cada perfil público ahora tiene un **código QR** descargable.', version: '2.1.0', type: 'feature', is_premium: false, created_at: '2026-05-30T12:00:00Z' },
    { id: 'cl-7', title: '🔍 SEO y Meta Tags para perfiles', content: 'Los perfiles públicos ahora tienen **meta tags optimizadas** para compartir en redes.', version: '2.2.0', type: 'feature', is_premium: false, created_at: '2026-05-30T14:00:00Z' },
    { id: 'cl-8', title: '📦 Exportar e Importar Links', content: 'Ahora puedes **exportar e importar** todos tus links en JSON.', version: '2.3.0', type: 'feature', is_premium: false, created_at: '2026-05-30T16:00:00Z' },
    { id: 'cl-9', title: '🏷️ Categorías y Grupos de Links', content: 'Organiza tus links en **categorías** con secciones colapsables.', version: '2.4.0', type: 'feature', is_premium: false, created_at: '2026-05-30T18:00:00Z' },
    { id: 'cl-10', title: '🎯 Selector de Iconos para Links', content: 'Cada link ahora puede tener un **icono personalizado**.', version: '2.5.0', type: 'feature', is_premium: false, created_at: '2026-05-31T08:00:00Z' },
    { id: 'cl-11', title: '📋 Changelog Admin', content: 'Desde **Ajustes > Changelog Admin** puedes añadir entradas al changelog público.', version: '2.6.0', type: 'feature', is_premium: false, created_at: '2026-05-31T10:00:00Z' },
    { id: 'cl-12', title: '✨ Rediseño total del perfil público', content: 'El perfil público fue **completamente rediseñado** con partículas, estadísticas, efectos glow y más.', version: '3.0.0', type: 'feature', is_premium: false, created_at: '2026-05-31T20:00:00Z' },
    { id: 'cl-13', title: '🎨 Sección de Personalización', content: 'Nueva sección dedicada a **personalizar** tu perfil con controles finos:\n\n- **Plantillas** — 8 temas preseleccionados\n- **Colores** — Pickers para fondo, texto, acento y botones\n- **Fondo** — Sólido, degradado o imagen personalizada\n- **Tipografía** — 10 fuentes para elegir\n- **Visibilidad** — Toggles para avatar, bio, stats, partículas y marca\n- **CSS Avanzado** — Editor CSS para usuarios premium\n- **Vista Previa** — Previsualización en tiempo real con modo móvil/escritorio', version: '3.1.0', type: 'feature', is_premium: false, created_at: '2026-05-31T21:00:00Z' },
    { id: 'cl-14', title: '🎬 Fondos de Video y Música', content: 'Tu perfil ahora puede tener **fondos dinámicos**:\n\n- **Video de fondo** — Reproduce un video como fondo de perfil\n- **Sonido opcional** — Activa/desactiva el audio del video\n- **Música ambiental** — Añade una pista musical a tu perfil\n- **Control de volumen** — Controlador elegante en /:username para ajustar volumen\n- **Preview real** — La vista previa ahora es idéntica al perfil real', version: '3.2.0', type: 'feature', is_premium: false, created_at: '2026-05-31T22:00:00Z' },
    { id: 'cl-15', title: '🛡️ Admin Panel completo', content: 'El **Admin Panel** fue completamente rediseñado con:\n\n- **Resumen** — Estadísticas generales de la plataforma\n- **Insignias** — Gestión completa (CRUD + asignación)\n- **Changelog** — Crear, editar y eliminar entradas directamente\n- **Anuncios** — Publicar anuncios desde el panel\n- **Herramientas** — Exportar/importar datos completos de la plataforma', version: '3.3.0', type: 'feature', is_premium: false, created_at: '2026-05-31T22:30:00Z' },
    { id: 'cl-16', title: '🎨 Rediseño total del perfil público', content: 'El perfil público fue **completamente rediseñado**:\n\n- **Diseño premium** — Glass morphism, sombras, animaciones fluidas\n- **Medias de fondo** — Imágenes, GIFs y videos se cargan con transiciones suaves y sin cortes\n- **Loading states** — Spinner de carga, fade-in para imágenes/videos\n- **Badges en perfil** — Las insignias se muestran en el perfil público\n- **Volume controller** — Control de volumen moderno con slider animado\n- **Tipografía mejorada** — Mejor jerarquía visual', version: '3.4.0', type: 'improvement', is_premium: false, created_at: '2026-05-31T23:00:00Z' },
    { id: 'cl-17', title: '🎯 Insignia Early Adopter automática', content: 'Los **primeros 100 usuarios** en registrarse reciben automáticamente la insignia **Early Adopter** 🌟.\n\nAdemás:\n- El Changelog Admin se movió a `/admin`\n- Nuevas opciones de personalización:\n  - Forma del avatar (círculo, redondeado, cuadrado)\n  - Grosor del borde del avatar\n  - Efecto hover en links (escalar, brillar, elevar, ninguno)\n  - Estilo de estadísticas (mínimo, detallado, insignias)\n  - Espaciado entre links (compacto, normal, cómodo)\n  - Escala de bordes redondeados', version: '3.5.0', type: 'feature', is_premium: false, created_at: '2026-06-01T00:00:00Z' },
    { id: 'cl-18', title: '🌐 i18n — Español e Inglés', content: 'Keef ahora soporta **idioma español e inglés** con switcher.', version: '3.6.0', type: 'feature', is_premium: false, created_at: '2026-06-01T08:00:00Z' },
    { id: 'cl-19', title: '🔗 Dominios Personalizados', content: 'Usá tu **propio dominio** para tu perfil de Keef.', version: '3.7.0', type: 'feature', is_premium: true, created_at: '2026-06-01T10:00:00Z' },
    { id: 'cl-20', title: '📅 Links Programados', content: 'Programá la **fecha de inicio y fin** de tus links.', version: '3.8.0', type: 'feature', is_premium: false, created_at: '2026-06-01T12:00:00Z' },
    { id: 'cl-21', title: '🖼️ Miniaturas en Links', content: 'Los links pueden mostrar **miniaturas** con vista previa.', version: '3.9.0', type: 'feature', is_premium: false, created_at: '2026-06-01T14:00:00Z' },
    { id: 'cl-22', title: '📝 Biografía Markdown', content: 'La biografía ahora soporta **formato Markdown**.', version: '3.10.0', type: 'feature', is_premium: false, created_at: '2026-06-01T16:00:00Z' },
    { id: 'cl-23', title: '🔐 Login Social', content: 'Iniciá sesión con **Google, GitHub o Discord**.', version: '4.0.0', type: 'feature', is_premium: false, created_at: '2026-06-01T18:00:00Z' },
    { id: 'cl-24', title: '🔑 Recuperación de Contraseña', content: 'Flujo completo de **recuperación de contraseña**.', version: '4.1.0', type: 'feature', is_premium: false, created_at: '2026-06-01T20:00:00Z' },
    { id: 'cl-25', title: '🎨 Theme Marketplace', content: '**Marketplace de temas** creados por la comunidad.', version: '4.2.0', type: 'feature', is_premium: false, created_at: '2026-06-01T22:00:00Z' },
  ]
  localStorage.setItem(CL_KEY, JSON.stringify(defaults))
  return defaults
}

function saveChangelogs(entries: ChangelogEntry[]) {
  localStorage.setItem(CL_KEY, JSON.stringify(entries))
}

function getBadges(): Badge[] {
  const raw = localStorage.getItem(BADGE_KEY)
  if (raw) return JSON.parse(raw)

  const defaults: Badge[] = [
    { id: 'bg-1', name: 'Early Adopter', icon: '🌟', color: '#f59e0b', background: '#f59e0b20', assigned_to: [], created_at: '2026-05-15T10:00:00Z' },
    { id: 'bg-2', name: 'Premium', icon: '⭐', color: '#8b5cf6', background: '#8b5cf620', assigned_to: [], created_at: '2026-05-20T14:00:00Z' },
    { id: 'bg-3', name: '1000 Visits', icon: '🔥', color: '#ef4444', background: '#ef444420', assigned_to: [], created_at: '2026-05-25T09:00:00Z' },
    { id: 'bg-4', name: 'Verified', icon: '✅', color: '#22c55e', background: '#22c55e20', assigned_to: [], created_at: '2026-05-30T16:00:00Z' },
  ]
  localStorage.setItem(BADGE_KEY, JSON.stringify(defaults))
  return defaults
}

function saveBadges(entries: Badge[]) {
  localStorage.setItem(BADGE_KEY, JSON.stringify(entries))
}

function getMarketplaceThemes(): MarketplaceTheme[] {
  const raw = localStorage.getItem(MARKETPLACE_KEY)
  if (raw) return JSON.parse(raw)

  function mkTheme(overrides: Partial<ThemeConfig>): ThemeConfig {
    return { ...DEFAULT_THEME, ...overrides }
  }

  const defaults: MarketplaceTheme[] = [
    { id: 'mt-1', name: 'Matrix', description: 'Verde neón sobre fondo negro — estilo hacker', author: 'cyber_dev', theme: mkTheme({ type: 'neon', background: '#000000', text_color: '#00ff00', accent_color: '#ff00ff', button_color: '#111111', button_text_color: '#00ff00', link_hover_effect: 'glow', stats_style: 'detailed', link_spacing: 'compact', border_radius_scale: 'small' }), downloads: 234, rating: 4.8, category: 'gaming', tags: ['neon', 'hacker', 'green'], created_at: '2026-06-01T00:00:00Z' },
    { id: 'mt-2', name: 'Sunrise', description: 'Tonos cálidos naranja y amarillo como un amanecer', author: 'dawn_crafter', theme: mkTheme({ type: 'sunset', background: 'linear-gradient(135deg, #1a0a2e, #2d1b69, #e74c3c)', background_type: 'gradient', text_color: '#ffffff', accent_color: '#f39c12', button_style: 'glass', button_color: 'rgba(255,255,255,0.1)', button_text_color: '#ffffff', link_hover_effect: 'lift', stats_style: 'minimal' }), downloads: 189, rating: 4.6, category: 'gradient', tags: ['warm', 'sunset', 'glass'], created_at: '2026-06-01T01:00:00Z' },
    { id: 'mt-3', name: 'Arctic', description: 'Azul hielo y blanco — minimalista y limpio', author: 'frost_byte', theme: mkTheme({ type: 'light', background: '#f0f8ff', text_color: '#1a365d', accent_color: '#3182ce', button_style: 'pill', button_color: '#ffffff', button_text_color: '#1a365d', avatar_shape: 'rounded', avatar_border_width: 'thin', link_hover_effect: 'scale', stats_style: 'detailed' }), downloads: 156, rating: 4.4, category: 'minimal', tags: ['clean', 'light', 'blue'], created_at: '2026-06-01T02:00:00Z' },
    { id: 'mt-4', name: 'Midnight', description: 'Púrpura profundo sobre fondo oscuro — elegante y misterioso', author: 'night_owl', theme: mkTheme({ type: 'dark', background: '#0d0015', text_color: '#e0d0ff', accent_color: '#9b59b6', button_color: '#1a0d2e', button_text_color: '#e0d0ff', avatar_border_width: 'thick', link_hover_effect: 'glow', stats_style: 'minimal', link_spacing: 'comfortable', border_radius_scale: 'large' }), downloads: 312, rating: 4.9, category: 'dark', tags: ['purple', 'dark', 'elegant'], created_at: '2026-06-01T03:00:00Z' },
    { id: 'mt-5', name: 'Forest', description: 'Tonos tierra y verde naturaleza', author: 'nature_lover', theme: mkTheme({ type: 'dark', background: '#0a1f0a', text_color: '#d4edda', accent_color: '#28a745', button_color: '#1a3a1a', button_text_color: '#d4edda', link_hover_effect: 'lift', stats_style: 'badges' }), downloads: 98, rating: 4.2, category: 'nature', tags: ['green', 'nature', 'earthy'], created_at: '2026-06-01T04:00:00Z' },
    { id: 'mt-6', name: 'Candy', description: 'Pasteles rosas y púrpura — dulce y divertido', author: 'sweet_tooth', theme: mkTheme({ type: 'light', background: '#fff0f5', text_color: '#6b21a8', accent_color: '#ec4899', button_style: 'pill', button_color: '#ffffff', button_text_color: '#6b21a8', avatar_shape: 'rounded', avatar_border_width: 'thin', link_hover_effect: 'scale', stats_style: 'detailed', link_spacing: 'comfortable', border_radius_scale: 'large' }), downloads: 145, rating: 4.5, category: 'colorful', tags: ['pink', 'pastel', 'sweet'], created_at: '2026-06-01T05:00:00Z' },
    { id: 'mt-7', name: 'Cyberpunk', description: 'Violetas y cyan neón sobre fondo oscuro — vibra futurista', author: 'neon_rider', theme: mkTheme({ type: 'cyber', background: '#0a0015', text_color: '#00ffff', accent_color: '#ff00ff', button_color: '#1a0030', button_text_color: '#00ffff', link_hover_effect: 'glow', stats_style: 'detailed', font: 'JetBrains Mono' }), downloads: 567, rating: 4.7, category: 'gaming', tags: ['cyber', 'neon', 'futuristic'], created_at: '2026-06-02T00:00:00Z' },
    { id: 'mt-8', name: 'RetroWave', description: '80s synthwave con puestas de sol y grids', author: 'vapor_fan', theme: mkTheme({ type: 'retro', background: 'linear-gradient(180deg, #ff6b6b, #1a0a3e)', background_type: 'gradient', text_color: '#ffe66d', accent_color: '#ff6b6b', button_color: '#2d1b69', button_text_color: '#ffe66d', button_style: 'pill', link_hover_effect: 'lift' }), downloads: 423, rating: 4.3, category: 'retro', tags: ['80s', 'synthwave', 'vaporwave'], created_at: '2026-06-02T06:00:00Z' },
  ]
  localStorage.setItem(MARKETPLACE_KEY, JSON.stringify(defaults))
  return defaults
}

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function fakeId(): string {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const MOCK_PLANS: PremiumPlan[] = [
  { id: 'premium-monthly', name: 'Premium Mensual', price: 499, currency: 'usd', interval: 'month', stripe_price_id: 'price_monthly', features: ['Temas premium exclusivos', 'Sin marca de agua', 'Analytics avanzados', 'Hasta 50 links', 'Soporte prioritario'] },
  { id: 'premium-yearly', name: 'Premium Anual', price: 3999, currency: 'usd', interval: 'year', stripe_price_id: 'price_yearly', features: ['Todo lo de Premium mensual', '3 meses gratis', 'Insignia Pro', 'CSS avanzado', 'Beta features'] },
]

// ==================== AUTH ====================

export const authApi = {
  register: async (data: { email: string; password: string; username: string }): Promise<ApiResponse<{ profile: Profile; session: { access_token: string; refresh_token: string; expires_at: number } }>> => {
    await delay()
    const existing = getData().profile
    if (existing) return { success: false, error: 'Ya hay una sesión activa' }

    const profile: Profile = {
      id: fakeId(),
      username: data.username,
      display_name: data.username,
      bio: null,
      bio_markdown: null,
      avatar_url: null,
      theme: { ...DEFAULT_THEME, show_stats: true, show_particles: true, show_brand_footer: true },
      plan: 'free',
      is_premium: false,
      premium_since: null,
      total_visits: 0,
      stripe_customer_id: null,
      custom_domain: null,
      custom_domain_verified: false,
      verification_status: 'unverified',
      trust_score: 0,
      blocks: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Auto-assign Early Adopter badge to first 100 users
    let regCount = Number(localStorage.getItem(REG_COUNT_KEY)) || 0
    regCount++
    localStorage.setItem(REG_COUNT_KEY, String(regCount))
    if (regCount <= 100) {
      const badges = getBadges()
      const earlyBadge = badges.find((b) => b.id === 'bg-1')
      if (earlyBadge) {
        if (!earlyBadge.assigned_to.includes(data.username)) {
          earlyBadge.assigned_to.push(data.username)
        }
        ;(profile as any).badge_ids = ['bg-1']
        saveBadges(badges)
      }
    }

    saveData(profile, [])
    const token = fakeId()
    localStorage.setItem('access_token', token)
    return { success: true, data: { profile, session: { access_token: token, refresh_token: token, expires_at: Date.now() + 86400000 } } }
  },

  login: async (_data?: { email: string; password: string }): Promise<ApiResponse<{ profile: Profile; session: { access_token: string; refresh_token: string; expires_at: number } }>> => {
    await delay()
    const existing = getData().profile
    if (!existing) return { success: false, error: 'Primero debes registrarte. Crea una cuenta.' }

    const token = fakeId()
    localStorage.setItem('access_token', token)
    return { success: true, data: { profile: existing, session: { access_token: token, refresh_token: token, expires_at: Date.now() + 86400000 } } }
  },

  socialLogin: async (provider: 'google' | 'github' | 'discord'): Promise<ApiResponse<{ profile: Profile; session: { access_token: string; refresh_token: string; expires_at: number } }>> => {
    await delay(500)
    const existing = getData().profile
    if (!existing) return { success: false, error: 'Primero debes registrarte. Crea una cuenta.' }

    const token = fakeId()
    localStorage.setItem('access_token', token)
    return { success: true, data: { profile: existing, session: { access_token: token, refresh_token: token, expires_at: Date.now() + 86400000 } } }
  },

  forgotPassword: async (_email: string): Promise<ApiResponse<{ message: string }>> => {
    await delay(500)
    return { success: true, data: { message: 'Si el email existe, recibirás un link de recuperación' } }
  },

  resetPassword: async (_data: { token: string; password: string }): Promise<ApiResponse<{ message: string }>> => {
    await delay(500)
    return { success: true, data: { message: 'Contraseña actualizada correctamente' } }
  },

  me: async (): Promise<ApiResponse<Profile>> => {
    await delay(100)
    const token = localStorage.getItem('access_token')
    if (!token) return { success: false, error: 'No autorizado' }
    const { profile } = getData()
    if (!profile) return { success: false, error: 'No autorizado' }
    return { success: true, data: profile }
  },
}

// ==================== PROFILE ====================

export const profileApi = {
  getByUsername: async (username: string): Promise<ApiResponse<PublicProfile>> => {
    await delay(200)
    const { profile, links } = getData()
    const allBadges = getBadges()
    const profileBadgeIds: string[] = (profile as any)?.badge_ids || []
    const assignedBadges = allBadges.filter((b) => profileBadgeIds.includes(b.id) || b.assigned_to.includes(username))

    if (!profile || profile.username !== username) {
      return {
        success: true,
        data: {
          username,
          display_name: 'Usuario Ejemplo',
          bio: 'Este es un perfil de ejemplo. Crea el tuyo en Keef!',
          avatar_url: null,
          theme: { ...DEFAULT_THEME, show_stats: true, show_particles: true, show_brand_footer: true },
          links: [
            { id: fakeId(), profile_id: '', title: 'GitHub', url: 'https://github.com', icon: 'github', icon_url: null, position: 0, is_active: true, clicks: 42, thumbnail_url: null, scheduled_start: null, scheduled_end: null, preview: null, pixels: null, affiliate: null, created_at: '', updated_at: '' },
            { id: fakeId(), profile_id: '', title: 'Twitter / X', url: 'https://x.com', icon: 'twitter', icon_url: null, position: 1, is_active: true, clicks: 28, thumbnail_url: null, scheduled_start: null, scheduled_end: null, preview: null, pixels: null, affiliate: null, created_at: '', updated_at: '' },
            { id: fakeId(), profile_id: '', title: 'Instagram', url: 'https://instagram.com', icon: 'instagram', icon_url: null, position: 2, is_active: true, clicks: 15, thumbnail_url: null, scheduled_start: null, scheduled_end: null, preview: null, pixels: null, affiliate: null, created_at: '', updated_at: '' },
          ],
          blocks: [],
          is_premium: false,
          is_verified: false,
          badges: [],
        },
      }
    }

    const currentVisits = profile.total_visits || 0
    await saveData({ ...profile, total_visits: currentVisits + 1 }, links)

    // Filter links by schedule and active status
    const now = new Date().toISOString()
    const activeLinks = links.filter((l) => {
      if (!l.is_active) return false
      if (l.scheduled_start && l.scheduled_start > now) return false
      if (l.scheduled_end && l.scheduled_end < now) return false
      return true
    }).sort((a, b) => a.position - b.position)

    return {
      success: true,
      data: {
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio_markdown || profile.bio,
        avatar_url: profile.avatar_url,
        theme: { ...profile.theme, show_stats: profile.theme.show_stats ?? true, show_particles: profile.theme.show_particles ?? true, show_brand_footer: profile.theme.show_brand_footer ?? true },
        links: activeLinks,
        blocks: (profile as any).blocks || [],
        is_premium: profile.is_premium,
        is_verified: profile.verification_status === 'verified',
        badges: assignedBadges,
      },
    }
  },

  update: async (data: Partial<Profile> & { badge_ids?: string[] }): Promise<ApiResponse<Profile>> => {
    await delay()
    const { profile, links } = getData()
    if (!profile) return { success: false, error: 'No autorizado' }

    const badgeIds = data.badge_ids
    const { badge_ids, ...profileData } = data

    const updated: Profile = { ...profile, ...profileData, updated_at: new Date().toISOString() } as Profile
    if (badgeIds !== undefined) (updated as any).badge_ids = badgeIds

    saveData(updated, links)
    return { success: true, data: { ...updated, theme: { ...updated.theme, show_stats: updated.theme.show_stats ?? true, show_particles: updated.theme.show_particles ?? true, show_brand_footer: updated.theme.show_brand_footer ?? true } } }
  },

  checkUsername: async (username: string): Promise<ApiResponse<{ available: boolean }>> => {
    await delay(100)
    const { profile } = getData()
    return { success: true, data: { available: !profile || profile.username !== username } }
  },

  verifyCustomDomain: async (domain: string): Promise<ApiResponse<{ verified: boolean; message: string }>> => {
    await delay(1000)
    // Simulate DNS verification - always succeeds in mock
    const { profile, links } = getData()
    if (!profile) return { success: false, error: 'No autorizado' }
    const updated = { ...profile, custom_domain: domain, custom_domain_verified: true }
    saveData(updated, links)
    return { success: true, data: { verified: true, message: 'Dominio verificado correctamente' } }
  },
}

// ==================== LINKS ====================

export const linkApi = {
  getAll: async (): Promise<ApiResponse<Link[]>> => {
    await delay()
    const { profile, links } = getData()
    if (!profile) return { success: false, error: 'No autorizado' }
    return { success: true, data: links.sort((a, b) => a.position - b.position) }
  },

  create: async (data: CreateLinkInput): Promise<ApiResponse<Link>> => {
    await delay()
    const { profile, links } = getData()
    if (!profile) return { success: false, error: 'No autorizado' }
    const maxPos = links.reduce((max, l) => Math.max(max, l.position), -1)
    const link: Link = {
      id: fakeId(), profile_id: profile.id, title: data.title, url: data.url,
      icon: data.icon || 'globe', icon_url: data.icon_url || null,
      position: data.position ?? maxPos + 1, is_active: true, clicks: 0,
      thumbnail_url: data.thumbnail_url || null,
      scheduled_start: data.scheduled_start || null,
      scheduled_end: data.scheduled_end || null,
      preview: data.preview || null,
      pixels: data.pixels || null,
      affiliate: data.affiliate || null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    link.category = data.category || ''
    links.push(link); saveData(profile, links)
    return { success: true, data: link }
  },

  update: async (id: string, data: UpdateLinkInput): Promise<ApiResponse<Link>> => {
    await delay()
    const { profile, links } = getData()
    if (!profile) return { success: false, error: 'No autorizado' }
    const idx = links.findIndex((l) => l.id === id)
    if (idx === -1) return { success: false, error: 'Link no encontrado' }
    const updated = { ...links[idx], ...data, updated_at: new Date().toISOString() } as Link
    links[idx] = updated; saveData(profile, links)
    return { success: true, data: updated }
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay()
    const { profile, links } = getData()
    if (!profile) return { success: false, error: 'No autorizado' }
    saveData(profile, links.filter((l) => l.id !== id))
    return { success: true, message: 'Link eliminado' }
  },

  reorder: async (items: { id: string; position: number }[]): Promise<ApiResponse<void>> => {
    await delay()
    const { profile, links } = getData()
    if (!profile) return { success: false, error: 'No autorizado' }
    const map = new Map(items.map((i) => [i.id, i.position]))
    for (const link of links) { const pos = map.get(link.id); if (pos !== undefined) link.position = pos }
    saveData(profile, links)
    return { success: true, message: 'Orden actualizado' }
  },

  trackClick: async (id: string): Promise<ApiResponse<void>> => {
    await delay(50)
    const { profile, links } = getData()
    const link = links.find((l) => l.id === id)
    if (link) { link.clicks++; saveData(profile, links) }
    return { success: true }
  },
}

export const blockApi = {
  update: async (blocks: Block[]): Promise<ApiResponse<Block[]>> => {
    await delay(100)
    const { profile, links } = getData()
    if (!profile) return { success: false, error: 'No autorizado' }
    const updated = { ...profile, blocks, updated_at: new Date().toISOString() }
    saveData(updated, links)
    return { success: true, data: blocks }
  },
}

// ==================== CHANGELOG ====================

export const changelogApi = {
  getAll: async (): Promise<ApiResponse<ChangelogEntry[]>> => {
    await delay(200)
    return { success: true, data: getChangelogs() }
  },
  create: async (data: { title: string; content: string; version: string; type: 'feature' | 'fix' | 'improvement'; is_premium?: boolean }): Promise<ApiResponse<ChangelogEntry>> => {
    await delay()
    const entries = getChangelogs()
    const entry: ChangelogEntry = { id: fakeId(), title: data.title, content: data.content, version: data.version, type: data.type, is_premium: data.is_premium || false, created_at: new Date().toISOString() }
    entries.unshift(entry); saveChangelogs(entries)
    return { success: true, data: entry }
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay()
    saveChangelogs(getChangelogs().filter((e) => e.id !== id))
    return { success: true, message: 'Entrada eliminada' }
  },
}

// ==================== ANALYTICS ====================

export const analyticsApi = {
  getOverview: async (): Promise<ApiResponse<AnalyticsOverview>> => {
    await delay(300)
    const { profile, links } = getData()
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return { date: d.toISOString().split('T')[0]!, count: Math.floor(Math.random() * 50) + 5 }
    })
    return {
      success: true, data: {
        total_visits: profile?.total_visits || 1284, total_clicks: links.reduce((s, l) => s + l.clicks, 0) || 847,
        unique_visitors: 523, visits_today: 34, clicks_today: 18,
        visits_by_day: days,
        visits_by_hour: Array.from({ length: 24 }, (_, h) => ({ hour: h, count: Math.floor(Math.random() * 30) + 2 })),
        categories: [...new Set(links.map((l) => l.category).filter((c): c is string => !!c))],
        clicks_by_link: links.map((l) => ({ link_id: l.id, title: l.title, url: l.url, count: l.clicks, ctr: profile?.total_visits ? Math.round((l.clicks / profile.total_visits) * 1000) / 10 : 0 })),
        referrers: [{ source: 'direct', count: 456 }, { source: 'twitter.com', count: 234 }, { source: 'instagram.com', count: 189 }, { source: 'github.com', count: 98 }],
      },
    }
  },
}

// ==================== PREMIUM ====================

export const premiumApi = {
  getPlans: async (): Promise<ApiResponse<PremiumPlan[]>> => {
    await delay(200)
    return { success: true, data: MOCK_PLANS }
  },
  createCheckout: async (_priceId: string): Promise<ApiResponse<{ url: string }>> => {
    await delay(500)
    const { profile, links } = getData()
    const updated: Profile = { ...profile!, is_premium: true, plan: 'premium', premium_since: new Date().toISOString() }
    saveData(updated, links)
    return { success: true, data: { url: '/dashboard?premium=activated' } }
  },
  getSubscription: async (): Promise<ApiResponse<Subscription | null>> => {
    await delay(100)
    const { profile } = getData()
    if (profile?.is_premium) {
      return { success: true, data: { id: fakeId(), profile_id: profile.id, plan: 'premium', status: 'active', current_period_start: new Date().toISOString(), current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(), stripe_subscription_id: 'sub_mock', created_at: new Date().toISOString() } }
    }
    return { success: true, data: null }
  },
  cancelSubscription: async (): Promise<ApiResponse<void>> => {
    await delay(300)
    const { profile, links } = getData()
    const updated: Profile = { ...profile!, is_premium: false, plan: 'free', premium_since: null }
    saveData(updated, links)
    return { success: true, message: 'Suscripción cancelada' }
  },
}

// ==================== MARKETPLACE ====================

export const marketplaceApi = {
  getAll: async (): Promise<ApiResponse<MarketplaceTheme[]>> => {
    await delay(200)
    return { success: true, data: getMarketplaceThemes() }
  },
}

// ==================== BADGES (Admin) ====================

export const badgeApi = {
  getAll: async (): Promise<ApiResponse<Badge[]>> => {
    await delay(150)
    return { success: true, data: getBadges() }
  },
  create: async (data: { name: string; icon: string; color: string; background: string }): Promise<ApiResponse<Badge>> => {
    await delay()
    const badges = getBadges()
    const badge: Badge = { id: fakeId(), name: data.name, icon: data.icon, color: data.color, background: data.background, assigned_to: [], created_at: new Date().toISOString() }
    badges.push(badge); saveBadges(badges)
    return { success: true, data: badge }
  },
  update: async (id: string, data: Partial<Badge>): Promise<ApiResponse<Badge>> => {
    await delay()
    const badges = getBadges()
    const idx = badges.findIndex((b) => b.id === id)
    if (idx === -1) return { success: false, error: 'Insignia no encontrada' }
    badges[idx] = { ...badges[idx], ...data } as Badge; saveBadges(badges)
    return { success: true, data: badges[idx] }
  },
  delete: async (id: string): Promise<ApiResponse<void>> => {
    await delay()
    saveBadges(getBadges().filter((b) => b.id !== id))
    return { success: true, message: 'Insignia eliminada' }
  },
  assignToProfile: async (badgeId: string, username: string): Promise<ApiResponse<Badge>> => {
    await delay()
    const badges = getBadges()
    const idx = badges.findIndex((b) => b.id === badgeId)
    if (idx === -1) return { success: false, error: 'Insignia no encontrada' }
    if (!badges[idx]!.assigned_to.includes(username)) badges[idx]!.assigned_to.push(username)
    saveBadges(badges)

    const { profile, links } = getData()
    if (profile && profile.username === username) {
      const ids: string[] = (profile as any).badge_ids || []
      if (!ids.includes(badgeId)) ids.push(badgeId)
      ;(profile as any).badge_ids = ids; saveData(profile, links)
    }
    return { success: true, data: badges[idx] }
  },
  removeFromProfile: async (badgeId: string, username: string): Promise<ApiResponse<Badge>> => {
    await delay()
    const badges = getBadges()
    const idx = badges.findIndex((b) => b.id === badgeId)
    if (idx === -1) return { success: false, error: 'Insignia no encontrada' }
    badges[idx]!.assigned_to = badges[idx]!.assigned_to.filter((u) => u !== username)
    saveBadges(badges)

    const { profile, links } = getData()
    if (profile && profile.username === username) {
      const ids: string[] = (profile as any).badge_ids || []
      ;(profile as any).badge_ids = ids.filter((i) => i !== badgeId); saveData(profile, links)
    }
    return { success: true, data: badges[idx] }
  },
}

// ==================== ADMIN ====================

export const adminApi = {
  getOverview: async (): Promise<ApiResponse<{ total_users: number; total_links: number; total_visits: number; total_badges: number; total_changelogs: number }>> => {
    await delay(200)
    const { profile, links } = getData()
    return {
      success: true, data: {
        total_users: profile ? 1 : 0, total_links: links.length,
        total_visits: profile?.total_visits || 0, total_badges: getBadges().length,
        total_changelogs: getChangelogs().length,
      },
    }
  },
}

// ==================== EXPORT / IMPORT ====================

export const backupApi = {
  exportLinks: async (): Promise<ApiResponse<{ data: string; filename: string }>> => {
    await delay(200)
    const { links } = getData()
    return { success: true, data: { data: JSON.stringify(links, null, 2), filename: `keef-links-${Date.now()}.json` } }
  },
  importLinks: async (json: string): Promise<ApiResponse<{ count: number }>> => {
    await delay(300)
    try {
      const imported = JSON.parse(json)
      if (!Array.isArray(imported)) throw new Error('Formato inválido')
      const { profile, links } = getData()
      const merged = [...links, ...imported.map((l: any) => ({ ...l, id: fakeId(), clicks: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }))]
      saveData(profile, merged)
      return { success: true, data: { count: imported.length } }
    } catch { return { success: false, error: 'Archivo JSON inválido' } }
  },
}
