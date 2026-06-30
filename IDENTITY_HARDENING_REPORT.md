# IDENTITY_HARDENING_REPORT.md

## 1. Executive Summary
Under the CARSS Wave 5 Constitution, all production and operational identities must originate exclusively from the Supabase Single Source of Truth (SSOT) via parameter-driven execution contexts. Hardcoding keys, tokens, placeholder identifiers, or synthetic fallback identities inside repository definitions introduces architectural drift and violates isolation boundaries.

This report lists all discovered hardcoded identities across the CARSS persistence repositories and defines the hardening targets for Phase 1.2.

---

## 2. Discovered Hardcoded Identities & Target Locations

| Identifier / Constant | Repository | Line Number | Category | Core Constitutional Impact |
| :--- | :--- | :---: | :--- | :--- |
| `"biz-1"` | `BookingRepository.ts` | 58 | Business ID | Hardcoded business profile assignment for desk/table bookings. |
| `"biz-1"` | `TransactionRepository.ts` | 42 | Business ID | Hardcoded default business profile lookup on failure. |
| `"biz-1"` | `ShiftRepository.ts` | 44 | Business ID | Hardcoded default business lookup inside shift initialization. |
| `"biz-1"` | `PaymentRepository.ts` | 237 | Business ID | Hardcoded fallback business ID in dispute creation. |
| `"branch-1"` | `PaymentRepository.ts` | 85 | Branch ID | Hardcoded default branch ID for online payment intent inserts. |
| `"branch-1"` | `PaymentRepository.ts` | 238 | Branch ID | Hardcoded default branch ID for dispute inserts. |
| `"org-1"` | `PaymentRepository.ts` | 84 | Org ID | Hardcoded organization uuid. |
| `"staff-1"` | `PaymentRepository.ts` | 86 | Staff ID | Hardcoded default staff member uuid. |
| `"reservation-dummy"` | `PaymentRepository.ts` | 83 | Reservation ID | Fallback UUID for order link when reservation_id is missing. |
| `"shift-dummy"` | `PaymentRepository.ts` | 87 | Shift ID | Fallback UUID for active shift linkage. |
| `"active-manager-sim"` | `PaymentRepository.ts` | 164 | Staff / Manager ID | Hardcoded manager simulation actor for payment intents approval. |
| `"active-manager-sim"` | `PaymentRepository.ts` | 240 | Staff / Manager ID | Hardcoded manager simulation actor for disputes. |
| `"active-manager-sim"` | `PaymentRepository.ts` | 258 | Staff / Manager ID | Hardcoded dispute resolution actor. |
| `"active-manager-sim"` | `PaymentRepository.ts` | 374 | Staff / Manager ID | Hardcoded bank transfer verification manager. |
| `"629000ff-8a27-46e3-9eba-b603207565af"` | `ShiftRepository.ts` | 52 | Branch ID | Hardcoded canonical Main Deck Lounge branch UUID. |
| `"db6cda1c-635d-4f6e-a954-3bff0330780b"` | `ShiftRepository.ts` | 53 | Department ID | Hardcoded department UUID for shift initialization. |
| `"TERM-01"` | `TransactionRepository.ts` | 57 | Terminal ID | Hardcoded fallback terminal ID for POS transaction mapping. |
| `"STAFF-01"`, `"STAFF-99"`, `"MGR-01"` | `OfflineStorage.ts` | 41-43 | Staff IDs | Hardcoded offline staff seeds. |
| `DEFAULT_BUSINESS`, `DEFAULT_BRANCH` | `BusinessRepository.ts` | 12-13, 41-42, 130-131 | Entity Objects | Hardcoded static fallback profile structures for offline mode. |

---

## 3. Hardening Remediation Strategy
1. **Dynamic Parameter Passing**: Inject the entire execution context (including `businessId`, `branchId`, `staffId`, `departmentId`, `operatorId`, `role`, and `shiftId`) as typed repository parameters.
2. **Context-Agnostic Boundaries**: Strip all internal context resolvers, defaults, and local JSON user session parsing from within the repositories.
3. **Mappers Relocation**: Migrate all entity-to-record conversion mapping routines out of repository boundaries.
4. **Empty-State Fail-Safe**: Ensure offline queries return a clean, empty state instead of generating synthetic identities if no real synchronized DB data exists.

---

## 4. Constitutional Verdict
**PROCEED TO IMPLEMENTATION**
All identified hardcoded identities have been localized and cataloged.
