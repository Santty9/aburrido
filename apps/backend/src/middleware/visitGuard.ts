import { Request, Response, NextFunction } from 'express'

interface VisitRecord {
  count: number
  firstVisit: number
}

const visitMap = new Map<string, VisitRecord>()
const WINDOW_MS = 5 * 60 * 1000
const MAX_VISITS_PER_WINDOW = 30

const BOT_IPS = new Set<string>(['10.0.0.1', '172.16.0.1'])
const BOT_UA_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /googlebot/i,
  /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /facebot/i, /facebookexternalhit/i,
]

function getFingerprint(req: Request): string {
  const ip = (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown'
  const ua = req.headers['user-agent'] || 'unknown'
  return `${ip}_${ua}`
}

function isBot(req: Request): boolean {
  const ip = (req.headers['x-forwarded-for'] as string) || req.ip || ''
  if (BOT_IPS.has(ip)) return true

  const ua = req.headers['user-agent'] || ''
  return BOT_UA_PATTERNS.some((pattern) => pattern.test(ua))
}

function cleanup() {
  const now = Date.now()
  for (const [key, record] of visitMap) {
    if (now - record.firstVisit > WINDOW_MS) {
      visitMap.delete(key)
    }
  }
}

setInterval(cleanup, 60000)

export function visitGuard(req: Request, res: Response, next: NextFunction) {
  if (isBot(req)) {
    res.status(204).send()
    return
  }

  const fingerprint = getFingerprint(req)
  const now = Date.now()
  const record = visitMap.get(fingerprint)

  if (!record) {
    visitMap.set(fingerprint, { count: 1, firstVisit: now })
    next()
    return
  }

  if (now - record.firstVisit > WINDOW_MS) {
    visitMap.set(fingerprint, { count: 1, firstVisit: now })
    next()
    return
  }

  if (record.count >= MAX_VISITS_PER_WINDOW) {
    res.status(429).json({ success: false, error: 'Demasiadas visitas, intenta más tarde' })
    return
  }

  record.count++
  next()
}
