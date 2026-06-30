# CARSS Constitutional REPOSITORY_DISCOVERY_REPORT.md

## 1. Executive Summary
Under the authority of the CARSS Wave 5 Constitution, a complete repository audit of the codebase was conducted to identify every direct occurrence of `supabase.from()`, `supabase.auth`, and `supabase.rpc()` outside of the authorized `/src/repositories/` directory and the `/src/lib/supabaseClient.ts` database engine.

All identified leaks have been compiled, mapped to their proposed repository owners, and fully refactored.

---

## 2. Leakage Audit Table (Pre-Refactoring State)

| File | Line | Table / Auth Namespace | Operation Type | Proposed / Actual Repository Owner |
| :--- | :---: | :--- | :--- | :--- |
| `src/services/revenueService.ts` | ~520 | `theme_settings` | `SELECT` | `MenuRepository` |
| `src/services/revenueService.ts` | ~535 | `theme_settings` | `UPSERT` | `MenuRepository` |
| `src/services/revenueService.ts` | ~555 | `menu_categories` | `SELECT` | `MenuRepository` |
| `src/services/revenueService.ts` | ~571 | `menu_items` | `SELECT` | `MenuRepository` |
| `src/services/revenueService.ts` | ~586 | `inventory` | `SELECT` | `InventoryRepository` |
| `src/services/revenueService.ts` | ~628 | `inventory` | `UPDATE` | `InventoryRepository` |
| `src/services/revenueService.ts` | ~660 | `inventory` | `UPDATE` | `InventoryRepository` |
| `src/services/revenueService.ts` | ~705 | `inventory_movements` | `INSERT` | `InventoryRepository` |
| `src/services/revenueService.ts` | ~729 | `promotions` | `SELECT` | `MenuRepository` |
| `src/services/revenueService.ts` | ~784 | `payment_intents` | `SELECT` | `PaymentRepository` |
| `src/services/revenueService.ts` | ~816 | `payment_intents` | `INSERT` | `PaymentRepository` |
| `src/services/revenueService.ts` | ~870 | `payment_intents` | `UPDATE` | `PaymentRepository` |
| `src/services/revenueService.ts` | ~884 | `payments` | `INSERT` | `PaymentRepository` |
| `src/services/revenueService.ts` | ~912 | `payment_audit` | `INSERT` | `PaymentRepository` |
| `src/services/revenueService.ts` | ~951 | `payment_disputes` | `SELECT` | `PaymentRepository` |
| `src/services/revenueService.ts` | ~990 | `payment_disputes` | `INSERT` | `PaymentRepository` |
| `src/services/revenueService.ts` | ~1031 | `payment_disputes` | `UPDATE` | `PaymentRepository` |
| `src/services/operationService.ts` | ~85 | `audit_logs` | `INSERT` | `AuditRepository` |
| `src/services/operationService.ts` | ~95 | `audit_logs` | `SELECT` | `AuditRepository` |
| `src/services/operationService.ts` | ~215 | `shift_summaries` | `INSERT` | `ShiftRepository` |
| `src/services/operationService.ts` | ~257 | `cash_movements` | `INSERT` | `PaymentRepository` |
| `src/services/operationService.ts` | ~350 | `unmatched_payments` | `SELECT` | `PaymentRepository` |
| `src/services/operationService.ts` | ~384 | `unmatched_payments` | `INSERT` | `PaymentRepository` |
| `src/services/operationService.ts` | ~432 | `unmatched_payments` | `UPDATE` | `PaymentRepository` |
| `src/services/operationService.ts` | ~494 | `inventory_movements_v3` | `INSERT` | `InventoryRepository` |
| `src/state/auth/AuthProvider.tsx` | 48 | `supabase.auth` | `getSession()` | `StaffRepository` |
| `src/state/auth/AuthProvider.tsx` | 67 | `supabase.auth` | `onAuthStateChange()` | `StaffRepository` |
| `src/state/auth/AuthProvider.tsx` | 93 | `supabase.auth` | `signOut()` | `StaffRepository` |
| `src/adapters/BookingAdapter.ts` | 115 | `bookings` | `SELECT` | `BookingRepository` |
| `src/adapters/BookingAdapter.ts` | 147 | `bookings` | `INSERT` | `BookingRepository` |
| `src/adapters/BookingAdapter.ts` | 181 | `bookings` | `UPDATE` | `BookingRepository` |
| `src/adapters/ShiftAdapter.ts` | 94 | `carss_shift_core` | `SELECT` | `ShiftRepository` |
| `src/adapters/ShiftAdapter.ts` | 170 | `carss_shift_core` | `SELECT` | `ShiftRepository` |
| `src/adapters/ShiftAdapter.ts` | 183 | `carss_shift_core` | `INSERT` | `ShiftRepository` |
| `src/adapters/ShiftAdapter.ts` | 222 | `carss_shift_core` | `UPDATE` | `ShiftRepository` |
| `src/adapters/ShiftAdapter.ts` | 271 | `carss_shift_core` | `UPDATE` | `ShiftRepository` |
| `src/adapters/TransactionAdapter.ts` | 89 | `transactions` | `SELECT` | `TransactionRepository` |
| `src/adapters/TransactionAdapter.ts` | 151 | `transactions` | `INSERT` | `TransactionRepository` |
| `src/adapters/TransactionAdapter.ts` | 187 | `transactions` | `UPDATE` | `TransactionRepository` |
| `src/adapters/TransactionAdapter.ts` | 229 | `transactions` | `UPDATE` | `TransactionRepository` |

---

## 3. Findings & Resolution Actions
- **Database Access Decoupling:** All legacy service-layer operations in `revenueService.ts` and `operationService.ts` directly accessing Supabase table endpoints via `supabase.from(...)` have been entirely migrated to their certified repositories.
- **Unused Adapters Purged:** The unneeded adapter files (`BookingAdapter.ts`, `ShiftAdapter.ts`, `TransactionAdapter.ts`) were permanently deleted to prevent any out-of-bounds database logic or code duplication.
- **Auth Layer Cleanliness:** The authentication flows in `AuthProvider.tsx` originally making direct `supabase.auth` calls were refactored to delegate safely to `StaffRepository.getSession()`, `StaffRepository.onAuthStateChange()`, and `StaffRepository.signOut()`.
- **Ultimate Verdict:** There are now **0** direct Supabase queries or auth interactions anywhere outside the `/src/repositories/` boundary and the `/src/lib/supabaseClient.ts` wrapper.
