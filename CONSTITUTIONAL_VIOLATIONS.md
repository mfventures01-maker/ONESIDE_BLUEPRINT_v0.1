# CARSS CONSTITUTIONAL VIOLATIONS REPORT

This document lists all constitutional violations identified within the current repository during the forensic audit. Every deviation from the CARSS Wave 5 execution model increases security risks and must be addressed.

---

## 1. Direct Table Access in Services (Repository Bypass)
*   **Severity**: **CRITICAL**
*   **Constitutional Mandate**: All database actions must remain encapsulated within a formal Repository layer. Services are strictly forbidden from executing direct database queries.
*   **Violation Description**:
    Domain services (`revenueService.ts`, `operationService.ts`, and `auditService.ts`) import the raw `supabase` JS client and write inline table-level queries directly.
*   **Identified Leaks**:
    *   `revenueService.ts`: Direct reads and writes on `theme_settings`, `menu_categories`, `menu_items`, `inventory`, `inventory_movements`, `promotions`, `payment_intents`, `payments`, `payment_audit`, and `payment_disputes`.
    *   `operationService.ts`: Direct reads and writes on `audit_logs`, `shift_summaries`, `cash_movements`, `unmatched_payments`, and `inventory_movements_v3`.
    *   `auditService.ts`: Direct reads and writes on `audit_events` and anomalies.
*   **Operational Risk**: Direct database access bypasses repository interfaces, which duplicates queries and breaks offline-first state synchronization.

---

## 2. Direct Service Imports in React (API Gateway Bypass)
*   **Severity**: **CRITICAL**
*   **Constitutional Mandate**: React is a presentation layer only. It is strictly forbidden from importing database wrappers, repositories, or individual domain services. All user interactions must be routed through the unified CARSS API Gateway (`carssApi`) using standardized commands.
*   **Violation Description**:
    React pages import separate domain-specific service instances directly to resolve and mutate states.
*   **Identified Leaks**:
    *   `Dashboard.tsx` directly imports `CARSS_Revenue_Server` and `CARSS_Operations_Server`.
    *   `CustomerHomepage.tsx` directly imports `CARSS_Revenue_Server`.
    *   `AuditRoom.tsx` directly imports `ConstitutionalAuditService`.
    *   `Reports.tsx` directly imports `reportService`.
*   **Operational Risk**: Directly importing services couples the UI to domain implementations, which prevents central execution routing and breaks forensic logging.

---

## 3. Session Bypass in Authentication (Authority Bypass)
*   **Severity**: **HIGH**
*   **Constitutional Mandate**: Access to restricted panels must be authorized by a deterministic security challenge routed through the CARSS API Gateway and checked by the Authority Engine.
*   **Violation Description**:
    Credentials screens bypass authentication challenges using simulation helpers.
*   **Identified Leaks**:
    *   `CEOLogin.tsx` features a development dropdown that logs users in immediately using `simulateLogin()` without verifying passwords.
    *   `StaffLogin.tsx` verifies pins against a static local array instead of querying a database table.
    *   `Bootstrap.tsx` executes a mock bootstrap procedure that displays success without writing admin records to any table.
*   **Operational Risk**: Bypassing credentials verification exposes the application to unauthorized access.

---

## 4. Missing Schema Implementation (`carss_orders_unified`)
*   **Severity**: **HIGH**
*   **Constitutional Mandate**: The platform must map and synchronize all official tables registered in the CARSS Wave 5 Constitution.
*   **Violation Description**:
    The unified orders table `carss_orders_unified` is completely absent from active queries, repository adapters, and services.
*   **Operational Risk**: Lacking this table prevents multi-channel checkout order audits, which breaks compliance rules.

---

## 5. Client-Side Role Enforcement (No Server-Side Validation)
*   **Severity**: **MEDIUM**
*   **Constitutional Mandate**: Security constraints must be enforced server-side. Client-side state changes must not grant data access.
*   **Violation Description**:
    Role validation is conducted purely client-side via React conditional rendering and route guards.
*   **Operational Risk**: Session variables can be modified directly in the browser console, allowing unauthorized users to execute database mutations.
