# REPOSITORY CARTOGRAPHY

## Overview
This document maps the entire ONESIDE_BLUEPRINT repository structure, categorizing all files.

### Directories
- `src/` - Application source code
- `src/adapters/` - Database adapters and data mappers
- `src/audit/` - Audit logging utilities
- `src/components/` - Reusable UI components
- `src/guards/` - Route and authorization guards
- `src/lib/` - External library configurations (Supabase)
- `src/pages/` - Application views and screens
- `src/routes/` - Route definitions
- `src/services/` - Business logic and data access services
- `src/state/` - State management and context providers

### Files

#### `src\App.tsx`
- **Category**: Root/Configuration
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: ./state/Contexts, react, ./routes, ./state/auth/AuthProvider, react-router-dom
- **Status**: Verified Active

#### `src\main.tsx`
- **Category**: Root/Configuration
- **Purpose**: To be detailed based on components exported ().
- **Dependencies**: react-dom/client, react, ./App
- **Status**: Verified Active

#### `src\types.ts`
- **Category**: Types
- **Purpose**: To be detailed based on components exported (RoleType, RoleConfig, RoleVisibilityMap, ThemeType, ThemeConfig, MenuCategory, MenuItem, InventoryItem, InventoryMovement, PricingRule, Promotion, Reservation, PaymentIntention, PaymentAudit, PaymentDispute, Shift, ShiftTransaction, ShiftSummary, CashMovement, POSTransaction, BankTransfer, OperationalInventoryMovement, AuditLog, EventCategoryType, AuditEvent).
- **Dependencies**: None
- **Status**: Verified Active

#### `src\adapters\BookingAdapter.ts`
- **Category**: Adapters
- **Purpose**: To be detailed based on components exported (BookingRecord, BookingAdapter).
- **Dependencies**: ../lib/supabaseClient, ../types
- **Status**: Verified Active

#### `src\adapters\ShiftAdapter.ts`
- **Category**: Adapters
- **Purpose**: To be detailed based on components exported (ConstitutionalShiftRecord, ShiftAdapter).
- **Dependencies**: ../lib/supabaseClient, ../types
- **Status**: Verified Active

#### `src\adapters\TransactionAdapter.ts`
- **Category**: Adapters
- **Purpose**: To be detailed based on components exported (ConstitutionalTransactionRecord, TransactionAdapter).
- **Dependencies**: ../lib/supabaseClient, ../types
- **Status**: Verified Active

#### `src\audit\auditLogger.ts`
- **Category**: Audit Utilities
- **Purpose**: To be detailed based on components exported (computeSha256Fingerprint).
- **Dependencies**: None
- **Status**: Verified Active

#### `src\components\DashboardLayout.tsx`
- **Category**: Components
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: ../types, ../state/Contexts, react, react-router-dom
- **Status**: Verified Active

#### `src\guards\AuthBoundary.tsx`
- **Category**: Guards
- **Purpose**: To be detailed based on components exported (AuthBoundary).
- **Dependencies**: react, lucide-react
- **Status**: Verified Active

#### `src\guards\ProtectedRoute.tsx`
- **Category**: Guards
- **Purpose**: To be detailed based on components exported (ProtectedRoute).
- **Dependencies**: lucide-react, react, ../state/auth/useAuth, ../types, ../state/Contexts, react-router-dom
- **Status**: Verified Active

#### `src\guards\RoleGuard.tsx`
- **Category**: Guards
- **Purpose**: To be detailed based on components exported (RoleGuard).
- **Dependencies**: ../types, ../state/Contexts, react
- **Status**: Verified Active

#### `src\lib\supabaseClient.ts`
- **Category**: Configuration
- **Purpose**: To be detailed based on components exported (supabase, toUUID, isSupabaseConfigured).
- **Dependencies**: @supabase/supabase-js
- **Status**: Verified Active

#### `src\pages\AuditRoom.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: ../types, ../state/Contexts, react, ../components/DashboardLayout
- **Status**: Verified Active

#### `src\pages\CustomerHomepage.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: ../services/revenueService, react, motion/react, ../types, ../state/Contexts, react-router-dom
- **Status**: Verified Active

