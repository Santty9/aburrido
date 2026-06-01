import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/useLanguage'
import { ArrowRight, Link2, Palette, BarChart3, Smartphone, Globe, Shield, Star, Zap, Sparkles, Users, MousePointerClick, Layers } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const features = [
  { icon: Link2, titleKey: 'home.features.dragDrop' as const, descKey: 'home.features.dragDropDesc' as const },
  { icon: Palette, titleKey: 'home.features.themes' as const, descKey: 'home.features.themesDesc' as const },
  { icon: BarChart3, titleKey: 'home.features.analytics' as const, descKey: 'home.features.analyticsDesc' as const },
  { icon: Smartphone, titleKey: 'home.features.qr' as const, descKey: 'home.features.qrDesc' as const },
  { icon: Globe, titleKey: 'home.features.pwa' as const, descKey: 'home.features.pwaDesc' as const },
  { icon: Layers, titleKey: 'home.features.export' as const, descKey: 'home.features.exportDesc' as const },
] as const

function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function UserPlus(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg> }

function Share2(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> }

export function HomePage() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-surface/80 backdrop-blur-xl">
        <div className="container-main flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-keef-500 to-pink-500 flex items-center justify-center text-white font-black text-sm">K</div>
            <span className="text-lg font-bold">Keef</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard"><Button variant="primary" size="sm">{t('nav.dashboard')}</Button></Link>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">{t('nav.login')}</Button></Link>
                <Link to="/register"><Button variant="primary" size="sm">{t('nav.register')}</Button></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-keef-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-40 right-10 w-60 h-60 bg-keef-500/10 rounded-full blur-2xl" />

        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-keef-500/10 border border-keef-500/20 rounded-full text-sm text-keef-400 mb-6">
              <Sparkles className="w-4 h-4" />
              {t('home.badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
              {t('home.title1')}
              <span className="gradient-text block mt-1">{t('home.title2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('home.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register">
                <Button variant="primary" size="lg" className="text-base px-8 py-4">
                  {t('home.cta.start')}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/changelog">
                <Button variant="secondary" size="lg" className="text-base px-8 py-4">
                  {t('home.cta.changelog')}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative mt-20 max-w-3xl mx-auto"
          >
            <div className="relative glass rounded-2xl p-1 overflow-hidden">
              <div className="bg-surface rounded-xl p-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-keef-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">K</div>
                <div className="h-4 w-32 bg-keef-500/20 rounded-full" />
                <div className="h-3 w-48 bg-text-secondary/20 rounded-full" />
                <div className="w-full space-y-2 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 rounded-xl bg-keef-500/10 border border-keef-500/20 flex items-center px-4 gap-3">
                      <div className="w-5 h-5 rounded bg-keef-500/30" />
                      <div className="h-3 flex-1 bg-keef-500/20 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-keef-500/20 rounded-full blur-xl" />
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-pink-500/20 rounded-full blur-xl" />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-surface-2/30">
        <div className="container-main py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '10K+', label: t('landing.users') },
              { icon: Link2, value: '50K+', label: t('landing.links') },
              { icon: MousePointerClick, value: '1M+', label: t('landing.visits') },
              { icon: Star, value: '4.9', label: t('landing.rating') },
            ].map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Icon className="w-6 h-6 text-keef-400 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-black gradient-text">{value}</div>
                <div className="text-sm text-text-secondary mt-1">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container-main">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{t('home.features.title')}</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('landing.featuresSub')}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, titleKey, descKey }, i) => (
              <motion.div
                key={titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-surface-2/50 border border-border/80 hover:border-keef-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-xl bg-keef-500/10 flex items-center justify-center mb-4 group-hover:bg-keef-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-keef-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t(titleKey)}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-surface-2/30 border-y border-border/50">
        <div className="container-main">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{t('landing.howto')}</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('landing.howtoSub')}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: UserPlus, step: '01', titleKey: 'landing.howto1' as const, descKey: 'landing.howto1Desc' as const },
              { icon: Link2, step: '02', titleKey: 'landing.howto2' as const, descKey: 'landing.howto2Desc' as const },
              { icon: Share2, step: '03', titleKey: 'landing.howto3' as const, descKey: 'landing.howto3Desc' as const },
            ].map(({ icon: Icon, step, titleKey, descKey }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-keef-500/10 border border-keef-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-keef-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-keef-500 text-white text-xs font-bold flex items-center justify-center">{step}</div>
                <h3 className="text-lg font-semibold mb-2">{t(titleKey)}</h3>
                <p className="text-text-secondary text-sm">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-24">
        <div className="container-main">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-keef-500/10 border border-keef-500/20 rounded-full text-sm text-keef-400 mb-4">
              <Star className="w-4 h-4" />
              {t('landing.premiumTag')}
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">{t('home.premium.title')}</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('home.premium.subtitle')}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Sparkles, titleKey: 'home.premium.themes.title' as const, descKey: 'home.premium.themes.desc' as const },
              { icon: Shield, titleKey: 'home.premium.branding.title' as const, descKey: 'home.premium.branding.desc' as const },
              { icon: Zap, titleKey: 'home.premium.css.title' as const, descKey: 'home.premium.css.desc' as const },
            ].map(({ icon: Icon, titleKey, descKey }, i) => (
              <motion.div
                key={titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl bg-surface-2/30 border border-border/50 hover:border-keef-500/20 transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-keef-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-keef-500/20">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{t(titleKey)}</h3>
                <p className="text-text-secondary text-sm">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>

          <AnimatedSection className="text-center mt-10" delay={0.3}>
            <Link to="/premium">
              <Button variant="premium" size="lg" className="text-base px-8">
                {t('home.premium.cta')}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 border-t border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.1),transparent_60%)]" />
        <div className="container-main relative">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{t('landing.ctaTitle')}</h2>
            <p className="text-text-secondary text-lg mb-8">{t('landing.ctaSub')}</p>
            <Link to="/register">
              <Button variant="primary" size="lg" className="text-base px-10 py-4">
                <Sparkles className="w-5 h-5 mr-1" />
                {t('home.cta.start')}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10">
        <div className="container-main">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-keef-500 to-pink-500 flex items-center justify-center text-white font-black text-xs">K</div>
              <span className="text-sm font-semibold">Keef</span>
            </div>
            <p className="text-text-secondary text-sm">{t('home.footer')}</p>
            <div className="flex items-center gap-4">
              <Link to="/changelog" className="text-xs text-text-secondary hover:text-white transition-colors">{t('nav.changelog')}</Link>
              <Link to="/premium" className="text-xs text-text-secondary hover:text-white transition-colors">{t('nav.premium')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
