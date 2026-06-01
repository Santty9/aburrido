import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { LogIn, Sparkles, Eye, EyeOff } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const err = await login(email, password)
    if (err) {
      setError(err)
      setIsLoading(false)
    } else {
      navigate('/dashboard')
    }
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
            {t('auth.login.subtitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary text-sm mt-1.5"
          >
            {'Ingresa a tu cuenta para gestionar tu perfil'}
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
              label={t('auth.login.email')}
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                id="password"
                label={t('auth.login.password')}
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

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-xs text-keef-400 hover:text-keef-300 transition-colors">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

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
              <LogIn className="w-4 h-4" />
              {t('auth.login.button')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-surface-2 text-text-tertiary">{'o continua con'}</span>
              </div>
            </div>

            <p className="text-center text-sm text-text-secondary">
              {t('auth.login.noAccount')}{' '}
              <Link to="/register" className="text-keef-400 hover:text-keef-300 transition-colors font-medium">
                {t('auth.login.registerLink')}
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}
