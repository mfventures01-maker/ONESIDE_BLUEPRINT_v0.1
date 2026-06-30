/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { MenuCategory, MenuItem, Promotion, ThemeType, CarssResult } from "../types";
import { OfflineStorage } from "../offline/OfflineStorage";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const MenuRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async getSavedTheme(): Promise<CarssResult<ThemeType>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("theme_settings")
          .select("value")
          .eq("key", "active_theme")
          .single();
        if (data && !error) {
          return createCarssSuccess(data.value as ThemeType, "Theme fetched successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase fetch theme_settings failed:", err);
    }
    return createCarssSuccess("midnight_gold" as ThemeType, "Default theme returned");
  },

  async saveTheme(theme: ThemeType): Promise<CarssResult<void>> {
    try {
      if (this.isOnline()) {
        const { error } = await supabase
          .from("theme_settings")
          .upsert({ key: "active_theme", value: theme });
        if (error) {
          console.warn("Supabase upsert theme_settings failed:", error.message);
          return createCarssError([error.message], "Database theme save failed");
        }
      }
      return createCarssSuccess(undefined, "Theme saved successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to save theme");
    }
  },

  async getCategories(): Promise<CarssResult<MenuCategory[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("menu_categories")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) {
          console.warn("Supabase menu_categories fetch failed:", error.message);
        } else if (data) {
          return createCarssSuccess(data as MenuCategory[], "Categories fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase menu_categories fetch failed:", err);
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
          console.warn("Supabase menu_items fetch failed:", error.message);
        } else if (data) {
          return createCarssSuccess(data as MenuItem[], "Menu items fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase menu_items fetch failed:", err);
    }
    
    const cached = OfflineStorage.getJson<MenuItem[]>("carss_items", []);
    return createCarssSuccess(cached, "Menu items fetched offline successfully");
  },

  async getPromotions(): Promise<CarssResult<Promotion[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("promotions")
          .select("*")
          .eq("is_active", true);
        if (error) {
          console.warn("Supabase promotions fetch failed:", error.message);
        } else if (data) {
          return createCarssSuccess(data as Promotion[], "Promotions fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase promotions fetch failed:", err);
    }
    
    const cached = OfflineStorage.getJson<Promotion[]>("carss_promotions", []);
    return createCarssSuccess(cached, "Promotions fetched offline successfully");
  }
};
