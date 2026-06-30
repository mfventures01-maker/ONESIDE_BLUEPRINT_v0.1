/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { PaymentIntention, PaymentDispute, BankTransfer } from "../types";

export const PaymentMapper = {
  mapRowToPaymentIntention(row: any): PaymentIntention {
    return {
      id: row.id,
      reservation_id: row.order_id,
      amount: Number(row.expected_amount) || 0,
      payment_method: (row.payment_type || "cash") as any,
      status: (row.status === "reconciled" ? "reconciled" : row.status === "failed" ? "failed" : "pending") as any,
      reconciliation_notes: row.rejection_reason || "",
      payment_reference: row.external_reference || "",
      shift_id: row.shift_id || "",
      created_at: row.created_at
    };
  },

  mapRowToPaymentDispute(row: any): PaymentDispute {
    return {
      id: row.id,
      business_id: row.business_id,
      branch_id: row.branch_id,
      payment_id: row.payment_id,
      dispute_reason: row.dispute_reason,
      status: row.status as "open" | "resolved",
      opened_by: row.opened_by,
      resolved_by: row.resolved_by,
      resolution_note: row.resolution_note,
      created_at: row.created_at,
      resolved_at: row.resolved_at,
      paid_at: row.paid_at
    };
  },

  mapRowToBankTransfer(row: any): BankTransfer {
    return {
      reference: row.reference || "",
      amount: Number(row.amount) || 0,
      payer_name: row.sender || "Unknown",
      verification_status: (row.status === "verified" ? "verified" : "pending") as any,
      verified_by: null
    };
  }
};
