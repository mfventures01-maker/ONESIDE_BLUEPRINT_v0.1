# REPOSITORY BOUNDARY COMPLIANCE REPORT

This report evaluates whether every persistence operation (database read, insert, update, or delete) passes through an authorized Repository layer (e.g., adapters mapped to domain models). 

---

## 1. Compliance Matrix by Operational Entity

Under the CARSS Wave 5 Constitution, all tables must be wrapped by dedicated repository abstractions to isolate persistence actions.

| Entity (Table Name) | Repository Adapter | Compliance Status | Leak / Bypass Description |
| :--- | :--- | :---: | :--- |
| **`bookings`** | `BookingAdapter` | **PASS** | Fully encapsulated. Reads/writes pass through `BookingAdapter`. |
| **`carss_shift_core`** | `ShiftAdapter` | **PASS** | Fully encapsulated. Reads/writes pass through `ShiftAdapter`. |
| **`transactions`** | `TransactionAdapter` | **PASS** | Fully encapsulated. Reads/writes pass through `TransactionAdapter`. |
| **`businesses`** | None | **FAIL** | **No Repository**. Hardcoded string parameters injected inside shift and transactional adaptors instead of calling a dedicated repository. |
| **`customers`** | None | **FAIL** | **No Repository**. Standard identity mappings are handled inline during booking operations. |
| **`inventory`** | None | **FAIL** | **Direct Leak**. Business logic in `revenueService.ts` directly queries the `"inventory"` table with `supabase.from()` commands. |
| **`payment_intents`** | None | **FAIL** | **Direct Leak**. Business logic in `revenueService.ts` directly queries the `"payment_intents"` table with `supabase.from()` commands. |
| **`payments`** | None | **FAIL** | **Direct Leak**. Business logic in `revenueService.ts` directly queries the `"payments"` table with `supabase.from()` commands. |
| **`carss_orders_unified`**| None | **FAIL** | **No Repository**. Unimplemented entity; no active code exists to manage or persist unified orders. |

---

## 2. Granular Code Leak Inventory (By Service File)

The following lists the specific points in the codebase where SQL table interactions bypass the formal Repository boundary:

### A. Leaks in `src/services/revenueService.ts`
*   **Theme Settings Table (`theme_settings`)**:
    *   Bypasses adapter at lines 528 and 544 via `supabase.from("theme_settings")`.
*   **Menu Categories Table (`menu_categories`)**:
    *   Bypasses adapter at line 558 via `supabase.from("menu_categories")`.
*   **Menu Items Table (`menu_items`)**:
    *   Bypasses adapter at line 574 via `supabase.from("menu_items")`.
*   **Inventory Table (`inventory`)**:
    *   Bypasses adapter at lines 590, 643, and 690 via `supabase.from("inventory")`.
*   **Inventory Movements Table (`inventory_movements`)**:
    *   Bypasses adapter at line 720 via `supabase.from("inventory_movements")`.
*   **Promotions Table (`promotions`)**:
    *   Bypasses adapter at line 740 via `supabase.from("promotions")`.
*   **Payment Intents Table (`payment_intents`)**:
    *   Bypasses adapter at lines 799, 839, and 893 via `supabase.from("payment_intents")`.
*   **Payments Table (`payments`)**:
    *   Bypasses adapter at line 906 via `supabase.from("payments")`.
*   **Payment Audit Table (`payment_audit`)**:
    *   Bypasses adapter at line 930 via `supabase.from("payment_audit")`.
*   **Disputes Table (`payment_disputes`)**:
    *   Bypasses adapter at lines 971, 1017, and 1071 via `supabase.from("payment_disputes")`.

### B. Leaks in `src/services/operationService.ts`
*   **Audit Logs Table (`audit_logs`)**:
    *   Bypasses adapter at lines 85 and 96 via `supabase.from("audit_logs")`.
*   **Shift Summaries Table (`shift_summaries`)**:
    *   Bypasses adapter at line 215 via `supabase.from("shift_summaries")`.
*   **Cash Movements Table (`cash_movements`)**:
    *   Bypasses adapter at line 257 via `supabase.from("cash_movements")`.
*   **Unmatched Payments Table (`unmatched_payments`)**:
    *   Bypasses adapter at lines 351, 384, and 433 via `supabase.from("unmatched_payments")`.
*   **Inventory Movements Table (`inventory_movements_v3`)**:
    *   Bypasses adapter at line 494 via `supabase.from("inventory_movements_v3")`.

### C. Leaks in `src/services/auditService.ts`
*   **Audit Events Table (`audit_events`)**:
    *   Bypasses adapter at lines 171 and 200 via `supabase.from("audit_events")`.

---

## 3. Structural Analysis & Operational Risk

1.  **Orphaned Entities**: Because `businesses` and `customers` lack explicit Adapter-Repositories, entity associations (such as linking a shift to a specific business branch) rely on static placeholders.
2.  **Unsynchronized Offline Caching**: While `bookings` and `shifts` have fully developed local-storage replication mechanics inside their respective adapters, the entities with inline leaks (like `inventory`, `payments`, and `disputes`) must coordinate fallback caching inside their services. This leads to duplicate fallback logic and increased maintainability debt.
