# PAYMENTS DRIFT REPORT (WAVE 7.5)

This forensic drift report documents all discrepancies, legacy pathways, field mismatches, and authority overlaps identified and resolved during the Wave 7.5 Payment Territory Harmonization audit.

---

### 1. LEGACY TABLE EXPULSION & REALIGNMENT

*   **Identified Drift**: Codebase originally targeted unregistered table names `payment_intentions` and `bank_transfers`.
*   **Constitutional Schema Target**: `payment_intents` and `unmatched_payments`.
*   **Resolution Status**: **FIXED**.
    *   All queries, update routines, and insert payloads targeting `payment_intentions` have been aligned to `payment_intents`.
    *   All bank transfer routines targeting `bank_transfers` have been mapped and re-pointed to `unmatched_payments`.

---

### 2. LOCAL-ONLY STORES AND SHADOW RECORDS

*   **Identified Drift**: A client-side store `carss_payment_intentions` served as a local-only cache for offline-first resilience.
*   **Constitutional Schema Target**: Ensure local stores serve purely as transient fallbacks and synchronization buffers, never as alternative sources of truth.
*   **Resolution Status**: **ALIGNED**.
    *   Local storage is configured to act as a *write-through, read-fallback buffer*. When online state is present, mutations are dispatched immediately to Supabase and verified.

---

### 3. AMOUNT FIELD FORENSIC INVESTIGATION

*   **Drift Analysis**: The database schema contains both `amount_ngn` (BIGINT) and `amount` (NUMERIC) columns inside the `payments` table.
*   **Reads**: Reports and analytic aggregations (`reportService.ts`) read standard currency values via `sum(amount)`.
*   **Writes**: `revenueService.ts` writes to BOTH fields simultaneously:
    *   `amount_ngn`: `Math.floor(act.amount)` (integer representation in Nigerian Naira).
    *   `amount`: `act.amount` (decimal/numeric precision).
*   **Harmonization Recommendation**:
    *   **Authoritative Field**: `amount` (NUMERIC) is the authoritative column for all standard currency operations, decimal-level ledger matching, and customer-facing reports.
    *   **Legacy Field**: `amount_ngn` (BIGINT) acts as a secondary high-integrity integer index for high-speed integer aggregations and low-level payment processor alignments. Keep both updated to maintain complete backward compatibility.

---

### 4. ORPHAN WRITES & SHADOW LEVERAGE

*   **Identified Drift**: Reconciled payment logs (`payments`) were originally inserted without registering corresponding entries in compliance audit loggers or dispute resolution ledgers.
*   **Constitutional Schema Target**: `payment_audit` and `payment_disputes`.
*   **Resolution Status**: **RESOLVED**.
    *   A synchronous write pathway has been implemented during manual reconciliation to insert a detailed tracking record in the `payment_audit` table.
    *   Full support for opening, tracking, listing, and resolving billing disputes has been added, terminating directly inside the constitutional `payment_disputes` table.
