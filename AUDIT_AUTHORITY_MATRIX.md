# AUDIT AUTHORITY MATRIX (WAVE 7.6)

This matrix defines the authoritative domain ownership, triggering functions, source services, and validation guidelines for all logging and audit subsystems under the CARSS Wave 5 Constitution.

---

### 1. AUTHORITATIVE DOMAIN MAPPING

| Business Event / Activity | Authoritative Audit Table | Event Triggering Code | Source Service / Adapter | FK / Referential Integrity |
| :--- | :--- | :--- | :--- | :--- |
| **Payment Invoicing & Reconciliation** | `payment_audit` | `reconcilePaymentIntention(...)` | `revenueService.ts` | `payment_audit.payment_id` → `payments.id` (Enforced)<br>`payment_audit.business_id` → `businesses.id` (Enforced) |
| **Operator Collections Dispute** | `payment_disputes` | `createPaymentDispute(...)`<br>`resolvePaymentDispute(...)` | `revenueService.ts` | `payment_disputes.payment_id` → `payments.id` (Enforced)<br>`payment_disputes.branch_id` → `branches.id` (Enforced) |
| **Reservation Sales Deductions** | `inventory_movements` | `logMovement(...)` | `revenueService.ts` | `inventory_movements.product_id` → `inventory.id` (Enforced) |
| **Floor Inventory Waste & Stocking** | `inventory_movements_v3` | `addInventoryMovement(...)` | `operationService.ts` | `inventory_movements_v3.inventory_id` (Logical Indexing) |
| **Drawer Cash Adjustment / Expensing**| `cash_movements` | `addCashMovement(...)` | `operationService.ts` | `cash_movements.shift_id` → `shifts.id` (Enforced) |
| **Shift Lockup & Variance Audit** | `shift_summaries` | `closeShift(...)` | `operationService.ts` | `shift_summaries.shift_id` → `shifts.id` (Enforced) |
| **Chronological Audit Timeline Engine**| `audit_events` | `emitEvent(...)` | `auditService.ts` | Unified system-wide event logging (Logical Indexing) |
| **Operational Quick Trace Logger** | `audit_logs` | `emitAudit(...)` | `operationService.ts` | Legacy logging indexing (Logical Indexing) |

---

### 2. CORE BUSINESS AUDIT VALIDATION POLICIES

1.  **Strict Write Synchronization**: Whenever a core operational state mutates (e.g., drawer closes, inventory adjusts, or payments reconcile), a corresponding audit trace MUST be written inside the same transaction scope.
2.  **No Gaps in Flow History**: Cash drawer modifications can only occur when there is an active, open shift, and MUST log to `cash_movements` with the associated operator role and signature notes.
3.  **One Business Event, One Audited ID**: If a customer checkout consumes ingredients, a transaction ID MUST tie the sales event in `payments` directly to the stock adjustment log in `inventory_movements`.
4.  **Forensic Log Preservation**: Chronological tables (`audit_events`, `payment_audit`) are read-only and write-once by system design. No delete or update pathways are implemented for these structures.
