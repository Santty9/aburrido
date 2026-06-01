import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KeyRound, Sparkles, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { authApi } from '@/lib/api'

export function ResetPasswordPage() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reset, setReset] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError(t('common.error'))
      return
    }

    setIsLoading(true)

    const token = searchParams.get('token') || ''
    const res = await authApi.resetPassword({ token, password })
    if (res.success) {
      setIsLoading(false)
      setReset(true)
    } else {
      setError(res.error || t('common.error'))
      setIsLoading(false)
    }
  }

  if (reset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.06),transparent_50%)]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <Link to="/" className="inline-flex items-center gap-2.5 text-3xl font-bold">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-keef-500 to-pink-500 flex items-center justify-center shadow-lg shadow-keef-500/25">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-keef-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Keef</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-surface-2/80 backdrop-blur-xl border border-border rounded-2xl p-8 text-center space-y-5 shadow-xl shadow-black/20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-keef-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-8 h-8 text-keef-400" />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{t('password.reset.success')}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t('password.reset.success')}
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-keef-400 hover:text-keef-300 transition-colors font-medium mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.login.button')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.06),transparent_50%)]" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-keef-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center gap-2.5 text-3xl font-bold mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-keef-500 to-pink-500 flex items-center justify-center shadow-lg shadow-keef-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-keef-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Keef</span>
            </Link>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-2xl font-bold mt-4"
          >
            {t('password.reset.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary text-sm mt-1.5"
          >
            {t('password.reset.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="bg-surface-2/80 backdrop-blur-xl border border-border rounded-2xl p-7 space-y-5 shadow-xl shadow-black/20">
            <div className="relative">
              <Input
                id="password"
                label={t('password.reset.newPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                id="confirmPassword"
                label={t('password.reset.confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {confirmPassword && password && password !== confirmPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/20 rounded-xl px-4 py-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                {t('common.error')}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/20 rounded-xl px-4 py-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                {error}
              </motion.div>
            )}

            <Button type="submit" variant="premium" className="w-full h-11" isLoading={isLoading}>
              <KeyRound className="w-4 h-4" />
              {t('password.reset.button')}
            </Button>

            <p className="text-center text-sm text-text-secondary">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-keef-400 hover:text-keef-300 transition-colors font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                {t('auth.login.button')}
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}
