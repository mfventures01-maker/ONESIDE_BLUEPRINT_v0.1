# WAVE 7.4 RUNTIME WRITE MAP

This document maps the complete database mutation paths (inserts, updates, and writes) affecting inventory levels and transaction logs across the CARSS territory.

---

### 1. WRITE AUTHORITY ARCHITECTURE

All inventory modifications flow through a strict, atomic double-ledger pipeline to keep master balances and transactional audits perfectly in sync:

1.  **Balance Update**: Applied to **`inventory`** (master table using the `current_stock` column).
2.  **Transaction Logs**: Generated in **`inventory_movements`** (using the `product_id` foreign key and `quantity` column).

---

### 2. DETAILED MUTATION PATHS

#### A. Automatic Checkout Consumption (Customer Purchase Flow)
*   **Trigger UI / Page**: `src/pages/CustomerHomepage.tsx` (Checkout submission)
*   **Mutation Flow**:
    ```
    CustomerHomepage.tsx (handleCheckout)
      ↓
    CARSS_Revenue_Server.updateItemInventory(menuItemId, count)
      ↓
    [1] Update Balance:
        supabase.from("inventory")
          .update({ current_stock: nextQty })
          .eq("id", targetId)
      ↓
    [2] Record Revenue Transaction Log:
        supabase.from("inventory_movements")
          .insert({ product_id: invItemId, quantity: -count, movement_type: "sale" })
      ↓
    [3] Propagate Operational Audit Trail:
        CARSS_Operations_Server.addInventoryMovement(itemId, -count, "consumption", ...)
    ```

#### B. Manual Staff Replenishment (Inventory Restock Flow)
*   **Trigger UI / Page**: `src/pages/Dashboard.tsx` (Restock buttons & low-stock warning cards)
*   **Mutation Flow**:
    ```
    Dashboard.tsx (Restock trigger +10/+25)
      ↓
    CARSS_Revenue_Server.restockItemInventory(menuItemId, count)
      ↓
    [1] Update Balance:
        supabase.from("inventory")
          .update({ current_stock: nextQty })
          .eq("id", targetId)
      ↓
    [2] Record Revenue Transaction Log:
        supabase.from("inventory_movements")
          .insert({ product_id: invItemId, quantity: count, movement_type: "restock" })
      ↓
    [3] Propagate Operational Audit Trail:
        CARSS_Operations_Server.addInventoryMovement(itemId, count, "stock_in", ...)
    ```

#### C. Manual Stock Slicers & Sliders (Manager Adjustment Flow)
*   **Trigger UI / Page**: `src/pages/Dashboard.tsx` (Inventory slider modal)
*   **Mutation Flow**:
    ```
    Dashboard.tsx (handleInventoryAdjustment)
      ↓
    Calculates change (delta). If delta > 0:
      CARSS_Revenue_Server.restockItemInventory(itemId, delta)
    If delta < 0:
      CARSS_Revenue_Server.updateItemInventory(itemId, abs(delta))
      ↓
    Funnels directly into the corresponding sub-systems:
      1. Updates quantity on `inventory` (via `current_stock` column)
      2. Records transaction log in `inventory_movements` (via `product_id` column)
    ```

---

### 3. CONFORMANCE ANALYSIS

*   **Runtime Balance Table**: **`inventory`** (master table)
*   **Runtime Transaction Ledger**: **`inventory_movements`**
*   **Double-Entry Audit Integrity**: Perfect. Every change to `inventory` generates an accompanying record in the transaction table `inventory_movements` for cross-reconciliation.
