import { Router, Request, Response } from 'express'
import { prisma } from '@/lib/prisma'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const changelogs = await prisma.changelog.findMany({
      orderBy: { created_at: 'desc' },
    })
    res.json({ success: true, data: changelogs })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

export default router
