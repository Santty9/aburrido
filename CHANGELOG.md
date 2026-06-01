# Changelog de Aburrido

Todas las modificaciones importantes del proyecto.

---

## [3.10.0] — 2026-05-31 — Sesión 1: Diagnóstico y corrección de errores

### Corregido
- **`packages/shared/src/index.ts`**: Agregadas propiedades faltantes a tipos compartidos:
  - `Link`: `thumbnail_url`, `scheduled_start`, `scheduled_end`, `category`
  - `CreateLinkInput`: mismas propiedades que `Link`
  - `Profile`: `badge_ids?` (array de strings)
  - `ThemeType`: 6 nuevas variantes (`matrix`, `sunrise`, `arctic`, `midnight`, `forest`, `candy`)
  - `THEMES` record: agregadas las 6 nuevas variantes con configuraciones completas
- **`PublicProfilePage.tsx`**: `LoadingScreen` y `Error404` ahora reciben `t` como prop (antes referenciaban `t()` fuera de scope → crash runtime seguro)
- **`SettingsPage.tsx`**: `useRef<ReturnType<typeof setTimeout>>(undefined)` (faltaba el argumento inicial)
- **`useLanguage.tsx`**: Firma `t()` ahora acepta `Record<string, string | number>` en params + uso de `String(v)` en el replace para compatibilidad de tipos
- **`ThemeMarketplacePage.tsx`**: `ease: 'easeOut' as const` para compatibilidad con tipos estrictos de framer-motion
- **`api.ts`**: Removidos casts `as any` de `category`, `thumbnail_url`, `scheduled_start`, `scheduled_end`. Filtro de `categories` usa type guard
- **`i18n/es.ts` y `i18n/en.ts`**: Agregadas ~40 claves de traducción faltantes (dashboard, analytics, premium, changelog, editor)
- **`language.test.tsx`**: `as keyof Translations` para test de key inexistente
- **`ThemeType` extendido**: Compilación exitosa del shared package con nuevas variantes
- **`DEFAULT_PRESETS` (ahora `THEMES`)**: Completado con entries para matrix, sunrise, arctic, midnight, forest, candy
- **`DashboardPage.tsx`**: Cambiado `t('dashboard.stats.analytics')` → clave existente agregada
- **`api.ts`**: `categories` filter con type guard `(c: c is string) => !!c`

### Resultado
- `npx tsc --noEmit` → **0 errores**
- `npx vitest run` → **51 tests pasando**

---

## [3.11.0] — 2026-05-31 — Sesión 2: Features mayores + Rediseño

### Agregado
- **Tipos compartidos** (`packages/shared/src/index.ts`):
  - `ThemeSchedule`: programación día/noche con `enabled`, `day_theme`, `night_theme`, `day_start`, `night_start`
  - `LinkPreview`: preview rica (`title`, `description`, `image`, `favicon`)
  - `PixelTracking`: píxeles de Facebook, Google, TikTok, Twitter
  - `AffiliateSettings`: link de afiliado con cloaking
  - `VerificationStatus`: `'unverified' | 'pending' | 'verified' | 'rejected'`
  - `ThemeConfig`: 7 campos nuevos (`show_verification_badge`, `link_border_style`, `link_shadow`, `animation_speed`, `schedule`)
  - `Profile`: `verification_status`, `trust_score`
  - `PublicProfile`: `is_verified`
  - `MarketplaceTheme`: `rating`, `category`, `tags`
  - `AnalyticsOverview`: `visits_by_hour`, `clicks_by_link` ahora con `url`, `ctr`
  - `Link`/`CreateLinkInput`: `preview`, `pixels`, `affiliate`

- **Dashboard (`DashboardPage.tsx`) — Rediseño completo**:
  - Stats reales: visitas, links, clicks, plan
  - Barra de perfil con globe icon + copy link
  - Grid de acceso rápido con gradientes por sección
  - Card de cuenta con plan, username, verificación, member since
  - Resumen rápido (visitas hoy, clicks hoy, unique visitors, CTR)
  - Actividad reciente
  - CTA premium contextual

- **Personalization (`PersonalizationPage.tsx`) — Nuevas opciones**:
  - Borde de links: sin borde, sutil, resplandor, degradado
  - Sombra de links: sin sombra, suave, media, fuerte
  - Velocidad de animación: lenta, normal, rápida
  - Programación día/noche: toggle, selectores de tema, horarios
  - Toggle de insignia de verificación

- **Marketplace (`ThemeMarketplacePage.tsx`) — Búsqueda + filtros**:
  - Input de búsqueda en vivo
  - Filtros por categoría (8 categorías con iconos)
  - Ordenamiento: descargas, rating, fecha
  - Rating con estrellas (1-5)
  - Tags por tema
  - Badge con contador de resultados
  - 8 temas predefinidos (2 nuevos: Cyberpunk, RetroWave)

