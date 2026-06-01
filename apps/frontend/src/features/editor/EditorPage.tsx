import { useEffect, useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { linkApi, backupApi } from '@/lib/api'
import { iconMap } from '@aburrido/shared'
import type { Link, CreateLinkInput, LinkPreview, PixelTracking, LinkIcon } from '@aburrido/shared'
import { Plus, GripVertical, Pencil, Trash2, ExternalLink, Globe, Upload, Download, Tag, X, QrCode, Image, Clock, Target, DollarSign, ChevronDown, ChevronUp, Search, Eye } from 'lucide-react'

const linkIcons = ['globe', 'github', 'twitter', 'instagram', 'youtube', 'discord', 'tiktok', 'twitch', 'linkedin', 'spotify']

async function unfurlUrl(url: string): Promise<LinkPreview | null> {
  try {
    const res = await fetch(url, { mode: 'cors', signal: AbortSignal.timeout(3000) })
    const html = await res.text()
    const getMeta = (name: string): string | null => {
      const patterns = [
        new RegExp(`<meta\\s+property="og:${name}"\\s+content="([^"]*)"`, 'i'),
        new RegExp(`<meta\\s+name="twitter:${name}"\\s+content="([^"]*)"`, 'i'),
        new RegExp(`<meta\\s+content="([^"]*)"\\s+property="og:${name}"`, 'i'),
      ]
      for (const p of patterns) {
        const m = html.match(p)
        if (m?.[1]) return m[1]
      }
      return null
    }
    const getFavicon = (): string | null => {
      const m = html.match(/<link[^>]*rel="(?:shortcut )?icon"[^>]*href="([^"]*)"/i)
      if (m?.[1]) {
        if (m[1].startsWith('http')) return m[1]
        try { return new URL(m[1], url).href } catch { return null }
      }
      return null
    }
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i)
    return {
      title: getMeta('title') || titleMatch?.[1] || null,
      description: getMeta('description') || null,
      image: getMeta('image') || null,
      favicon: getFavicon(),
    }
  } catch {
    return null
  }
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${checked ? 'bg-aburrido-500' : 'bg-border'} shrink-0`}
      onClick={() => onChange(!checked)}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </div>
  )
}

export function EditorPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [icon, setIcon] = useState('globe')
  const [category, setCategory] = useState('')
  const [scheduledStart, setScheduledStart] = useState('')
  const [scheduledEnd, setScheduledEnd] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [featured, setFeatured] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [preview, setPreview] = useState<LinkPreview | null>(null)
  const [isUnfurling, setIsUnfurling] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [pixelFb, setPixelFb] = useState('')
  const [pixelGa, setPixelGa] = useState('')
  const [pixelTt, setPixelTt] = useState('')
  const [pixelTw, setPixelTw] = useState('')
  const [affiliateEnabled, setAffiliateEnabled] = useState(false)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { profile } = useAuth()
  const { t } = useLanguage()

  const loadLinks = useCallback(async () => {
    const res = await linkApi.getAll()
    if (res.success && res.data) {
      const data = res.data as Link[]
      setLinks(data)
      const cats = [...new Set(data.map((l) => l.category).filter(Boolean))] as string[]
      setCategories(cats)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => { loadLinks() }, [loadLinks])

  const openCreate = () => {
    setEditingLink(null)
    setTitle('')
    setUrl('')
    setIcon('globe')
    setCategory('')
    setScheduledStart('')
    setScheduledEnd('')
    setThumbnailUrl('')
    setPreview(null)
    setShowAdvanced(false)
    setPixelFb('')
    setPixelGa('')
    setPixelTt('')
    setPixelTw('')
    setAffiliateEnabled(false)
    setQrUrl(null)
    setIsModalOpen(true)
  }

  const openEdit = (link: Link) => {
    setEditingLink(link)
    setTitle(link.title)
    setUrl(link.url)
    setIcon(link.icon)
    setCategory(link.category || '')
    setFeatured(link.featured || false)
    setScheduledStart(link.scheduled_start?.split('T')[0] || '')
    setScheduledEnd(link.scheduled_end?.split('T')[0] || '')
    setThumbnailUrl(link.thumbnail_url || '')
    setPreview(link.preview || null)
    setShowAdvanced(!!(link.pixels || link.affiliate))
    setPixelFb(link.pixels?.facebook || '')
    setPixelGa(link.pixels?.google || '')
    setPixelTt(link.pixels?.tiktok || '')
    setPixelTw(link.pixels?.twitter || '')
    setAffiliateEnabled(link.affiliate?.enabled || false)
    setQrUrl(null)
    setIsModalOpen(true)
  }

  const handleUrlBlur = async () => {
    if (!url.trim() || url.startsWith('http')) {
      setIsUnfurling(true)
      const result = await unfurlUrl(url)
      if (result) {
        setPreview(result)
        if (!title && result.title) setTitle(result.title)
        if (!thumbnailUrl && result.image) setThumbnailUrl(result.image)
      }
      setIsUnfurling(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) return

    const pixels: PixelTracking | null = pixelFb || pixelGa || pixelTt || pixelTw
      ? { facebook: pixelFb || null, google: pixelGa || null, tiktok: pixelTt || null, twitter: pixelTw || null }
      : null

    const linkData: CreateLinkInput = {
      title: title.trim(),
      url: url.trim(),
      icon: icon as LinkIcon,
      category: category || undefined,
      featured: featured || undefined,
      scheduled_start: scheduledStart ? new Date(scheduledStart).toISOString() : null,
      scheduled_end: scheduledEnd ? new Date(scheduledEnd).toISOString() : null,
      thumbnail_url: thumbnailUrl || null,
      preview,
      pixels,
      affiliate: affiliateEnabled ? { enabled: true, commission_rate: null, network: null, cloaked_url: null } : null,
    }

    if (editingLink) {
      const res = await linkApi.update(editingLink.id, linkData)
      if (res.success) loadLinks()
    } else {
      const res = await linkApi.create(linkData)
      if (res.success) loadLinks()
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    const res = await linkApi.delete(id)
    if (res.success) setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const handleToggle = async (link: Link) => {
    const res = await linkApi.update(link.id, { is_active: !link.is_active })
    if (res.success) loadLinks()
  }

  const handleDragStart = (index: number) => setDragIndex(index)
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    const newLinks = [...links]
    const [item] = newLinks.splice(dragIndex, 1)
    newLinks.splice(index, 0, item!)
    setDragIndex(index)
    setLinks(newLinks)
  }
  const handleDragEnd = async () => {
    setDragIndex(null)
    await linkApi.reorder(links.map((link, i) => ({ id: link.id, position: i })))
  }

  const handleExport = async () => {
    const res = await backupApi.exportLinks()
    if (res.success && res.data) {
      const blob = new Blob([res.data.data], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = res.data.filename
      a.click()
      URL.revokeObjectURL(a.href)
    }
  }

  const handleImport = () => fileInputRef.current?.click()
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const res = await backupApi.importLinks(text)
    if (res.success) loadLinks()
    e.target.value = ''
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-aburrido-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const groupedLinks: Record<string, Link[]> = { __default__: [] }
  for (const link of links) {
    const cat = link.category || '__default__'
    if (!groupedLinks[cat]) groupedLinks[cat] = []
    groupedLinks[cat]!.push(link)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('editor.title')}</h1>
            <p className="text-text-secondary text-sm mt-1">{t('editor.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4" /> {t('editor.export')}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleImport}>
              <Upload className="w-4 h-4" /> {t('editor.import')}
            </Button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4" /> {t('editor.new')}
            </Button>
          </div>
        </div>

        {links.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('editor.empty.title')}</h3>
              <p className="text-text-secondary text-sm mb-4">{t('editor.empty.description')}</p>
              <Button onClick={openCreate}>{t('editor.empty.action')}</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedLinks).map(([cat, catLinks]) => (
              <div key={cat}>
                {cat !== '__default__' && (
                  <div className="flex items-center gap-2 mb-2 mt-4">
                    <Tag className="w-4 h-4 text-text-secondary" />
                    <span className="text-sm font-medium text-text-secondary">{cat}</span>
                    <Badge variant="default">{catLinks.length}</Badge>
                  </div>
                )}
                <div className="space-y-2">
                  {catLinks.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      draggable
                      onDragStart={() => handleDragStart(links.indexOf(link))}
                      onDragOver={(e) => handleDragOver(e, links.indexOf(link))}
                      onDragEnd={handleDragEnd}
                      className={`bg-surface-2 border border-border rounded-xl p-3 flex items-center gap-2 transition-all duration-200 hover:border-aburrido-500/30 ${dragIndex === links.indexOf(link) ? 'opacity-50 border-aburrido-500' : ''}`}
                    >
                      <div className="cursor-grab active:cursor-grabbing text-text-secondary hover:text-white transition-colors">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="text-base shrink-0">{iconMap[link.icon] || '🌐'}</span>
                      {link.thumbnail_url && (
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-surface-3">
                          <img src={link.thumbnail_url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{link.title}</span>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${link.is_active ? 'bg-success' : 'bg-text-secondary'}`} />
                          {link.category && (
                            <span className="text-[10px] text-text-secondary bg-surface-3 px-1.5 py-0.5 rounded shrink-0">{link.category}</span>
                          )}
                          {link.preview && (
                            <span className="shrink-0 text-aburrido-400" title="Preview disponible"><Eye className="w-3 h-3 inline" /></span>
                          )}
                          {link.pixels && (
                            <span className="shrink-0 text-amber-400" title="Tracking configurado"><Target className="w-3 h-3 inline" /></span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary truncate mt-0.5">{link.url}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-text-secondary mr-1">{link.clicks} clicks</span>
                        <button onClick={() => handleToggle(link)} className="p-1.5 hover:bg-surface-3 rounded-lg transition-colors text-[10px] text-text-secondary">
                          {link.is_active ? 'ON' : 'OFF'}
                        </button>
                        <button onClick={() => openEdit(link)} className="p-2 hover:bg-surface-3 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4 text-text-secondary" />
                        </button>
                        <button onClick={() => handleDelete(link.id)} className="p-2 hover:bg-error/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLink ? t('editor.edit.title') : t('editor.create.title')}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input id="link-title" label={t('editor.form.title')} placeholder={t('editor.form.titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className="relative">
            <Input id="link-url" label={t('editor.form.url')} placeholder={t('editor.form.urlPlaceholder')} value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleUrlBlur}
            />
            {isUnfurling && (
              <div className="absolute right-3 top-8">
                <div className="w-4 h-4 border-2 border-aburrido-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {preview && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-3 border border-border">
              {preview.image && (
                <img src={preview.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              )}
              <div className="min-w-0 flex-1">
                {preview.title && <p className="text-sm font-medium truncate">{preview.title}</p>}
                {preview.description && <p className="text-xs text-text-secondary truncate">{preview.description}</p>}
                <div className="flex items-center gap-2 mt-1">
                  {preview.favicon && <img src={preview.favicon} alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                  <span className="text-[10px] text-text-secondary truncate">{url}</span>
                </div>
              </div>
              {preview.image && (
                <button onClick={() => setThumbnailUrl(preview.image!)} className="text-[10px] text-aburrido-400 hover:underline shrink-0" title="Usar como thumbnail">
                  <Image className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">{t('editor.form.icon')}</label>
            <div className="flex flex-wrap gap-1.5">
              {linkIcons.map((ic) => (
                <button key={ic} onClick={() => setIcon(ic)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all text-base ${icon === ic ? 'border-aburrido-500 bg-aburrido-500/10 scale-110' : 'border-border hover:border-aburrido-500/50'}`}
                  title={ic}>
                  {iconMap[ic] || '🌐'}
                </button>
              ))}
            </div>
          </div>

          <Input id="link-category" label="Categoría" placeholder="ej: redes, trabajo, proyectos" value={category} onChange={(e) => setCategory(e.target.value)} />

          <label className="flex items-center gap-3 p-3 bg-surface-3 rounded-xl cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-aburrido-500" />
            <div>
              <span className="text-sm font-medium">Link destacado</span>
              <p className="text-xs text-text-secondary">Aparece más grande y con estilo especial</p>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Input id="link-scheduled-start" label="Inicio programado" type="date" value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} />
            <Input id="link-scheduled-end" label="Fin programado" type="date" value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} />
          </div>

          <Input id="link-thumbnail" label="URL de miniatura" placeholder="https://..." value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />

          <button onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Opciones avanzadas
          </button>

          {showAdvanced && (
            <div className="space-y-4 pl-2 border-l-2 border-aburrido-500/30">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium">Píxeles de Tracking</span>
                </div>
                <div className="space-y-2">
                  <Input label="Facebook Pixel ID" placeholder="1234567890" value={pixelFb} onChange={(e) => setPixelFb(e.target.value)} />
                  <Input label="Google Analytics ID" placeholder="G-XXXXXXXXXX" value={pixelGa} onChange={(e) => setPixelGa(e.target.value)} />
                  <Input label="TikTok Pixel ID" placeholder="TIKTOK-PIXEL" value={pixelTt} onChange={(e) => setPixelTt(e.target.value)} />
                  <Input label="Twitter Pixel ID" placeholder="TWTR-PIXEL" value={pixelTw} onChange={(e) => setPixelTw(e.target.value)} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">Link de Afiliado</span>
                  </div>
                  <Toggle checked={affiliateEnabled} onChange={setAffiliateEnabled} />
                </div>
                {affiliateEnabled && (
                  <p className="text-xs text-text-secondary">El link será cloaked: los visitantes verán una URL de Aburrido en lugar de la URL real.</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="w-4 h-4 text-aburrido-400" />
                  <span className="text-sm font-medium">Código QR</span>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setQrUrl(url || 'https://aburrido.app')}>
                  <QrCode className="w-4 h-4" />
                  Generar QR
                </Button>
                {qrUrl && (
                  <div className="mt-2 p-3 bg-surface-3 rounded-xl flex items-center gap-3">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrUrl)}`} alt="QR" className="w-16 h-16 rounded-lg" />
                    <div className="text-xs text-text-secondary">
                      <p className="font-medium text-white mb-1">QR generado</p>
                      <p>Escaneá para abrir el link directamente.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button onClick={handleSave} className="w-full">
            {editingLink ? t('editor.form.save') : t('editor.form.create')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
