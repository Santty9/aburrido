import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { ArrowRight, Star, Layers, Palette, BarChart3, Smartphone, Globe, Zap, Sparkles, ExternalLink, MousePointerClick, Users, Eye, Link2, Shield, Github, Twitter, Instagram } from 'lucide-react'

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[280px] h-[560px] mx-auto">
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-zinc-400/30 to-zinc-600/30 p-[3px] shadow-2xl shadow-keef-500/10">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-2xl z-10 flex items-center justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          <div className="w-8 h-1.5 rounded-full bg-zinc-700" />
        </div>
        <div className="absolute -left-[2px] top-32 w-[3px] h-8 bg-zinc-600 rounded-l" />
        <div className="absolute -right-[2px] top-28 w-[3px] h-12 bg-zinc-600 rounded-r" />
        <div className="absolute -right-[2px] top-44 w-[3px] h-16 bg-zinc-600 rounded-r" />
        <div className="w-full h-full rounded-[2.85rem] bg-[#0c0c14] overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  )
}

function ProfilePreview() {
  return (
    <div className="h-full flex flex-col items-center px-5 pt-12 pb-6 overflow-y-auto">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-keef-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mb-3 ring-2 ring-keef-500/30 shadow-lg shadow-keef-500/20">
        K
      </div>
      <h3 className="text-white font-bold text-sm">santty</h3>
      <p className="text-zinc-500 text-[10px] text-center mt-1 leading-relaxed">back-end developer</p>
      <div className="flex items-center gap-1.5 mt-2 mb-5">
        <div className="flex items-center gap-1 bg-keef-500/15 rounded-full px-2 py-0.5">
          <Star className="w-2.5 h-2.5 text-keef-400" />
          <span className="text-[9px] text-keef-400 font-medium">Premium</span>
        </div>
        <div className="flex items-center gap-1 bg-zinc-800/50 rounded-full px-2 py-0.5">
          <Eye className="w-2.5 h-2.5 text-zinc-400" />
          <span className="text-[9px] text-zinc-400">1.2k</span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {[
          { icon: Github, label: 'GitHub', accent: 'from-zinc-600 to-zinc-700' },
          { icon: Twitter, label: 'Twitter / X', accent: 'from-sky-600 to-sky-700' },
          { icon: Instagram, label: 'Instagram', accent: 'from-pink-600 to-orange-600' },
        ].map(({ icon: Icon, label, accent }) => (
          <div key={label} className={`w-full py-2.5 px-3 rounded-xl bg-gradient-to-r ${accent} flex items-center gap-2.5`}>
            <Icon className="w-3.5 h-3.5 text-white/80" />
            <span className="text-xs text-white/90 font-medium">{label}</span>
          </div>
        ))}
        <div className="w-full py-2.5 px-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center gap-2.5">
          <Link2 className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400 font-medium">keef.app/santty</span>
        </div>
      </div>
      <p className="text-[8px] text-zinc-600 mt-4">Powered by Keef</p>
    </div>
  )
}

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } },
}

