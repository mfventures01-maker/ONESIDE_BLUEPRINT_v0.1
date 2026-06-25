# AUDIT SCHEMA INVENTORY (WAVE 7.6)

This document provides a comprehensive structural inventory of all certified audit, logging, movement, and historical transaction tables within the CARSS/ONESIDE database territory under the Wave 5 Constitution.

---

### 1. `audit_events`
*   **Purpose**: Constitutional trust layer, recording full chronological details, state changes, and session contexts for audit timeline queries.
*   **Table Type**: High-Fidelity Chronological Event Log

| Column Name | Data Type | Nullable | Description / Key Constraint |
| :--- | :--- | :---: | :--- |
| **`id`** | `TEXT` | `NO` | Primary Key |
| **`event_type`** | `TEXT` | `NO` | Type of event (e.g., `open_shift`, `reconcile_pos`) |
| **`event_category`** | `TEXT` | `NO` | Higher-level categorizer (e.g., `Shifts`, `Stock Adjustments`) |
| **`actor_id`** | `TEXT` | `NO` | Reference to active system user / operator ID |
| **`actor_role`** | `TEXT` | `NO` | Role of actor at event execution (`manager`, `staff`, etc.) |
| **`resource_type`** | `TEXT` | `NO` | Type of audited resource (e.g., `shift`, `reservation`) |
| **`resource_id`** | `TEXT` | `NO` | Unique reference of audited entity |
| **`resource_name`** | `TEXT` | `NO` | Descriptive human-readable label of target resource |
| **`before_state`** | `TEXT` | `NO` | JSON string state before modification (Defaults to `'{}'`) |
| **`after_state`** | `TEXT` | `NO` | JSON string state after modification (Defaults to `'{}'`) |
| **`notes`** | `TEXT` | `YES` | Rich descriptive commentary |
| **`source_module`** | `TEXT` | `NO` | System originator (`operations`, `revenue`, etc.) |
| **`session_id`** | `TEXT` | `YES` | Session grouping token |
| **`shift_id`** | `TEXT` | `YES` | Active shift reference at event execution |
| **`created_at`** | `TIMESTAMPTZ` | `NO` | Chronological epoch timestamp (Defaults to `NOW()`) |

---

### 2. `audit_logs`
*   **Purpose**: Simplified transaction audit logging for fast operator status tracing.
*   **Table Type**: Legacy Status Log

| Column Name | Data Type | Nullable | Description / Key Constraint |
| :--- | :--- | :---: | :--- |
| **`id`** | `TEXT` | `NO` | Primary Key |
| **`operator_id`** | `TEXT` | `NO` | Reference to system user ID |
| **`role`** | `TEXT` | `NO` | Role of active operator |
| **`action`** | `TEXT` | `NO` | Action description string |
| **`resource`** | `TEXT` | `NO` | Audited target identifier string |
| **`timestamp`** | `TIMESTAMPTZ` | `NO` | Logging timestamp (Defaults to `NOW()`) |

---

### 3. `payment_audit`
*   **Purpose**: Forensic financial audit ledger capturing manual payment reconciliations and system-level payment state transitions.
*   **Table Type**: Financial Ledger Audit Trail

| Column Name | Data Type | Nullable | Description / Key Constraint |
| :--- | :--- | :---: | :--- |
| **`id`** | `UUID` | `NO` | Primary Key |
| **`business_id`** | `UUID` | `NO` | Foreign Key references `businesses(id)` ON DELETE CASCADE |
| **`payment_id`** | `UUID` | `NO` | Foreign Key references `payments(id)` ON DELETE CASCADE |
| **`branch_id`** | `UUID` | `NO` | Foreign Key references `branches(id)` ON DELETE CASCADE |
| **`action`** | `TEXT` | `NO` | Operational action description |
| **`actor_user_id`** | `UUID` | `YES` | Reference to validating manager / user UUID |
| **`note`** | `TEXT` | `YES` | Reconciliation annotation |
| **`meta`** | `JSONB` | `NO` | Rich transaction details, references, and amounts |
| **`created_at`** | `TIMESTAMPTZ` | `NO` | Audit creation epoch (Defaults to `NOW()`) |

---

### 4. `payment_disputes`
*   **Purpose**: Logs discrepancies, disputes, and manual operator overrides regarding realized collections.
*   **Table Type**: Dispute Ledger

