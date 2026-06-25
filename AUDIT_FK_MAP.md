# AUDIT FK CARTOGRAPHY (WAVE 7.6)

This document charts every active database-level Foreign Key (FK) constraint involving audit, log, and movement-related tables under the CARSS Wave 5 Constitution.

---

### 1. ACTIVE DATABASE FOREIGN KEYS

| Constraint Source Table | Source Column | Referenced Foreign Table | Referenced Foreign Column | On Delete Cascade | Enforcement Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **`payment_audit`** | `payment_id` | `payments` | `id` | **YES** | Enforced |
| **`payment_audit`** | `business_id` | `businesses` | `id` | **YES** | Enforced |
| **`payment_audit`** | `branch_id` | `branches` | `id` | **YES** | Enforced |
| **`payment_disputes`** | `payment_id` | `payments` | `id` | **YES** | Enforced |
| **`payment_disputes`** | `business_id` | `businesses` | `id` | **YES** | Enforced |
| **`payment_disputes`** | `branch_id` | `branches` | `id` | **YES** | Enforced |
| **`inventory_movements`**| `product_id` | `inventory` | `id` | **YES** | Enforced |
| **`cash_movements`** | `shift_id` | `shifts` | `id` | **YES** | Enforced |
| **`shift_summaries`** | `shift_id` | `shifts` | `id` | **YES** | Enforced |

---

### 2. LOGICAL-ONLY RELATIONSHIPS (NO DB FOREIGN KEYS)

The following tables handle relationships logically within the application runtime layer, but do not declare database-enforced foreign key constraints. This design maintains zero-latency offline availability.

#### A. `audit_events`
*   **Logical Actor Mapping**: `actor_id` (matches active worker username/operator ID)
*   **Logical Resource Mapping**: `resource_id` (points dynamically to audited records such as `shift_id` or `reservation_id` depending on the `resource_type`)
*   **Logical Shift Mapping**: `shift_id` (maps optionally to `shifts.id` / `carss_shift_core.id`)

#### B. `audit_logs`
*   **Logical Actor Mapping**: `operator_id` (matches active operator ID)
*   **Logical Resource Mapping**: `resource` (matches legacy target strings like `shift:shiftId` or `pos_tx:reference`)

#### C. `inventory_movements_v3`
*   **Logical Item Mapping**: `inventory_id` (points to the target stock item ID)
*   **Logical Actor Mapping**: `operator_id` (points to the recording operator ID)

---

### 3. INTEGRITY ASSURANCE STRATEGY

To prevent orphaning and ensure absolute referential integrity across logical boundaries:
1.  **UUID Determinism**: Application runtime relies on `toUUID` to cast legacy string IDs into stable UUID hashes when saving reference constraints inside `payment_audit` and `payment_disputes`.
2.  **Cascading Deletes**: Whenever a parent `payments` or `shifts` row is removed, child audits and disputes are deleted automatically via DB constraints, preserving space and preventing structural decay.
3.  **Strict Write Transaction Paths**: Mutations to child audit logs are coupled synchronously to their parent transaction boundaries inside `revenueService` and `operationService`.
