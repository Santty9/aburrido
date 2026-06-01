import { Router, Response } from 'express'
import { prisma } from '@/lib/prisma'
import { authenticate, AuthRequest } from '@/middleware/auth'

const router = Router()

router.get('/overview', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const profileId = req.profileId!

    const totalVisits = await prisma.visit.count({
      where: { profile_id: profileId },
    })

    const totalClicks = await prisma.link.aggregate({
      where: { profile_id: profileId },
      _sum: { clicks: true },
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const visitsToday = await prisma.visit.count({
      where: { profile_id: profileId, created_at: { gte: today } },
    })

    const clicksToday = await prisma.click.count({
      where: {
        link: { profile_id: profileId },
        created_at: { gte: today },
      },
    })

    const uniqueVisitors = await prisma.visit.groupBy({
      by: ['visitor_ip'],
      where: { profile_id: profileId },
    })

    const visitsByDay = await prisma.visit.groupBy({
      by: ['created_at'],
      where: { profile_id: profileId },
      _count: { id: true },
      orderBy: { created_at: 'asc' },
    })

    const clicksByLink = await prisma.link.findMany({
      where: { profile_id: profileId },
      select: { id: true, title: true, clicks: true },
      orderBy: { clicks: 'desc' },
    })

    const referrers = await prisma.visit.groupBy({
      by: ['referer'],
      where: { profile_id: profileId, referer: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    })

    // Group visits by date
    const visitsByDayMap = new Map<string, number>()
    for (const v of visitsByDay) {
      const date = v.created_at.toISOString().split('T')[0]!
      visitsByDayMap.set(date, (visitsByDayMap.get(date) || 0) + v._count.id)
    }

    res.json({
      success: true,
      data: {
        total_visits: totalVisits,
        total_clicks: totalClicks._sum.clicks || 0,
        unique_visitors: uniqueVisitors.length,
        visits_today: visitsToday,
        clicks_today: clicksToday,
        visits_by_day: Array.from(visitsByDayMap.entries()).map(([date, count]) => ({ date, count })),
        clicks_by_link: clicksByLink.map((l: { id: string; title: string; clicks: number }) => ({
          link_id: l.id,
          title: l.title,
          count: l.clicks,
        })),
        referrers: referrers.map((r: { referer: string | null; _count: { id: number } }) => ({
          source: r.referer || 'direct',
          count: r._count.id,
        })),
      },
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ success: false, error: 'Error interno' })
  }
})

export default router
