/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured, toUUID } from "../lib/supabaseClient";
import { PaymentIntention, PaymentDispute, BankTransfer, CarssResult } from "../types";
import { OfflineStorage } from "../offline/OfflineStorage";
import { PaymentMapper } from "../mappers/PaymentMapper";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const PaymentRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async getPaymentIntents(): Promise<CarssResult<PaymentIntention[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("payment_intents")
          .select("*");
        if (error) {
          console.warn("Supabase payment intents fetch error:", error.message);
        } else if (data && data.length > 0) {
          const mapped = data.map((row: any) => PaymentMapper.mapRowToPaymentIntention(row));
          return createCarssSuccess(mapped, "Payment intents fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase payment intents fetch failed:", err);
    }
    
    // Fallback to offline cache
    const cached = OfflineStorage.getJson<PaymentIntention[]>("carss_payment_intentions", []);
    return createCarssSuccess(cached, "Payment intents fetched offline successfully");
  },

  async getPaymentIntent(id: string): Promise<CarssResult<PaymentIntention | null>> {
    try {
      const res = await this.getPaymentIntents();
      if (res.success && res.data) {
        const found = res.data.find(x => x.id === id) || null;
        return createCarssSuccess(found, "Payment intent found successfully");
      }
      return createCarssError(res.errors || ["Failed to fetch payment intents"], "Payment intent retrieval failed");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to get payment intent");
    }
  },

  async createPaymentIntent(intent: PaymentIntention): Promise<CarssResult<PaymentIntention>> {
    try {
      // 1. Local storage save via OfflineStorage
      const cached = await this.getPaymentIntents();
      const currentIntents = cached.success && cached.data ? cached.data : [];
      currentIntents.unshift(intent);
      OfflineStorage.setJson("carss_payment_intentions", currentIntents);

      // 2. Online insert
      if (this.isOnline()) {
        const { error } = await supabase
          .from("payment_intents")
          .insert({
            id: toUUID(intent.id),
            order_id: intent.reservation_id ? toUUID(intent.reservation_id) : toUUID("00000000-0000-0000-0000-000000000000"),
            org_id: toUUID("00000000-0000-0000-0000-000000000000"),
            branch_id: toUUID("00000000-0000-0000-0000-000000000000"),
            staff_id: toUUID("00000000-0000-0000-0000-000000000000"),
            shift_id: intent.shift_id ? toUUID(intent.shift_id) : toUUID("00000000-0000-0000-0000-000000000000"),
            expected_amount: intent.amount,
            payment_type: intent.payment_method,
            status: intent.status,
            external_reference: intent.payment_reference,
            created_at: intent.created_at,
            approval_status: "pending"
          });
        if (error) {
          console.warn("Supabase payment intents insert error:", error.message);
          return createCarssError([error.message], "Database insert failed");
        }
      }
      return createCarssSuccess(intent, "Payment intent created successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to create payment intent");
    }
  },

  async verifyPayment(reference: string): Promise<CarssResult<void>> {
    return createCarssSuccess(undefined, "Payment verified successfully");
  },

  async recordPayment(paymentData: any): Promise<CarssResult<void>> {
    try {
      if (this.isOnline()) {
        const { error } = await supabase
          .from("payments")
          .insert(paymentData);
        if (error) {
          console.warn("Supabase payments write error:", error.message);
          return createCarssError([error.message], "Database write error");
        }
      }
      return createCarssSuccess(undefined, "Payment recorded successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to record payment");
    }
  },

  async recordPaymentAudit(auditData: any): Promise<CarssResult<void>> {
    try {
      if (this.isOnline()) {
        const { error } = await supabase
          .from("payment_audit")
          .insert(auditData);
        if (error) {
          console.warn("Supabase payment audit write error:", error.message);
          return createCarssError([error.message], "Database audit error");
        }
      }
      return createCarssSuccess(undefined, "Payment audit recorded successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to record payment audit");
    }
  },

  async updatePaymentIntentStatus(id: string, updates: Partial<PaymentIntention>, operatorId?: string): Promise<CarssResult<void>> {
    try {
      // 1. Local update
      const cached = await this.getPaymentIntents();
      if (cached.success && cached.data) {
        const updated = cached.data.map(item => {
          if (item.id === id) {
            return { ...item, ...updates };
          }
          return item;
        });
        OfflineStorage.setJson("carss_payment_intentions", updated);
      }

      // 2. DB update
      if (this.isOnline()) {
        const dbUpdates: any = {};
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.reconciliation_notes !== undefined) dbUpdates.rejection_reason = updates.reconciliation_notes;
        
        // Include approval columns if approved
        if (updates.status === "reconciled") {
          dbUpdates.approval_status = "approved";
          dbUpdates.approved_by = toUUID(operatorId || "00000000-0000-0000-0000-000000000000");
          dbUpdates.approved_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from("payment_intents")
          .update(dbUpdates)
          .eq("id", toUUID(id));

        if (error) {
          console.warn("Supabase payment intents update error:", error.message);
          return createCarssError([error.message], "Database status update failed");
        }
      }
      return createCarssSuccess(undefined, "Payment intent status updated successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to update payment intent status");
    }
  },

  async getPaymentDisputes(): Promise<CarssResult<PaymentDispute[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("payment_disputes")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) {
          console.warn("Supabase payment disputes fetch error:", error.message);
        } else if (data) {
          const mapped = data.map((row: any) => PaymentMapper.mapRowToPaymentDispute(row));
          return createCarssSuccess(mapped, "Payment disputes fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase payment disputes fetch failed:", err);
    }
    
    const cached = OfflineStorage.getJson<PaymentDispute[]>("carss_payment_disputes", []);
    return createCarssSuccess(cached, "Payment disputes fetched offline successfully");
  },

  async createPaymentDispute(dispute: PaymentDispute): Promise<CarssResult<PaymentDispute>> {
    try {
      // 1. Local save
      const cached = await this.getPaymentDisputes();
      const currentDisputes = cached.success && cached.data ? cached.data : [];
      currentDisputes.unshift(dispute);
      OfflineStorage.setJson("carss_payment_disputes", currentDisputes);

      // 2. Online insert
      if (this.isOnline()) {
        const { error } = await supabase
          .from("payment_disputes")
          .insert({
            id: toUUID(dispute.id),
            business_id: toUUID(dispute.business_id || "00000000-0000-0000-0000-000000000000"),
            branch_id: toUUID(dispute.branch_id || "00000000-0000-0000-0000-000000000000"),
            payment_id: toUUID(dispute.payment_id),
            dispute_reason: dispute.dispute_reason,
            status: dispute.status,
            opened_by: toUUID(dispute.opened_by || "00000000-0000-0000-0000-000000000000"),
            created_at: dispute.created_at
          });
        if (error) {
          console.warn("Supabase payment disputes insert error:", error.message);
          return createCarssError([error.message], "Database dispute insertion failed");
        }
      }
      return createCarssSuccess(dispute, "Payment dispute created successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to create payment dispute");
    }
  },

  async resolvePaymentDispute(id: string, notes: string, operatorId?: string): Promise<CarssResult<void>> {
    try {
      const activeOperator = operatorId || "system";
      // 1. Local update
      const cached = await this.getPaymentDisputes();
      if (cached.success && cached.data) {
        const updated = cached.data.map(item => {
          if (item.id === id) {
            return {
              ...item,
              status: "resolved" as const,
              resolution_note: notes,
              resolved_by: activeOperator,
              resolved_at: new Date().toISOString()
            };
          }
          return item;
        });
        OfflineStorage.setJson("carss_payment_disputes", updated);
      }

      // 2. DB update
      if (this.isOnline()) {
        const { error } = await supabase
          .from("payment_disputes")
          .update({
            status: "resolved",
            resolution_note: notes,
            resolved_by: toUUID(activeOperator),
            resolved_at: new Date().toISOString()
          })
          .eq("id", toUUID(id));
        if (error) {
          console.warn("Supabase disputes resolve update error:", error.message);
          return createCarssError([error.message], "Database dispute resolution failed");
        }
      }
      return createCarssSuccess(undefined, "Payment dispute resolved successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to resolve payment dispute");
    }
  },

  async getBankTransfers(): Promise<CarssResult<BankTransfer[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("unmatched_payments")
          .select("*")
          .order("status", { ascending: true });
        if (error) {
          console.warn("Supabase bank transfers fetch error:", error.message);
        } else if (data && data.length > 0) {
          const mapped = data.map((row: any) => PaymentMapper.mapRowToBankTransfer(row));
          return createCarssSuccess(mapped, "Bank transfers fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase bank transfers fetch failed:", err);
    }
    
    const cached = OfflineStorage.getJson<BankTransfer[]>("carss_transfers", []);
    return createCarssSuccess(cached, "Bank transfers fetched offline successfully");
  },

  async addBankTransfer(transfer: BankTransfer): Promise<CarssResult<BankTransfer>> {
    try {
      // 1. Local storage save
      const cached = await this.getBankTransfers();
      const currentTransfers = cached.success && cached.data ? cached.data : [];
      currentTransfers.unshift(transfer);
      OfflineStorage.setJson("carss_transfers", currentTransfers);

      // 2. Online insert
      if (this.isOnline()) {
        const { error } = await supabase
          .from("unmatched_payments")
          .insert({
            id: toUUID(`00000000-0000-0000-0000-${transfer.reference.padEnd(12, "0").substring(0, 12)}`),
            amount: transfer.amount,
            reference: transfer.reference,
            sender: transfer.payer_name,
            detected_at: new Date().toISOString(),
            status: "pending"
          });
        if (error) {
          console.warn("Supabase bank transfer insert error:", error.message);
          return createCarssError([error.message], "Database bank transfer insertion failed");
        }
      }
      return createCarssSuccess(transfer, "Bank transfer added successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to add bank transfer");
    }
  },

  async verifyBankTransfer(reference: string, operatorId?: string): Promise<CarssResult<void>> {
    try {
      const activeOperator = operatorId || "system";
      // 1. Local update
      const cached = await this.getBankTransfers();
      if (cached.success && cached.data) {
        const updated = cached.data.map(t => {
          if (t.reference === reference) {
            return {
              ...t,
              verification_status: "verified" as const,
              verified_by: activeOperator
            };
          }
          return t;
        });
        OfflineStorage.setJson("carss_transfers", updated);
      }

      // 2. DB update
      if (this.isOnline()) {
        const { error } = await supabase
          .from("unmatched_payments")
          .update({ status: "verified" })
          .eq("reference", reference);
        if (error) {
          console.warn("Supabase bank transfer verify update error:", error.message);
          return createCarssError([error.message], "Database bank transfer verification failed");
        }
      }
      return createCarssSuccess(undefined, "Bank transfer verified successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to verify bank transfer");
    }
  }
};
