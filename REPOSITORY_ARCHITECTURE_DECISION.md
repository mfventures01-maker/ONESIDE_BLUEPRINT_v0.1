# CARSS Architecture Decision: Repository Inventory & Responsibility Alignment

## 1. Architectural Context
Under the CARSS Wave 5 Constitution, strict modularity and high-fidelity data structures must guide our architectural design. While a minimal system model might suggest grouping resources, the scale of CARSS operations requires distinct repository separations to maintain the Single Source of Truth (SSOT).

## 2. Directory Inventory & Table Ownership Matrix
CARSS actively maintains **10 specialized repositories** to manage persistent state:

| Repository Name | Certified Table Mappings | Boundary Context |
| :--- | :--- | :--- |
| **`AuditRepository`** | `audit_events`, `audit_logs` | Security trails and ledger audit events |
| **`BookingRepository`** | `bookings` | Desk, table, and lounge reservations |
| **`BusinessRepository`** | `businesses`, `branches` | Corporate profiles and workspace layout nodes |
| **`CustomerRepository`** | `customers` | Certified identities and consumer details |
| **`InventoryRepository`** | `inventory`, `inventory_movements`, `inventory_movements_v3` | Resource stocks, thresholds, and operational tracking |
| **`MenuRepository`** | `menu_categories`, `menu_items`, `promotions`, `theme_settings` | Presentation resources and system theme styling |
| **`PaymentRepository`** | `payment_intents`, `payments`, `payment_audit`, `payment_disputes`, `unmatched_payments` | Financial ledger tracking, intents, and bank transfers |
| **`ShiftRepository`** | `carss_shift_core` | Shift timeline, state tracking, and variance audits |
| **`StaffRepository`** | `staff`, `memberships` | Internal staff identities, membership scopes, and roles |
| **`TransactionRepository`** | `transactions` | Point-of-Sale (POS) reconciliation ledger |

## 3. Justification for Repository Separation
Consolidating these 10 areas would violate the **Single Responsibility Principle (SRP)** and result in bloated file sizes prone to generation cutoff.
- **Transaction vs. Payment Separation**: Payments handle the pre-settlement intent and bank transfer reconciliation flows, whereas Transactions track post-execution Point-of-Sale reference entries.
- **Staff vs. Business Separation**: Keeping `StaffRepository` independent of `BusinessRepository` allows staff profiling and PIN verification to scale cleanly without carrying physical node hierarchy logic.
- **Menu vs. Inventory Separation**: Menu resources manage consumer-facing catalogs, pricing, and active promotions. Inventory tracks stock weights, cold-store locations, and automatic thresholds.

## 4. Constitutional Verdict
The 10-repository matrix is fully certified, preventing architectural drift and guaranteeing high modularity.
