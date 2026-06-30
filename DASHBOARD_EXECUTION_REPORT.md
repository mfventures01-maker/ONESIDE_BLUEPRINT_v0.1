# DASHBOARD EXECUTION PATHWAY REPORT

This report traces the execution pathways for the four specialized workspaces within the CARSS Console, mapping React UI actions to their domain services, adapters, and final Supabase database tables.

---

## 1. Operations Workspace (Shift, Cash, & POS Terminals)
Handles active shifts, shift float registers, cash logs, physical card swiping (POS transactions), bank direct deposits, and real-time inventory adjustments.

*   **React UI Tab Key**: `dashboardViewTab === "operations"`
*   **Domain Service**: `CARSS_Operations_Server` (`src/services/operationService.ts`)
*   **Data Resolution Pathway**:
    ```text
    React Component (Dashboard.tsx)
        ├── ➔ CARSS_Operations_Server.getActiveShift() ──➔ ShiftAdapter ──➔ DB Table: [carss_shift_core]
        ├── ➔ CARSS_Operations_Server.getShifts()      ──➔ ShiftAdapter ──➔ DB Table: [carss_shift_core]
        ├── ➔ CARSS_Operations_Server.getPOSTransactions() ──➔ TransactionAdapter ──➔ DB Table: [transactions]
        ├── ➔ CARSS_Operations_Server.getCashMovements() ──➔ Direct Supabase ──➔ DB Table: [cash_movements]
        ├── ➔ CARSS_Operations_Server.getBankTransfers() ──➔ Direct Supabase ──➔ DB Table: [unmatched_payments]
        └── ➔ CARSS_Operations_Server.getInventoryMovements() ──➔ Direct Supabase ──➔ DB Table: [inventory_movements_v3]
    ```
*   **Command Execution Paths**:
    *   *Opening Shift*: `openShift()` ➔ `ShiftAdapter.openShift()` ➔ Writes to `carss_shift_core` table.
    *   *Closing Shift*: `closeShift()` ➔ `ShiftAdapter.closeShift()` ➔ Updates `carss_shift_core` table & writes to `shift_summaries` table.
    *   *Adding POS terminal transaction*: `addPOSTransaction()` ➔ `TransactionAdapter.createTransaction()` ➔ Inserts into `transactions` table.
    *   *Reconciling card swiping*: `reconcilePOSTransaction()` ➔ `TransactionAdapter.reconcileTransaction()` ➔ Updates `transactions` table.

---

## 2. CEO Workspace (Executive Reporting & Anomaly Scanners)
Provides executive analytical metrics, weekly operation charts, mock terminal monitors tracking real-time events, and system security risk indicators.

*   **React UI Tab Key**: `dashboardViewTab === "ceo"`
*   **Domain Service**: `CARSS_Operations_Server` & `CARSS_Revenue_Server`
*   **Data Resolution Pathway**:
    ```text
    React Component (Dashboard.tsx)
        ├── ➔ Recharts Visualization Charts ──➔ Local mock array [chartData]
        ├── ➔ Live Terminal Event Monitor   ──➔ `useRoleStore` [systemLogs]
        ├── ➔ Exception Counters (Unresolved POS) ──➔ `CARSS_Operations_Server.getPOSTransactions()`
        └── ➔ Exception Counters (Unverified Transfers) ──➔ `CARSS_Operations_Server.getBankTransfers()`
    ```
*   **Command Execution Paths**:
    *   All executive interactions are analytical and read-only.
    *   System log entries are appended client-side using the `addSystemLog()` action within React's global `useRoleStore` context.

---

## 3. Revenue Workspace (Bookings, Cashier Ledger, & Disputes)
Manages customer reservation books, verification vouchers, cashier settlement ledgers, inventory stock, and payment dispute files.

*   **React UI Tab Key**: `dashboardViewTab === "revenue"`
*   **Domain Service**: `CARSS_Revenue_Server` (`src/services/revenueService.ts`)
*   **Data Resolution Pathway**:
    ```text
    React Component (Dashboard.tsx)
        ├── ➔ CARSS_Revenue_Server.getReservations() ──➔ BookingAdapter ──➔ DB Table: [bookings]
        ├── ➔ CARSS_Revenue_Server.getPaymentIntentions() ──➔ Direct Supabase ──➔ DB Table: [payment_intents]
        ├── ➔ CARSS_Revenue_Server.getInventory() ──➔ Direct Supabase ──➔ DB Table: [inventory]
        └── ➔ CARSS_Revenue_Server.getPaymentDisputes() ──➔ Direct Supabase ──➔ DB Table: [payment_disputes]
    ```
*   **Command Execution Paths**:
    *   *Confirming Reservation*: `updateReservationStatus()` ➔ `BookingAdapter.updateBookingStatus()` ➔ Updates `bookings` table.
    *   *Resolving Disputes*: `resolvePaymentDispute()` ➔ Direct Supabase update on `payment_disputes` table.
    *   *Reconciling checkout receipts*: `reconcilePaymentIntention()` ➔ Direct Supabase update on `payment_intents` and insert on `payments` tables.

---

## 4. Security Audit Workspace (Chronological Event Logging)
Tracks user activity timelines, identifies security anomalies, and displays current SQL database configurations.

*   **React UI Tab Key**: `dashboardViewTab === "audit"` (or page `/audit`)
*   **Domain Service**: `ConstitutionalAuditService` (`src/services/auditService.ts`)
*   **Data Resolution Pathway**:
    ```text
    React Component (AuditRoom.tsx)
        ├── ➔ ConstitutionalAuditService.getTimeline() ──➔ Direct Supabase ──➔ DB Table: [audit_events]
        └── ➔ ConstitutionalAuditService.detectAnomalies() ──➔ Evaluates lists locally to return anomaly profiles
    ```
*   **Command Execution Paths**:
    *   *Logging compliance event*: `emitEvent()` ➔ Direct Supabase insert into `audit_events` table.
