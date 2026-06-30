# CARSS Wave 5 Constitutional ARCHITECTURAL_DEFECT_DISCOVERY.md

Under the immutable CARSS Constitution, this discovery document acts as a complete audit of the codebase to expose and locate every structural and architectural defect before executing any code changes.

---

## 1. Defect Audit and Locations

### DEFECT 1: Static Authentication Data
- **Location 1:** `/src/repositories/StaffRepository.ts` (Lines 19-23)
  - **Code:** `const INITIAL_STAFF: StaffMember[] = [...]`
  - **Violation:** Hardcoded seed operator data and role assignments exist directly inside a canonical repository module, violating clean storage separation.
- **Location 2:** `/src/services/pinService.ts` (Lines 15-34)
  - **Code:** `const CERTIFIED_STAFF_PROFILES: Record<string, StaffProfile> = {...}`
  - **Violation:** Hardcoded staff identities, pins, and roles are defined in a legacy pin service instead of resolving deterministically via repositories.

### DEFECT 2: StaffRepository Boundary Violation
- **Location:** `/src/repositories/StaffRepository.ts` (Lines 181-218)
  - **Code:** `getSession()`, `onAuthStateChange()`, `signOut()`
  - **Violation:** The repository manages active user session subscription and auth lifecycle, violating the Single Responsibility principle. Only persistence should live in the repository layer.

### DEFECT 3: LocalStorage Coupling
- **Location:** All files under `/src/repositories/`
  - **Code:** Direct invocations of `localStorage.getItem` and `localStorage.setItem` for localized caching and offline fallback state.
  - **Violation:** Repositories are tightly coupled to the DOM-specific `localStorage` API, limiting testability and violating clean boundaries.

### DEFECT 4: Repository Inventory Drift
- **Location:** `/src/repositories/`
  - **Files:** `BookingRepository.ts`, `MenuRepository.ts`, `ShiftRepository.ts`, `TransactionRepository.ts`
  - **Violation:** These repositories are not in the baseline set specified by the initial CARSS Constitution. A formal reconciliation and decision document is required.

### DEFECT 5 & 6: Repository Contract Consistency & Exception Handling
- **Location:** `/src/repositories/`
  - **Violation:** Checking for raw un-wrapped database objects, potentially leaking platform-specific errors or empty/null values without a clean `CarssResult<T>` envelope.

### DEFECT 7: Authentication Leakage
- **Location:** `/src/state/auth/AuthProvider.tsx`
  - **Violation:** Auth state management binds directly to `StaffRepository` auth helper routines rather than accessing a dedicated, clean, non-UI authentication boundary suitable for future Authority Engine integration.

### DEFECT 8: Offline Boundary
- **Location:** Entire codebase (currently missing)
  - **Violation:** Local caching and offline persistence strategies are scattered ad-hoc throughout individual files without a clean, unified offline storage abstraction.

---

## 2. Proposed Constitutional Corrections

1. **Delete `pinService.ts`**: Shift-operator credentials verification must be handled by `StaffRepository.verifyPin(...)`.
2. **Move Hardcoded Seeds to Offline Abstraction**: Relocate fallback staff data to a dedicated, clearly isolated offline provider module at `/src/offline/OfflineStorage.ts` and `/src/offline/OfflineProvider.ts`.
3. **Build dedicated Auth Boundary**: Create `/src/auth/AuthBoundary.ts` which encapsulates all `supabase.auth` operations, keeping them entirely out of both React components/contexts and the persistence repositories.
4. **Create Offline Boundary**: Implement `/src/offline/OfflineStorage.ts` to manage all localStorage caching. Let all repositories invoke `OfflineStorage` rather than `localStorage` directly.
5. **Reconciliation & Certification**: Verify that no direct `localStorage` or `supabase.auth` calls leak into forbidden layers, and confirm build and TypeScript status.
