/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { POSTransaction } from "../types";

export interface ConstitutionalTransactionRecord {
  id: string;
  amount: number;
  status: "pending" | "reconciled";
  payment_intent_id: string | null;
  shift_id: string | null;
  staff_id: string | null;
  business_id: string;
  payment_method: string;
  created_at: string;
}

export const TransactionMapper = {
  mapLegacyToConstitutional(
    t: POSTransaction,
    operatorId: string = "system",
    shiftId: string | null = null,
    businessId: string = "biz-1"
  ): ConstitutionalTransactionRecord {
    return {
      id: t.reference,
      amount: t.amount,
      status: t.status,
      payment_intent_id: t.terminal_id || null,
      shift_id: shiftId,
      staff_id: operatorId,
      business_id: businessId,
      payment_method: "pos",
      created_at: t.reconciled_at || new Date().toISOString()
    };
  },

  mapConstitutionalToLegacy(c: ConstitutionalTransactionRecord, fallbackTerminalId = "TERM-01"): POSTransaction {
    return {
      reference: c.id,
      amount: Number(c.amount),
      terminal_id: c.payment_intent_id || fallbackTerminalId,
      status: c.status,
      reconciled_at: c.status === "reconciled" ? c.created_at : null
    };
  }
};
