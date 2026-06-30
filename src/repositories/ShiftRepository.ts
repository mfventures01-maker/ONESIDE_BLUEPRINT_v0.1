/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured, toUUID } from "../lib/supabaseClient";
import { Shift, CarssResult, ExecutionContext } from "../types";
import { OfflineStorage } from "../offline/OfflineStorage";
import { ShiftMapper, ConstitutionalShiftRecord } from "../mappers/ShiftMapper";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const ShiftRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async getShifts(): Promise<CarssResult<Shift[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("carss_shift_core")
          .select("*")
          .order("start_time", { ascending: false });

        if (error) {
          console.warn(`Supabase shifts fetch error: ${error.message}`);
        } else if (data) {
          const mapped = (data || []).map((c: ConstitutionalShiftRecord) => ShiftMapper.mapConstitutionalToLegacy(c));
          return createCarssSuccess(mapped, "Shifts fetched online successfully");
        }
      }
    } catch (dbError: any) {
      console.warn("Supabase error during shift fetch:", dbError);
    }

    const shifts = OfflineStorage.getJson<Shift[]>("carss_shifts", []);
    return createCarssSuccess(shifts, "Shifts fetched offline successfully");
  },

  async getActiveShift(): Promise<CarssResult<Shift | null>> {
    try {
      const res = await this.getShifts();
      if (res.success && res.data) {
        const active = res.data.find((s) => s.status === "open") || null;
        return createCarssSuccess(active, "Active shift fetched successfully");
      }
      return createCarssError(res.errors || ["Failed to fetch shifts"], "Active shift fetch failed");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to get active shift");
    }
  },

  async openShift(operatorId: string, role: string, openingFloat: number, context?: ExecutionContext): Promise<CarssResult<Shift>> {
    try {
      const listRes = await this.getShifts();
      const list = listRes.success && listRes.data ? listRes.data : [];
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
      OfflineStorage.setJson("carss_shifts", updatedList);

      if (this.isOnline()) {
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

        const bizId = context?.businessId || "00000000-0000-0000-0000-000000000000";
        const branchId = context?.branchId || null;
        const departmentId = context?.departmentId || null;

        const record = ShiftMapper.mapShiftToConstitutional(newShift, bizId, branchId, departmentId);
        const { error: insertError } = await supabase
          .from("carss_shift_core")
          .insert(record);

        if (insertError) {
          console.warn(`Supabase open shift insert failed: ${insertError.message}`);
          return createCarssError([insertError.message], "Database open shift insert failed");
        }
      }

      return createCarssSuccess(newShift, "Shift opened successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to open shift");
    }
  },

  async closeShift(shiftId: string, closingAmount: number, varianceComputed: number, closedAt: string): Promise<CarssResult<void>> {
    try {
      const listRes = await this.getShifts();
      const list = listRes.success && listRes.data ? listRes.data : [];
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

      OfflineStorage.setJson("carss_shifts", updated);

      if (this.isOnline()) {
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
          console.warn(`Supabase shift close failed: ${error.message}`);
          return createCarssError([error.message], "Database close shift failed");
        }
      }
      return createCarssSuccess(undefined, "Shift closed successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to close shift");
    }
  },

  async updateShift(id: string, updates: Partial<Shift>): Promise<CarssResult<void>> {
    try {
      const listRes = await this.getShifts();
      const list = listRes.success && listRes.data ? listRes.data : [];
      const updated = list.map((s) => {
        if (s.id === id) {
          return { ...s, ...updates };
        }
        return s;
      });

      OfflineStorage.setJson("carss_shifts", updated);

      if (this.isOnline()) {
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
          console.warn(`Supabase shift update failed: ${error.message}`);
          return createCarssError([error.message], "Database shift update failed");
        }
      }
      return createCarssSuccess(undefined, "Shift updated successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to update shift");
    }
  }
};
