import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { profileApi } from '@/lib/api'
import { Palette, User, ExternalLink, Globe, CheckCircle, Upload, Camera, Loader2 } from 'lucide-react'

export function SettingsPage() {
  const { t } = useLanguage()
  const { profile, checkAuth } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [saved, setSaved] = useState(false)
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
      await profileApi.update({ display_name: displayName, bio })
      await checkAuth()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [displayName, bio])

  if (!profile) return null

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
          <p className="text-text-secondary text-sm mt-1">{t('settings.subtitle')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-aburrido-400" />
                <CardTitle>{t('settings.profileInfo')}</CardTitle>
              </div>
              <CardDescription>{t('settings.profileInfoDesc')}</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border overflow-hidden flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-text-secondary/30" />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
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
                <div>
                  <p className="text-sm font-medium">Foto de perfil</p>
                  <p className="text-xs text-text-secondary">PNG, JPG. Máximo 2MB</p>
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
                <label className="block text-sm font-medium text-text-secondary">{t('settings.bio')}</label>
                <textarea
                  id="bio"
                  className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-aburrido-500 focus:ring-1 focus:ring-aburrido-500/50 transition-all duration-200 min-h-[100px] resize-none"
                  placeholder={t('settings.bioPlaceholder')}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                />
                <p className="text-xs text-text-secondary text-right">{bio.length}/300</p>
              </div>
              {saved && (
                <p className="text-xs text-success flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {t('personalization.saved')}
                </p>
              )}
              <p className="text-xs text-text-secondary/50">{t('settings.save')} automáticamente</p>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-aburrido-400" />
                <CardTitle>{t('settings.personalization')}</CardTitle>
              </div>
              <CardDescription>{t('settings.personalizationDesc')}</CardDescription>
            </CardHeader>
            <Link to="/personalization">
              <Button variant="secondary" className="w-full">
                <Palette className="w-4 h-4" />
                {t('settings.openPersonalization')}
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>
            </Link>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-aburrido-400" />
                <CardTitle>{t('settings.customDomain')}</CardTitle>
              </div>
              <CardDescription>{t('settings.customDomainDesc')}</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <Input
                id="custom-domain"
                label={t('settings.customDomain')}
                placeholder={t('settings.customDomainPlaceholder')}
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
              {domainStatus && (
                <p className={`text-sm ${domainStatus === 'verified' ? 'text-success' : domainStatus === 'pending' ? 'text-warning' : 'text-error'}`}>
                  {domainStatus === 'verified' ? t('settings.customDomain.verified') :
                   domainStatus === 'pending' ? t('settings.customDomain.pending') :
                   t('settings.customDomain.notVerified')}
                </p>
              )}
              <p className="text-xs text-text-secondary">
                {t('settings.customDomain.howTo')} <code className="text-aburrido-400">aburrido.com</code>
              </p>
              <Button onClick={handleVerifyDomain} isLoading={isVerifying}>
                <CheckCircle className="w-4 h-4" />
                {t('settings.customDomain.verify')}
              </Button>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
