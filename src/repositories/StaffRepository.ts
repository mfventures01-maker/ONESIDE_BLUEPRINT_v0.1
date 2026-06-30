/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured, toUUID } from "../lib/supabaseClient";
import { CarssResult } from "../types";
import { computeSha256Fingerprint } from "../audit/auditLogger";
import { OfflineStorage } from "../offline/OfflineStorage";
import { StaffMapper } from "../mappers/StaffMapper";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export interface StaffMember {
  id: string;
  name: string;
  pinHash: string;
  role: "staff" | "manager" | "ceo" | "superadmin";
  email?: string;
  created_at: string;
}

export const StaffRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async getStaff(): Promise<CarssResult<StaffMember[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("staff")
          .select("*");
        if (error) {
          console.warn("Supabase staff fetch error:", error.message);
        } else if (data && data.length > 0) {
          const mapped = data.map((row: any) => StaffMapper.mapRowToStaff(row)) as StaffMember[];
          return createCarssSuccess(mapped, "Staff fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase staff fetch failed:", err);
    }

    const cached = OfflineStorage.getJson<StaffMember[]>("carss_staff", []);
    return createCarssSuccess(cached, "Staff fetched offline successfully");
  },

  async findStaff(id: string): Promise<CarssResult<StaffMember | null>> {
    try {
      const res = await this.getStaff();
      if (res.success && res.data) {
        const found = res.data.find(s => s.id === id || s.email === id) || null;
        return createCarssSuccess(found, "Staff member found successfully");
      }
      return createCarssError(res.errors || ["Failed to fetch staff"], "Staff find failed");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to find staff");
    }
  },

  async createStaff(staff: StaffMember): Promise<CarssResult<StaffMember>> {
    try {
      const cached = await this.getStaff();
      const current = cached.success && cached.data ? cached.data : [];
      current.push(staff);
      OfflineStorage.setJson("carss_staff", current);

      if (this.isOnline()) {
        const { error } = await supabase
          .from("staff")
          .insert({
            id: toUUID(staff.id),
            name: staff.name,
            pin_hash: staff.pinHash,
            role: staff.role,
            email: staff.email,
            created_at: staff.created_at
          });
        if (error) {
          console.warn("Supabase staff insert error:", error.message);
          return createCarssError([error.message], "Database staff insert failed");
        }
      }
      return createCarssSuccess(staff, "Staff member created successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to create staff member");
    }
  },

  async updateStaff(id: string, updates: Partial<StaffMember>): Promise<CarssResult<void>> {
    try {
      const cached = await this.getStaff();
      if (cached.success && cached.data) {
        const updated = cached.data.map(s => {
          if (s.id === id) return { ...s, ...updates };
          return s;
        });
        OfflineStorage.setJson("carss_staff", updated);
      }

      if (this.isOnline()) {
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.pinHash !== undefined) dbUpdates.pin_hash = updates.pinHash;
        if (updates.role !== undefined) dbUpdates.role = updates.role;
        if (updates.email !== undefined) dbUpdates.email = updates.email;

        const { error } = await supabase
          .from("staff")
          .update(dbUpdates)
          .eq("id", toUUID(id));
        if (error) {
          console.warn("Supabase staff update error:", error.message);
          return createCarssError([error.message], "Database staff update failed");
        }
      }
      return createCarssSuccess(undefined, "Staff member updated successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to update staff member");
    }
  },

  async verifyPin(id: string, pin: string): Promise<CarssResult<StaffMember | null>> {
    try {
      const res = await this.findStaff(id);
      if (res.success && res.data) {
        const hash = computeSha256Fingerprint(pin);
        if (res.data.pinHash === hash) {
          return createCarssSuccess(res.data, "PIN verified successfully");
        }
        return createCarssSuccess(null, "Invalid PIN");
      }
      return createCarssError(res.errors || ["Failed to find staff member"], "PIN verification failed");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to verify PIN");
    }
  },

  async assignRole(id: string, role: "staff" | "manager" | "ceo" | "superadmin"): Promise<CarssResult<void>> {
    return this.updateStaff(id, { role });
  },

  async resolveMembership(id: string): Promise<CarssResult<any>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("memberships")
          .select("*")
          .eq("staff_id", toUUID(id))
          .single();
        if (error) {
          console.warn("Supabase resolveMembership fetch error:", error.message);
        } else if (data) {
          return createCarssSuccess(data, "Membership resolved successfully");
        }
      }
    } catch (err) {
      console.warn("Supabase resolveMembership fetch failed:", err);
    }
    return createCarssSuccess(null, "No membership found");
  }
};
