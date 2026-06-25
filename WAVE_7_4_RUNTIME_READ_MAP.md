# WAVE 7.4 RUNTIME READ MAP

This document maps out the comprehensive, harmonized runtime read authority for all inventory and stock screens in the CARSS Wave 5 application territory.

---

### 1. READ AUTHORITY ARCHITECTURE

Every inventory-aware screen in the application reads data from the single, unified master authority: **`inventory`** (the certified table under the CARSS Wave 5 Constitution).

```
[UI Component / Page]
         ↓
 [Service Interface]
         ↓
[Constitutional Table] (inventory)
```

---

### 2. DETAILED SCREEN READ FLOWS

#### A. Inventory Management Console (Operator Dashboard)
*   **Source File**: `src/pages/Dashboard.tsx`
*   **Runtime Flow**:
    ```
    Dashboard.tsx (activeTab === "inventory")
      ↓
    CARSS_Revenue_Server.getInventory()
      ↓
    supabase.from("inventory").select("*") (Mapped to InventoryItem format)
    ```
*   **Data Purpose**:
    *   Retrieves active stock quantities, locations, and low-stock alert thresholds.
    *   Determines warning badges and counts on the primary operational metrics ribbon.

#### B. Customer pre-Order Storefront (Real-Time Availability)
*   **Source File**: `src/pages/CustomerHomepage.tsx`
*   **Runtime Flow**:
    ```
    CustomerHomepage.tsx (onMount)
      ↓
    CARSS_Revenue_Server.getInventory()
      ↓
    supabase.from("inventory").select("*") (Mapped to InventoryItem format)
    ```
*   **Data Purpose**:
    *   Enforces real-time stock limits during pre-ordering.
    *   Prevents users from adding quantities of food/drink items exceeding actual live inventory levels (safety limiters).

#### C. Inventory & Stock Analytics (Reporting Suite)
*   **Source File**: `src/pages/Reports.tsx`
*   **Runtime Flow**:
    ```
    Reports.tsx (activeTab === "inventory")
      ↓
    CARSS_Report_Service.getInventoryReport()
      ↓
    CARSS_Revenue_Server.getInventory()  ──> supabase.from("inventory").select("*")
    CARSS_Operations_Server.getInventoryMovements()  ──> Local Storage / inventory_movements
    ```
*   **Data Purpose**:
    *   Aggregates total inventory lines and current stock levels.
    *   Highlights items requiring immediate replenishment based on min-stock safety limits.
    *   Tracks operational consumption and shrinkage trends over time.

#### D. Live System Warning Ribbon
*   **Source File**: `src/pages/Dashboard.tsx`
*   **Runtime Flow**:
    ```
    Dashboard.tsx -> Filter warning cards
      ↓
    CARSS_Revenue_Server.getInventory()
      ↓
    supabase.from("inventory").select("*")
    ```
*   **Data Purpose**:
    *   Extracts counts of items whose quantity has fallen below `min_alert_threshold` (mapped from `min_stock`) and triggers alert warning components automatically.

---

### 3. VERIFICATION VERDICT

*   **Runtime Read Authority Table**: **`inventory`** (Unified Database Table)
*   **Read Paths Verified**: 100% Unified.
*   **No Parallel Read Tables Found**: Confirmed.
