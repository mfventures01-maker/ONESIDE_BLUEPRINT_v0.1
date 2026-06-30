/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured, toUUID } from "../lib/supabaseClient";
import { CarssResult } from "../types";
import { OfflineStorage, BusinessProfile, BranchProfile } from "../offline/OfflineStorage";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const BusinessRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async getBusinesses(): Promise<CarssResult<BusinessProfile[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("businesses")
          .select("*");
        if (error) {
          console.warn("Supabase businesses fetch error:", error.message);
        } else if (data && data.length > 0) {
          return createCarssSuccess(data as BusinessProfile[], "Businesses fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase businesses fetch failed:", err);
    }

    const cached = OfflineStorage.getJson<BusinessProfile[]>("carss_businesses", []);
    return createCarssSuccess(cached, "Businesses fetched offline successfully");
  },

  async getBusiness(id: string): Promise<CarssResult<BusinessProfile | null>> {
    try {
      const res = await this.getBusinesses();
      if (res.success && res.data) {
        const found = res.data.find(b => b.id === id) || null;
        return createCarssSuccess(found, "Business retrieved successfully");
      }
      return createCarssError(res.errors || ["Failed to fetch businesses"], "Failed to retrieve business");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to get business");
    }
  },

  async createBusiness(business: BusinessProfile): Promise<CarssResult<BusinessProfile>> {
    try {
      const cached = await this.getBusinesses();
      const current = cached.success && cached.data ? cached.data : [];
      current.push(business);
      OfflineStorage.setJson("carss_businesses", current);

      if (this.isOnline()) {
        const { error } = await supabase
          .from("businesses")
          .insert({
            id: toUUID(business.id),
            name: business.name,
            description: business.description,
            created_at: business.created_at
          });
        if (error) {
          console.warn("Supabase business insert error:", error.message);
          return createCarssError([error.message], "Database business insert failed");
        }
      }
      return createCarssSuccess(business, "Business created successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to create business");
    }
  },

  async updateBusiness(id: string, updates: Partial<BusinessProfile>): Promise<CarssResult<void>> {
    try {
      const cached = await this.getBusinesses();
      if (cached.success && cached.data) {
        const updated = cached.data.map(b => {
          if (b.id === id) return { ...b, ...updates };
          return b;
        });
        OfflineStorage.setJson("carss_businesses", updated);
      }

      if (this.isOnline()) {
        const { error } = await supabase
          .from("businesses")
          .update(updates)
          .eq("id", toUUID(id));
        if (error) {
          console.warn("Supabase business update error:", error.message);
          return createCarssError([error.message], "Database business update failed");
        }
      }
      return createCarssSuccess(undefined, "Business updated successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to update business");
    }
  },

  async getBranches(): Promise<CarssResult<BranchProfile[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("branches")
          .select("*");
        if (error) {
          console.warn("Supabase branches fetch error:", error.message);
        } else if (data && data.length > 0) {
          return createCarssSuccess(data as BranchProfile[], "Branches fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase branches fetch failed:", err);
    }

    const cached = OfflineStorage.getJson<BranchProfile[]>("carss_branches", []);
    return createCarssSuccess(cached, "Branches fetched offline successfully");
  },

  async createBranch(branch: BranchProfile): Promise<CarssResult<BranchProfile>> {
    try {
      const cached = await this.getBranches();
      const current = cached.success && cached.data ? cached.data : [];
      current.push(branch);
      OfflineStorage.setJson("carss_branches", current);

      if (this.isOnline()) {
        const { error } = await supabase
          .from("branches")
          .insert({
            id: toUUID(branch.id),
            business_id: toUUID(branch.business_id),
            name: branch.name,
            created_at: branch.created_at
          });
        if (error) {
          console.warn("Supabase branch insert error:", error.message);
          return createCarssError([error.message], "Database branch insert failed");
        }
      }
      return createCarssSuccess(branch, "Branch created successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to create branch");
    }
  }
};
