// ========== Enums ==========
export type ThemeType = 'dark' | 'light' | 'neon' | 'cyber' | 'minimal' | 'retro' | 'ocean' | 'sunset' | 'matrix' | 'sunrise' | 'arctic' | 'midnight' | 'forest' | 'candy'
export type PlanType = 'free' | 'premium' | 'pro'
export type ChangelogType = 'feature' | 'fix' | 'improvement'
export type LinkIcon = 'globe' | 'github' | 'twitter' | 'instagram' | 'youtube' | 'discord' | 'tiktok' | 'twitch' | 'linkedin' | 'spotify' | 'custom'
export type BlockType = 'hero' | 'links' | 'gallery' | 'embed' | 'text' | 'cta' | 'divider'

// ========== Profile ==========
export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  bio_markdown: string | null
  avatar_url: string | null
  theme: ThemeConfig
  plan: PlanType
  is_premium: boolean
  premium_since: string | null
  total_visits: number
  stripe_customer_id: string | null
  custom_domain: string | null
  custom_domain_verified: boolean
  badge_ids?: string[]
  verification_status: VerificationStatus
  trust_score: number
  blocks: Block[]
  created_at: string
  updated_at: string
}

export interface ThemeSchedule {
  enabled: boolean
  day_theme: ThemeType | null
  night_theme: ThemeType | null
  day_start: string
  night_start: string
}

export interface ThemeConfig {
  type: ThemeType
  background: string
  background_type: 'solid' | 'gradient' | 'image' | 'video'
  text_color: string
  accent_color: string
  button_style: 'rounded' | 'pill' | 'sharp' | 'glass'
  button_color: string
  button_text_color: string
  font: string
  background_video_url: string | null
  background_video_sound: boolean
  background_music_url: string | null
  show_avatar: boolean
  show_bio: boolean
  show_stats: boolean
  show_particles: boolean
  show_brand_footer: boolean
  show_verification_badge: boolean
  show_online_count: boolean
  avatar_shape: 'circle' | 'rounded' | 'square'
  avatar_border_width: 'thin' | 'medium' | 'thick'
  avatar_size: 'sm' | 'md' | 'lg'
  link_hover_effect: 'scale' | 'glow' | 'lift' | 'none'
  link_border_style: 'none' | 'thin' | 'glow' | 'gradient'
  link_shadow: 'none' | 'soft' | 'medium' | 'strong'
  shadow_color: string
  animation_speed: 'slow' | 'normal' | 'fast'
  stats_style: 'minimal' | 'detailed' | 'badges'
  link_spacing: 'compact' | 'normal' | 'comfortable'
  link_font_size: 'xs' | 'sm' | 'base'
  border_radius_scale: 'small' | 'medium' | 'large'
  glass_blur: 'none' | 'light' | 'medium' | 'strong'
  overlay_opacity: number
  gradient_angle: number
  corner_decoration: 'none' | 'dots' | 'lines' | 'ornate'
  show_gradient_text: boolean
  link_divider: 'none' | 'line' | 'dots' | 'glow'
  glow_intensity: 'subtle' | 'normal' | 'strong'
  title_style: 'normal' | 'gradient' | 'shadow' | 'outline'
  title_font_size: 'sm' | 'md' | 'lg' | 'xl'
  overlay_color: string
  badge_style: 'standard' | 'glow' | 'minimal' | 'none'
  entrance_animation: 'fade' | 'slide-up' | 'zoom' | 'none'
  show_link_url_preview: boolean
  lead_form_enabled: boolean
  lead_form_title: string
  lead_form_button_text: string
  profile_password: string | null
  custom_css: string | null
  presentation_mode: boolean
  presentation_interval: number
  schedule: ThemeSchedule
}

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export interface LinkPreview {
  title: string | null
  description: string | null
  image: string | null
  favicon: string | null
}

export interface PixelTracking {
  facebook: string | null
  google: string | null
  tiktok: string | null
  twitter: string | null
}

export interface AffiliateSettings {
  enabled: boolean
  commission_rate: number | null
  network: string | null
  cloaked_url: string | null
}

export interface Block {
  id: string
  type: BlockType
  position: number
  data: Record<string, unknown>
  is_active: boolean
}

export interface Badge {
  id: string
  name: string
  icon: string
  color: string
  background: string
  assigned_to: string[]
  created_at: string
}