#### `src\pages\Dashboard.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: ../services/revenueService, ../components/DashboardLayout, react, motion/react, ../services/operationService, ../state/Contexts
- **Status**: Verified Active

#### `src\pages\Notifications.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: ../state/Contexts, react, ../components/DashboardLayout, lucide-react
- **Status**: Verified Active

#### `src\pages\Onboarding.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: ../state/Contexts, react, ../components/DashboardLayout, lucide-react
- **Status**: Verified Active

#### `src\pages\Profile.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: lucide-react, ../components/DashboardLayout, react, ../state/auth/useAuth, ../state/Contexts
- **Status**: Verified Active

#### `src\pages\PublicGatewayPage.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: lucide-react, react, motion/react, ../state/auth/useAuth, react-router-dom
- **Status**: Verified Active

#### `src\pages\Reports.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: ../state/Contexts, react, motion/react
- **Status**: Verified Active

#### `src\pages\auth\CEOLogin.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: lucide-react, react, motion/react, ../../state/auth/useAuth, react-router-dom
- **Status**: Verified Active

#### `src\pages\auth\StaffLogin.tsx`
- **Category**: Pages
- **Purpose**: To be detailed based on components exported (function).
- **Dependencies**: lucide-react, react, motion/react, ../../services/pinService, ../../state/auth/useAuth, react-router-dom
- **Status**: Verified Active

#### `src\routes\index.tsx`
- **Category**: Routes
- **Purpose**: To be detailed based on components exported (AppRoutes).
- **Dependencies**: react, ../guards/ProtectedRoute, ../guards/AuthBoundary, react-router-dom
- **Status**: Verified Active

#### `src\services\auditService.ts`
- **Category**: Services
- **Purpose**: To be detailed based on components exported (AnomalyLog, ConstitutionalAuditService).
- **Dependencies**: ../lib/supabaseClient, ../types
- **Status**: Verified Active

#### `src\services\operationService.ts`
- **Category**: Services
- **Purpose**: To be detailed based on components exported (CARSS_Operations_Server).
- **Dependencies**: ../lib/supabaseClient, ../adapters/TransactionAdapter, ../adapters/ShiftAdapter, ./auditService
- **Status**: Verified Active

#### `src\services\pinService.ts`
- **Category**: Services
- **Purpose**: To be detailed based on components exported (StaffProfile, verifyPin).
- **Dependencies**: ../audit/auditLogger
- **Status**: Verified Active

#### `src\services\reportService.ts`
- **Category**: Services
- **Purpose**: To be detailed based on components exported (MetricLineage, ExecutiveRevenueReport, OperationsReport, AuditReportData, InventoryReportData, ReservationReportData, StaffPerformanceReportData, CARSS_Report_Service).
- **Dependencies**: ../lib/supabaseClient, ./revenueService, ./operationService, ./auditService
- **Status**: Verified Active

#### `src\services\revenueService.ts`
- **Category**: Services
- **Purpose**: To be detailed based on components exported (EXPERIMENTAL_THEMES, CARSS_Revenue_Server).
- **Dependencies**: ../lib/supabaseClient, ../adapters/BookingAdapter, ./operationService, ./auditService
- **Status**: Verified Active

#### `src\state\Contexts.tsx`
- **Category**: State/Contexts
- **Purpose**: To be detailed based on components exported (ShellStateContextType, ApplicationStore, ShellStateProvider, useRoleStore).
- **Dependencies**: ../types, react, ./auth/useAuth
- **Status**: Verified Active

#### `src\state\auth\AuthContext.tsx`
- **Category**: State/Contexts
- **Purpose**: To be detailed based on components exported (UserSession, AuthContextType, AuthContext).
- **Dependencies**: react, ../../types
- **Status**: Verified Active

#### `src\state\auth\AuthProvider.tsx`
- **Category**: State/Contexts
- **Purpose**: To be detailed based on components exported (determineRoleFromEmail, AuthProvider).
- **Dependencies**: ../../lib/supabaseClient, ./AuthContext, react, ../../types
- **Status**: Verified Active

#### `src\state\auth\useAuth.ts`
- **Category**: State/Contexts
- **Purpose**: To be detailed based on components exported (useAuth).
- **Dependencies**: ./AuthContext, react
- **Status**: Verified Active

