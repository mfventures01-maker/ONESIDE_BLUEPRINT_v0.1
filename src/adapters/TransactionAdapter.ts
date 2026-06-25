/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { POSTransaction } from "../types";

export interface ConstitutionalTransactionRecord {
  id: string; // Maps to legacy reference
  amount: number;
  status: "pending" | "reconciled";
  payment_intent_id: string | null; // Maps to legacy terminal_id
  shift_id: string | null;
  staff_id: string | null; // Maps to legacy operator_id
  business_id: string;
  payment_method: string;
  created_at: string;
}

export const TransactionAdapter = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * Resolve active business ID from local session dynamically
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
   * Map legacy POSTransaction to Constitutional Record
   */
  mapLegacyToConstitutional(
    t: POSTransaction,
    operatorId: string = "system",
    shiftId: string | null = null
  ): ConstitutionalTransactionRecord {
    return {
      id: t.reference,
      amount: t.amount,
      status: t.status,
      payment_intent_id: t.terminal_id || null,
      shift_id: shiftId,
      staff_id: operatorId,
      business_id: this.getBusinessId(),
      payment_method: "pos",
      created_at: t.reconciled_at || new Date().toISOString()
    };
  },

  /**
   * Map Constitutional Record back to legacy POSTransaction
   */
  mapConstitutionalToLegacy(c: ConstitutionalTransactionRecord): POSTransaction {
    return {
      reference: c.id,
      amount: Number(c.amount),
      terminal_id: c.payment_intent_id || "TERM-01",
      status: c.status,
      reconciled_at: c.status === "reconciled" ? c.created_at : null
    };
  },

  /**
   * Retrieve all transactions from the transactions table
   */
  async getTransactions(): Promise<POSTransaction[]> {
    if (this.isOnline()) {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Log error and fallback to offline storage
        console.warn(`Constitutional database fetch from 'transactions' failed: ${error.message}`);
      } else if (data) {
        return (data as ConstitutionalTransactionRecord[]).map((c) =>
          this.mapConstitutionalToLegacy(c)
        );
      }
    }

    // Offline fallback: Primary Offline Authority option B
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("carss_pos");
        return local ? JSON.parse(local) : [];
      } catch (err) {
        console.error("Local storage transaction reading error:", err);
      }
    }
    return [];
  },

  /**
   * Fetch single transaction by its primary identifier
   */
  async getTransactionById(id: string): Promise<POSTransaction | null> {
    const list = await this.getTransactions();
    return list.find((t) => t.reference === id) || null;
  },

  /**
   * Insert new POS transaction into transactions table
   */
  async createTransaction(
    reference: string,
    amount: number,
    terminalId: string,
    operatorId: string = "system",
    shiftId: string | null = null
  ): Promise<POSTransaction> {
    const newTx: POSTransaction = {
      reference,
      amount,
      terminal_id: terminalId,
      status: "pending",
      reconciled_at: null
    };

    // Update local cache for offline capabilities (Option B)
    const list = await this.getTransactions();
    list.unshift(newTx);
    if (typeof window !== "undefined") {
      localStorage.setItem("carss_pos", JSON.stringify(list));
    }

    if (this.isOnline()) {
      try {
        const record = this.mapLegacyToConstitutional(newTx, operatorId, shiftId);
        const { error } = await supabase.from("transactions").insert(record);
        if (error) {
          console.warn(`Constitutional database insert to 'transactions' failed: ${error.message}`);
        }
      } catch (dbError) {
        console.warn("Offline fallback activated - Supabase insert error during transaction creation:", dbError);
      }
    }

    return newTx;
  },

  /**
   * Specific reconciliation state updater
   */
  async reconcileTransaction(reference: string, operatorId: string, role: string): Promise<void> {
    const list = await this.getTransactions();
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

    if (typeof window !== "undefined") {
      localStorage.setItem("carss_pos", JSON.stringify(updated));
    }

    if (this.isOnline()) {
      try {
        const { error } = await supabase
          .from("transactions")
          .update({
            status: "reconciled",
            // Corrected: Avoid updating created_at to preserve original transaction historical timestamps!
            staff_id: operatorId
          })
          .eq("id", reference);

        if (error) {
          console.warn(`Constitutional database update on 'transactions' failed: ${error.message}`);
        }
      } catch (dbError) {
        console.warn("Offline fallback activated - Supabase write error during transaction reconciliation:", dbError);
      }
    }
  },

  /**
   * Generic transaction updater for backwards compatibility
   */
  async updateTransaction(id: string, updates: Partial<POSTransaction>): Promise<void> {
    const list = await this.getTransactions();
    const updated = list.map((t) => {
      if (t.reference === id) {
        return { ...t, ...updates };
      }
      return t;
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("carss_pos", JSON.stringify(updated));
    }

    if (this.isOnline()) {
      try {
        const dbUpdates: any = {};
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
        // Corrected: Avoid updating created_at on update to preserve transaction timeline historical integrity!
        if (updates.terminal_id !== undefined) dbUpdates.payment_intent_id = updates.terminal_id;

        const { error } = await supabase
          .from("transactions")
          .update(dbUpdates)
          .eq("id", id);

        if (error) {
          console.warn(`Constitutional database update on 'transactions' failed: ${error.message}`);
        }
      } catch (dbError) {
        console.warn("Offline fallback activated - Supabase write error during transaction update:", dbError);
      }
    }
  }
};
