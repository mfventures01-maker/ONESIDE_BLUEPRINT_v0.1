# SUPABASE LEAKAGE FORENSIC REPORT

This forensic audit locates, catalogs, and classifies every occurrence of the word **"supabase"** across the CARSS repository. Under the CARSS Constitution, the Supabase client and any SQL/database-level operations must remain fully encapsulated within the Adapter/Repository boundary. React or presentation layers are strictly forbidden from directly importing or interacting with the database client.

---

## 1. Allowed Infrastructural Components

These locations are certified as **ALLOWED** because they represent standard system architecture connectors or metadata representations:

### A. Infrastructure Connector
*   **Location**: `src/lib/supabaseClient.ts`
*   **Code Evidence**:
    ```typescript
    import { createClient } from "@supabase/supabase-js";
    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```
*   **Classification Justification**: This is the core connection bootstrap. It is allowed because it establishes the primary connection wrapper without leaking data schemas or business transactions directly to the React layer.

### B. Certified Repository-Adapters
*   **Locations**:
    *   `src/adapters/BookingAdapter.ts`
    *   `src/adapters/ShiftAdapter.ts`
    *   `src/adapters/TransactionAdapter.ts`
*   **Code Evidence**:
    ```typescript
    import { supabase } from "../lib/supabaseClient";
    // standard repository operations:
    await supabase.from("bookings").insert(bookingData)...
    ```
*   **Classification Justification**: These adapters act as the official repository boundary, translating domain models into concrete database-level mappings. They are constitutional because they isolate query execution and prevent database tables from leaking outside of repositories.

### C. Pure UI Descriptive Text & Branding Markup
*   **Locations**:
    *   `src/pages/auth/Bootstrap.tsx` (Renders visual logos and onboarding texts)
    *   `src/pages/CustomerHomepage.tsx` (Renders connectivity status indicators)
    *   `src/pages/Reports.tsx` (Prints formal metadata query lineage statements for auditors)
*   **Classification Justification**: These instances represent static strings, label elements, icon attributes, or copyable SQL guides. Because no actual Supabase API libraries or client objects are imported, instantiated, or invoked on these pages, they are fully constitutional.

---

## 2. Constitutional Leakage Violations

These files contain **CONSTITUTIONAL VIOLATIONS** because they bypass the required boundaries and expose direct Supabase API commands outside of authorized Adapters/Repositories:

### A. Bypass in Domain Services
*   **Locations**:
    *   `src/services/revenueService.ts`
    *   `src/services/operationService.ts`
    *   `src/services/auditService.ts`
*   **Description of Leakage**:
    These domain-level business services directly import the `supabase` client and write inline table queries (such as `supabase.from("inventory").select("*")`, `supabase.from("payments").insert(...)`, and `supabase.from("audit_events")`).
*   **Why this is a Violation**:
    Under the CARSS Constitution, services must only query specialized Adapters (or Repositories). Bypassing the adapter layer and writing inline table-level SQL adapters in the service layer breaks structural encapsulation and complicates offline-first sync synchronization.

### B. Direct Client Auth binding in React Context
*   **Location**: `src/state/auth/AuthProvider.tsx`
*   **Description of Leakage**:
    This state provider directly handles session checking and auth events using `supabase.auth.getSession()`, `supabase.auth.onAuthStateChange()`, and `supabase.auth.signOut()`.
*   **Why this is a Violation**:
    React presentation state is directly bound to a third-party client authentication engine instead of invoking unified authentication methods through a CARSS API Gateway or Authority Engine. This leaks vendor-specific SDK calls directly into React state-management wrappers.

---

## 3. Summary of Compliance Status

*   **Total Locations Checked**: 11 Files
*   **Allowed Locations**: 6 Files
*   **Constitutional Violations**: 4 Files
*   **Leakage Vector Severity**: **HIGH**. Direct table interactions have leaked into domain business services, bypassing the Repository boundary.
