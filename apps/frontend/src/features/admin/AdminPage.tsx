import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { adminApi, badgeApi, changelogApi, profileApi, marketplaceApi } from '@/lib/api'
import type { Badge as BadgeType, ChangelogEntry, ChangelogType, MarketplaceTheme } from '@aburrido/shared'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import {
  Shield, Plus, Pencil, Trash2, Users, Link2, Eye, Newspaper, Sparkles,
  Megaphone, RefreshCw, Check, X, Save, Download, Upload, Clock,
  MessageSquare, GitCommit, Tag, Volume2
} from 'lucide-react'

export function AdminPage() {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const [stats, setStats] = useState<any>(null)
  const [badges, setBadges] = useState<BadgeType[]>([])
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([])
  const [marketplaceThemes, setMarketplaceThemes] = useState<MarketplaceTheme[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Badge state
  const [badgeModal, setBadgeModal] = useState(false)
  const [editingBadge, setEditingBadge] = useState<BadgeType | null>(null)
  const [bName, setBName] = useState('')
  const [bIcon, setBIcon] = useState('🌟')
  const [bColor, setBColor] = useState('#8b5cf6')
  const [bBg, setBBg] = useState('#8b5cf620')
  const [assignModal, setAssignModal] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null)
  const [assignUsername, setAssignUsername] = useState('')

  // Changelog state
  const [clModal, setClModal] = useState(false)
  const [editingCl, setEditingCl] = useState<ChangelogEntry | null>(null)
  const [clTitle, setClTitle] = useState('')
  const [clContent, setClContent] = useState('')
  const [clVersion, setClVersion] = useState('')
  const [clType, setClType] = useState<ChangelogType>('feature')
  const [clIsPremium, setClIsPremium] = useState(false)
  const [publishingCl, setPublishingCl] = useState(false)

  // Announcement
  const [announcement, setAnnouncement] = useState('')
  const [showAnnouncement, setShowAnnouncement] = useState(false)

  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'changelog' | 'tools' | 'marketplace'>('overview')

  const loadAll = async () => {
    const [s, b, c, m] = await Promise.all([
      adminApi.getOverview(),
      badgeApi.getAll(),
      changelogApi.getAll(),
      marketplaceApi.getAll(),
    ])
    if (s.success) setStats(s.data)
    if (b.success) setBadges(b.data as BadgeType[])
    if (c.success) setChangelogs(c.data as ChangelogEntry[])
    if (m.success) setMarketplaceThemes(m.data as MarketplaceTheme[])
    setIsLoading(false)
  }

  useEffect(() => { loadAll() }, [])

  // Badge handlers
  const openBadgeCreate = () => {
    setEditingBadge(null); setBName(''); setBIcon('🌟'); setBColor('#8b5cf6'); setBBg('#8b5cf620')
    setBadgeModal(true)
  }

  const openBadgeEdit = (badge: BadgeType) => {
    setEditingBadge(badge); setBName(badge.name); setBIcon(badge.icon); setBColor(badge.color); setBBg(badge.background)
    setBadgeModal(true)
  }

  const handleBadgeSave = async () => {
    if (!bName.trim()) return
    if (editingBadge) {
      await badgeApi.update(editingBadge.id, { name: bName, icon: bIcon, color: bColor, background: bBg })
    } else {
      await badgeApi.create({ name: bName, icon: bIcon, color: bColor, background: bBg })
    }
    setBadgeModal(false)
    const res = await badgeApi.getAll()
    if (res.success) setBadges(res.data as BadgeType[])
  }

  const handleBadgeDelete = async (id: string) => {
    await badgeApi.delete(id)
    const res = await badgeApi.getAll()
    if (res.success) setBadges(res.data as BadgeType[])
  }

  const openAssign = (badge: BadgeType) => {
    setSelectedBadge(badge); setAssignUsername(''); setAssignModal(true)
  }

  const handleAssign = async () => {
    if (!selectedBadge || !assignUsername.trim()) return
    await badgeApi.assignToProfile(selectedBadge.id, assignUsername)
    setAssignModal(false)
    const res = await badgeApi.getAll()
    if (res.success) setBadges(res.data as BadgeType[])
  }

  const handleRemoveAssign = async (badgeId: string, username: string) => {
    await badgeApi.removeFromProfile(badgeId, username)
    const res = await badgeApi.getAll()
    if (res.success) setBadges(res.data as BadgeType[])
  }

  // Changelog handlers
  const openClCreate = () => {
    setEditingCl(null); setClTitle(''); setClContent(''); setClVersion(''); setClType('feature'); setClIsPremium(false)
    setClModal(true)
  }

  const openClEdit = (entry: ChangelogEntry) => {
    setEditingCl(entry); setClTitle(entry.title); setClContent(entry.content); setClVersion(entry.version); setClType(entry.type); setClIsPremium(entry.is_premium)
    setClModal(true)
  }

  const handleClSave = async () => {
    if (!clTitle.trim() || !clContent.trim()) return
    setPublishingCl(true)
    if (editingCl) {
      await changelogApi.delete(editingCl.id)
    }
    await changelogApi.create({
      title: clTitle, content: clContent, version: clVersion || '1.0.0',
      type: clType, is_premium: clIsPremium,
    })
    setClModal(false)
    setPublishingCl(false)
    const res = await changelogApi.getAll()
    if (res.success) setChangelogs(res.data as ChangelogEntry[])
  }

  const handleClDelete = async (id: string) => {
    await changelogApi.delete(id)
    const res = await changelogApi.getAll()
    if (res.success) setChangelogs(res.data as ChangelogEntry[])
  }

  const publishAnnouncement = () => {
    if (!announcement.trim()) return
    const entry = {
      id: `ann-${Date.now()}`,
      title: '📢 Anuncio de la plataforma',
      content: announcement,
      version: 'platform',
      type: 'improvement' as ChangelogType,
      is_premium: false,
      created_at: new Date().toISOString(),
    }
    const all = [entry, ...changelogs]
    localStorage.setItem('aburrido_changelogs', JSON.stringify(all))
    setChangelogs(all)
    setAnnouncement('')
    setShowAnnouncement(false)
  }

  const handleExportData = () => {
    const raw = localStorage.getItem('aburrido_data')
    const cl = localStorage.getItem('aburrido_changelogs')
    const bg = localStorage.getItem('aburrido_badges')
    const blob = new Blob([JSON.stringify({ data: raw ? JSON.parse(raw) : null, changelogs: cl ? JSON.parse(cl) : [], badges: bg ? JSON.parse(bg) : [] }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `aburrido-backup-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return
      const text = await file.text()
      try {
        const json = JSON.parse(text)
        if (json.data) localStorage.setItem('aburrido_data', JSON.stringify(json.data))
        if (json.changelogs) localStorage.setItem('aburrido_changelogs', JSON.stringify(json.changelogs))
        if (json.badges) localStorage.setItem('aburrido_badges', JSON.stringify(json.badges))
        loadAll()
      } catch { alert('Archivo inválido') }
    }
    input.click()
  }

  const emojis = ['🌟', '⭐', '🔥', '✅', '💎', '👑', '🚀', '🎯', '💪', '🎨', '⚡', '🏆', '💯', '🔮', '🛡️', '🎖️', '🏅', '📌', '💫', '🌈']
  const clTypeColors: Record<ChangelogType, string> = { feature: 'from-emerald-500 to-teal-500', fix: 'from-rose-500 to-red-500', improvement: 'from-blue-500 to-cyan-500' }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 gap-3"><div className="w-8 h-8 border-2 border-aburrido-500 border-t-transparent rounded-full animate-spin" /><span className="text-text-secondary text-sm">{t('common.loading')}</span></div>
  }

  const tabs = [
    { id: 'overview' as const, label: t('admin.tab.overview'), icon: Shield },
    { id: 'badges' as const, label: t('admin.tab.badges'), icon: Sparkles },
    { id: 'changelog' as const, label: t('admin.tab.changelog'), icon: Newspaper },
    { id: 'tools' as const, label: t('admin.tab.tools'), icon: RefreshCw },
    { id: 'marketplace' as const, label: t('admin.tab.marketplace'), icon: Megaphone },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
              <p className="text-text-secondary text-sm">Gestiona toda la plataforma</p>
            </div>
          </div>
          <div className="flex gap-1 bg-surface-2 border border-border rounded-xl p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === id ? 'bg-aburrido-500 text-white shadow-lg' : 'text-text-secondary hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* === OVERVIEW TAB === */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: t('admin.overview.users'), value: stats?.total_users || 0, icon: Users, color: 'from-blue-500 to-cyan-500', desc: 'Cuentas registradas' },
                { label: t('admin.overview.links'), value: stats?.total_links || 0, icon: Link2, color: 'from-aburrido-500 to-purple-500', desc: 'Links creados' },
                { label: t('admin.overview.visits'), value: stats?.total_visits || 0, icon: Eye, color: 'from-emerald-500 to-teal-500', desc: 'Visitas totales' },
                { label: t('admin.overview.badges'), value: stats?.total_badges || 0, icon: Sparkles, color: 'from-amber-500 to-yellow-500', desc: 'Insignias creadas' },
                { label: t('admin.overview.changelogs'), value: stats?.total_changelogs || 0, icon: Newspaper, color: 'from-pink-500 to-rose-500', desc: 'Entradas publicadas' },
              ].map(({ label, value, icon: Icon, color, desc }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:border-aburrido-500/30 transition-all group">
                    <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                    <p className="text-xs text-text-secondary mt-1">{desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Announcement */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-400" />
                  <CardTitle>Anuncio de Plataforma</CardTitle>
                </div>
                <CardDescription>Publica un anuncio que aparecerá en el changelog como entrada destacada</CardDescription>
              </CardHeader>
              <div className="space-y-3">
                {showAnnouncement ? (
                  <>
                    <textarea
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-white text-sm focus:outline-none focus:border-aburrido-500 min-h-[100px] resize-none"
                      placeholder="Escribe el mensaje del anuncio..."
                    />
                    <div className="flex gap-2">
                      <Button onClick={publishAnnouncement} disabled={!announcement.trim()}>
                        <Megaphone className="w-4 h-4" /> Publicar Anuncio
                      </Button>
                      <Button variant="ghost" onClick={() => setShowAnnouncement(false)}>Cancelar</Button>
                    </div>
                  </>
                ) : (
                  <Button variant="secondary" onClick={() => setShowAnnouncement(true)} className="w-full">
                    <Megaphone className="w-4 h-4" /> Redactar Anuncio
                  </Button>
                )}
              </div>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.tools.quickActions')}</CardTitle>
                <CardDescription>Tareas frecuentes de administración</CardDescription>
              </CardHeader>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button onClick={openBadgeCreate} className="p-4 rounded-xl bg-surface-3 border border-border hover:border-aburrido-500/50 transition-all text-center">
                  <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <span className="text-xs font-medium">{t('admin.badges.new')}</span>
                </button>
                <button onClick={openClCreate} className="p-4 rounded-xl bg-surface-3 border border-border hover:border-aburrido-500/50 transition-all text-center">
                  <Newspaper className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <span className="text-xs font-medium">{t('admin.changelog.new')}</span>
                </button>
                <button onClick={handleExportData} className="p-4 rounded-xl bg-surface-3 border border-border hover:border-aburrido-500/50 transition-all text-center">
                  <Download className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <span className="text-xs font-medium">{t('admin.tools.export')}</span>
                </button>
                <button onClick={handleImportData} className="p-4 rounded-xl bg-surface-3 border border-border hover:border-aburrido-500/50 transition-all text-center">
                  <Upload className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <span className="text-xs font-medium">{t('admin.tools.import')}</span>
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* === BADGES TAB === */}
        {activeTab === 'badges' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Gestión de Insignias
                  </CardTitle>
                  <CardDescription>Crea, edita y asigna insignias a los perfiles</CardDescription>
                </div>
                <Button onClick={openBadgeCreate}>
                  <Plus className="w-4 h-4" /> {t('admin.badges.new')}
                </Button>
              </div>
            </CardHeader>

            {badges.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">No hay insignias creadas aún</p>
              </div>
            ) : (
              <div className="space-y-2">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex items-center justify-between p-3 bg-surface-3 rounded-xl hover:bg-surface-3/80 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: badge.background }}>
                        {badge.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{badge.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono" style={{ background: badge.background, color: badge.color }}>{badge.color}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary">
                          {t('admin.badges.assignedTo')} {badge.assigned_to.length} perfil(es)
                          {badge.assigned_to.length > 0 && (
                            <span> ({badge.assigned_to.slice(0, 2).join(', ')}{badge.assigned_to.length > 2 ? '...' : ''})</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" onClick={() => openAssign(badge)} title={t('admin.badges.assign')}>
                        <Users className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openBadgeEdit(badge)} title={t('admin.badges.edit')}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleBadgeDelete(badge.id)} title={t('admin.badges.delete')}>
                        <Trash2 className="w-3.5 h-3.5 text-error" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* === CHANGELOG TAB === */}
        {activeTab === 'changelog' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-blue-400" />
                    Gestión de Changelog
                  </CardTitle>
                  <CardDescription>Crea, edita y publica entradas del changelog público</CardDescription>
                </div>
                <Button onClick={openClCreate}>
                  <Plus className="w-4 h-4" /> {t('admin.changelog.new')}
                </Button>
              </div>
            </CardHeader>
            <div className="space-y-2">
              {changelogs.map((entry) => (
                <div key={entry.id} className="flex items-start justify-between p-3 bg-surface-3 rounded-xl hover:bg-surface-3/80 transition-colors group">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 bg-gradient-to-br ${clTypeColors[entry.type]} rounded-xl flex items-center justify-center shrink-0 mt-0.5`}>
                      {entry.type === 'feature' ? '🚀' : entry.type === 'fix' ? '🐛' : '⚡'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium truncate">{entry.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-2 text-text-secondary font-mono">v{entry.version}</span>
                        {entry.is_premium && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400">{t('admin.changelog.premium')}</span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-1 line-clamp-2">{entry.content.replace(/[*_#]/g, '')}</p>
                      <p className="text-[10px] text-text-secondary/50 mt-1">{new Date(entry.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openClEdit(entry)} title={t('admin.badges.edit')}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleClDelete(entry.id)} title={t('admin.changelog.delete')}>
                      <Trash2 className="w-3.5 h-3.5 text-error" />
                    </Button>
                  </div>
                </div>
              ))}
              {changelogs.length === 0 && (
                <div className="text-center py-12">
                  <Newspaper className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <p className="text-text-secondary">No hay entradas de changelog</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* === TOOLS TAB === */}
        {activeTab === 'tools' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-400" />
                  {t('admin.tools.export')}
                </CardTitle>
                <CardDescription>Descarga toda la información de la plataforma</CardDescription>
              </CardHeader>
              <div className="text-center py-6">
                <p className="text-sm text-text-secondary mb-4">Exporta perfiles, changelogs e insignias en un archivo JSON</p>
                <Button variant="secondary" onClick={handleExportData} className="w-full">
                  <Download className="w-4 h-4" /> {t('admin.tools.exportAll')}
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-cyan-400" />
                  {t('admin.tools.import')}
                </CardTitle>
                <CardDescription>Restaura una copia de seguridad previa</CardDescription>
              </CardHeader>
              <div className="text-center py-6">
                <p className="text-sm text-text-secondary mb-4">Selecciona un archivo JSON de backup para restaurar</p>
                <Button variant="secondary" onClick={handleImportData} className="w-full">
                  <Upload className="w-4 h-4" /> {t('admin.tools.import')}
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-400" />
                  {t('admin.tools.reload')}
                </CardTitle>
                <CardDescription>Refresca toda la información desde localStorage</CardDescription>
              </CardHeader>
              <div className="text-center py-6">
                <Button variant="secondary" onClick={loadAll} className="w-full">
                  <RefreshCw className="w-4 h-4" /> {t('admin.tools.reload')}
                </Button>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                  Enviar Anuncio
                </CardTitle>
                <CardDescription>Publica un anuncio global en el changelog</CardDescription>
              </CardHeader>
              <div className="text-center py-6">
                <Button variant="secondary" onClick={() => setShowAnnouncement(true)} className="w-full">
                  <Megaphone className="w-4 h-4" /> Nuevo Anuncio
                </Button>
              </div>
            </Card>
          </div>
        )}
        {/* === MARKETPLACE TAB === */}
        {activeTab === 'marketplace' && (
          <div className="space-y-4">
            <p className="text-text-secondary text-sm">{t('marketplace.subtitle')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceThemes.map((theme) => (
                <Card key={theme.id}>
                  <div className="p-4 space-y-3">
                    <div className="w-full h-20 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: theme.theme.background, color: theme.theme.text_color }}>
                      {theme.name}
                    </div>
                    <h3 className="font-semibold">{theme.name}</h3>
                    <p className="text-xs text-text-secondary">{theme.description}</p>
                    <p className="text-xs text-text-secondary">{t('marketplace.by')} @{theme.author} · {theme.downloads} descargas</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Badge Create/Edit Modal */}
      <Modal isOpen={badgeModal} onClose={() => setBadgeModal(false)} title={editingBadge ? t('admin.badges.edit') : t('admin.badges.new')}>
        <div className="space-y-4">
          <Input id="badge-name" label={t('admin.badges.name')} placeholder="Early Adopter" value={bName} onChange={(e) => setBName(e.target.value)} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">{t('admin.badges.icon')}</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button key={emoji} onClick={() => setBIcon(emoji)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border text-lg transition-all ${bIcon === emoji ? 'border-aburrido-500 bg-aburrido-500/20 scale-110' : 'border-border hover:border-aburrido-500/50'}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">{t('admin.badges.color')}</label>
              <input type="color" value={bColor} onChange={(e) => setBColor(e.target.value)} className="w-full h-10 rounded-xl bg-surface-2 border border-border cursor-pointer" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">{t('admin.badges.background')}</label>
              <input type="color" value={bBg.replace(/[^a-fA-F0-9#]/g, '').slice(0, 7)} onChange={(e) => setBBg(e.target.value + '20')} className="w-full h-10 rounded-xl bg-surface-2 border border-border cursor-pointer" />
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface-3 rounded-xl">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: bBg }}>{bIcon}</div>
            <div>
              <p className="text-sm font-medium">{bName || 'Nombre de insignia'}</p>
              <p className="text-[10px]" style={{ color: bColor }}>Vista previa</p>
            </div>
          </div>
          <Button onClick={handleBadgeSave} className="w-full">{editingBadge ? 'Guardar Cambios' : t('admin.badges.create')}</Button>
        </div>
      </Modal>

      {/* Assign Badge Modal */}
      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title={`${t('admin.badges.assign')} "${selectedBadge?.name}"`}>
        <div className="space-y-4">
          <Input id="assign-username" label="Nombre de usuario" placeholder="ej: midudev" value={assignUsername} onChange={(e) => setAssignUsername(e.target.value)} />
          <Button onClick={handleAssign} className="w-full"><Users className="w-4 h-4" /> {t('admin.badges.assign')}</Button>
          {selectedBadge && selectedBadge.assigned_to.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border">
              <p className="text-xs text-text-secondary font-medium">{t('admin.badges.assignedTo')}:</p>
              {selectedBadge.assigned_to.map((u) => (
                <div key={u} className="flex items-center justify-between p-2 bg-surface-3 rounded-lg text-sm">
                  <span>{u}</span>
                  <button onClick={() => handleRemoveAssign(selectedBadge.id, u)} className="text-[10px] text-error hover:bg-error/10 px-2 py-1 rounded transition-colors">{t('admin.badges.remove')}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Changelog Create/Edit Modal */}
      <Modal isOpen={clModal} onClose={() => setClModal(false)} title={editingCl ? t('admin.badges.edit') : t('admin.changelog.new')}>
        <div className="space-y-4">
          <Input id="cl-title" label={t('admin.changelog.title')} placeholder="🚀 Nueva funcionalidad" value={clTitle} onChange={(e) => setClTitle(e.target.value)} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">{t('admin.changelog.content')}</label>
            <textarea
              className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-aburrido-500 min-h-[120px] resize-none font-mono text-sm"
              placeholder="## Features&#10;- Item 1&#10;- Item 2"
              value={clContent}
              onChange={(e) => setClContent(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input id="cl-version" label={t('admin.changelog.version')} placeholder="1.3.0" value={clVersion} onChange={(e) => setClVersion(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">{t('admin.changelog.type')}</label>
              <select value={clType} onChange={(e) => setClType(e.target.value as ChangelogType)}
                className="w-full px-3 py-3 bg-surface-2 border border-border rounded-xl text-white focus:outline-none focus:border-aburrido-500 text-sm">
                <option value="feature">🚀 {t('admin.changelog.type.feature')}</option>
                <option value="fix">🐛 {t('admin.changelog.type.fix')}</option>
                <option value="improvement">⚡ {t('admin.changelog.type.improvement')}</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="cl-premium" checked={clIsPremium} onChange={(e) => setClIsPremium(e.target.checked)} className="rounded bg-surface-2 border-border" />
              <label htmlFor="cl-premium" className="text-sm text-text-secondary">{t('admin.changelog.premium')}</label>
            </div>
          </div>
          <Button onClick={handleClSave} isLoading={publishingCl} className="w-full">
            <Newspaper className="w-4 h-4" />
            {editingCl ? 'Actualizar Entrada' : t('admin.changelog.create')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
