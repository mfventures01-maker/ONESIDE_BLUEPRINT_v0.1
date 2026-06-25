# ROUTE CARTOGRAPHY

## Overview
Routes discovered in `src/routes/index.tsx` and related components.

### Discovered Routes

- `/` (PublicGatewayPage)
- `/login/ceo` (CEOLogin)
- `/login/staff` (StaffLogin)
- `/*` (Protected Routes under DashboardLayout):
  - `/dashboard` (Dashboard)
  - `/reports` (Reports)
  - `/audit` (AuditRoom)
  - `/home` (CustomerHomepage)
  - `/notifications` (Notifications)
  - `/profile` (Profile)
  - `/onboarding` (Onboarding)

### Guards
- `AuthBoundary`: Top-level error boundary for auth failures.
- `ProtectedRoute`: Ensures user session exists.
- `RoleGuard`: Component-level role authorization.
