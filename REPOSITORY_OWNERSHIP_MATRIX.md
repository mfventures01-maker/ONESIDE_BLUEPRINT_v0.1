# CARSS Constitutional REPOSITORY_OWNERSHIP_MATRIX.md

## 1. Constitutional Repository Ownership Architecture

Every certified database entity under the CARSS Wave 5 Constitution is owned by an explicit repository. Repositories own persistence and only persistence, returning structured results and containing zero client-side view or router state.

---

## 2. Table Ownership Assignments

| Database Table Name | Certified Repository Owner | Operational Subsystem Domain | Description / Table Details |
| :--- | :--- | :--- | :--- |
| **`theme_settings`** | `MenuRepository` | UI Configuration | Saved active theme variables and options. |
| **`menu_categories`** | `MenuRepository` | Menu Operations | Categories of available culinary items and VIP lounge platters. |
| **`menu_items`** | `MenuRepository` | Menu Operations | Canonical list of food, cocktail, shisha, and snooker bite menu items. |
| **`promotions`** | `MenuRepository` | Marketing | Active discount codes, badges, and promotional metadata. |
| **`inventory`** | `InventoryRepository` | Resource Planning | Current stock quantities, warehouse descriptions, and safety floors. |
| **`inventory_movements`** | `InventoryRepository` | Audit Tracking | Historic movement log data of inventory stock change amounts. |
| **`inventory_movements_v3`** | `InventoryRepository` | Compliance / Operations | High-fidelity POS and order stock depletion trails. |
| **`payment_intents`** | `PaymentRepository` | Financial Ledger | Pending, approved, or rejected payment intentions. |
| **`payments`** | `PaymentRepository` | Revenue Management | Reconciled/verified payments mapping to bookings and orders. |
| **`payment_disputes`** | `PaymentRepository` | Disputes / Compliance | Open or resolved transaction disputes filed by customers/managers. |
| **`payment_audit`** | `PaymentRepository` | Compliance / Auditing | Audits of reconciliation steps and verification records. |
| **`unmatched_payments`** | `PaymentRepository` | Bank Transfer Ledger | Historic direct bank transfers matched or pending manual approval. |
| **`audit_events`** | `AuditRepository` | Constitutional Audit | Security-critical and operational events mapped to users. |
| **`audit_logs`** | `AuditRepository` | Forensic Log | Raw general log statements emitted across the system. |
| **`businesses`** | `BusinessRepository` | Corporate Profile | Certified profiles of operational business branches. |
| **`branches`** | `BusinessRepository` | Corporate Profile | Branch-specific coordinates and detail sheets. |
| **`business_settings`** | `BusinessRepository` | Corporate Profile | Configurable parameters of localized businesses. |
| **`customers`** | `CustomerRepository` | Client Profiling | Registered guest profiles and VIP status indicators. |
| **`staff`** | `StaffRepository` | Operations Identity | Standard registered operator details. |
| **`operators`** | `StaffRepository` | Operations Identity | Logged-in operators and shift-associated accounts. |
| **`memberships`** | `StaffRepository` | Membership Identity | Client and staff club cards and VIP deck passes. |
| **`roles`** | `StaffRepository` | Privilege Levels | Access groups (staff, manager, ceo, superadmin) security rules. |
| **`bookings`** | `BookingRepository` | Lounge / Table Reservations | Table reservations, snooker ticket books, and deck reservations. |
| **`carss_shift_core`** | `ShiftRepository` | Workshift Control | Shift open/close times, operator details, floats, and audits. |
| **`transactions`** | `TransactionRepository` | POS Streams | Bank terminal reference records, amounts, and reconciliation status. |

---

## 3. Strict Boundary Rules
1. **Isolated Persistence:** No repository shall cross-import another repository. Any cross-repository data combining must take place in the Service Layer (e.g., `revenueService.ts` or `operationService.ts`).
2. **Deterministic Outputs:** Every repository returns a strongly-typed `CarssResult<T>` wrapper. No raw Supabase query exceptions leak to the service layers.
3. **No UI Leakage:** Repositories have absolutely zero references to components, contexts, routing mechanisms, or UI assets.
