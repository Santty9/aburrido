import { useEffect, useRef } from 'react'
import { Download } from 'lucide-react'

interface QRCodeProps {
  url: string
  title?: string
}

export function QRCode({ url, title = 'Compartir perfil' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const qrCodeRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    const loadQR = async () => {
      try {
        const QRCode = (await import('qrcode')).default
        if (!cancelled && canvasRef.current) {
          qrCodeRef.current = QRCode
          QRCode.toCanvas(canvasRef.current, url, {
            width: 200,
            margin: 2,
            color: { dark: '#ffffff', light: '#0a0a0f' },
          })
        }
      } catch {
        console.log('QRCode library not available')
      }
    }
    loadQR()
    return () => { cancelled = true }
  }, [url])

  const downloadQR = async () => {
    if (!canvasRef.current) return
    try {
      const QRCode = (await import('qrcode')).default
      const blob = await new Promise<Blob | null>((resolve) => {
        canvasRef.current!.toBlob((b) => resolve(b), 'image/png')
      })
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'keef-qr.png'
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      const link = document.createElement('a')
      link.download = 'keef-qr.png'
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={canvasRef} className="rounded-xl" width="200" height="200" />
      <button
        onClick={downloadQR}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
      >
        <Download className="w-4 h-4" />
        Descargar QR
      </button>
    </div>
  )
}
