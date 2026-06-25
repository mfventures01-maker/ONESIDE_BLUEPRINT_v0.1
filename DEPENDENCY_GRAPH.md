# DEPENDENCY GRAPH

## Overview

### src\App.tsx
- depends on `./state/Contexts`
- depends on `react`
- depends on `./routes`
- depends on `./state/auth/AuthProvider`
- depends on `react-router-dom`

### src\main.tsx
- depends on `react-dom/client`
- depends on `react`
- depends on `./App`

### src\adapters\BookingAdapter.ts
- depends on `../lib/supabaseClient`
- depends on `../types`

### src\adapters\ShiftAdapter.ts
- depends on `../lib/supabaseClient`
- depends on `../types`

### src\adapters\TransactionAdapter.ts
- depends on `../lib/supabaseClient`
- depends on `../types`

### src\components\DashboardLayout.tsx
- depends on `../types`
- depends on `../state/Contexts`
- depends on `react`
- depends on `react-router-dom`

### src\guards\AuthBoundary.tsx
- depends on `react`
- depends on `lucide-react`

### src\guards\ProtectedRoute.tsx
- depends on `lucide-react`
- depends on `react`
- depends on `../state/auth/useAuth`
- depends on `../types`
- depends on `../state/Contexts`
- depends on `react-router-dom`

### src\guards\RoleGuard.tsx
- depends on `../types`
- depends on `../state/Contexts`
- depends on `react`

### src\lib\supabaseClient.ts
- depends on `@supabase/supabase-js`

### src\pages\AuditRoom.tsx
- depends on `../types`
- depends on `../state/Contexts`
- depends on `react`
- depends on `../components/DashboardLayout`

### src\pages\CustomerHomepage.tsx
- depends on `../services/revenueService`
- depends on `react`
- depends on `motion/react`
- depends on `../types`
- depends on `../state/Contexts`
- depends on `react-router-dom`

### src\pages\Dashboard.tsx
- depends on `../services/revenueService`
- depends on `../components/DashboardLayout`
- depends on `react`
- depends on `motion/react`
- depends on `../services/operationService`
- depends on `../state/Contexts`

### src\pages\Notifications.tsx
- depends on `../state/Contexts`
- depends on `react`
- depends on `../components/DashboardLayout`
- depends on `lucide-react`

### src\pages\Onboarding.tsx
- depends on `../state/Contexts`
- depends on `react`
- depends on `../components/DashboardLayout`
- depends on `lucide-react`

### src\pages\Profile.tsx
- depends on `lucide-react`
- depends on `../components/DashboardLayout`
- depends on `react`
- depends on `../state/auth/useAuth`
- depends on `../state/Contexts`

### src\pages\PublicGatewayPage.tsx
- depends on `lucide-react`
- depends on `react`
- depends on `motion/react`
- depends on `../state/auth/useAuth`
- depends on `react-router-dom`

### src\pages\Reports.tsx
- depends on `../state/Contexts`
- depends on `react`
- depends on `motion/react`

### src\pages\auth\CEOLogin.tsx
- depends on `lucide-react`
- depends on `react`
- depends on `motion/react`
- depends on `../../state/auth/useAuth`
- depends on `react-router-dom`

### src\pages\auth\StaffLogin.tsx
- depends on `lucide-react`
- depends on `react`
- depends on `motion/react`
- depends on `../../services/pinService`
- depends on `../../state/auth/useAuth`
- depends on `react-router-dom`

### src\routes\index.tsx
- depends on `react`
- depends on `../guards/ProtectedRoute`
- depends on `../guards/AuthBoundary`
- depends on `react-router-dom`

### src\services\auditService.ts
- depends on `../lib/supabaseClient`
- depends on `../types`

### src\services\operationService.ts
- depends on `../lib/supabaseClient`
- depends on `../adapters/TransactionAdapter`
- depends on `../adapters/ShiftAdapter`
- depends on `./auditService`

### src\services\pinService.ts
- depends on `../audit/auditLogger`

### src\services\reportService.ts
- depends on `../lib/supabaseClient`
- depends on `./revenueService`
- depends on `./operationService`
- depends on `./auditService`

### src\services\revenueService.ts
- depends on `../lib/supabaseClient`
- depends on `../adapters/BookingAdapter`
- depends on `./operationService`
- depends on `./auditService`

### src\state\Contexts.tsx
- depends on `../types`
- depends on `react`
- depends on `./auth/useAuth`

### src\state\auth\AuthContext.tsx
- depends on `react`
- depends on `../../types`

### src\state\auth\AuthProvider.tsx
- depends on `../../lib/supabaseClient`
- depends on `./AuthContext`
- depends on `react`
- depends on `../../types`

### src\state\auth\useAuth.ts
- depends on `./AuthContext`
- depends on `react`

