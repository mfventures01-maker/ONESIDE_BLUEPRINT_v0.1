/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { Shift } from "../types";

export interface ConstitutionalShiftRecord {
  id: string;
  business_id: string;
  staff_id: string;
  branch_id: string | null;
  department_id: string | null;
  start_time: string;
  end_time: string | null;
  status: "open" | "closed";
  total_revenue: number;
  expected_revenue: number;
  variance: number;
}

export const ShiftAdapter = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * Resolve active business ID from local session or context dynamically
   */
  getBusinessId(): string {
    if (typeof window !== "undefined") {
      const storedBiz = localStorage.getItem("carss_active_business_id");
      if (storedBiz) return storedBiz;

      const sessionStr = localStorage.getItem("carss_user_session");
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session && session.business_id) {
            return session.business_id;
          }
        } catch {
          // Ignore
        }
      }
    }
    return "biz-1"; // Fallback canonical business branch
  },

  /**
   * Map from legacy Shift to Constitutional Shift Record using verified DB columns
   */
  mapShiftToConstitutional(s: Shift): ConstitutionalShiftRecord {
    return {
      id: s.id,
      business_id: this.getBusinessId(),
      staff_id: s.operator_id,
      branch_id: "629000ff-8a27-46e3-9eba-b603207565af", // Canonical verified default branch
      department_id: "db6cda1c-635d-4f6e-a954-3bff0330780b", // Canonical verified default department
      start_time: s.opened_at,
      end_time: s.closed_at,
      status: s.status,
      total_revenue: s.closing_amount || 0,
      expected_revenue: s.opening_float || 0,
      variance: s.variance || 0
    };
  },

  /**
   * Map from Constitutional Shift Record back to legacy Shift using verified DB columns
   */
  mapConstitutionalToLegacy(c: ConstitutionalShiftRecord): Shift {
    return {
      id: c.id,
      operator_id: c.staff_id,
      role: "staff", // Reconstruct role safely
      opening_float: Number(c.expected_revenue || 0),
      closing_amount: c.total_revenue !== null ? Number(c.total_revenue) : null,
      variance: c.variance !== null ? Number(c.variance) : null,
      status: c.status,
      opened_at: c.start_time,
      closed_at: c.end_time
    };
  },

  /**
   * Get all shifts from the target carss_shift_core view
   */
  async getShifts(): Promise<Shift[]> {
    if (this.isOnline()) {
      try {
        const { data, error } = await supabase
          .from("carss_shift_core")
          .select("*")
          .order("start_time", { ascending: false });

        if (error) {
          console.warn(`Constitutional database fetch from 'carss_shift_core' failed: ${error.message}. Falling back to local storage.`);
        } else if (data) {
          return (data || []).map((c: ConstitutionalShiftRecord) => this.mapConstitutionalToLegacy(c));
        }
      } catch (dbError) {
        console.warn("Offline fallback activated - Supabase error during shift fetch:", dbError);
      }
    }

    // Offline fallback: read from local storage "carss_shifts"
    if (typeof window !== "undefined") {
      try {
        const shifts = JSON.parse(localStorage.getItem("carss_shifts") || "[]") as Shift[];
        return shifts;
      } catch (err) {
        console.error("Local storage shift reading error:", err);
      }
    }
    return [];
  },

  /**
   * Find the active open shift
   */
  async getActiveShift(): Promise<Shift | null> {
    const list = await this.getShifts();
    const active = list.find((s) => s.status === "open");
    return active || null;
  },

  /**
   * Create and open a shift in carss_shift_core
   */
  async openShift(operatorId: string, role: string, openingFloat: number): Promise<Shift> {
    const list = await this.getShifts();
    const closedAt = new Date().toISOString();
    const updatedList = list.map((s) => {
      if (s.status === "open") {
        return {
          ...s,
          status: "closed" as const,
          closing_amount: s.opening_float,
          variance: 0,
          closed_at: closedAt
        };
      }
      return s;
    });

    const newShift: Shift = {
      id: `SHIFT-REV-ACTIVE-${Date.now()}`,
      operator_id: operatorId,
      role: role,
      opening_float: openingFloat,
      closing_amount: null,
      variance: null,
      status: "open",
      opened_at: new Date().toISOString(),
      closed_at: null
    };

    updatedList.unshift(newShift);

    if (typeof window !== "undefined") {
      localStorage.setItem("carss_shifts", JSON.stringify(updatedList));
    }

    if (this.isOnline()) {
      try {
        // Close old shifts in DB using correct verified columns
        await supabase
          .from("carss_shift_core")
          .update({
            status: "closed",
            total_revenue: openingFloat,
            expected_revenue: openingFloat,
            variance: 0,
            end_time: closedAt
          })
          .eq("status", "open");

        // Insert new open shift record using correct verified columns
        const record = this.mapShiftToConstitutional(newShift);
        const { error: insertError } = await supabase
          .from("carss_shift_core")
          .insert(record);

        if (insertError) {
          console.warn(`Constitutional database insert to 'carss_shift_core' failed: ${insertError.message}`);
        }
      } catch (dbError) {
        console.warn("Offline fallback activated - Supabase shift creation write failed or restricted:", dbError);
      }
    }

    return newShift;
  },

  /**
   * Close a shift in carss_shift_core
   */
  async closeShift(shiftId: string, closingAmount: number, varianceComputed: number, closedAt: string): Promise<void> {
    const list = await this.getShifts();
    const updated = list.map((s) => {
      if (s.id === shiftId) {
        return {
          ...s,
          status: "closed" as const,
          closing_amount: closingAmount,
          variance: varianceComputed,
          closed_at: closedAt
        };
      }
      return s;
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("carss_shifts", JSON.stringify(updated));
    }

    if (this.isOnline()) {
      try {
        const { error } = await supabase
          .from("carss_shift_core")
          .update({
            status: "closed",
            total_revenue: closingAmount,
            expected_revenue: closingAmount,
            variance: varianceComputed,
            end_time: closedAt
          })
          .eq("id", shiftId);

        if (error) {
          console.warn(`Constitutional database update on 'carss_shift_core' failed: ${error.message}`);
        }
      } catch (dbError) {
        console.warn("Offline fallback activated - Supabase shift close write failed or restricted:", dbError);
      }
    }
  },

  /**
   * Generic shift updater for backwards compatibility
   */
  async updateShift(id: string, updates: Partial<Shift>): Promise<void> {
    const list = await this.getShifts();
    const updated = list.map((s) => {
      if (s.id === id) {
        return { ...s, ...updates };
      }
      return s;
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("carss_shifts", JSON.stringify(updated));
    }

    if (this.isOnline()) {
      try {
        const dbUpdates: any = {};
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.opening_float !== undefined) dbUpdates.expected_revenue = updates.opening_float;
        if (updates.closing_amount !== undefined) {
          dbUpdates.total_revenue = updates.closing_amount;
          dbUpdates.expected_revenue = updates.closing_amount;
        }
        if (updates.variance !== undefined) dbUpdates.variance = updates.variance;
        if (updates.opened_at !== undefined) dbUpdates.start_time = updates.opened_at;
        if (updates.closed_at !== undefined) dbUpdates.end_time = updates.closed_at;

        const { error } = await supabase
          .from("carss_shift_core")
          .update(dbUpdates)
          .eq("id", id);

        if (error) {
          console.warn(`Constitutional database update on 'carss_shift_core' failed: ${error.message}`);
        }
      } catch (dbError) {
        console.warn("Offline fallback activated - Supabase shift update failed or restricted:", dbError);
      }
    }
  }
};
