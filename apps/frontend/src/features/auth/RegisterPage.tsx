import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { UserPlus, Sparkles } from 'lucide-react'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const err = await register(email, password, username)
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
            Aburrido
          </Link>
          <h1 className="text-2xl font-bold mt-4">{t('auth.register.title')}</h1>
          <p className="text-text-secondary text-sm mt-1">Tu presencia online en un solo enlace</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-2 border border-border rounded-2xl p-6 space-y-4">
          <Input
            id="username"
            label={t('auth.register.username')}
            type="text"
            placeholder="tuusuario"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            required
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
          <Input
            id="password"
            label={t('auth.register.password')}
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
            <UserPlus className="w-4 h-4" />
            {t('auth.register.button')}
          </Button>

          <p className="text-center text-sm text-text-secondary">
            {t('auth.register.hasAccount')}{' '}
            <Link to="/login" className="text-aburrido-400 hover:text-aburrido-300 transition-colors">
              {t('auth.register.loginLink')}
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
