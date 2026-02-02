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

// Admin pages - Organizational Structure
import { HierarchyLevelsPage } from './pages/admin/HierarchyLevelsPage'
import { OrganizationalUnitsPage } from './pages/admin/OrganizationalUnitsPage'
import { PositionsPage } from './pages/admin/PositionsPage'

// Admin pages - User Management
import { UsersPage } from './pages/admin/UsersPage'
import { BulkImportPage } from './pages/admin/BulkImportPage'
import { ProfileFieldsPage } from './pages/admin/ProfileFieldsPage'
import { RolesPage } from './pages/admin/RolesPage'

// User pages
import { MyProfilePage } from './pages/user/MyProfilePage'

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
        
        {/* Admin - Organizational Structure */}
        <Route path="/admin/hierarchy-levels" element={<HierarchyLevelsPage />} />
        <Route path="/admin/organizational-units" element={<OrganizationalUnitsPage />} />
        <Route path="/admin/positions" element={<PositionsPage />} />
        
        {/* Admin - User Management */}
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/users/bulk-import" element={<BulkImportPage />} />
        <Route path="/admin/profile-fields" element={<ProfileFieldsPage />} />
        <Route path="/admin/roles" element={<RolesPage />} />
        
        {/* User pages */}
        <Route path="/my-profile" element={<MyProfilePage />} />
        
        {/* SuperAdmin */}
        <Route path="/superadmin/organizations" element={<OrganizationsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
