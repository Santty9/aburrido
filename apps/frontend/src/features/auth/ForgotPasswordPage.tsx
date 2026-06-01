import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Sparkles, ArrowLeft, CheckCircle, Send } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { authApi } from '@/lib/api'

export function ForgotPasswordPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const res = await authApi.forgotPassword(email)
    if (res.success) {
      setIsLoading(false)
      setSent(true)
    } else {
      setError(res.error || t('common.error'))
      setIsLoading(false)
    }
  }

  if (sent) {
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
              <h2 className="text-xl font-bold">{t('common.success')}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t('password.forgot.sent')}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm bg-surface-3 rounded-xl px-4 py-3 border border-border">
              <Mail className="w-4 h-4 text-keef-400" />
              <span className="text-text-secondary">{email}</span>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-keef-400 hover:text-keef-300 transition-colors font-medium"
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
            {t('password.forgot.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary text-sm mt-1.5"
          >
            {t('password.forgot.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="bg-surface-2/80 backdrop-blur-xl border border-border rounded-2xl p-7 space-y-5 shadow-xl shadow-black/20">
            <Input
              id="email"
              label={t('password.forgot.email')}
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

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
              <Send className="w-4 h-4" />
              {t('password.forgot.button')}
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
