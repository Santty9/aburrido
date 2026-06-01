import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { initializeWebSocket } from '@/services/websocket'
import authRoutes from '@/routes/auth'
import profileRoutes from '@/routes/profile'
import linkRoutes from '@/routes/links'
import changelogRoutes from '@/routes/changelog'
import premiumRoutes from '@/routes/premium'
import analyticsRoutes from '@/routes/analytics'
import { apiLimiter } from '@/middleware/rateLimiter'
import { csrfProtection } from '@/middleware/csrf'

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
    },
  },
}))

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}))

app.use(cookieParser())
app.use(express.json({ limit: '10kb' }))
app.use('/api', apiLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/links', linkRoutes)
app.use('/api/changelog', changelogRoutes)
app.use('/api/premium', premiumRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Aburrido API funcionando', timestamp: new Date().toISOString() })
})

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' })
})

const httpServer = createServer(app)

initializeWebSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
  console.log(`Health: http://localhost:${PORT}/api/health`)
  console.log(`WebSocket: ws://localhost:${PORT}/ws`)
})

export default app
