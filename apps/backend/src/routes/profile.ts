import { Router, Request, Response } from 'express'
import { prisma } from '@/lib/prisma'
import { authenticate, AuthRequest } from '@/middleware/auth'
import { visitGuard } from '@/middleware/visitGuard'
import { validate } from '@/middleware/validate'
import { z } from 'zod'
import { broadcastToProfile } from '@/services/websocket'

const router = Router()

const updateProfileSchema = z.object({
  display_name: z.string().max(50).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  theme: z.record(z.unknown()).nullable().optional(),
})

router.get('/check-username', async (req: Request, res: Response) => {
  try {
    const { username } = req.query
    if (!username || typeof username !== 'string') {
      res.json({ success: true, data: { available: false } })
      return
    }
    const sanitized = username.replace(/[^a-zA-Z0-9_]/g, '')
    const existing = await prisma.profile.findUnique({ where: { username: sanitized } })
    res.json({ success: true, data: { available: !existing } })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

router.get('/:username', visitGuard, async (req: Request, res: Response) => {
  try {
    const username = ((req.params.username as string) || '').replace(/[^a-zA-Z0-9_]/g, '')

    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        links: {
          where: { is_active: true },
          orderBy: { position: 'asc' },
        },
      },
    })

    if (!profile) {
      res.status(404).json({ success: false, error: 'Perfil no encontrado' })
      return
    }

    await prisma.profile.update({
      where: { id: profile.id },
      data: { total_visits: { increment: 1 } },
    })

    await prisma.visit.create({
      data: {
        profile_id: profile.id,
        visitor_ip: (req.headers['x-forwarded-for'] as string) || req.ip,
        user_agent: req.headers['user-agent'] as string | undefined,
        referer: req.headers['referer'] as string | undefined,
      },
    })

    broadcastToProfile(profile.id, 'profile:visit', {
      username: profile.username,
      timestamp: new Date().toISOString(),
      referer: (req.headers['referer'] as string) || 'direct',
    })

    res.json({
      success: true,
      data: {
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        theme: typeof profile.theme === 'string' ? JSON.parse(profile.theme as string) : profile.theme,
        links: profile.links,
        is_premium: profile.is_premium,
      },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

router.patch('/', authenticate, validate(updateProfileSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { display_name, bio, avatar_url, theme } = req.body

    const data: Record<string, unknown> = {}
    if (display_name !== undefined) data.display_name = display_name
    if (bio !== undefined) data.bio = bio
    if (avatar_url !== undefined) data.avatar_url = avatar_url
    if (theme !== undefined) data.theme = theme

    const profile = await prisma.profile.update({
      where: { id: req.profileId },
      data,
    })

    res.json({
      success: true,
      data: {
        ...profile,
        theme: typeof profile.theme === 'string' ? JSON.parse(profile.theme as string) : profile.theme,
      },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

export default router
