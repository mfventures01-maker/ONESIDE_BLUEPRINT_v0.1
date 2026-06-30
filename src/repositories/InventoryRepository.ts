/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { InventoryItem, InventoryMovement, MenuCategory, MenuItem, OperationalInventoryMovement, CarssResult } from "../types";
import { OfflineStorage } from "../offline/OfflineStorage";
import { InventoryMapper } from "../mappers/InventoryMapper";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const InventoryRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async getCategories(): Promise<CarssResult<MenuCategory[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("menu_categories")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) {
          console.warn("Supabase categories fetch error:", error.message);
        } else if (data) {
          return createCarssSuccess(data as MenuCategory[], "Categories fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase categories fetch failed:", err);
    }
    
    const cached = OfflineStorage.getJson<MenuCategory[]>("carss_categories", []);
    return createCarssSuccess(cached, "Categories fetched offline successfully");
  },

  async getMenuItems(): Promise<CarssResult<MenuItem[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("status", "active");
        if (error) {
          console.warn("Supabase menu items fetch error:", error.message);
        } else if (data) {
          return createCarssSuccess(data as MenuItem[], "Menu items fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase menu items fetch failed:", err);
    }
    
    const cached = OfflineStorage.getJson<MenuItem[]>("carss_items", []);
    return createCarssSuccess(cached, "Menu items fetched offline successfully");
  },

  async getInventory(): Promise<CarssResult<InventoryItem[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("inventory")
          .select("*");
        if (error) {
          console.warn("Supabase inventory fetch error:", error.message);
        } else if (data && data.length > 0) {
          const mapped = data.map((row: any) => InventoryMapper.mapRowToInventory(row));
          return createCarssSuccess(mapped, "Inventory fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase inventory fetch failed:", err);
    }
    
    const cached = OfflineStorage.getJson<InventoryItem[]>("carss_inventory", []);
    return createCarssSuccess(cached, "Inventory fetched offline successfully");
  },

  async getInventoryItem(id: string): Promise<CarssResult<InventoryItem | null>> {
    try {
      const res = await this.getInventory();
      if (res.success && res.data) {
        const found = res.data.find(i => i.id === id || i.menu_item_id === id) || null;
        return createCarssSuccess(found, "Inventory item retrieved successfully");
      }
      return createCarssError(res.errors || ["Failed to read inventory"], "Inventory item retrieval failed");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to get inventory item");
    }
  },

  async updateInventory(id: string, nextQty: number): Promise<CarssResult<void>> {
    try {
      // 1. Update online if configured
      if (this.isOnline()) {
        const { error } = await supabase
          .from("inventory")
          .update({ current_stock: nextQty })
          .eq("id", id);
        if (error) {
          console.warn("Supabase inventory update error:", error.message);
        }
      }

      // 2. Update local storage via OfflineStorage
      const cached = await this.getInventory();
      if (cached.success && cached.data) {
        const updated = cached.data.map(item => {
          if (item.id === id) {
            return { ...item, quantity: nextQty };
          }
          return item;
        });
        OfflineStorage.setJson("carss_inventory", updated);
      }
      return createCarssSuccess(undefined, "Inventory updated successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to update inventory");
    }
  },

  async deductInventory(menuItemId: string, amountToDeduct: number): Promise<CarssResult<void>> {
    try {
      const res = await this.getInventory();
      if (!res.success || !res.data) {
        return createCarssError(res.errors || ["Could not read inventory"], "Deduct inventory failed");
      }
      const target = res.data.find(i => i.menu_item_id === menuItemId);
      if (target) {
        const nextQty = Math.max(0, target.quantity - amountToDeduct);
        await this.updateInventory(target.id, nextQty);
      }
      return createCarssSuccess(undefined, "Inventory deducted successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to deduct inventory");
    }
  },

  async restockInventory(menuItemId: string, amountToAdd: number): Promise<CarssResult<void>> {
    try {
      const res = await this.getInventory();
      if (!res.success || !res.data) {
        return createCarssError(res.errors || ["Could not read inventory"], "Restock inventory failed");
      }
      const target = res.data.find(i => i.menu_item_id === menuItemId);
      if (target) {
        const nextQty = target.quantity + amountToAdd;
        await this.updateInventory(target.id, nextQty);
      }
      return createCarssSuccess(undefined, "Inventory restocked successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to restock inventory");
    }
  },

  async recordMovement(
    invItemId: string,
    change: number,
    type: "sale" | "restock" | "waste" | "reconciliation",
    notes: string
  ): Promise<CarssResult<InventoryMovement>> {
    try {
      const newMovement: InventoryMovement = {
        id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        inventory_item_id: invItemId,
        quantity_changed: change,
        movement_type: type,
        notes,
        created_at: new Date().toISOString()
      };

      // Store locally
      const cached = OfflineStorage.getJson<InventoryMovement[]>("carss_inventory_movements", []);
      cached.push(newMovement);
      OfflineStorage.setJson("carss_inventory_movements", cached);

      // Online write
      if (this.isOnline()) {
        const { error } = await supabase
          .from("inventory_movements")
          .insert({
            id: newMovement.id,
            product_id: invItemId,
            quantity: change,
            movement_type: type,
            notes,
            created_at: newMovement.created_at
          });
        if (error) {
          console.warn("Supabase inventory movement write error:", error.message);
        }
      }

      return createCarssSuccess(newMovement, "Inventory movement recorded successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to record inventory movement");
    }
  },

  // Operational inventory movements (inventory_movements_v3)
  async getOperationalInventoryMovements(): Promise<CarssResult<OperationalInventoryMovement[]>> {
    try {
      const cached = OfflineStorage.getItem("carss_op_inventory_movements");
      if (cached) {
        return createCarssSuccess(JSON.parse(cached) as OperationalInventoryMovement[], "Operational inventory movements fetched successfully");
      }
    } catch (err) {
      console.warn("Error reading local operational inventory movements", err);
    }
    return createCarssSuccess([], "No operational inventory movements found");
  },

  async addOperationalInventoryMovement(
    newMovement: OperationalInventoryMovement
  ): Promise<CarssResult<void>> {
    try {
      // 1. Local write
      const cached = OfflineStorage.getJson<OperationalInventoryMovement[]>("carss_op_inventory_movements", []);
      cached.push(newMovement);
      OfflineStorage.setJson("carss_op_inventory_movements", cached);

      // 2. Online write to inventory_movements_v3
      if (this.isOnline()) {
        const { error } = await supabase
          .from("inventory_movements_v3")
          .insert(newMovement);
        if (error) {
          console.warn("Supabase operational inventory movement write error:", error.message);
        }
      }
      return createCarssSuccess(undefined, "Operational inventory movement added successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to add operational inventory movement");
    }
  }
};
