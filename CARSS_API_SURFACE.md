# CARSS API SURFACE CATALOGUE

This catalogue documents every exported system service API within the CARSS codebase, defining their functional signatures, expected parameters, returns, and structural role within the application.

---

## 1. CARSS API Core Gateway
**Location**: `src/services/carssApi.ts`
Unified mock API endpoint designed as the single programmatic gateway for React Presentation layer integration.

### `carssApi.bootstrap(payload)`
*   **Purpose**: Bootstraps the system by provisioning the initial SuperAdmin account credential.
*   **Inputs**:
    ```typescript
    interface BootstrapPayload {
      fullName: string;
      email: string;
      password?: string;
      confirmPassword?: string;
    }
    ```
*   **Outputs**: `Promise<CarssResult>`
    ```typescript
    interface CarssResult {
      success: boolean;
      message: string;
      data?: any;
      error?: string;
    }
    ```

---

## 2. CARSS Revenue Sub-Server
**Location**: `src/services/revenueService.ts`
Coordinates point-of-sale menus, reservations, physical inventories, promotional campaigns, payment disputes, and financial checkouts.

### `CARSS_Revenue_Server.getSavedTheme()`
*   **Purpose**: Fetches the active system visual branding configuration.
*   **Inputs**: None.
*   **Outputs**: `Promise<ThemeType>`

### `CARSS_Revenue_Server.saveTheme(theme)`
*   **Purpose**: Commits a visual branding configuration to persistent storage.
*   **Inputs**: `theme: ThemeType`
*   **Outputs**: `Promise<void>`

### `CARSS_Revenue_Server.getCategories()`
*   **Purpose**: Retrieves all menu classification segments.
*   **Inputs**: None.
*   **Outputs**: `Promise<MenuCategory[]>`

### `CARSS_Revenue_Server.getMenuItems()`
*   **Purpose**: Fetches all available storefront menu items.
*   **Inputs**: None.
*   **Outputs**: `Promise<MenuItem[]>`

### `CARSS_Revenue_Server.getInventory()`
*   **Purpose**: Fetches active inventory stock levels and alert parameters.
*   **Inputs**: None.
*   **Outputs**: `Promise<InventoryItem[]>`

### `CARSS_Revenue_Server.updateItemInventory(menuItemId, amountToDeduct)`
*   **Purpose**: Deducts units from item inventory mapping to track immediate sales.
*   **Inputs**: `menuItemId: string`, `amountToDeduct: number`
*   **Outputs**: `Promise<void>`

### `CARSS_Revenue_Server.restockItemInventory(menuItemId, amountToAdd)`
*   **Purpose**: Adds stock units to specific item allocations.
*   **Inputs**: `menuItemId: string`, `amountToAdd: number`
*   **Outputs**: `Promise<void>`

### `CARSS_Revenue_Server.logMovement(invItemId, change, type, notes)`
*   **Purpose**: Chronologically logs standard stock transfers, usage, restock, or waste.
*   **Inputs**: `invItemId: string`, `change: number`, `type: "sale" | "restock" | "waste" | "reconciliation"`, `notes: string`
*   **Outputs**: `Promise<void>`

### `CARSS_Revenue_Server.getPromotions()`
*   **Purpose**: Retrieves all running promotional campaigns.
*   **Inputs**: None.
*   **Outputs**: `Promise<Promotion[]>`

### `CARSS_Revenue_Server.getReservations()`
*   **Purpose**: Fetches table, snooker, VIP, and event bookings.
*   **Inputs**: None.
*   **Outputs**: `Promise<Reservation[]>`

### `CARSS_Revenue_Server.placeReservation(res)`
*   **Purpose**: Registers a new customer booking and compiles verification vouchers.
*   **Inputs**: `res: Omit<Reservation, "id" | "ticket_code" | "status" | "created_at">`
*   **Outputs**: `Promise<Reservation>`

### `CARSS_Revenue_Server.updateReservationStatus(id, status)`
*   **Purpose**: Modifies the operational status of an active reservation.
*   **Inputs**: `id: string`, `status: "pending" | "confirmed" | "cancelled"`
*   **Outputs**: `Promise<void>`

### `CARSS_Revenue_Server.getPaymentIntentions()`
*   **Purpose**: Fetches transactional intentions triggered during checkout or pre-booking.
*   **Inputs**: None.
*   **Outputs**: `Promise<PaymentIntention[]>`

### `CARSS_Revenue_Server.generatePaymentIntention(intent)`
*   **Purpose**: Instantiates a secure payment target.
*   **Inputs**: `intent: Omit<PaymentIntention, "id" | "payment_reference" | "status" | "created_at">`
*   **Outputs**: `Promise<PaymentIntention>`

### `CARSS_Revenue_Server.reconcilePaymentIntention(id, notes)`
*   **Purpose**: Harmonizes payment intents with physical point-of-sale transactions.
*   **Inputs**: `id: string`, `notes: string`
*   **Outputs**: `Promise<void>`

### `CARSS_Revenue_Server.getPaymentDisputes()`
*   **Purpose**: Retrieves contested card, cash, or bank transfers.
*   **Inputs**: None.
*   **Outputs**: `Promise<PaymentDispute[]>`

### `CARSS_Revenue_Server.createPaymentDispute(paymentId, reason)`
*   **Purpose**: Files a payment discrepancy or customer complaint.
*   **Inputs**: `paymentId: string`, `reason: string`
*   **Outputs**: `Promise<void>`

### `CARSS_Revenue_Server.resolvePaymentDispute(id, notes)`
*   **Purpose**: Closes an unresolved payment dispute.
*   **Inputs**: `id: string`, `notes: string`
*   **Outputs**: `Promise<void>`

