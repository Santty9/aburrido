import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Demasiados intentos de autenticación, intenta de nuevo en 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'Demasiadas peticiones de analytics' },
})

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { success: false, error: 'Demasiadas peticiones, intenta de nuevo más tarde' },
})

export const publicProfileLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, error: 'Demasiadas peticiones al perfil público' },
})
