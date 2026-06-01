import { Router, Request, Response } from 'express'
import { prisma } from '@/lib/prisma'
import { authenticate, AuthRequest } from '@/middleware/auth'
import { z } from 'zod'
import { validate } from '@/middleware/validate'
import { broadcastToProfile } from '@/services/websocket'

const router = Router()

const createLinkSchema = z.object({
  title: z.string().min(1, 'Título requerido').max(100),
  url: z.string().url('URL inválida'),
  icon: z.string().max(50).optional(),
  icon_url: z.string().url().nullable().optional(),
})

const updateLinkSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url('URL inválida').optional(),
  icon: z.string().max(50).optional(),
  icon_url: z.string().url().nullable().optional(),
  is_active: z.boolean().optional(),
})

const clickCooldown = new Map<string, number>()

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const links = await prisma.link.findMany({
      where: { profile_id: req.profileId },
      orderBy: { position: 'asc' },
    })
    res.json({ success: true, data: links })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

router.post('/', authenticate, validate(createLinkSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { title, url, icon, icon_url } = req.body

    const lastLink = await prisma.link.findFirst({
      where: { profile_id: req.profileId },
      orderBy: { position: 'desc' },
    })

    const link = await prisma.link.create({
      data: {
        profile_id: req.profileId!,
        title,
        url,
        icon: icon || 'globe',
        icon_url,
        position: (lastLink?.position ?? -1) + 1,
      },
    })

    res.status(201).json({ success: true, data: link })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

router.patch('/:id', authenticate, validate(updateLinkSchema), async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const { title, url, icon, icon_url, is_active } = req.body

    const link = await prisma.link.findFirst({
      where: { id, profile_id: req.profileId },
    })

    if (!link) {
      res.status(404).json({ success: false, error: 'Link no encontrado' })
      return
    }

    const updated = await prisma.link.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(url !== undefined && { url }),
        ...(icon !== undefined && { icon }),
        ...(icon_url !== undefined && { icon_url }),
        ...(is_active !== undefined && { is_active }),
      },
    })

    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const link = await prisma.link.findFirst({
      where: { id, profile_id: req.profileId },
    })

    if (!link) {
      res.status(404).json({ success: false, error: 'Link no encontrado' })
      return
    }

    await prisma.link.delete({ where: { id } })
    res.json({ success: true, message: 'Link eliminado' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

router.put('/reorder', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body as { items: { id: string; position: number }[] }

    await prisma.$transaction(
      items.map((item) =>
        prisma.link.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    )

    res.json({ success: true, message: 'Orden actualizado' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

router.post('/:id/click', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown'
    const ua = req.headers['user-agent'] || 'unknown'
    const fingerprint = `${ip}_${ua}_${id}`
    const now = Date.now()
    const lastClick = clickCooldown.get(fingerprint)
    if (lastClick && now - lastClick < 2000) {
      res.json({ success: true })
      return
    }
    clickCooldown.set(fingerprint, now)
    if (clickCooldown.size > 10000) {
      const keysToDelete: string[] = []
      for (const [key, ts] of clickCooldown) {
        if (now - ts > 60000) keysToDelete.push(key)
      }
      keysToDelete.forEach((k) => clickCooldown.delete(k))
    }

    const link = await prisma.link.findUnique({ where: { id } })
    if (!link) {
      res.status(404).json({ success: false, error: 'Link no encontrado' })
      return
    }

    await prisma.link.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    })

    await prisma.click.create({
      data: {
        link_id: id,
        visitor_ip: ip,
        user_agent: ua,
        referer: req.headers['referer'] as string | undefined,
      },
    })

    const profile = await prisma.profile.findUnique({ where: { id: link.profile_id } })
    if (profile) {
      broadcastToProfile(profile.id, 'profile:click', {
        linkTitle: link.title,
        timestamp: new Date().toISOString(),
      })
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

export default router
