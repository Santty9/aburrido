import { Router, Response } from 'express'
import type { PremiumPlan } from '@aburrido/shared'
import { authenticate, AuthRequest } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'

const router = Router()

const plans: PremiumPlan[] = [
  {
    id: 'premium-monthly',
    name: 'Premium Mensual',
    price: 499,
    currency: 'usd',
    interval: 'month',
    stripe_price_id: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_monthly',
    features: [
      'Temas premium exclusivos',
      'Sin marca de agua',
      'Analytics avanzados',
      'Hasta 50 links',
      'Soporte prioritario',
      'Estadísticas en tiempo real',
    ],
  },
  {
    id: 'premium-yearly',
    name: 'Premium Anual',
    price: 3999,
    currency: 'usd',
    interval: 'year',
    stripe_price_id: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || 'price_yearly',
    features: [
      'Todo lo de Premium mensual',
      '3 meses gratis',
      'Insignia Pro',
      'Personalización CSS avanzada',
      'Acceso a beta features',
    ],
  },
]

router.get('/plans', (_req, res: Response) => {
  res.json({ success: true, data: plans })
})

router.post('/checkout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { price_id } = req.body

    const profile = await prisma.profile.findUnique({
      where: { id: req.profileId },
    })

    if (!profile) {
      res.status(404).json({ success: false, error: 'Perfil no encontrado' })
      return
    }

    if (profile.is_premium) {
      res.status(400).json({ success: false, error: 'Ya eres premium' })
      return
    }

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      await prisma.profile.update({
        where: { id: req.profileId },
        data: { is_premium: true, plan: 'premium', premium_since: new Date() },
      })

      await prisma.subscription.upsert({
        where: { profile_id: req.profileId! },
        create: {
          profile_id: req.profileId!,
          plan: 'premium',
          status: 'active',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        update: {
          status: 'active',
          plan: 'premium',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      res.json({
        success: true,
        data: { url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?premium=activated` },
      })
      return
    }

    const stripe = (await import('stripe')).default
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-03-31.basel' as any })

    const session = await stripeClient.checkout.sessions.create({
      customer_email: profile.display_name || undefined,
      mode: 'subscription',
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?premium=activated`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/premium`,
      metadata: { profile_id: req.profileId! },
    })

    res.json({ success: true, data: { url: session.url } })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({ success: false, error: 'Error al crear sesión de pago' })
  }
})

router.get('/subscription', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { profile_id: req.profileId },
    })
    res.json({ success: true, data: sub })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

router.post('/cancel', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.subscription.update({
      where: { profile_id: req.profileId },
      data: { status: 'canceled' },
    })

    await prisma.profile.update({
      where: { id: req.profileId },
      data: { is_premium: false, plan: 'free' },
    })

    res.json({ success: true, message: 'Suscripción cancelada' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

export default router
