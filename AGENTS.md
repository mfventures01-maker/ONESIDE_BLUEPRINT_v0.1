# CARSS Wave 5 Constitution: Registry & Schema Compliance Guidelines

This document establishes the official certified registries and required table structures under the CARSS Wave 5 Constitution. All future operations, code modifications, and feature deployments must adhere strictly to the schema dimensions, entity constraints, and target record counts defined below.

## 1. CARSS Constitutional Table Registries & Counts

The following table registries represent the authorized state architecture for the Wave 5 territory. Every generation and system interface must conform to these registered entities:

| Table Name | Target Count | Operational Territory | Core Constitutional Description |
| :--- | :---: | :---: | :--- |
| **`bookings`** | 13 | Revenue / Reservations | Verified reservation vouchers, table, event, and lounge books. |
| **`businesses`** | 10 | Corporate Registry | Canonical profiles of certified operational units and branches. |
| **`carss_orders_unified`** | 10 | Unified Operations | Consolidated multi-channel checkout orders across territories. |
| **`carss_shift_core`** | 11 | Shift Operations | High-integrity shift timeline, status, and floating balance ledgers. |
| **`customers`** | 7 | Identity / Profiling | Standard registered consumer identities and VIP privileges. |
| **`inventory`** | 18 | Resource Planning | Operational stock levels, alert thresholds, and replenishment rules. |
| **`payment_intents`** | 17 | Payments Ledger | Secure payment intentions triggered during checkout or pre-booking. |
| **`payments`** | 24 | Financial Ledger | Reconciled/verified transactions mapped to payments and bank transfers. |
| **`transactions`** | 19 | POS Reconciliation | Point-of-Sale reference logs and automated/manual clearance states. |

## 2. Structural Principles & Constraints

1. **Strict Literal Naming**: Never bypass these table name mappings or invent custom/branded synonyms. Use standard, descriptive, literal keys for these tables.
2. **Durable Cloud Persistence**: Align all storage policies with secure, cloud-hosted structures (e.g. Supabase, PostgreSQL) to ensure no data loss between sessions or cache purges.
3. **Forensic Lineage Tracing**: Maintain a 1:1 lineage trace for every aggregated metric shown in dashboards or reporting interfaces, linking them explicitly to these registered tables.
4. **Zero AI-Slop / Professional Composure**: Do not clutter page margins or rails with unrequested telemetry logs or system-internal coordinates. Maintain a clean, high-contrast, professional aesthetic.
