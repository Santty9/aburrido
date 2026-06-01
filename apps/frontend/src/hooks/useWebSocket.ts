import { useEffect, useRef, useState, useCallback } from 'react'

type WSStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface WSEvent {
  event: string
  data: unknown
}

interface UseWebSocketOptions {
  token: string | null
  onEvent?: (event: string, data: unknown) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useWebSocket({
  token,
  onEvent,
  reconnectInterval = 3000,
  maxReconnectAttempts = 10,
}: UseWebSocketOptions) {
  const [status, setStatus] = useState<WSStatus>('disconnected')
  const [activeViewers, setActiveViewers] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCountRef = useRef(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  const connect = useCallback(() => {
    if (!token) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = import.meta.env.VITE_WS_URL || `${protocol}//${window.location.hostname}:3001`
    const url = `${host}/ws?token=${token}`

    setStatus('connecting')
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('connected')
      reconnectCountRef.current = 0
    }

    ws.onmessage = (event) => {
      try {
        const parsed: WSEvent = JSON.parse(event.data)
        if (parsed.event === 'connected') {
          return
        }
        if (parsed.event === 'active:count') {
          setActiveViewers(parsed.data as number)
        }
        onEventRef.current?.(parsed.event, parsed.data)
      } catch {
        /* ignore parse errors */
      }
    }

    ws.onclose = () => {
      setStatus('disconnected')
      wsRef.current = null
      if (reconnectCountRef.current < maxReconnectAttempts) {
        reconnectCountRef.current++
        reconnectTimerRef.current = setTimeout(
          connect,
          reconnectInterval * reconnectCountRef.current
        )
      }
    }

    ws.onerror = () => {
      setStatus('error')
      ws.close()
    }
  }, [token, reconnectInterval, maxReconnectAttempts])

  useEffect(() => {
    if (!token) {
      setStatus('disconnected')
      return
    }
    connect()
    return () => {
      clearTimeout(reconnectTimerRef.current)
      wsRef.current?.close()
    }
  }, [token, connect])

  const send = useCallback((event: string, data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ event, data }))
    }
  }, [])

  return { status, activeViewers, send }
}
