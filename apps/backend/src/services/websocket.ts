import { WebSocketServer, WebSocket } from 'ws'
import { Server } from 'http'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

interface Client {
  ws: WebSocket
  profileId: string
  userId: string
}

const clients = new Map<string, Client>()
const profileRooms = new Map<string, Set<string>>()

function broadcastToProfile(profileId: string, event: string, data: unknown) {
  const room = profileRooms.get(profileId)
  if (!room) return
  const message = JSON.stringify({ event, data })
  for (const clientId of room) {
    const client = clients.get(clientId)
    if (client?.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message)
    }
  }
}

function heartbeat() {
  for (const [id, client] of clients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.ping()
    } else {
      cleanupClient(id)
    }
  }
}

function cleanupClient(clientId: string) {
  const client = clients.get(clientId)
  if (client) {
    for (const [profileId, room] of profileRooms) {
      room.delete(clientId)
      if (room.size === 0) profileRooms.delete(profileId)
    }
    clients.delete(clientId)
  }
}

export function initializeWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' })

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    const token = url.searchParams.get('token')

    if (!token) {
      ws.close(4001, 'Token requerido')
      return
    }

    let decoded: { userId: string; profileId: string }
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; profileId: string }
    } catch {
      ws.close(4002, 'Token inválido')
      return
    }

    const clientId = `${decoded.userId}_${Date.now()}`
    const client: Client = { ws, profileId: decoded.profileId, userId: decoded.userId }
    clients.set(clientId, client)

    if (!profileRooms.has(decoded.profileId)) {
      profileRooms.set(decoded.profileId, new Set())
    }
    profileRooms.get(decoded.profileId)!.add(clientId)

    ws.send(JSON.stringify({ event: 'connected', data: { clientId } }))

    ws.on('pong', () => {})
    ws.on('close', () => cleanupClient(clientId))
    ws.on('error', () => cleanupClient(clientId))
  })

  const interval = setInterval(heartbeat, 30000)
  wss.on('close', () => clearInterval(interval))

  return { broadcastToProfile }
}

export { broadcastToProfile }
