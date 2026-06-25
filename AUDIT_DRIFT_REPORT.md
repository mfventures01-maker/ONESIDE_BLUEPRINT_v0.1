# AUDIT DRIFT REPORT (WAVE 7.6)

This forensic audit report documents all dual logging pathways, legacy table overlaps, and architectural differences identified within the audit logging subsystem under the Wave 5 Constitution.

---

### 1. DUAL LOGGING DUPLICATION & AUTHORITY OVERLAP

*   **Identified Drift**: A significant dual-logging occurrence is present across the operations service (`operationService.ts`). Every critical event—including opening shifts, closing shifts, registering cash drawer adjustments, resolving credit terminal POS logs, confirming bank remittances, and recording floor stock shrinkage—is recorded twice:
    1.  Inserted into **`audit_logs`** via `this.emitAudit(...)`.
    2.  Inserted into **`audit_events`** via `ConstitutionalAuditService.emitEvent(...)`.
*   **Operational Risk**: Duplicate database insertions consume extra bandwidth, increase cold-start latency in offline environments, and lead to log fragmentation when tracing history.
*   **Constitutional Standard**: `audit_events` is the primary, high-integrity constitutional logging authority under the Wave 5 Constitution. `audit_logs` represents a legacy, less descriptive overlap.

---

### 2. LEGACY AUDIT TABLES IN USE

*   **Identified Drift**: The `audit_logs` table (declaring columns `id`, `operator_id`, `role`, `action`, `resource`, `timestamp`) remains fully active. It has overlapping coverage with `audit_events` but lacks rich fields like `before_state`, `after_state`, `notes`, `source_module`, `session_id`, and `shift_id`.
*   **Resolution Guideline**: `audit_events` should be designated as the sole authoritative timeline recorder. Maintain `audit_logs` only as a secondary, structural fallback for backwards-compatible integrations, while ensuring no new modules depend on it.

---

### 3. STOCK LOGGING DIVERGENCE (`inventory_movements` vs `inventory_movements_v3`)

*   **Identified Drift**: Two separate stock-flow logging structures exist in the schema:
    1.  **`inventory_movements`** (under `revenueService.ts`): Records transactions driven automatically by checkout sales and restocking operations. It maintains explicit foreign key tracking (`product_id REFERENCES inventory(id)`).
    2.  **`inventory_movements_v3`** (under `operationService.ts`): Records manual, operator-submitted adjustments, waste, and stock_ins. It uses looser logical tracking (`inventory_id TEXT NOT NULL`).
*   **Resolution Verdict**: This division is accepted under Wave 5 as a *functional split* (financial sales logging vs floor operational logging), but the schemas must be harmonized by ensuring consistent naming and formatting standards in both.

---

### 4. LOCAL-ONLY SHADOW LOGS AND SYNCHRONIZATION

*   **Identified Drift**: Local caching layers (`carss_audit_events`, `carss_op_inventory_movements`, etc.) are heavily utilized for offline resilience.
*   **Mitigation Strategy**: The synchronization layer is structured as a *write-through, read-fallback buffer*. When online connectivity is detected, all operations are dispatched to Supabase immediately and verified. If a write fails or is pending, the cache preserves the record, preventing data loss.

---

### 5. EVENT COVERAGE HOLES

*   **Identified Drift**: While core financial transactions, cash movements, and stock adjustments are heavily logged, administrative metadata changes (such as updating theme settings, modifying menu category tags, or editing popular badges) are currently bypassed by the audit timeline engine.
*   **Recommendation**: Future iterations should introduce metadata audit listeners in `revenueService.ts` to log any configuration updates under category `Configuration` inside `audit_events`.
