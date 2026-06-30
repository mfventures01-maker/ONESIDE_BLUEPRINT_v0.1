/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { InventoryItem } from "../types";

export const InventoryMapper = {
  mapRowToInventory(row: any): InventoryItem {
    return {
      id: row.id,
      menu_item_id: row.sku || "",
      quantity: Number(row.current_stock) || 0,
      min_alert_threshold: Number(row.min_stock) || 0,
      location: row.description || "Main Deck"
    };
  }
};
