import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export function ForgotPasswordPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setSent(true)
  }

  if (sent) {
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
          </div>

          <div className="bg-surface-2 border border-border rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-keef-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-keef-400" />
            </div>
            <h2 className="text-xl font-bold">{t('common.success')}</h2>
            <p className="text-text-secondary text-sm">
              {t('password.forgot.sent')}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-keef-400 hover:text-keef-300 transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.login.title')}
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
            Keef
          </Link>
          <h1 className="text-2xl font-bold mt-4">{t('password.forgot.title')}</h1>
          <p className="text-text-secondary text-sm mt-1">{t('password.forgot.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-2 border border-border rounded-2xl p-6 space-y-4">
          <Input
            id="email"
            label={t('password.forgot.email')}
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            <Mail className="w-4 h-4" />
            {t('password.forgot.button')}
          </Button>

          <p className="text-center text-sm text-text-secondary">
            <Link to="/login" className="inline-flex items-center gap-1 text-keef-400 hover:text-keef-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('auth.login.title')}
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
