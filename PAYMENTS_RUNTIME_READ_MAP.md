# PAYMENTS RUNTIME READ MAP (WAVE 7.5)

This document provides a comprehensive mapping of all runtime read pathways for payment records, payment intentions, audits, disputes, and electronic remittances within the ONESIDE / CARSS payment territory under the Wave 5 Constitution.

---

### 1. PAYMENT INTENTIONS (`payment_intents`)
*   **Reads Initiated In**: `src/services/revenueService.ts` -> `getPaymentIntentions()`
*   **Supabase Target Table**: `payment_intents`
*   **Mapping Transformation**:
    ```typescript
    data.map((row: any) => ({
      id: row.id,
      reservation_id: row.order_id,
      amount: Number(row.expected_amount) || 0,
      payment_method: (row.payment_type || "cash") as any,
      payment_reference: row.external_reference || "",
      status: (row.status === "reconciled" ? "reconciled" : "pending") as any,
      created_at: row.created_at
    }))
    ```
*   **Offline Fallback Store**: `carss_payment_intentions` (localStorage)

---

### 2. COMPLETED TRANSACTIONS (`payments`)
*   **Reads Initiated In**: `src/services/reportService.ts` -> `ConstituentRevenueReportService()`
*   **Supabase Target Table**: `payments`
*   **Linear Query / Aggregation Pathway**:
    *   Daily Revenue: `SELECT sum(amount) FROM payments WHERE status = 'verified' AND created_at >= CURRENT_DATE`
    *   Weekly Revenue: `SELECT sum(amount) FROM payments WHERE status = 'verified' AND created_at >= NOW() - INTERVAL '7 days'`
    *   Monthly Revenue: `SELECT sum(amount) FROM payments WHERE status = 'verified' AND created_at >= NOW() - INTERVAL '30 days'`
*   **Offline Fallback Store**: `carss_payments` (localStorage)

---

### 3. PAYMENT AUDIT TRAIL (`payment_audit`)
*   **Reads Initiated In**: System-level administrative queries (Auditor Desk)
*   **Supabase Target Table**: `payment_audit`
*   **Core Audit Query**:
    ```sql
    SELECT * FROM payment_audit WHERE payment_id = $1 ORDER BY created_at DESC;
    ```

---

### 4. PAYMENT DISPUTES (`payment_disputes`)
*   **Reads Initiated In**: `src/services/revenueService.ts` -> `getPaymentDisputes()` and loaded dynamically in `src/pages/Dashboard.tsx`
*   **Supabase Target Table**: `payment_disputes`
*   **Mapping Schema**:
    ```typescript
    data.map((row: any) => ({
      id: row.id,
      business_id: row.business_id,
      branch_id: row.branch_id,
      payment_id: row.payment_id,
      dispute_reason: row.dispute_reason,
      status: row.status as "open" | "resolved",
      opened_by: row.opened_by,
      resolved_by: row.resolved_by,
      resolution_note: row.resolution_note,
      created_at: row.created_at,
      resolved_at: row.resolved_at,
      paid_at: row.paid_at
    }))
    ```
*   **Offline Fallback Store**: `carss_payment_disputes` (localStorage)

---

### 5. ELECTRONIC REMITTANCES (`unmatched_payments`)
*   **Reads Initiated In**: `src/services/operationService.ts` -> `getBankTransfers()` and `src/services/reportService.ts` -> `ConstituentOperatorsReportService()`
*   **Supabase Target Table**: `unmatched_payments`
*   **Mapping Transformation**:
    ```typescript
    data.map((row: any) => ({
      reference: row.reference || "",
      amount: Number(row.amount) || 0,
      payer_name: row.sender || "Unknown",
      verification_status: (row.status === "verified" ? "verified" : "pending") as any,
      verified_by: null
    }))
    ```
*   **Offline Fallback Store**: `carss_transfers` (localStorage)
