# AUDIT RUNTIME READ MAP (WAVE 7.6)

This document maps all runtime read pathways, query mechanisms, service methods, and rendering pages for audit data under the CARSS Wave 5 Constitution.

---

### 1. READ PATHWAY DIRECTORY

| Reading Page / View | Service Method | Database Target Table | Purpose / Operational Context |
| :--- | :--- | :--- | :--- |
| **`src/pages/Dashboard.tsx`** (Activity Feed & Audit Trails) | `ConstitutionalAuditService.getTimeline(...)` | `audit_events` | Displays the main backoffice chronological system event timeline. |
| **`src/pages/Dashboard.tsx`** (Security Exception / Anomaly Center) | `ConstitutionalAuditService.detectAnomalies()` | `audit_events` (via parsing timeline states) | Scans chronological logs to extract shift variance, dual POS entries, and policy breaches. |
| **`src/pages/Dashboard.tsx`** (Payments Backoffice) | `CARSS_Revenue_Server.getPaymentDisputes()` | `payment_disputes` | Loads pending billing disputes, enabling supervisors to verify discrepancies. |
| **`src/pages/Dashboard.tsx`** (Inventory Adjustments Feed) | `operationService.getInventoryMovements()` | `inventory_movements_v3` | Lists manual stock adjustments, shrinkage, and warehouse waste reports. |
| **`src/pages/Dashboard.tsx`** (Shift Operations Panel) | `operationService.getCashMovements(...)` | `cash_movements` | Displays cash ins/outs and drops for active shift drawer audit calculation. |
| **`src/pages/Dashboard.tsx`** (Shift Summary Dashboard) | `operationService.getShifts()` (maps core data) | `shift_summaries` | Checks historical shift outcomes, final aggregates, and drawer compliance variances. |

---

### 2. CORE READ TRANSFORMATION SCHEMAS

#### A. Timeline Events (`audit_events`)
*   **Transformation Logic**: Reads from the primary Supabase chronological database with local fallbacks.
*   **Object Model mapping**:
    ```typescript
    interface AuditEvent {
      id: string;
      event_type: string;
      event_category: EventCategoryType;
      actor_id: string;
      actor_role: string;
      resource_type: string;
      resource_id: string;
      resource_name: string;
      before_state: string;
      after_state: string;
      notes: string;
      source_module: string;
      session_id?: string;
      shift_id?: string;
      created_at: string;
    }
    ```

#### B. Direct Stock Movement (`inventory_movements_v3`)
*   **Transformation Logic**: Fetches manual changes compiled by warehouse floor workers:
    ```typescript
    interface OperationalInventoryMovement {
      id: string;
      inventory_id: string;
      quantity: number;
      movement_type: "stock_in" | "stock_out" | "consumption" | "waste" | "adjustment";
      reason: string;
      operator_id: string;
      timestamp: string;
    }
    ```

#### C. Shift Summaries (`shift_summaries`)
*   **Transformation Logic**: Reads aggregates written at shift closure:
    ```typescript
    interface ShiftSummary {
      shift_id: string;
      total_cash: number;
      total_pos: number;
      total_transfer: number;
      closing_amount: number;
      variance: number;
    }
    ```