---

## 3. CARSS Operations Sub-Server
**Location**: `src/services/operationService.ts`
Manages system operator shifts, cash movements, point-of-sale reconciliations, and bank transfers.

### `CARSS_Operations_Server.emitAudit(log)`
*   **Purpose**: Commits a granular backoffice activity log.
*   **Inputs**: `log: Omit<AuditLog, "id" | "timestamp">`
*   **Outputs**: `Promise<void>`

### `CARSS_Operations_Server.getAuditLogs()`
*   **Purpose**: Retrieves recorded backoffice log entries.
*   **Inputs**: None.
*   **Outputs**: `Promise<AuditLog[]>`

### `CARSS_Operations_Server.getShifts()`
*   **Purpose**: Lists historical shift journals.
*   **Inputs**: None.
*   **Outputs**: `Promise<Shift[]>`

### `CARSS_Operations_Server.getActiveShift()`
*   **Purpose**: Resolves the single open operator shift.
*   **Inputs**: None.
*   **Outputs**: `Promise<Shift | null>`

### `CARSS_Operations_Server.openShift(operatorId, role, openingFloat)`
*   **Purpose**: Opens an active operator shift.
*   **Inputs**: `operatorId: string`, `role: string`, `openingFloat: number`
*   **Outputs**: `Promise<Shift>`

### `CARSS_Operations_Server.closeShift(shiftId, closingAmount, operatorId, role)`
*   **Purpose**: Concludes an active shift, committing expected revenue and calculating cash variances.
*   **Inputs**: `shiftId: string`, `closingAmount: number`, `operatorId: string`, `role: string`
*   **Outputs**: `Promise<ShiftSummary>`

### `CARSS_Operations_Server.getCashMovements(shiftId?)`
*   **Purpose**: Fetches shift balance flows (cash-in, cash-out, corrections, and adjustments).
*   **Inputs**: `shiftId?: string`
*   **Outputs**: `Promise<CashMovement[]>`

### `CARSS_Operations_Server.addCashMovement(...)`
*   **Purpose**: Records a shift cash movement ledger.
*   **Inputs**: `amount: number`, `type: string`, `notes: string`, `shiftId: string`, `operatorId: string`, `role: string`
*   **Outputs**: `Promise<CashMovement>`

### `CARSS_Operations_Server.getPOSTransactions()`
*   **Purpose**: Fetches electronic card and POS terminal logs.
*   **Inputs**: None.
*   **Outputs**: `Promise<POSTransaction[]>`

### `CARSS_Operations_Server.addPOSTransaction(...)`
*   **Purpose**: Logs a raw terminal swipe.
*   **Inputs**: `reference: string`, `amount: number`, `terminalId: string`, `operatorId: string`, `role: string`
*   **Outputs**: `Promise<POSTransaction>`

### `CARSS_Operations_Server.reconcilePOSTransaction(reference, operatorId, role)`
*   **Purpose**: Verifies and reconciles a pending card transaction.
*   **Inputs**: `reference: string`, `operatorId: string`, `role: string`
*   **Outputs**: `Promise<void>`

### `CARSS_Operations_Server.getBankTransfers()`
*   **Purpose**: Retrieves bank direct-deposit receipts.
*   **Inputs**: None.
*   **Outputs**: `Promise<BankTransfer[]>`

### `CARSS_Operations_Server.addBankTransfer(...)`
*   **Purpose**: Initiates a bank transfer check.
*   **Inputs**: `reference: string`, `amount: number`, `payerName: string`, `operatorId: string`, `role: string`
*   **Outputs**: `Promise<BankTransfer>`

### `CARSS_Operations_Server.verifyBankTransfer(reference, operatorId, role)`
*   **Purpose**: Validates a bank transfer receipt.
*   **Inputs**: `reference: string`, `operatorId: string`, `role: string`
*   **Outputs**: `Promise<void>`

---

## 4. Constitutional Audit Service
**Location**: `src/services/auditService.ts`
Handles chronological event logging, tamper-proof audit trails, and automated anomaly detection.

### `ConstitutionalAuditService.emitEvent(event)`
*   **Purpose**: Appends a system security audit event log.
*   **Inputs**: `event: Omit<AuditEvent, "id" | "created_at">`
*   **Outputs**: `Promise<AuditEvent>`

### `ConstitutionalAuditService.getTimeline(filters?)`
*   **Purpose**: Fetches system event feeds with optional filters.
*   **Inputs**: `filters?: { limit?: number; category?: string; actor?: string }`
*   **Outputs**: `Promise<AuditEvent[]>`

### `ConstitutionalAuditService.getResourceHistory(resourceType, resourceId)`
*   **Purpose**: Tracks mutation paths for a specific entity ID.
*   **Inputs**: `resourceType: string`, `resourceId: string`
*   **Outputs**: `Promise<AuditEvent[]>`

### `ConstitutionalAuditService.getOperatorHistory(operatorId)`
*   **Purpose**: Logs action chronologies for a given staff ID.
*   **Inputs**: `operatorId: string`
*   **Outputs**: `Promise<AuditEvent[]>`

### `ConstitutionalAuditService.detectAnomalies()`
*   **Purpose**: Detects critical operational errors, security violations, and cash variances.
*   **Inputs**: None.
*   **Outputs**: `Promise<AnomalyLog[]>`

---

## 5. Pin Verification Service
**Location**: `src/services/pinService.ts`
Enforces localized operator credentials challenge.

### `verifyPin(operatorId, pin)`
*   **Purpose**: Authorizes access to the POS Staff Terminal.
*   **Inputs**: `operatorId: string`, `pin: string`
*   **Outputs**: `OperatorProfile | null`
