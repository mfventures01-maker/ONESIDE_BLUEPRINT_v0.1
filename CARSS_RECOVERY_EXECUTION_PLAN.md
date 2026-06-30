# CARSS RECOVERY EXECUTION PLAN

This recovery plan provides an ordered, phased roadmap to resolve the identified constitutional violations and harmonize the CARSS Platform Console with the Wave 5 execution model.

---

## Phase 1: Consolidated API Gateway Integration (UI Isolation)
*   **Objective**: Isolate the React UI from database schemas and business logic by routing all presentation queries and mutations through a single gateway.
*   **Execution Steps**:
    1.  Extend `carssApi` (`src/services/carssApi.ts`) to serve as the single programmatic gateway for all domain operations.
    2.  Implement a unified command execution dispatcher inside the gateway:
        ```typescript
        export const carssApi = {
          execute: async <T>(command: string, payload?: any): Promise<CarssResult<T>> => { ... }
        };
        ```
    3.  Refactor page components (`Dashboard.tsx`, `CustomerHomepage.tsx`, `Reports.tsx`, and `AuditRoom.tsx`) to remove direct service imports (such as `CARSS_Revenue_Server`). Replace them with standard gateway executions:
        ```typescript
        // Before:
        const data = await CARSS_Operations_Server.getShifts();
        // After:
        const result = await carssApi.execute("getShifts");
        ```

---

## Phase 2: Repository and Adapter Extraction (Persistence Isolation)
*   **Objective**: Remove direct database queries from domain services by encapsulating all persistence operations inside specialized Repository Adapters.
*   **Execution Steps**:
    1.  Extract direct table queries out of `revenueService.ts`, `operationService.ts`, and `auditService.ts`.
    2.  Build specialized adapters for all remaining database entities:
        *   `InventoryAdapter`: Manages stock depletions, restocks, and movements.
        *   `PaymentAdapter`: Manages payment intentions, audit trails, and disputes.
        *   `AuditAdapter`: Manages system security events.
    3.  Refactor domain services to only access the database through these repository interfaces.

---

## Phase 3: Authority Engine Integration (Security Isolation)
*   **Objective**: Replace client-side routing guards and simulation shortcuts with server-verified session checks.
*   **Execution Steps**:
    1.  Implement a formal `AuthorityEngine` to validate user roles, session signatures, and permissions.
    2.  Remove simulated login options (such as dropdown-based logins in `CEOLogin.tsx` and static PIN lists in `StaffLogin.tsx`).
    3.  Implement a database-backed PIN validation query to verify active operator roles against secure database profiles.

---

## Phase 4: Schema Alignment and Final Synchronization
*   **Objective**: Map and synchronize all database entities registered in the CARSS Wave 5 Constitution.
*   **Execution Steps**:
    1.  Create database schemas, mappings, and adapter logic for the missing `carss_orders_unified` table.
    2.  Implement mapping logic for the `businesses` table to replace static branch ID references with dynamic profiles.
    3.  Run the validation suite (`verify-carss-reporting.ps1`) to confirm the updated codebase passes all compliance checks.
