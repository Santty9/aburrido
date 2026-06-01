import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { HomePage } from '@/features/home/HomePage'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { PublicProfilePage } from '@/features/profile/PublicProfilePage'
import { EditorPage } from '@/features/editor/EditorPage'
import { PremiumPage } from '@/features/premium/PremiumPage'
import { ChangelogPage } from '@/features/changelog/ChangelogPage'
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { PersonalizationPage } from '@/features/personalization/PersonalizationPage'
import { AdminPage } from '@/features/admin/AdminPage'
import { ThemeMarketplacePage } from '@/features/marketplace/ThemeMarketplacePage'
import { AppLayout } from '@/components/layout/AppLayout'
import { AnimatePresence } from 'framer-motion'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-keef-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/marketplace" element={<ThemeMarketplacePage />} />
        <Route path="/:username" element={<PublicProfilePage />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/personalization" element={<PersonalizationPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
