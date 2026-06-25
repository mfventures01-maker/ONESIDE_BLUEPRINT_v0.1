# PAYMENTS RUNTIME WRITE MAP (WAVE 7.5)

This document maps all write pathways, insertion payloads, mutation triggers, and target table schemas for the ONESIDE / CARSS payment subsystems under Wave 7.5 compliance guidelines.

---

### 1. PAYMENT INTENTIONS (`payment_intents`)
*   **Write Endpoint**: `src/services/revenueService.ts` -> `generatePaymentIntention(...)`
*   **Trigger Event**: Customer initiates online/offline reservation checkout.
*   **Payload Schema**:
    ```typescript
    await supabase.from("payment_intents").insert({
      id: toUUID(fullIntention.id),
      order_id: toUUID(fullIntention.reservation_id || "reservation-dummy"),
      org_id: toUUID("org-1"),
      branch_id: toUUID("branch-1"),
      staff_id: toUUID("active-staff-sim"),
      shift_id: toUUID(fullIntention.shift_id || "shift-dummy"),
      expected_amount: fullIntention.amount,
      payment_type: fullIntention.payment_method,
      status: "pending",
      external_reference: fullIntention.payment_reference,
      approval_status: "pending",
      created_at: fullIntention.created_at
    });
    ```

---

### 2. REALIZED PAYMENTS (`payments`)
*   **Write Endpoint**: `src/services/revenueService.ts` -> `reconcilePaymentIntention(...)`
*   **Trigger Event**: Administrative desk reconciles a payment intention manually.
*   **Payload Schema**:
    ```typescript
    await supabase.from("payments").insert({
      id: toUUID(paymentId),
      business_id: toUUID("biz-1"),
      customer_id: toUUID("customer-dummy"),
      amount_ngn: Math.floor(act.amount),
      amount: act.amount,
      method: act.payment_method,
      status: "verified",
      reference: act.payment_reference,
      note: notes,
      created_by: toUUID("customer-dummy"),
      verified_by: toUUID("active-manager-sim"),
      verified_at: new Date().toISOString(),
      branch_id: toUUID("branch-1"),
      org_id: toUUID("org-1"),
      order_id: act.reservation_id ? toUUID(act.reservation_id) : toUUID("reservation-dummy"),
      booking_id: act.reservation_id ? toUUID(act.reservation_id) : toUUID("reservation-dummy"),
      created_at: act.created_at,
      updated_at: new Date().toISOString()
    });
    ```

---

### 3. COMPLIANCE AUDIT TRAILS (`payment_audit`)
*   **Write Endpoint**: `src/services/revenueService.ts` -> `reconcilePaymentIntention(...)`
*   **Trigger Event**: Fired synchronously upon successful commit of a reconciled `payments` record.
*   **Payload Schema**:
    ```typescript
    await supabase.from("payment_audit").insert({
      id: toUUID(`audit-payment-${id}`),
      business_id: toUUID("biz-1"),
      payment_id: toUUID(paymentId),
      branch_id: toUUID("branch-1"),
      action: "reconcile",
      actor_user_id: toUUID("active-manager-sim"),
      note: notes,
      meta: { 
        payment_reference: act.payment_reference, 
        amount: act.amount, 
        reconciled_at: new Date().toISOString() 
      }
    });
    ```

---

### 4. PAYMENT DISPUTES (`payment_disputes`)
*   **Write Endpoint**: `src/services/revenueService.ts` -> `createPaymentDispute(...)` / `resolvePaymentDispute(...)`
*   **Trigger Event**: Operator files a discrepancy, or resolves an active dispute in `Dashboard.tsx`.
*   **Filing Payload Schema**:
    ```typescript
    await supabase.from("payment_disputes").insert({
      id: toUUID(id),
      business_id: toUUID("biz-1"),
      branch_id: toUUID("branch-1"),
      payment_id: toUUID(paymentId),
      dispute_reason: reason,
      status: "open",
      opened_by: toUUID("active-manager-sim"),
      created_at: dispute.created_at
    });
    ```
*   **Resolution Payload Schema**:
    ```typescript
    await supabase
      .from("payment_disputes")
      .update({
        status: "resolved",
        resolution_note: notes,
        resolved_by: toUUID("active-manager-sim"),
        resolved_at: new Date().toISOString()
      })
      .eq("id", toUUID(id));
    ```

---

### 5. ELECTRONIC REMITTANCES (`unmatched_payments`)
*   **Write Endpoint**: `src/services/operationService.ts` -> `recordBankTransfer(...)` / `verifyBankTransfer(...)`
*   **Trigger Event**: Bank notification alerts of automated wire transfers, verified by auditing operators.
*   **Payload Schema**:
    ```typescript
    await supabase.from("unmatched_payments").insert({
      id: toUUID(`unmatched-${reference}`),
      amount: amount,
      reference: reference,
      sender: payerName,
      detected_at: new Date().toISOString(),
      status: "pending"
    });
    ```
