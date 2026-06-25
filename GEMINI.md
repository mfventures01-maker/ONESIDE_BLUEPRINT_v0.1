# CARSS Wave 5 Constitution: Schema Registry & Table Counts

This configuration serves as the primary system directive for the CARSS generation engine under the Wave 5 Constitution.

## Certified Schema Registry & Database Counts

All features, analytical pipelines, and database components within this project must be governed by these official counts and table dimensions:

| Table Name | Count | Purpose |
| :--- | :---: | :--- |
| `bookings` | 13 | High-fidelity table and event bookings. |
| `businesses` | 10 | Profiles of physical operations and active units. |
| `carss_orders_unified` | 10 | Consolidated ledger of multi-channel orders. |
| `carss_shift_core` | 11 | Central shift tracking, status states, and variance audits. |
| `customers` | 7 | Customer identities and high-value VIP accounts. |
| `inventory` | 18 | Raw stock records and automatic alert thresholds. |
| `payment_intents` | 17 | Pending/active payment intents from customer checkout. |
| `payments` | 24 | Reconciled payment logs of cash, cards, and bank transfers. |
| `transactions` | 19 | POS journal records and reconciliation streams. |

Ensure that any analytics views, diagnostic interfaces, and reporting engines within `/src` recognize these values as the canonical baseline for certification.