export interface MarketplaceTheme {
  id: string
  name: string
  description: string
  author: string
  theme: ThemeConfig
  downloads: number
  rating: number
  category: 'dark' | 'light' | 'colorful' | 'minimal' | 'gradient' | 'nature' | 'retro' | 'gaming'
  tags: string[]
  created_at: string
}

export interface PublicProfile {
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  theme: ThemeConfig
  links: Link[]
  blocks: Block[]
  is_premium: boolean
  is_verified: boolean
  badges: Badge[]
}

// ========== Links ==========
export interface Link {
  id: string
  profile_id: string
  title: string
  url: string
  icon: LinkIcon
  icon_url: string | null
  position: number
  is_active: boolean
  clicks: number
  thumbnail_url: string | null
  scheduled_start: string | null
  scheduled_end: string | null
  category?: string
  featured?: boolean
  preview?: LinkPreview | null
  pixels?: PixelTracking | null
  affiliate?: AffiliateSettings | null
  created_at: string
  updated_at: string
}

export interface CreateLinkInput {
  title: string
  url: string
  icon: LinkIcon | 'custom'
  icon_url?: string | null
  category?: string
  featured?: boolean
  position?: number
  thumbnail_url?: string | null
  scheduled_start?: string | null
  scheduled_end?: string | null
  preview?: LinkPreview | null
  pixels?: PixelTracking | null
  affiliate?: AffiliateSettings | null
}

export interface UpdateLinkInput extends Partial<CreateLinkInput> {
  is_active?: boolean
}

// ========== Auth ==========
export interface AuthResponse {
  user: Profile | null
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  } | null
  error: string | null
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  username: string
}

// ========== Changelog ==========
export interface ChangelogEntry {
  id: string
  title: string
  content: string
  version: string
  type: ChangelogType
  is_premium: boolean
  created_at: string
}

// ========== Analytics ==========
export interface AnalyticsOverview {
  total_visits: number
  total_clicks: number
  unique_visitors: number
  visits_today: number
  clicks_today: number
  visits_by_day: { date: string; count: number }[]
  visits_by_hour: { hour: number; count: number }[]
  clicks_by_link: { link_id: string; title: string; url: string; count: number; ctr: number }[]
  categories?: string[]
  referrers: { source: string; count: number }[]
}

// ========== Premium ==========
export interface PremiumPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripe_price_id: string
}

export interface Subscription {
  id: string
  profile_id: string
  plan: PlanType
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start: string
  current_period_end: string
  stripe_subscription_id: string | null
  created_at: string
}

// ========== API Responses ==========
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ========== Default theme ==========
export const DEFAULT_THEME: ThemeConfig = {
  type: 'dark',
  background: '#0a0a0f',
  background_type: 'solid',
  text_color: '#ffffff',
  accent_color: '#8b5cf6',
  button_style: 'rounded',
  button_color: '#1e1e2e',
  button_text_color: '#ffffff',
  font: 'Inter',
  background_video_url: null,
  background_video_sound: false,
  background_music_url: null,
  show_avatar: true,
  show_bio: true,
  show_stats: true,
  show_particles: true,
  show_brand_footer: true,
  show_verification_badge: true,
  show_online_count: false,
  avatar_shape: 'circle',
  avatar_border_width: 'medium',
  avatar_size: 'md',
  link_hover_effect: 'scale',
  link_border_style: 'none',
  link_shadow: 'none',
  shadow_color: '#000000',
  animation_speed: 'normal',
  stats_style: 'minimal',
  link_spacing: 'normal',
  link_font_size: 'sm',
  border_radius_scale: 'medium',
  glass_blur: 'medium',
  overlay_opacity: 40,
  gradient_angle: 135,
  corner_decoration: 'none',
  show_gradient_text: false,
  link_divider: 'none',
  glow_intensity: 'normal',
  title_style: 'normal',
  title_font_size: 'md',
  overlay_color: '#000000',
  badge_style: 'standard',
  entrance_animation: 'fade',
  show_link_url_preview: false,
  lead_form_enabled: false,
  lead_form_title: 'Suscribite',
  lead_form_button_text: 'Enviar',
  profile_password: null,
  custom_css: null,
  presentation_mode: false,
  presentation_interval: 5,
  schedule: {
    enabled: false,
    day_theme: null,
    night_theme: null,
    day_start: '08:00',
    night_start: '20:00',
  },
}

