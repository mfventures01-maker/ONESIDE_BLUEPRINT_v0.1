# PAYMENTS AUTHORITY MATRIX (WAVE 7.5)

This matrix defines the authoritative domain ownership, table mappings, validation guidelines, and structural keys for all core payment workflows within the ONESIDE / CARSS payment territory.

| Business Function / Domain | Authoritative Table | Single Source of Truth Columns | Mutation Authority | FK Authority Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **Payment Invoicing & Intents** | `payment_intents` | `id`, `expected_amount`, `payment_type`, `status`, `approval_status`, `external_reference` | Managers/Operators during checkout loops. | `payment_intents.order_id` → `reservations.id` |
| **Realized Payments Ledger** | `payments` | `id`, `business_id`, `amount_ngn`, `amount`, `method`, `status`, `reference`, `verified_by` | Auto-committed on payment reconciliation. | `payments.business_id` → `businesses.id`<br>`payments.branch_id` → `branches.id`<br>`payments.customer_id` → `customers.id` |
| **Electronic Remittances** | `unmatched_payments` | `id`, `amount`, `reference`, `sender`, `detected_at`, `status` | Automatic banking webhook triggers / manual posting fallback. | `unmatched_payments.matched_order_id` → `reservations.id` |
| **Payment Compliance Audits** | `payment_audit` | `id`, `business_id`, `payment_id`, `action`, `actor_user_id`, `note`, `meta`, `created_at` | Automatic logging triggered on reconciled transaction commit. | `payment_audit.payment_id` → `payments.id`<br>`payment_audit.business_id` → `businesses.id`<br>`payment_audit.branch_id` → `branches.id` |
| **Discrepancy & Dispute Resolution** | `payment_disputes` | `id`, `business_id`, `payment_id`, `dispute_reason`, `status`, `opened_by`, `resolved_by`, `resolution_note` | Open and resolve dispute workflows via Dashboard UI. | `payment_disputes.payment_id` → `payments.id`<br>`payment_disputes.business_id` → `businesses.id`<br>`payment_disputes.branch_id` → `branches.id` |

---

### CORE BUSINESS RULES & VALIDATIONS

1.  **Strict Transaction Traceability**: Every entry in the `payments` table must be backed by a valid, certified entry in `payment_intents`.
2.  **No Orphan Writes**: Auditing records (`payment_audit`) and dispute logs (`payment_disputes`) cannot exist without mapping to a valid transaction ID in `payments`.
3.  **Audit Trail Immutability**: Rows committed to the `payment_audit` table cannot be edited, updated, or removed under any circumstances.
4.  **Null-Safety Fallbacks**: Offline transactions are maintained in high-integrity encrypted local JSON strings and reconciled directly using UUID casting helper functions.
