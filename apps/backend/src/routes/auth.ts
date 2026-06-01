import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { authenticate, AuthRequest, generateAccessToken, generateRefreshToken } from '@/middleware/auth'
import { validate } from '@/middleware/validate'
import { csrfProtection } from '@/middleware/csrf'
import { authLimiter } from '@/middleware/rateLimiter'

const router = Router()
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-fallback-secret'

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  username: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(20, 'El usuario debe tener máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guiones bajos'),
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

router.post('/register', authLimiter, validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body

    const existing = await prisma.profile.findUnique({ where: { username } })
    if (existing) {
      res.status(409).json({ success: false, error: 'El nombre de usuario ya está en uso' })
      return
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      res.status(400).json({ success: false, error: authError?.message || 'Error al crear usuario' })
      return
    }

    const profile = await prisma.profile.create({
      data: {
        auth_user_id: authData.user.id,
        username,
        display_name: username,
      },
    })

    const accessToken = generateAccessToken(authData.user.id, profile.id)
    const refreshToken = generateRefreshToken(authData.user.id, profile.id)

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      success: true,
      data: {
        profile: {
          ...profile,
          theme: typeof profile.theme === 'string' ? JSON.parse(profile.theme) : profile.theme,
        },
        session: {
          access_token: accessToken,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        },
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, error: 'Error interno del servidor' })
  }
})

router.post('/login', authLimiter, validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      res.status(401).json({ success: false, error: 'Credenciales inválidas' })
      return
    }

    const user = authData.users.find((u) => u.email === email)
    if (!user) {
      res.status(401).json({ success: false, error: 'Credenciales inválidas' })
      return
    }

    const profile = await prisma.profile.findUnique({
      where: { auth_user_id: user.id },
    })

    if (!profile) {
      res.status(401).json({ success: false, error: 'Perfil no encontrado' })
      return
    }

    const accessToken = generateAccessToken(user.id, profile.id)
    const refreshToken = generateRefreshToken(user.id, profile.id)

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      data: {
        profile: {
          ...profile,
          theme: typeof profile.theme === 'string' ? JSON.parse(profile.theme as string) : profile.theme,
        },
        session: {
          access_token: accessToken,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        },
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, error: 'Error interno del servidor' })
  }
})

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token
    if (!refreshToken) {
      res.status(401).json({ success: false, error: 'Refresh token requerido' })
      return
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      userId: string
      profileId: string
      type: string
    }

    if (decoded.type !== 'refresh') {
      res.status(401).json({ success: false, error: 'Token inválido' })
      return
    }

    const profile = await prisma.profile.findUnique({ where: { id: decoded.profileId } })
    if (!profile) {
      res.status(401).json({ success: false, error: 'Perfil no encontrado' })
      return
    }

    const newAccessToken = generateAccessToken(decoded.userId, decoded.profileId)
    const newRefreshToken = generateRefreshToken(decoded.userId, decoded.profileId)

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      data: {
        access_token: newAccessToken,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      },
    })
  } catch {
    res.status(401).json({ success: false, error: 'Refresh token inválido o expirado' })
  }
})

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('refresh_token')
  res.json({ success: true, message: 'Sesión cerrada' })
})

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.profileId },
      include: {
        _count: { select: { links: true, visits: true } },
      },
    })

    if (!profile) {
      res.status(404).json({ success: false, error: 'Perfil no encontrado' })
      return
    }

    res.json({
      success: true,
      data: {
        ...profile,
        theme: typeof profile.theme === 'string' ? JSON.parse(profile.theme as string) : profile.theme,
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    res.status(500).json({ success: false, error: 'Error interno del servidor' })
  }
})

export default router
