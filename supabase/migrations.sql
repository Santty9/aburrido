-- ============================================
-- Aburrido - Esquema de Base de Datos Supabase
-- ============================================

-- Tipos ENUM
CREATE TYPE plan_type AS ENUM ('free', 'premium', 'pro');
CREATE TYPE changelog_type AS ENUM ('feature', 'fix', 'improvement');

-- Tabla de perfiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme JSONB DEFAULT '{"type":"dark","background":"#0a0a0f","background_type":"solid","text_color":"#ffffff","accent_color":"#8b5cf6","button_style":"rounded","button_color":"#1e1e2e","button_text_color":"#ffffff","font":"Inter","show_avatar":true,"show_bio":true,"custom_css":null}',
  plan plan_type DEFAULT 'free',
  is_premium BOOLEAN DEFAULT false,
  premium_since TIMESTAMPTZ,
  total_visits INTEGER DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de links
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'globe',
  icon_url TEXT,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_links_profile_id ON links(profile_id);

-- Tabla de visitas
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  visitor_ip TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_visits_profile_id ON visits(profile_id);
CREATE INDEX idx_visits_created_at ON visits(created_at);

-- Tabla de clicks
CREATE TABLE clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  visitor_ip TEXT,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clicks_link_id ON clicks(link_id);
CREATE INDEX idx_clicks_created_at ON clicks(created_at);

-- Tabla de suscripciones
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan plan_type DEFAULT 'premium',
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de changelogs
CREATE TABLE changelogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT NOT NULL,
  type changelog_type DEFAULT 'feature',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de votos de changelog
CREATE TABLE changelog_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  changelog_id UUID NOT NULL REFERENCES changelogs(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL,
  vote INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(changelog_id, profile_id)
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelogs ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Profiles son públicos"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden editar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = auth_user_id);

-- Políticas para links
CREATE POLICY "Links activos son públicos"
  ON links FOR SELECT
  USING (is_active = true OR
    EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND auth_user_id = auth.uid()::text));

CREATE POLICY "Usuarios pueden administrar sus links"
  ON links FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND auth_user_id = auth.uid()::text));

CREATE POLICY "Usuarios pueden actualizar sus links"
  ON links FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND auth_user_id = auth.uid()::text));

CREATE POLICY "Usuarios pueden eliminar sus links"
  ON links FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND auth_user_id = auth.uid()::text));

-- Changelogs son públicos
CREATE POLICY "Changelogs son públicos"
  ON changelogs FOR SELECT
  USING (true);

-- ============================================
-- Triggers
-- ============================================

-- Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Seed Data - Changelogs iniciales
-- ============================================

INSERT INTO changelogs (title, content, version, type, is_premium) VALUES
('🚀 Lanzamiento de Aburrido',
'Bienvenido a **Aburrido** — la forma más elegante de compartir tus links.

## Features
- Perfil público personalizable
- Drag & drop para organizar links
- 8 temas visuales únicos
- Analytics en tiempo real
- Modo oscuro/light

## Próximamente
- Pago premium con Stripe
- Temas exclusivos premium
- Personalización CSS avanzada',
'1.0.0', 'feature', false),

('🎨 Temas Premium',
'Añadidos **temas exclusivos** para usuarios premium:

- **Cyberpunk** — Colores neón vibrantes
- **Sunset** — Degradado atardecer
- **Ocean** — Azul profundo
- **Glassmorphism** — Efecto cristal

Además, ahora puedes personalizar colores individuales en cualquier tema.',
'1.1.0', 'feature', true),

('🐛 Fix: Analytics incorrectos',
'Corregido un bug donde los analytics mostraban conteos duplicados en visitas. Ahora los datos son precisos y en tiempo real.',
'1.1.1', 'fix', false),

('⚡ Mejora de rendimiento',
'Optimizaciones significativas:

- Carga de perfiles 60% más rápida
- Imágenes optimizadas con lazy loading
- Reducción de bundle size
- Mejora en animaciones y transiciones',
'1.2.0', 'improvement', false);
