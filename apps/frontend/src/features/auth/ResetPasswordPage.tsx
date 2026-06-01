import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KeyRound, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export function ResetPasswordPage() {
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reset, setReset] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setReset(true)
  }

  if (reset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_50%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold gradient-text mb-2">
              <Sparkles className="w-6 h-6" />
              Aburrido
            </Link>
          </div>

          <div className="bg-surface-2 border border-border rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-aburrido-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-aburrido-400" />
            </div>
            <h2 className="text-xl font-bold">{t('password.reset.success')}</h2>
            <p className="text-text-secondary text-sm">
              {t('password.reset.success')}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-aburrido-400 hover:text-aburrido-300 transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.login.button')}
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold gradient-text mb-2">
            <Sparkles className="w-6 h-6" />
            Aburrido
          </Link>
          <h1 className="text-2xl font-bold mt-4">{t('password.reset.title')}</h1>
          <p className="text-text-secondary text-sm mt-1">{t('password.reset.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-2 border border-border rounded-2xl p-6 space-y-4">
          <Input
            id="password"
            label={t('password.reset.newPassword')}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            id="confirmPassword"
            label={t('password.reset.confirmPassword')}
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            <KeyRound className="w-4 h-4" />
            {t('password.reset.button')}
          </Button>

          <p className="text-center text-sm text-text-secondary">
            <Link to="/login" className="inline-flex items-center gap-1 text-aburrido-400 hover:text-aburrido-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('auth.login.title')}
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
