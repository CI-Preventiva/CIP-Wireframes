import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'

// Auth pages
import { LoginPage } from './pages/auth/LoginPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { ActivateAccountPage } from './pages/auth/ActivateAccountPage'

// App pages
import { HomePage } from './pages/HomePage'
import { OnboardingChecklistPage } from './pages/onboarding/OnboardingChecklistPage'

// Admin pages
import { SubsidiariesPage } from './pages/admin/SubsidiariesPage'
import { AreasPage } from './pages/admin/AreasPage'
import { RolesPage } from './pages/admin/RolesPage'
import { UsersPage } from './pages/admin/UsersPage'
import { BulkImportPage } from './pages/admin/BulkImportPage'

// SuperAdmin pages
import { OrganizationsPage } from './pages/superadmin/OrganizationsPage'

export default function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/activate" element={<ActivateAccountPage />} />
      </Route>

      {/* App routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingChecklistPage />} />
        
        {/* Admin */}
        <Route path="/admin/subsidiaries" element={<SubsidiariesPage />} />
        <Route path="/admin/areas" element={<AreasPage />} />
        <Route path="/admin/roles" element={<RolesPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/users/bulk-import" element={<BulkImportPage />} />
        
        {/* SuperAdmin */}
        <Route path="/superadmin/organizations" element={<OrganizationsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
