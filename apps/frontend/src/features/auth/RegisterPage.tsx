import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { UserPlus, Sparkles, Eye, EyeOff, Check, X } from 'lucide-react'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setUsername(sanitized)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (username.length < 3) {
      setError('Al menos 3 caracteres')
      return
    }

    if (password.length < 6) {
      setError('Minimo 6 caracteres')
      return
    }

    setIsLoading(true)

    const err = await register(email, password, username)
    if (err) {
      setError(err)
      setIsLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  const passwordStrength = () => {
    const checks = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
    ]
    const score = checks.filter(Boolean).length
    if (score <= 1) return { label: 'Debil', color: 'bg-error', text: 'text-error' }
    if (score <= 2) return { label: 'Regular', color: 'bg-warning', text: 'text-warning' }
    if (score <= 3) return { label: 'Buena', color: 'bg-info', text: 'text-info' }
    return { label: 'Fuerte', color: 'bg-green-500', text: 'text-green-400' }
  }

  const strength = password.length > 0 ? passwordStrength() : null

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
            {t('auth.register.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary text-sm mt-1.5"
          >
            {'Crea tu cuenta y comienza a compartir'}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="bg-surface-2/80 backdrop-blur-xl border border-border rounded-2xl p-7 space-y-5 shadow-xl shadow-black/20">
            <Input
              id="username"
              label={t('auth.register.username')}
              type="text"
              placeholder="tuusuario"
              value={username}
              onChange={handleUsernameChange}
              required
              hint={'Solo letras, numeros y guiones'}
            />
            <Input
              id="email"
              label={t('auth.register.email')}
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  label={t('auth.register.password')}
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

              {strength && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => {
                      const strengthLevel = strength.color.includes('error') ? 1 :
                        strength.color.includes('warning') ? 2 :
                        strength.color.includes('info') ? 3 : 4
                      return (
                        <div key={level} className="h-1 flex-1 rounded-full bg-surface-4 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${level <= strengthLevel ? strength.color : 'bg-transparent'}`} />
                        </div>
                      )
                    })}
                  </div>
                  <p className={`text-[11px] ${strength.text}`}>{strength.label}</p>
                </div>
              )}

              <div className="space-y-1">
                {[
                  { check: password.length >= 6, text: 'Minimo 6 caracteres' },
                  { check: /[A-Z]/.test(password), text: 'Una mayuscula' },
                  { check: /[0-9]/.test(password), text: 'Un numero' },
                ].map(({ check, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    {check ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <X className="w-3 h-3 text-text-tertiary" />
                    )}
                    <span className={`text-[11px] ${check ? 'text-green-400' : 'text-text-tertiary'}`}>{text}</span>
                  </div>
                ))}
              </div>
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
              <UserPlus className="w-4 h-4" />
              {t('auth.register.button')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-surface-2 text-text-tertiary">{'o registrate con'}</span>
              </div>
            </div>

            <p className="text-center text-sm text-text-secondary">
              {t('auth.register.hasAccount')}{' '}
              <Link to="/login" className="text-keef-400 hover:text-keef-300 transition-colors font-medium">
                {t('auth.register.loginLink')}
              </Link>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}