- **Editor (`EditorPage.tsx`) — Link Preview + Tracking + QR**:
  - Rich Link Preview automática al pegar URL (unfurl via fetch)
  - Preview visual: thumbnail, título, descripción, favicon
  - Botón para usar imagen del preview como thumbnail
  - Píxeles de tracking por link (Facebook, Google, TikTok, Twitter)
  - Link de afiliado con toggle + cloaking
  - Generación de código QR por link
  - Indicadores visuales en lista: eye (preview), target (tracking)
  - Panel de opciones avanzadas colapsable

- **Perfil público (`PublicProfilePage.tsx`)**:
  - Badge de verificación animado junto al nombre
  - Botón vCard que descarga `.vcf` con datos del perfil

- **Analytics (`AnalyticsPage.tsx`) — Insights profundos**:
  - Gráfico de actividad por hora (24h con barra horizontal)
  - CTR por link individual
  - Referrers con barra de progreso + porcentaje
  - Top links rankeados con barra y CTR
  - Últimos 7 días con barras de progreso relativo
  - Quick summary con 4 métricas

- **`api.ts`**: 
  - `mkTheme()` helper para crear temas sin repetir defaults
  - Todos los objetos mock actualizados con nuevos campos
  - Analytics devuelve `visits_by_hour` y `clicks_by_link` con `url`, `ctr`
  - Marketplace themes con `rating`, `category`, `tags`

### Corregido
- Varios errores de tipos en editor, dashboard y api.ts post-rediseño

---

## [4.0.0] — 2026-05-31 — Sesión 3: Live Analytics + Seguridad + Changelog

### Agregado

#### 🔒 Seguridad (Backend)
- **Rate limiting por IP en visitas de perfil**: límite de 30 visitas/15min por IP para prevenir fraude
- **Anti-fraud en visitas**: deduplicación por IP + User-Agent dentro de ventana de 5 minutos (no se registran visitas duplicadas)
- **Validación Zod** en todos los endpoints (`@zod`):
  - `/api/auth/register`: email, password (min 8 chars), username (3-20 chars, alfanumérico)
  - `/api/auth/login`: email, password
  - `/api/profile/:username`: sanitización de params
  - `/api/links`: title, url validados
  - `/api/profile`: whitelist de campos actualizables
- **CSRF Protection**: middleware que verifica header `X-CSRF-Token` en mutaciones (GET exento)
- **JWT refresh tokens**: endpoint `/api/auth/refresh` con token de 7 días, refresh de 30 días
- **Helmet mejorado**: Content-Security-Policy, X-Content-Type-Options, etc.
- **CORS restrictivo**: solo origen configurado via `FRONTEND_URL`
- **Errores sanitizados**: los errores internos no exponen detalles del servidor

#### 📡 Live Analytics (WebSocket)
- **Servidor WebSocket** en el puerto 3002 via `ws`
- **Broadcast en tiempo real** cuando alguien visita un perfil:
  - `profile:visit`: `{ username, timestamp, referer }` enviado al dueño del perfil
  - `profile:click`: `{ linkTitle, username, timestamp }` cuando alguien hace clic
- **Canales privados por perfil**: el dueño del perfil solo recibe eventos de su propio perfil
- **Heartbeat**: ping/pong cada 30s para mantener conexiones vivas
- **Reconexión automática**: el cliente frontend reconecta con backoff exponencial

#### 📊 Frontend — LiveAnalytics
- **`useWebSocket` hook**: conexión WebSocket, reconexión automática, estado de conexión
- **`LiveIndicator` componente**: dot verde/rojo indicando estado de la conexión
- **Sección en AnalyticsPage**: "En vivo ahora" con:
  - Indicador de conexión WebSocket
  - Feed de actividad en tiempo real (visitas, clicks)
  - Contador de visitas hoy que se actualiza solo
- Notificaciones toast para eventos en vivo

#### 📋 Sistema de Changelog
- **`CHANGELOG.md`**: documentación completa de todas las sesiones de trabajo
- A partir de ahora, todos los cambios se documentan en este archivo

### Corregido
- Visitas duplicadas por refresco de página (anti-fraud por IP + UA)
- Inyección de scripts en inputs de perfil (sanitización Zod)
- Exposición de `JWT_SECRET` en respuestas de error
- Token de autenticación sin expiry fijo (ahora 7 días con refresh)

### Seguridad
- [x] Rate limiting por IP en visitas
- [x] Anti-fraud con fingerprint IP+UA
- [x] Validación Zod en todos los inputs
- [x] CSRF protection en mutaciones
- [x] JWT con refresh tokens
- [x] Helmet + CORS restrictivo
- [x] Errores sanitizados
- [x] No exposición de secrets

---

*Formato basado en [Keep a Changelog](https://keepachangelog.com/)*
