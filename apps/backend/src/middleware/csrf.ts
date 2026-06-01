import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']
const COOKIE_NAME = 'csrf-token'
const HEADER_NAME = 'x-csrf-token'

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.includes(req.method)) {
    const token = crypto.randomBytes(32).toString('hex')
    res.cookie(COOKIE_NAME, token, {
      httpOnly: false,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    })
    next()
    return
  }

  const cookieToken = req.cookies?.[COOKIE_NAME]
  const headerToken = req.headers[HEADER_NAME] as string

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ success: false, error: 'CSRF token inválido' })
    return
  }

  next()
}