| Column Name | Data Type | Nullable | Description / Key Constraint |
| :--- | :--- | :---: | :--- |
| **`id`** | `UUID` | `NO` | Primary Key |
| **`business_id`** | `UUID` | `NO` | Foreign Key references `businesses(id)` ON DELETE CASCADE |
| **`branch_id`** | `UUID` | `NO` | Foreign Key references `branches(id)` ON DELETE CASCADE |
| **`payment_id`** | `UUID` | `NO` | Foreign Key references `payments(id)` ON DELETE CASCADE |
| **`dispute_reason`** | `TEXT` | `NO` | Reason filed by operator |
| **`status`** | `TEXT` | `NO` | Dispute state (Defaults to `'open'`) |
| **`opened_by`** | `UUID` | `YES` | Reference to operator UUID who opened the dispute |
| **`resolved_by`** | `UUID` | `YES` | Reference to supervisor UUID who resolved the dispute |
| **`resolution_note`**| `TEXT` | `YES` | Resolution remarks |
| **`created_at`** | `TIMESTAMPTZ` | `NO` | Opening epoch timestamp (Defaults to `NOW()`) |
| **`resolved_at`** | `TIMESTAMPTZ` | `YES` | Resolution timestamp |
| **`paid_at`** | `TIMESTAMPTZ` | `YES` | Payment validation timestamp |

---

### 5. `inventory_movements`
*   **Purpose**: Logs transaction-triggered changes in physical inventory quantities during checkout and checkout reversals.
*   **Table Type**: Transaction Inventory Ledger

| Column Name | Data Type | Nullable | Description / Key Constraint |
| :--- | :--- | :---: | :--- |
| **`id`** | `TEXT` | `NO` | Primary Key |
| **`product_id`** | `TEXT` | `NO` | Foreign Key references `inventory(id)` ON DELETE CASCADE |
| **`quantity`** | `INT` | `NO` | Absolute change in quantity |
| **`movement_type`** | `TEXT` | `NO` | Nature of movement (e.g. `sale`, `restock`) |
| **`notes`** | `TEXT` | `YES` | Transaction details |
| **`created_at`** | `TIMESTAMPTZ` | `NO` | Log timestamp (Defaults to `NOW()`) |

---

### 6. `inventory_movements_v3`
*   **Purpose**: Records operator-entered operational stock movements, waste, shrinkage, and direct floor adjustments.
*   **Table Type**: Operational Inventory Adjustment Log

| Column Name | Data Type | Nullable | Description / Key Constraint |
| :--- | :--- | :---: | :--- |
| **`id`** | `TEXT` | `NO` | Primary Key |
| **`inventory_id`** | `TEXT` | `NO` | Unique reference to the inventory record |
| **`quantity`** | `NUMERIC` | `NO` | Numeric quantity added or subtracted |
| **`movement_type`** | `TEXT` | `NO` | Adjustment classification (`stock_in`, `stock_out`, `waste`, etc.) |
| **`reason`** | `TEXT` | `YES` | Contextual explanation provided by worker |
| **`operator_id`** | `TEXT` | `NO` | Reference to active worker |
| **`timestamp`** | `TIMESTAMPTZ` | `NO` | Log timestamp (Defaults to `NOW()`) |

---

### 7. `cash_movements`
*   **Purpose**: Track manual cash additions, drops, and adjustments from the cash drawer inside active shifts.
*   **Table Type**: Drawer Movement Log

| Column Name | Data Type | Nullable | Description / Key Constraint |
| :--- | :--- | :---: | :--- |
| **`id`** | `TEXT` | `NO` | Primary Key |
| **`shift_id`** | `TEXT` | `YES` | Foreign Key references `shifts(id)` ON DELETE CASCADE |
| **`amount`** | `NUMERIC` | `NO` | Shift cash amount flow value |
| **`movement_type`** | `TEXT` | `NO` | Classification (`cash_in`, `cash_out`, `correction`, `adjustment`) |
| **`notes`** | `TEXT` | `YES` | Purpose of flow |
| **`operator_id`** | `TEXT` | `NO` | Submitting manager ID |
| **`timestamp`** | `TIMESTAMPTZ` | `NO` | Logging timestamp (Defaults to `NOW()`) |

---

### 8. `shift_summaries`
*   **Purpose**: Historical shift outcome record capturing financial aggregates upon drawer closure.
*   **Table Type**: Shift Financial Summary Log

| Column Name | Data Type | Nullable | Description / Key Constraint |
| :--- | :--- | :---: | :--- |
| **`shift_id`** | `TEXT` | `NO` | Primary Key, Foreign Key references `shifts(id)` ON DELETE CASCADE |
| **`total_cash`** | `NUMERIC` | `NO` | Aggregated cash payments verified during shift |
| **`total_pos`** | `NUMERIC` | `NO` | Aggregated card payments verified during shift |
| **`total_transfer`**| `NUMERIC` | `NO` | Aggregated bank transfer collections during shift |
| **`closing_amount`**| `NUMERIC` | `NO` | Reported drawer cash total upon lockup |
| **`variance`** | `NUMERIC` | `NO` | Deviation from expected cash drawer formula |
