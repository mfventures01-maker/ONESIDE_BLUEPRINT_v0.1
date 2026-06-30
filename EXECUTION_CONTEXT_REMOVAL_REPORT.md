# EXECUTION_CONTEXT_REMOVAL_REPORT.md

## 1. Context Removal Summary
Under the CARSS Constitution, repositories are pure persistence boundaries. They must not make assumptions, inspect the browser environment, look up active sessions, read cookies, query `localStorage` directly, or resolve active operator contexts internally.

Every execution context constraint must be passed explicitly into the repository method signature as a parameter.

---

## 2. Identified Context Lookups to Remove

| Repository | Method / Location | Discovered Session Lookup Code | Hardening Action |
| :--- | :--- | :--- | :--- |
| `BookingRepository` | `createBooking` | `OfflineStorage.getItem("carss_user_session")` | Remove internal session JSON parsing. Introduce `executionContext: ExecutionContext` parameter. |
| `TransactionRepository` | `getBusinessId` | `OfflineStorage.getItem("carss_active_business_id")` and `"carss_user_session"` | Remove `getBusinessId` entirely. Inject `businessId` via `executionContext` or directly as arguments. |
| `ShiftRepository` | `getBusinessId` | `OfflineStorage.getItem("carss_active_business_id")` and `"carss_user_session"` | Remove `getBusinessId` entirely. Inject `businessId` via method parameters. |

---

## 3. The Unified CARSS Execution Context Model

To cleanly handle parameters, we will declare a standardized, robust `ExecutionContext` interface in `src/types.ts`:

```typescript
export interface ExecutionContext {
  businessId: string;
  branchId: string;
  departmentId: string | null;
  operatorId: string;
  role: string;
  shiftId: string | null;
  requestId: string;
}
```

Every repository method requiring context will receive this standard object or specific required parameters.

---

## 4. Constitutional Verdict
**PROCEED TO CONTEXT STRIPPING**
No repository will retain any reference to session lookup, window, or local storage.
