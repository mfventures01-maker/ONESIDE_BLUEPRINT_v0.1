# ROUTE EXECUTION MATRIX
## 1. Public Storefront Channels

### Route: `/`
*   **React Component**: `CustomerHomepage` (`src/pages/CustomerHomepage.tsx`)
*   **API Entry Point**: `CARSS_Revenue_Server` (`src/services/revenueService.ts`)
*   **Command or Query**:
    *   **Queries**: `getSavedTheme()`, `getCategories()`, `getMenuItems()`, `getInventory()`, `getPromotions()`, `getReservations()`, `getPaymentIntentions()`
    *   **Commands**: `saveTheme()`, `placeReservation()`, `generatePaymentIntention()`, `reconcilePaymentIntention()`
*   **Repository/Adapter**: `BookingAdapter` (`src/adapters/BookingAdapter.ts`)
*   **Supabase Interaction**:
    *   *Direct reads*: `theme_settings`, `menu_categories`, `menu_items`, `inventory`, `promotions`, `bookings`, `payment_intents`
    *   *Direct writes*: `theme_settings` (upsert), `bookings` (insert), `payment_intents` (insert), `payments` (insert)
    *   *Offline fallback*: Reads and caches states inside `localStorage` using local keys (`carss_theme`, `carss_categories`, `carss_menu`, `carss_inventory`, `carss_bookings`, etc.).

---

### Route: `/admin/gateway`
*   **React Component**: `PublicGatewayPage` (`src/pages/PublicGatewayPage.tsx`)
*   **API Entry Point**: Local client navigation & `useAuth()` hook session context.
*   **Command or Query**: None (pure landing shell).
*   **Repository/Adapter**: None.
*   **Supabase Interaction**: None. Checks cached auth state in `AuthContext` to render navigation.

---

## 2. Authentication Channels

### Route: `/auth/ceo`
*   **React Component**: `CEOLogin` (`src/pages/auth/CEOLogin.tsx`)
*   **API Entry Point**: `useAuth()` state hook.
*   **Command or Query**: Command: `simulateLogin()` (Simulated lead session activation).
*   **Repository/Adapter**: None.
*   **Supabase Interaction**: Bypass logic. Writes mock session profile to `localStorage` under `carss_user_session`.

---

### Route: `/auth/staff`
*   **React Component**: `StaffLogin` (`src/pages/auth/StaffLogin.tsx`)
*   **API Entry Point**: `verifyPin` (`src/services/pinService.ts`) & `useAuth()` state hook.
*   **Command or Query**: Command: Local pin code verification and simulated login trigger.
*   **Repository/Adapter**: None (Evaluates static local Operator list).
*   **Supabase Interaction**: None. Completely client-side security verification.

---

### Route: `/bootstrap`
*   **React Component**: `Bootstrap` (`src/pages/auth/Bootstrap.tsx`)
*   **API Entry Point**: `carssApi` (`src/services/carssApi.ts`)
*   **Command or Query**: Command: `carssApi.bootstrap()` (System-level SuperAdmin creation).
*   **Repository/Adapter**: None.
*   **Supabase Interaction**: Non-interactive simulation. Receives user payload and immediately responds with a success status without writing to auth profiles.

---

## 3. Secured Workspace Channels

### Route: `/dashboard`
*   **React Component**: `Dashboard` (`src/pages/Dashboard.tsx`)
*   **API Entry Point**: `CARSS_Revenue_Server` (`src/services/revenueService.ts`) & `CARSS_Operations_Server` (`src/services/operationService.ts`)
*   **Command or Query**:
    *   **Queries**: `getActiveShift()`, `getShifts()`, `getCashMovements()`, `getPOSTransactions()`, `getBankTransfers()`, `getInventoryMovements()`, `getReservations()`, `getPaymentIntentions()`, `getInventory()`, `getMenuItems()`, `getCategories()`, `getPaymentDisputes()`
    *   **Commands**: `openShift()`, `closeShift()`, `addCashMovement()`, `addPOSTransaction()`, `reconcilePOSTransaction()`, `addBankTransfer()`, `verifyBankTransfer()`, `addInventoryMovement()`, `updateReservationStatus()`, `reconcilePaymentIntention()`, `createPaymentDispute()`, `resolvePaymentDispute()`, `updateItemInventory()`, `restockItemInventory()`, `logMovement()`
*   **Repository/Adapter**:
    *   `ShiftAdapter` (`src/adapters/ShiftAdapter.ts`)
    *   `TransactionAdapter` (`src/adapters/TransactionAdapter.ts`)
    *   `BookingAdapter` (`src/adapters/BookingAdapter.ts`)
*   **Supabase Interaction**:
    *   *Adapter-based operations*: Reads and writes from `carss_shift_core` and `transactions` tables.
    *   *Direct service-level operations*: Directly queries and mutates `payment_intents`, `payments`, `payment_disputes`, `menu_items`, `menu_categories`, `inventory`, `inventory_movements`, `unmatched_payments`, `shift_summaries`, and `cash_movements` tables.
    *   *Offline fallback*: Reads/writes from `localStorage` (`carss_shifts`, `carss_pos`, `carss_bookings`, etc.) when offline.

---

### Route: `/onboarding`
*   **React Component**: `Onboarding` (`src/pages/Onboarding.tsx`)
*   **API Entry Point**: Local client `useRoleStore` system action.
*   **Command or Query**: None (Client-side file intake and trust credential logging).
*   **Repository/Adapter**: None.
*   **Supabase Interaction**: None. Stores files in local React state and appends text entries to `localStorage` audit history logs.

---

### Route: `/profile`
*   **React Component**: `Profile` (`src/pages/Profile.tsx`)
*   **API Entry Point**: Local `useAuth()` and `useRoleStore` hooks.
*   **Command or Query**: None.
*   **Repository/Adapter**: None.
*   **Supabase Interaction**: Reads current authenticated user metadata from localized cache context.

---

### Route: `/notifications`
*   **React Component**: `Notifications` (`src/pages/Notifications.tsx`)
*   **API Entry Point**: Local client `useRoleStore` state handlers.
*   **Command or Query**: None.
*   **Repository/Adapter**: None.
*   **Supabase Interaction**: None. Completely client-side simulated notification records.

---

### Route: `/audit`
*   **React Component**: `AuditRoom` (`src/pages/AuditRoom.tsx`)
*   **API Entry Point**: `ConstitutionalAuditService` (`src/services/auditService.ts`)
*   **Command or Query**:
    *   **Queries**: `getTimeline()`, `detectAnomalies()`, `getResourceHistory()`, `getOperatorHistory()`
    *   **Commands**: `emitEvent()`
*   **Repository/Adapter**: None (Direct service-to-client queries).
*   **Supabase Interaction**: Reads and writes direct transactions onto the `audit_events` table using direct Supabase Client library calls. Falls back to `carss_audit_events` in local cache.

---

### Route: `/reports`
*   **React Component**: `Reports` (`src/pages/Reports.tsx`)
*   **API Entry Point**: `reportService` (`src/services/reportService.ts`)
*   **Command or Query**:
    *   **Queries**: `getExecutiveRevenueReport()`, `getOperationsReport()`, `getAuditReport()`, `getInventoryReport()`, `getReservationReport()`, `getStaffPerformanceReport()`
*   **Repository/Adapter**: Reads through aggregated sub-servers (`CARSS_Operations_Server`, `CARSS_Revenue_Server`, `ConstitutionalAuditService`).
*   **Supabase Interaction**: None directly (queries sub-services, but compiles static SQL query descriptions for metadata lineage).
