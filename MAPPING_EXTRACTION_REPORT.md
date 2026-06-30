# MAPPING_EXTRACTION_REPORT.md

## 1. Mapper Separation Architecture
In compliance with Rule 3 of the CARSS Wave 5 Constitutional Hardening, all DTO transformation, database row mapping, entity conversion, and format normalization logic must be completely removed from the persistence repositories. 

The repositories will handle purely queries and inserts using mapped entities, while a dedicated `/src/mappers` directory will encapsulate the structural conversions.

---

## 2. Extraction Catalog

| Source Repository | Extraction Targets | New Target Module |
| :--- | :--- | :--- |
| `BookingRepository` | `mapBookingToReservation`, `mapReservationToBooking` | `src/mappers/BookingMapper.ts` |
| `TransactionRepository` | `mapLegacyToConstitutional`, `mapConstitutionalToLegacy` | `src/mappers/TransactionMapper.ts` |
| `ShiftRepository` | `mapShiftToConstitutional`, `mapConstitutionalToLegacy` | `src/mappers/ShiftMapper.ts` |
| `StaffRepository` | DB Row Mapping for Staff | `src/mappers/StaffMapper.ts` |
| `PaymentRepository` | DB Row Mapping for Payment Intents, Disputes, Transfers | `src/mappers/PaymentMapper.ts` |
| `CustomerRepository` | DB Row Mapping for Customers | `src/mappers/CustomerMapper.ts` |
| `InventoryRepository` | DB Row Mapping for Inventory, Movements | `src/mappers/InventoryMapper.ts` |

---

## 3. Implementation Plan
1. Create a dedicated `src/mappers` directory.
2. Implement clean, robust, typed conversion methods in independent mapper files.
3. Import the mappers in repositories for serialization/deserialization.
4. Ensure no mapping operations occur natively in repository code blocks.

---

## 4. Constitutional Verdict
**PROCEED TO MAPPER EXTRACTION**
All mapping logic is isolated from the persistence boundary.
