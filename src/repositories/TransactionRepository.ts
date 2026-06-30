/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured, toUUID } from "../lib/supabaseClient";
import { POSTransaction, CarssResult, ExecutionContext } from "../types";
import { OfflineStorage } from "../offline/OfflineStorage";
import { TransactionMapper, ConstitutionalTransactionRecord } from "../mappers/TransactionMapper";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const TransactionRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async getTransactions(): Promise<CarssResult<POSTransaction[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn(`Supabase transactions fetch failed: ${error.message}`);
        } else if (data) {
          const mapped = (data as ConstitutionalTransactionRecord[]).map((c) =>
            TransactionMapper.mapConstitutionalToLegacy(c)
          );
          return createCarssSuccess(mapped, "Transactions fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase error during transactions fetch:", err);
    }

    const list = OfflineStorage.getJson<POSTransaction[]>("carss_pos", []);
    return createCarssSuccess(list, "Transactions fetched offline successfully");
  },

  async getTransactionById(id: string): Promise<CarssResult<POSTransaction | null>> {
    try {
      const res = await this.getTransactions();
      if (res.success && res.data) {
        const found = res.data.find((t) => t.reference === id) || null;
        return createCarssSuccess(found, "Transaction retrieved successfully");
      }
      return createCarssError(res.errors || ["Failed to read transactions"], "Transaction retrieval failed");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to get transaction by id");
    }
  },

  async createTransaction(
    reference: string,
    amount: number,
    terminalId: string,
    operatorId: string = "system",
    shiftId: string | null = null,
    context?: ExecutionContext
  ): Promise<CarssResult<POSTransaction>> {
    try {
      const newTx: POSTransaction = {
        reference,
        amount,
        terminal_id: terminalId,
        status: "pending",
        reconciled_at: null
      };

      const listRes = await this.getTransactions();
      const list = listRes.success && listRes.data ? listRes.data : [];
      list.unshift(newTx);
      OfflineStorage.setJson("carss_pos", list);

      if (this.isOnline()) {
        const businessId = context?.businessId || "00000000-0000-0000-0000-000000000000";
        const record = TransactionMapper.mapLegacyToConstitutional(newTx, operatorId, shiftId, businessId);
        const { error } = await supabase.from("transactions").insert(record);
        if (error) {
          console.warn(`Supabase transactions insert failed: ${error.message}`);
          return createCarssError([error.message], "Database transaction insertion failed");
        }
      }

      return createCarssSuccess(newTx, "Transaction created successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to create transaction");
    }
  },

  async reconcileTransaction(reference: string, operatorId: string, role: string): Promise<CarssResult<void>> {
    try {
      const listRes = await this.getTransactions();
      const list = listRes.success && listRes.data ? listRes.data : [];
      const reconciledAt = new Date().toISOString();
      const updated = list.map((t) => {
        if (t.reference === reference) {
          return {
            ...t,
            status: "reconciled" as const,
            reconciled_at: reconciledAt
          };
        }
        return t;
      });

      OfflineStorage.setJson("carss_pos", updated);

      if (this.isOnline()) {
        const { error } = await supabase
          .from("transactions")
          .update({
            status: "reconciled",
            staff_id: operatorId
          })
          .eq("id", reference);

        if (error) {
          console.warn(`Supabase transaction reconcile failed: ${error.message}`);
          return createCarssError([error.message], "Database transaction reconcile failed");
        }
      }
      return createCarssSuccess(undefined, "Transaction reconciled successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to reconcile transaction");
    }
  },

  async updateTransaction(id: string, updates: Partial<POSTransaction>): Promise<CarssResult<void>> {
    try {
      const listRes = await this.getTransactions();
      const list = listRes.success && listRes.data ? listRes.data : [];
      const updated = list.map((t) => {
        if (t.reference === id) {
          return { ...t, ...updates };
        }
        return t;
      });

      OfflineStorage.setJson("carss_pos", updated);

      if (this.isOnline()) {
        const dbUpdates: any = {};
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
        if (updates.terminal_id !== undefined) dbUpdates.payment_intent_id = updates.terminal_id;

        const { error } = await supabase
          .from("transactions")
          .update(dbUpdates)
          .eq("id", id);

        if (error) {
          console.warn(`Supabase transaction update failed: ${error.message}`);
          return createCarssError([error.message], "Database transaction update failed");
        }
      }
      return createCarssSuccess(undefined, "Transaction updated successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to update transaction");
    }
  }
};
