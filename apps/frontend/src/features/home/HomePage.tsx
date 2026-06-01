import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sparkles, Link2, Palette, BarChart3, ArrowRight, Star, Shield, Zap } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export function HomePage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-surface">
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-surface/80 backdrop-blur-xl">
        <div className="container-main flex items-center justify-between h-16">
          <span className="text-xl font-bold gradient-text">Aburrido</span>
          <div className="flex items-center gap-4">
            <Link to="/changelog" className="text-sm text-text-secondary hover:text-white transition-colors">{t('nav.changelog')}</Link>
            <Link to="/login"><Button variant="ghost" size="sm">{t('nav.login')}</Button></Link>
            <Link to="/register"><Button variant="primary" size="sm">{t('nav.register')}</Button></Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-aburrido-500/10 rounded-full blur-3xl" />

        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-aburrido-500/10 border border-aburrido-500/20 rounded-full text-sm text-aburrido-400 mb-6">
              <Sparkles className="w-4 h-4" />
              {t('home.badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              {t('home.title1')}
              <span className="gradient-text block mt-2">{t('home.title2')}</span>
            </h1>
            <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
               {t('home.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg" className="text-base">
                  {t('home.cta.start')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/changelog">
                <Button variant="secondary" size="lg" className="text-base">
                  {t('home.cta.changelog')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t border-border/50">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { icon: Link2, title: t('home.features.links.title'), desc: t('home.features.links.desc') },
              { icon: Palette, title: t('home.features.themes.title'), desc: t('home.features.themes.desc') },
              { icon: BarChart3, title: t('home.features.analytics.title'), desc: t('home.features.analytics.desc') },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-2 border border-border rounded-2xl p-6 hover:border-aburrido-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-aburrido-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-aburrido-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-aburrido-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-text-secondary text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 border-t border-border/50 bg-surface-2/50">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">{t('home.premium.title')}</h2>
            <p className="text-text-secondary">{t('home.premium.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Star, title: t('home.premium.themes.title'), desc: t('home.premium.themes.desc') },
              { icon: Shield, title: t('home.premium.branding.title'), desc: t('home.premium.branding.desc') },
              { icon: Zap, title: t('home.premium.css.title'), desc: t('home.premium.css.desc') },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-aburrido-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-text-secondary text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/premium">
              <Button variant="premium" size="lg">
                {t('home.premium.cta')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8">
        <div className="container-main text-center text-text-secondary text-sm">
          <p>{t('home.footer')}</p>
        </div>
      </footer>
    </div>
  )
}