export const THEMES: Record<ThemeType, Partial<ThemeConfig>> = {
  dark: {
    background: '#0a0a0f',
    text_color: '#ffffff',
    accent_color: '#8b5cf6',
    button_color: '#1e1e2e',
  },
  light: {
    type: 'light',
    background: '#ffffff',
    text_color: '#0a0a0f',
    accent_color: '#8b5cf6',
    button_color: '#f1f5f9',
    button_text_color: '#0a0a0f',
  },
  neon: {
    background: '#000000',
    text_color: '#00ff00',
    accent_color: '#ff00ff',
    button_color: '#111111',
    button_text_color: '#00ff00',
  },
  cyber: {
    background: '#0d1117',
    text_color: '#39ff14',
    accent_color: '#ff6b35',
    button_color: '#161b22',
    button_text_color: '#39ff14',
  },
  minimal: {
    background: '#fafafa',
    text_color: '#1a1a1a',
    accent_color: '#000000',
    button_color: '#ffffff',
    button_text_color: '#1a1a1a',
    button_style: 'sharp',
  },
  retro: {
    background: '#f4e4c1',
    text_color: '#5c3a1e',
    accent_color: '#d4a373',
    button_color: '#e9d5a1',
    button_text_color: '#5c3a1e',
    button_style: 'pill',
  },
  ocean: {
    background: '#0c1929',
    text_color: '#e0f7fa',
    accent_color: '#00bcd4',
    button_color: '#1a2a4a',
    button_text_color: '#e0f7fa',
  },
  sunset: {
    background: 'linear-gradient(135deg, #1a0a2e, #2d1b69, #e74c3c)',
    background_type: 'gradient',
    text_color: '#ffffff',
    accent_color: '#f39c12',
    button_color: 'rgba(255,255,255,0.1)',
    button_text_color: '#ffffff',
    button_style: 'glass',
  },
  matrix: {
    background: '#0a0a0a',
    text_color: '#00ff41',
    accent_color: '#00ff41',
    button_color: '#0d1f0d',
    button_text_color: '#00ff41',
    button_style: 'sharp',
  },
  sunrise: {
    background: 'linear-gradient(135deg, #ff6b35, #f7c948)',
    background_type: 'gradient',
    text_color: '#1a1a2e',
    accent_color: '#ff6b35',
    button_color: '#1a1a2e',
    button_text_color: '#f7c948',
    button_style: 'pill',
  },
  arctic: {
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    background_type: 'gradient',
    text_color: '#e0f7fa',
    accent_color: '#4fc3f7',
    button_color: '#1e3a5f',
    button_text_color: '#b3e5fc',
    button_style: 'rounded',
  },
  midnight: {
    background: '#0d0b1a',
    text_color: '#e0b3ff',
    accent_color: '#9b59b6',
    button_color: '#1e1338',
    button_text_color: '#d4a5ff',
    button_style: 'rounded',
  },
  forest: {
    background: 'linear-gradient(135deg, #1b3a1b, #2d5a27)',
    background_type: 'gradient',
    text_color: '#d4edda',
    accent_color: '#4caf50',
    button_color: '#1b3a1b',
    button_text_color: '#a5d6a7',
    button_style: 'pill',
  },
  candy: {
    background: 'linear-gradient(135deg, #f8bbd0, #ce93d8)',
    background_type: 'gradient',
    text_color: '#4a1a5e',
    accent_color: '#e91e8c',
    button_color: '#7b1fa2',
    button_text_color: '#fce4ec',
    button_style: 'pill',
  },
}

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'premium-monthly',
    name: 'Premium',
    price: 499,
    currency: 'usd',
    interval: 'month',
    stripe_price_id: 'price_premium_monthly',
    features: [
      'Temas premium exclusivos',
      'Sin marca de agua',
      'Analytics avanzados',
      'Hasta 50 links',
      'Soporte prioritario',
      'Botón personalizado por link',
      'Estadísticas en tiempo real',
      'Exportar datos',
    ],
  },
  {
    id: 'premium-yearly',
    name: 'Premium Anual',
    price: 3999,
    currency: 'usd',
    interval: 'year',
    stripe_price_id: 'price_premium_yearly',
    features: [
      'Todo lo de Premium mensual',
      '3 meses gratis',
      'Insignia Pro',
      'Personalización CSS avanzada',
      'Prioridad en nuevas features',
      'Acceso a beta features',
    ],
  },
]

export { iconMap } from './icons'
