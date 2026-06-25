# AUDIT RUNTIME WRITE MAP (WAVE 7.6)

This document charts every database write (insertion, state update, deletion protection) involving audit, log, and movement tables under the CARSS Wave 5 Constitution.

---

### 1. WRITE PATHWAY TARGETS & ENGINES

| Triggering Action / Business Event | API / Service Write Method | Database Target Table | State payload Structure |
| :--- | :--- | :--- | :--- |
| **Shift Opened** | `operationService.openShift(...)` | `audit_logs`<br>`audit_events` | Logs initial float, worker, and start timestamp to `audit_logs` and `audit_events` simultaneously. |
| **Shift Closed** | `operationService.closeShift(...)` | `shift_summaries`<br>`audit_logs`<br>`audit_events` | Inserts aggregates into `shift_summaries`; logs execution status to `audit_logs` and `audit_events`. |
| **Cash Drawer Flow** | `operationService.addCashMovement(...)` | `cash_movements`<br>`audit_logs`<br>`audit_events` | Records cash-in/out to `cash_movements`; triggers audits in both `audit_logs` and `audit_events`. |
| **POS Log Ingest** | `operationService.addPOSTransaction(...)` | `pos_transactions`<br>`audit_events` | Tracks incoming POS reference card checks; logs metadata to `audit_events`. |
| **POS Reconciled** | `operationService.reconcilePOSTransaction(...)` | `pos_transactions`<br>`audit_logs`<br>`audit_events` | Updates status in `pos_transactions`; logs execution to `audit_logs` and `audit_events`. |
| **Bank Transfer Ingestion** | `operationService.recordBankTransfer(...)` | `unmatched_payments`<br>`audit_events` | Logs incoming electronic bank ledger; logs notification alert in `audit_events`. |
| **Bank Transfer Verified** | `operationService.verifyBankTransfer(...)` | `unmatched_payments`<br>`audit_logs`<br>`audit_events` | Updates status in `unmatched_payments`; triggers verification audits in `audit_logs` and `audit_events`. |
| **Sales Deductions** | `revenueService.logMovement(...)` | `inventory_movements` | Updates current stock in `inventory`; inserts `sale` or `restock` event in `inventory_movements`. |
| **Operational Stock Adjustment** | `operationService.addInventoryMovement(...)` | `inventory_movements_v3`<br>`audit_logs`<br>`audit_events` | Saves stock correction to `inventory_movements_v3`; logs action to both `audit_logs` and `audit_events`. |
| **Invoice Reconciliation** | `revenueService.reconcilePaymentIntention(...)` | `payments`<br>`payment_audit`<br>`audit_events` | Creates certified transaction in `payments`; records audit history in `payment_audit` and `audit_events`. |
| **Dispute Filed** | `revenueService.createPaymentDispute(...)` | `payment_disputes`<br>`audit_events` | Creates discrepancy report in `payment_disputes`; fires security alert in `audit_events`. |
| **Dispute Resolved** | `revenueService.resolvePaymentDispute(...)` | `payment_disputes`<br>`audit_events` | Updates resolution state in `payment_disputes`; logs event to `audit_events`. |

---

### 2. CORE WRITE STRUCTURAL CODES (SUPABASE CLIENT INSIGHTS)

#### A. Comprehensive Auditing Timeline (`audit_events`)
```typescript
await supabase.from("audit_events").insert({
  id: `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
  event_type: event.event_type,
  event_category: event.event_category,
  actor_id: event.actor_id,
  actor_role: event.actor_role,
  resource_type: event.resource_type,
  resource_id: event.resource_id,
  resource_name: event.resource_name,
  before_state: event.before_state,
  after_state: event.after_state,
  notes: event.notes,
  source_module: event.source_module,
  session_id: event.session_id,
  shift_id: event.shift_id,
  created_at: new Date().toISOString()
});
```

#### B. Financial Forensics (`payment_audit`)
```typescript
await supabase.from("payment_audit").insert({
  id: toUUID(`audit-payment-${id}`),
  business_id: toUUID("biz-1"),
  payment_id: toUUID(paymentId),
  branch_id: toUUID("branch-1"),
  action: "reconcile",
  actor_user_id: toUUID("active-manager-sim"),
  note: notes,
  meta: { payment_reference: act.payment_reference, amount: act.amount, reconciled_at: new Date().toISOString() }
});
```

#### C. Operational Inventory Correction (`inventory_movements_v3`)
```typescript
await supabase.from("inventory_movements_v3").insert({
  id: `op-mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  inventory_id: inventoryId,
  quantity: quantity,
  movement_type: movementType,
  reason: reason,
  operator_id: operatorId,
  timestamp: new Date().toISOString()
});
```
