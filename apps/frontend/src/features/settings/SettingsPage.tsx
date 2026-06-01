import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { profileApi } from '@/lib/api'
import { Palette, User, ExternalLink, Globe, CheckCircle, Upload, Camera, Loader2, BadgeCheck, Sparkles, Save } from 'lucide-react'

export function SettingsPage() {
  const { t } = useLanguage()
  const { profile, checkAuth } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [customDomain, setCustomDomain] = useState(profile?.custom_domain || '')
  const [isVerifying, setIsVerifying] = useState(false)
  const [domainStatus, setDomainStatus] = useState<'verified' | 'pending' | 'not_verified' | null>(profile?.custom_domain_verified ? 'verified' : null)

  const handleVerifyDomain = async () => {
    setIsVerifying(true)
    setDomainStatus('pending')
    const res = await profileApi.verifyCustomDomain(customDomain)
    if (res.success) setDomainStatus('verified')
    else setDomainStatus('not_verified')
    setIsVerifying(false)
  }

  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      setIsSaving(true)
      await profileApi.update({ display_name: displayName, bio })
      await checkAuth()
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [displayName, bio])

  if (!profile) return null

  const domainStatusConfig = {
    verified: { label: t('settings.customDomain.verified'), icon: CheckCircle, class: 'text-success bg-success/10 border border-success/20' },
    pending: { label: t('settings.customDomain.pending'), icon: Loader2, class: 'text-warning bg-warning/10 border border-warning/20' },
    not_verified: { label: t('settings.customDomain.notVerified'), icon: Globe, class: 'text-error bg-error/10 border border-error/20' },
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-keef-500/10 border border-keef-500/20 text-keef-400 text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            Keef settings
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-keef-300 to-white bg-clip-text text-transparent">{t('settings.title')}</h1>
          <p className="text-text-secondary text-sm mt-2 max-w-xl mx-auto lg:mx-0">{t('settings.subtitle')}</p>
        </div>

        <div className="space-y-6">
          <Card variant="elevated" className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-keef-500/[0.03] to-transparent pointer-events-none" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-keef-500/10 border border-keef-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-keef-400" />
                </div>
                <div>
                  <CardTitle>{t('settings.profileInfo')}</CardTitle>
                  <CardDescription>{t('settings.profileInfoDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="space-y-5">
              <div className="flex items-center gap-5 p-4 rounded-xl bg-surface-3/50 border border-border/50">
                <div className="relative group/avatar">
                  <motion.div
                    className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-keef-500/40 via-transparent to-pink-500/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500 blur-lg"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="relative w-20 h-20 rounded-2xl bg-surface-2 border-2 border-border overflow-hidden flex items-center justify-center group-hover/avatar:border-keef-500/50 transition-all duration-300">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-text-secondary/30" />
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-1">
                        <Camera className="w-5 h-5 text-white drop-shadow-lg" />
                        <span className="text-[10px] text-white font-medium">Upload</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = async () => {
                          const dataUrl = reader.result as string
                          await profileApi.update({ avatar_url: dataUrl })
                          await checkAuth()
                        }
                        reader.readAsDataURL(file)
                      }} />
                    </label>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">@{profile.username}</p>
                  <p className="text-xs text-text-secondary mt-0.5">PNG, JPG. Max 2MB</p>
                  <p className="text-xs text-text-tertiary mt-0.5">Click the avatar to upload a new photo</p>
                </div>
              </div>

              <Input
                id="display-name"
                label={t('settings.displayName')}
                placeholder={profile.username}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-text-secondary">{t('settings.bio')}</label>
                  <span className={`text-[11px] font-mono transition-colors ${bio.length > 280 ? 'text-error' : bio.length > 250 ? 'text-warning' : 'text-text-tertiary'}`}>
                    {bio.length}/300
                  </span>
                </div>
                <textarea
                  id="bio"
                  className="w-full px-4 py-3.5 bg-surface-2 border border-border rounded-xl text-white placeholder:text-text-secondary/40 transition-all duration-200 min-h-[120px] resize-none focus:outline-none focus:border-keef-500 focus:ring-1 focus:ring-keef-500/50 focus:bg-surface-3 text-sm leading-relaxed"
                  placeholder={t('settings.bioPlaceholder')}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={false}
                    animate={saved ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20"
                  >
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span className="text-[11px] font-medium text-success">Saved</span>
                  </motion.div>
                  {isSaving && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-keef-500/10 border border-keef-500/20">
                      <Loader2 className="w-3 h-3 text-keef-400 animate-spin" />
                      <span className="text-[11px] font-medium text-keef-400">Saving...</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-text-tertiary flex items-center gap-1">
                  <Save className="w-3 h-3" />Auto-saves on change
                </p>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.03] to-transparent pointer-events-none" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <CardTitle>{t('settings.personalization')}</CardTitle>
                  <CardDescription>{t('settings.personalizationDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Link to="/personalization" className="block group/link">
              <div className="relative p-[1px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-keef-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-keef-500 via-pink-500 to-keef-500 opacity-0 group-hover/link:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center justify-between p-4 bg-surface-2 rounded-xl group-hover/link:bg-surface-3 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-keef-500/20 to-pink-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-keef-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover/link:text-keef-300 transition-colors">{t('settings.openPersonalization')}</p>
                      <p className="text-xs text-text-tertiary">Customize theme, colors, layout & more</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-text-secondary group-hover/link:text-keef-400 group-hover/link:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          </Card>

          <Card variant="elevated" className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent pointer-events-none" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <CardTitle>{t('settings.customDomain')}</CardTitle>
                  <CardDescription>{t('settings.customDomainDesc')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="space-y-4">
              <Input
                id="custom-domain"
                label={t('settings.customDomain')}
                placeholder={t('settings.customDomainPlaceholder')}
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
              {domainStatus && (() => {
                const status = domainStatusConfig[domainStatus]
                const Icon = status.icon
                return (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${status.class}`}>
                    <Icon className={`w-3.5 h-3.5 ${domainStatus === 'pending' ? 'animate-spin' : ''}`} />
                    {status.label}
                  </div>
                )
              })()}
              <div className="flex items-center gap-3">
                <p className="text-xs text-text-secondary flex-1">
                  {t('settings.customDomain.howTo')} <code className="text-keef-400 bg-keef-500/10 px-1.5 py-0.5 rounded text-[11px] font-mono">keef.app</code>
                </p>
                <Button onClick={handleVerifyDomain} isLoading={isVerifying} size="sm">
                  <CheckCircle className="w-4 h-4" />
                  {t('settings.customDomain.verify')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