export function HomePage() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <div className="min-h-screen bg-[#08080d] overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-keef-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-20%] w-[50%] h-[50%] bg-pink-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-sky-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-black text-sm">K</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Keef</span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  {t('nav.dashboard')}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="bg-white text-[#08080d] hover:bg-white/90 shadow-lg shadow-white/10">
                    {t('nav.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-28 pb-16 lg:pb-0 lg:pt-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger.container}
              className="relative z-10"
            >
              <motion.div variants={stagger.item} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-white/50 mb-8 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('home.badge')}
              </motion.div>

              <motion.h1 variants={stagger.item} className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-[0.95] tracking-[-0.04em] text-white mb-6">
                {t('home.title1')}
                <br />
                <span className="bg-gradient-to-r from-keef-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                  {t('home.title2')}
                </span>
              </motion.h1>

              <motion.p variants={stagger.item} className="text-lg text-white/40 leading-relaxed max-w-lg mb-10">
                {t('home.subtitle')}
              </motion.p>

              <motion.div variants={stagger.item} className="flex items-center gap-4 flex-wrap">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="text-base px-8 py-4 bg-white text-[#08080d] hover:bg-white/90 rounded-2xl shadow-2xl shadow-white/10 group">
                    <span>{t('home.cta.start')}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/changelog">
                  <Button variant="ghost" size="lg" className="text-base px-6 py-4 text-white/50 hover:text-white rounded-2xl">
                    {t('home.cta.changelog')}
                  </Button>
                </Link>
              </motion.div>

              {/* Trusted by mini section */}
              <motion.div variants={stagger.item} className="mt-14 pt-8 border-t border-white/[0.04]">
                <p className="text-[11px] uppercase tracking-[0.15em] text-white/20 mb-5 font-medium">Trusted by creators worldwide</p>
                <div className="flex items-center gap-6 flex-wrap">
                  {['@santty', '@juan_, @maria', '@code', '@design'].map((name) => (
                    <div key={name} className="flex items-center gap-2 text-white/15">
                      <div className="w-6 h-6 rounded-full bg-white/[0.04]" />
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ y: heroParallax }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Floating stat badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -top-4 -left-4 lg:-left-8 z-20 bg-[#0c0c14]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl px-4 py-3 shadow-2xl"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">1,234</p>
                    <p className="text-[10px] text-white/30">profile views</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="absolute bottom-12 -right-4 lg:-right-8 z-20 bg-[#0c0c14]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl px-4 py-3 shadow-2xl"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-keef-500/10 flex items-center justify-center">
                    <MousePointerClick className="w-4 h-4 text-keef-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">89</p>
                    <p className="text-[10px] text-white/30">clicks today</p>
                  </div>
                </div>
              </motion.div>

              <PhoneFrame>
                <ProfilePreview />
              </PhoneFrame>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/[0.08] flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-3xl overflow-hidden">
            {[
              { icon: Users, value: '10K+', label: 'Active users', desc: 'and growing daily' },
              { icon: Link2, value: '50K+', label: 'Links created', desc: 'across all profiles' },
              { icon: MousePointerClick, value: '1M+', label: 'Monthly visits', desc: 'and counting' },
              { icon: Star, value: '4.9', label: 'Average rating', desc: 'from user reviews' },
            ].map(({ icon: Icon, value, label, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0c0c14] p-8 text-center group hover:bg-[#0f0f18] transition-colors duration-500"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 group-hover:bg-white/[0.06] transition-colors">
                  <Icon className="w-5 h-5 text-white/40" />
                </div>
                <div className="text-3xl font-black text-white mb-1">{value}</div>
                <div className="text-sm text-white/50 font-medium">{label}</div>
                <div className="text-xs text-white/20 mt-1">{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Asymmetric Layout */}
      <section className="relative py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-white/30 mb-5">
              <span className="w-1 h-1 rounded-full bg-keef-400" />
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95]">
              Everything you need to<br />
              <span className="text-white/40">share your links</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Feature Cards */}
            <div className="space-y-4">
              {[
                { icon: Layers, title: 'home.features.dragDrop' as const, desc: 'home.features.dragDropDesc' as const, gradient: 'from-keef-500/10 to-transparent' },
                { icon: Palette, title: 'home.features.themes' as const, desc: 'home.features.themesDesc' as const, gradient: 'from-pink-500/10 to-transparent' },
                { icon: BarChart3, title: 'home.features.analytics' as const, desc: 'home.features.analyticsDesc' as const, gradient: 'from-sky-500/10 to-transparent' },
              ].map(({ icon: Icon, title, desc, gradient }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative bg-gradient-to-r ${gradient} border border-white/[0.04] hover:border-white/[0.08] rounded-2xl p-6 transition-all duration-500`}
                >
                  <div className="flex items-start gap-5">
                    <div className="w-11 h-11 rounded-xl bg-white/[0.03] flex items-center justify-center shrink-0 group-hover:bg-white/[0.06] transition-colors">
                      <Icon className="w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1.5">{t(title)}</h3>
                      <p className="text-sm text-white/30 leading-relaxed">{t(desc)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right - Showcase Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-transparent border border-white/[0.04] rounded-2xl p-8 lg:p-10 flex flex-col justify-center overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-keef-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-keef-500/10 transition-all duration-700" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-keef-500/30 to-pink-500/30 border border-white/[0.06] flex items-center justify-center text-[10px] text-white/50 font-medium">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-white/20">+2.4k creators</span>
                </div>
                <blockquote className="text-lg md:text-xl text-white/70 leading-relaxed font-medium">
                  "Keef completely changed how I share my content. <span className="text-white">One link, everything organized.</span> It's that simple."
                </blockquote>
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/[0.04]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-keef-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Santty9</p>
                    <p className="text-xs text-white/30">Developer & Creator</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom three features */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: Smartphone, title: 'home.features.qr' as const, desc: 'home.features.qrDesc' as const },
              { icon: Globe, title: 'home.features.pwa' as const, desc: 'home.features.pwaDesc' as const },
              { icon: Layers, title: 'home.features.export' as const, desc: 'home.features.exportDesc' as const },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="group bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] rounded-xl p-5 transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-0">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center group-hover:bg-white/[0.06] transition-colors">
                    <Icon className="w-4.5 h-4.5 text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white/80">{t(title)}</h3>
                    <p className="text-xs text-white/25">{t(desc)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="relative py-28 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start"
          >
            {/* Left - Label + Steps */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-white/30 mb-5">
                <Zap className="w-3 h-3" />
                How it works
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95] mb-4">
                Get started in
                <br />
                <span className="text-white/40">three simple steps</span>
              </h2>
              <p className="text-white/30 leading-relaxed max-w-sm">
                No credit card required. No complicated setup. Just you, your links, and your audience.
              </p>
            </div>

            {/* Right - Steps */}
            <div className="relative">
              <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-keef-500/40 via-pink-500/20 to-transparent" />
              <div className="space-y-12">
                {[
                  { step: '01', icon: Users, title: 'landing.howto1' as const, desc: 'landing.howto1Desc' as const },
                  { step: '02', icon: Link2, title: 'landing.howto2' as const, desc: 'landing.howto2Desc' as const },
                  { step: '03', icon: ExternalLink, title: 'landing.howto3' as const, desc: 'landing.howto3Desc' as const },
                ].map(({ step, icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="relative pl-14"
                  >
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-white/30">
                      {step}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1.5">{t(title)}</h3>
                    <p className="text-sm text-white/30 leading-relaxed">{t(desc)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-keef-500/10 to-pink-500/10 border border-keef-500/20 text-xs text-keef-400 mb-6">
              <Sparkles className="w-3 h-3" />
              {t('landing.premiumTag')}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95] mb-4">
              {t('home.premium.title')}
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              {t('home.premium.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Sparkles, title: 'home.premium.themes.title' as const, desc: 'home.premium.themes.desc' as const, gradient: 'from-keef-500 to-purple-500' },
              { icon: Shield, title: 'home.premium.branding.title' as const, desc: 'home.premium.branding.desc' as const, gradient: 'from-pink-500 to-rose-500' },
              { icon: Zap, title: 'home.premium.css.title' as const, desc: 'home.premium.css.desc' as const, gradient: 'from-sky-500 to-cyan-500' },
            ].map(({ icon: Icon, title, desc, gradient }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] rounded-2xl p-8 text-center transition-all duration-500"
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-xl shadow-keef-500/10 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t(title)}</h3>
                <p className="text-sm text-white/30 leading-relaxed">{t(desc)}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/premium">
              <Button variant="premium" size="lg" className="text-base px-8 py-4 bg-gradient-to-r from-keef-500 to-pink-500 hover:from-keef-600 hover:to-pink-600 text-white rounded-2xl shadow-xl shadow-keef-500/20 group border-0">
                <span>{t('home.premium.cta')}</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 border-t border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-keef-500/[0.02] via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-keef-500/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.9] mb-6">
              {t('landing.ctaTitle')}
            </h2>
            <p className="text-lg text-white/40 max-w-xl mx-auto mb-10">
              {t('landing.ctaSub')}
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg" className="text-base px-10 py-4 bg-white text-[#08080d] hover:bg-white/90 rounded-2xl shadow-2xl shadow-white/10 group">
                <Sparkles className="w-5 h-5 mr-1.5" />
                <span>{t('home.cta.start')}</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
                <span className="text-white font-black text-xs">K</span>
              </div>
              <span className="text-sm font-semibold text-white/60">Keef</span>
            </div>
            <p className="text-sm text-white/20">{t('home.footer')}</p>
            <div className="flex items-center gap-6">
              <Link to="/changelog" className="text-xs text-white/20 hover:text-white/50 transition-colors">{t('nav.changelog')}</Link>
              <Link to="/premium" className="text-xs text-white/20 hover:text-white/50 transition-colors">{t('nav.premium')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
