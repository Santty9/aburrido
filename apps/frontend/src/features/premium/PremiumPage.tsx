import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { premiumApi } from '@/lib/api'
import type { PremiumPlan } from '@aburrido/shared'
import { useLanguage } from '@/hooks/useLanguage'
import { Check, Sparkles, ArrowRight, X } from 'lucide-react'

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
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-keef-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('premium.title')}</h1>
          <p className="text-text-secondary">{t('premium.subtitle')}</p>
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
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-keef-500/10 border border-keef-500/20 rounded-full text-sm text-keef-400 mb-4">
          <Sparkles className="w-4 h-4" />
          {t('premium.cta')}
        </div>
        <h1 className="text-4xl font-black mb-4">{t('premium.title')}</h1>
        <p className="text-text-secondary max-w-lg mx-auto">
          {t('premium.description')}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`relative h-full ${i === 0 ? 'border-keef-500/50' : ''}`}>
              {i === 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="premium">{t('premium.popular')}</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-black">${(plan.price / 100).toFixed(2)}</span>
                  <span className="text-text-secondary text-sm">/{plan.interval === 'month' ? t('premium.monthlyLabel') : t('premium.yearlyLabel')}</span>
                </div>
                <CardDescription>
                  {plan.interval === 'year' && (
                    <span className="text-success text-sm">{t('premium.annualSavings')}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <div className="space-y-3 mt-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-success shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                variant={i === 0 ? 'premium' : 'secondary'}
                className="w-full mt-6"
                onClick={() => handleSubscribe(plan.stripe_price_id)}
              >
                {i === 0 ? t('premium.cta') : t('premium.yearly')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('premium.compare.title')}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { feature: t('premium.compare.links'), free: t('premium.compare.free.links'), premium: t('premium.compare.premium.links') },
              { feature: t('premium.compare.themes'), free: t('premium.compare.free.themes'), premium: t('premium.compare.premium.themes') },
              { feature: t('premium.compare.analytics'), free: t('premium.compare.free.analytics'), premium: t('premium.compare.premium.analytics') },
              { feature: t('premium.compare.watermark'), free: t('premium.compare.free.watermark'), premium: t('premium.compare.premium.watermark') },
              { feature: t('premium.compare.customCss'), free: t('premium.compare.free.customCss'), premium: t('premium.compare.premium.customCss') },
              { feature: t('premium.compare.support'), free: t('premium.compare.free.support'), premium: t('premium.compare.premium.support') },
            ].map(({ feature, free, premium }) => (
              <div key={feature} className="flex items-center justify-between p-3 bg-surface-3 rounded-xl text-sm">
                <span className="font-medium">{feature}</span>
                <div className="flex items-center gap-4">
                  <span className="text-text-secondary w-20 text-right">{free}</span>
                  <span className="text-keef-400 w-24 text-right">{premium}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
