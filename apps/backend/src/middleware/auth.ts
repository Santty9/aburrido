import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-fallback-secret'

export interface AuthRequest extends Request {
  userId?: string
  profileId?: string
}

export function generateAccessToken(userId: string, profileId: string): string {
  return jwt.sign({ userId, profileId }, JWT_SECRET, { expiresIn: '1h' })
}

export function generateRefreshToken(userId: string, profileId: string): string {
  return jwt.sign({ userId, profileId, type: 'refresh' }, REFRESH_SECRET, { expiresIn: '7d' })
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'No autorizado' })
    return
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    res.status(401).json({ success: false, error: 'No autorizado' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; profileId: string }
    
    const profile = await prisma.profile.findUnique({ where: { id: decoded.profileId } })
    if (!profile) {
      res.status(401).json({ success: false, error: 'Perfil no encontrado' })
      return
    }

    req.userId = decoded.userId
    req.profileId = decoded.profileId
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Token inválido o expirado' })
  }
}
