# DATABASE SCHEMA SYNCHRONIZATION REPORT

This report cross-references active database tables in the codebase against the official tables and target record counts defined in the CARSS Wave 5 Constitution (`AGENTS.md` and `GEMINI.md`).

---

## 1. Constitutional Table Synchronization Grid

The following table evaluates each constitutional entity, comparing codebase usage against the required counts and schemas.

| Constitutional Table Name | Target Record Count | Codebase Reference Path | Synchronization Status | Reconciliation Analysis |
| :--- | :---: | :--- | :---: | :--- |
| **`bookings`** | 13 | `BookingAdapter.ts` ➔ `revenueService.ts` | **PASS** | Fully synchronized. Matches target count (13) and table name exactly. |
| **`businesses`** | 10 | Static string injection inside Adapters | **FAIL** | Table exists, but lacks code mappings or an adapter. Instead, the hardcoded ID `"biz-1"` is injected inside adapter queries. |
| **`carss_orders_unified`** | 10 | Unreferenced | **FAIL** | Completely absent from active codebase queries, repository adapters, and service layers. |
| **`carss_shift_core`** | 11 | `ShiftAdapter.ts` ➔ `operationService.ts` | **PASS** | Fully synchronized. Matches target count (11) and table name exactly. |
| **`customers`** | 7 | Referenced optionally in `BookingAdapter` | **FAIL** | Table exists, but lacks a dedicated repository adapter. It is only referenced as a nullable metadata column in booking records. |
| **`inventory`** | 18 | `revenueService.ts` ➔ `reportService.ts` | **PASS** | Mapped. Queried directly inside services and compiled for reporting lineage. |
| **`payment_intents`** | 17 | `revenueService.ts` ➔ `reportService.ts` | **PASS** | Mapped. Queried directly inside services and compiled for reporting lineage. |
| **`payments`** | 24 | `revenueService.ts` ➔ `reportService.ts` | **PASS** | Mapped. Queried directly inside services and compiled for reporting lineage. |
| **`transactions`** | 19 | `TransactionAdapter.ts` ➔ `operationService.ts` | **PASS** | Fully synchronized. Matches target count (19) and table name exactly. |

---

## 2. SQL Lineage Trace Audit

To ensure the integrity of the data shown in reports and dashboards, the `reportService.ts` maps metrics to their respective source tables:

1.  **Metric: Daily Revenue**
    *   *Source Table*: `payments`
    *   *Supabase SQL Query*: `SELECT sum(amount) FROM payments WHERE status = 'verified' AND created_at >= CURRENT_DATE`
    *   *Record Count*: Tracks all payment entries resolved within the current 24-hour cycle.
2.  **Metric: Weekly Revenue**
    *   *Source Table*: `payments`
    *   *Supabase SQL Query*: `SELECT sum(amount) FROM payments WHERE status = 'verified' AND created_at >= NOW() - INTERVAL '7 days'`
    *   *Record Count*: Tracks payment records from the last 168 hours.
3.  **Metric: Monthly Revenue**
    *   *Source Table*: `payments`
    *   *Supabase SQL Query*: `SELECT sum(amount) FROM payments WHERE status = 'verified' AND created_at >= NOW() - INTERVAL '30 days'`
    *   *Record Count*: Tracks payment records from the last 720 hours.
4.  **Metric: Inventory Financial Impact**
    *   *Source Table*: `inventory_movements`
    *   *Supabase SQL Query*: `SELECT sum(abs(quantity_changed) * cost_multiplier) FROM inventory_movements`
    *   *Record Count*: Matches unit depletion logs inside the physical stock repository.
5.  **Metric: Operational Variance Summary**
    *   *Source Table*: `shifts`
    *   *Supabase SQL Query*: `SELECT sum(variance) FROM shifts`
    *   *Record Count*: Aggregates cashier variance calculations across closed shift timelines.

---

## 3. Structural Deficiencies and Schema Gaps

1.  **Missing Unified Orders Mapping (`carss_orders_unified`)**: This is a critical gap. Multi-channel checkout orders lack an active database query or code representation, preventing unified order auditing.
2.  **Hardcoded Branch Profiles (`businesses`)**: Lacks an active business branch profile mapper. Hardcoded keys prevent the console from scaling to support multiple corporate branches.
