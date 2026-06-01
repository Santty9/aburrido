import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { LogIn, Sparkles } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
            Keef
          </Link>
          <h1 className="text-2xl font-bold mt-4">{t('auth.login.subtitle')}</h1>
          <p className="text-text-secondary text-sm mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-2 border border-border rounded-2xl p-6 space-y-4">
          <Input
            id="email"
            label={t('auth.login.email')}
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label={t('auth.login.password')}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            <LogIn className="w-4 h-4" />
            {t('auth.login.button')}
          </Button>

          <p className="text-center text-sm text-text-secondary">
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className="text-keef-400 hover:text-keef-300 transition-colors">
              {t('auth.login.registerLink')}
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
