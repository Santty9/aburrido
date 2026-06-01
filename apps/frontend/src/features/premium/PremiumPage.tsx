import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { premiumApi } from '@/lib/api'
import type { PremiumPlan } from '@aburrido/shared'
import { useLanguage } from '@/hooks/useLanguage'
import { Check, Sparkles, ArrowRight, Crown, Zap, Shield, Star } from 'lucide-react'

export function PremiumPage() {
  const [plans, setPlans] = useState<PremiumPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { profile } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    premiumApi.getPlans().then((res) => {
      if (res.success && res.data) {
        setPlans(res.data as PremiumPlan[])
      }
      setIsLoading(false)
    })
  }, [])

  const handleSubscribe = async (priceId: string) => {
    const res = await premiumApi.createCheckout(priceId)
    if (res.success && res.data) {
      window.location.href = res.data.url
    }
  }

  if (profile?.is_premium) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.1 }}
            className="w-24 h-24 mx-auto bg-gradient-to-br from-keef-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-keef-500/30 relative"
          >
            <Crown className="w-12 h-12 text-white" />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-br from-keef-500/30 to-pink-500/30 rounded-3xl blur-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500/10 to-keef-500/10 border border-amber-500/20 rounded-full text-sm text-amber-400 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            {t('premium.cta.active')}
          </motion.div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-keef-300 via-white to-pink-300 bg-clip-text text-transparent mb-3">{t('premium.title')}</h1>
          <p className="text-text-secondary text-lg">{t('premium.subtitle')}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto"
          >
            {[
              { icon: Zap, label: 'Temas exclusivos' },
              { icon: Shield, label: 'Sin marca' },
              { icon: Star, label: 'Soporte VIP' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 bg-surface-2 border border-border rounded-2xl">
                <div className="w-10 h-10 bg-gradient-to-br from-keef-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-text-secondary text-center">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-keef-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-keef-500/10 to-pink-500/10 border border-keef-500/20 rounded-full text-sm text-keef-400 mb-4"
        >
          <Sparkles className="w-4 h-4" />
          {t('premium.cta')}
        </motion.div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-keef-300 via-white to-pink-300 bg-clip-text text-transparent mb-4">{t('premium.title')}</h1>
        <p className="text-text-secondary max-w-lg mx-auto text-lg">
          {t('premium.description')}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', damping: 20 }}
            className="relative"
          >
            <Card className={`relative h-full flex flex-col ${i === 1 ? 'border-keef-500/50 shadow-xl shadow-keef-500/10' : ''}`}>
              {i === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge variant="premium" className="text-xs px-4 py-1">
                    <Sparkles className="w-3 h-3" />
                    {t('premium.popular')}
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-3">
                  <span className="text-5xl font-black">${(plan.price / 100).toFixed(2)}</span>
                  <span className="text-text-secondary text-sm ml-1">/{plan.interval === 'month' ? t('premium.monthlyLabel') : t('premium.yearlyLabel')}</span>
                </div>
                {plan.interval === 'year' && (
                  <CardDescription>
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-sm mt-1 bg-emerald-500/10 px-3 py-1 rounded-full">
                      <Zap className="w-3 h-3" />
                      {t('premium.annualSavings')}
                    </span>
                  </CardDescription>
                )}
              </CardHeader>
              <div className="flex-1 space-y-3 px-6 pb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-keef-500/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-keef-400" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <Button
                  variant={i === 1 ? 'premium' : 'secondary'}
                  className="w-full"
                  onClick={() => handleSubscribe(plan.stripe_price_id)}
                >
                  {plan.interval === 'year' ? t('premium.cta') : t('premium.monthly')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 max-w-3xl mx-auto"
      >
        <Card variant="glass" className="border-keef-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="w-5 h-5 text-keef-400" />
              {t('premium.compare.title')}
            </CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {([
              { feature: t('premium.compare.links'), free: t('premium.compare.free.links'), premium: t('premium.compare.premium.links') },
              { feature: t('premium.compare.themes'), free: t('premium.compare.free.themes'), premium: t('premium.compare.premium.themes') },
              { feature: t('premium.compare.analytics'), free: t('premium.compare.free.analytics'), premium: t('premium.compare.premium.analytics') },
              { feature: t('premium.compare.watermark'), free: t('premium.compare.free.watermark'), premium: t('premium.compare.premium.watermark') },
              { feature: t('premium.compare.customCss'), free: t('premium.compare.free.customCss'), premium: t('premium.compare.premium.customCss') },
              { feature: t('premium.compare.support'), free: t('premium.compare.free.support'), premium: t('premium.compare.premium.support') },
            ] as const).map(({ feature, free, premium }, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center justify-between p-3 bg-surface-3/50 rounded-xl text-sm hover:bg-surface-3 transition-colors"
              >
                <span className="font-medium">{feature}</span>
                <div className="flex items-center gap-6">
                  <span className="text-text-secondary w-20 text-right">{free === 'Si' || free === 'Yes' ? <Check className="w-4 h-4 text-emerald-400 inline" /> : free === 'No' ? <span className="text-text-secondary/40">--</span> : free}</span>
                  <span className="text-keef-400 w-24 text-right font-medium">{premium === 'Si' || premium === 'Yes' ? <Check className="w-4 h-4 text-emerald-400 inline" /> : premium === 'No' ? <span className="text-text-secondary/40">--</span> : premium}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
