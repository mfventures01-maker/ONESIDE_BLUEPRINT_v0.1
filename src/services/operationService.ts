/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShiftRepository } from "../repositories/ShiftRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { AuditRepository } from "../repositories/AuditRepository";
import { InventoryRepository } from "../repositories/InventoryRepository";
import { toUUID } from "../lib/supabaseClient";
import {
  Shift,
  ShiftTransaction,
  ShiftSummary,
  CashMovement,
  POSTransaction,
  BankTransfer,
  OperationalInventoryMovement,
  AuditLog
} from "../types";
import { ConstitutionalAuditService } from "./auditService";

// --- SEEDS FOR FALLBACK / DEVELOPMENT ---

const INITIAL_SHIFTS: Shift[] = [
  {
    id: "SHIFT-REV-ACTIVE-02",
    operator_id: "operator-active-02",
    role: "manager",
    opening_float: 10000,
    closing_amount: null,
    variance: null,
    status: "open",
    opened_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    closed_at: null
  }
];

const INITIAL_POS: POSTransaction[] = [
  { reference: "POS-TX-9821", amount: 25000, terminal_id: "TERM-A", status: "pending", reconciled_at: null },
  { reference: "POS-TX-9822", amount: 15000, terminal_id: "TERM-B", status: "pending", reconciled_at: null },
  { reference: "POS-TX-9823", amount: 7000, terminal_id: "TERM-A", status: "reconciled", reconciled_at: new Date().toISOString() }
];

const INITIAL_TRANSFERS: BankTransfer[] = [
  { reference: "TRF-TX-1001", amount: 50000, payer_name: "Adebayo Kola", verification_status: "pending", verified_by: null },
  { reference: "TRF-TX-1002", amount: 12050, payer_name: "Chinedu Okafor", verification_status: "pending", verified_by: null },
  { reference: "TRF-TX-1003", amount: 8000, payer_name: "Fatima Yusuf", verification_status: "verified", verified_by: "manager-sim" }
];

// LocalStorage Persistence Helpers
const getStorage = <T>(key: string, seed: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return seed;
  }
};

const setStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const CARSS_Operations_Server = {
  isOnline: (): boolean => {
    return ShiftRepository.isOnline();
  },

  // --- GENERAL AUDIT LOG LOGGER ---
  async emitAudit(log: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
    await AuditRepository.recordAudit(log);
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await AuditRepository.getAuditLogs();
    return res.success && res.data ? res.data : [];
  },

  // --- 1. SHIFT ENGINE ---
  async getShifts(): Promise<Shift[]> {
    const res = await ShiftRepository.getShifts();
    return res.success && res.data ? res.data : [];
  },

  async getActiveShift(): Promise<Shift | null> {
    const res = await ShiftRepository.getActiveShift();
    return res.success && res.data ? res.data : null;
  },

  async openShift(operatorId: string, role: string, openingFloat: number): Promise<Shift> {
    const res = await ShiftRepository.openShift(operatorId, role, openingFloat);
    const newShift = res.success && res.data ? res.data : {
      id: `SHIFT-REV-ACTIVE-${Date.now()}`,
      operator_id: operatorId,
      role: role,
      opening_float: openingFloat,
      closing_amount: null,
      variance: null,
      status: "open" as const,
      opened_at: new Date().toISOString(),
      closed_at: null
    };

    await this.emitAudit({
      operator_id: operatorId,
      role: role,
      action: "open_shift",
      resource: `shift:${newShift.id}`
    });

    await ConstitutionalAuditService.emitEvent({
      event_type: "open_shift",
      event_category: "Shifts",
      actor_id: operatorId,
      actor_role: role,
      resource_type: "shift",
      resource_id: newShift.id,
      resource_name: `Active Shift Control [${newShift.id}]`,
      before_state: JSON.stringify({ status: "closed", opening_float: 0 }),
      after_state: JSON.stringify({ status: "open", opening_float: openingFloat }),
      notes: `Operator ${operatorId} kicked off shift cycle successfully. Initialized cash drawer with a float of ₦${openingFloat.toLocaleString()}`,
      source_module: "operations",
      session_id: `session-ops-${Date.now()}`,
      shift_id: newShift.id
    });

    return newShift;
  },

  async closeShift(shiftId: string, closingAmount: number, operatorId: string, role: string): Promise<ShiftSummary> {
    const list = await this.getShifts();
    const targetShift = list.find((s) => s.id === shiftId);

    // Retrieve shift transactions / payment details to calculate totals for validation
    // Cash Payments, POS, Transfer total sums
    const allPayments = getStorage<any[]>("carss_payment_intentions", []);
    const shiftPayments = allPayments.filter(p => p.shift_id === shiftId && p.status === "reconciled");

    const totalCash = shiftPayments.filter(p => p.payment_method === "cash").reduce((acc, current) => acc + current.amount, 0);
    const totalPos = shiftPayments.filter(p => p.payment_method === "pos").reduce((acc, current) => acc + current.amount, 0);
    const totalTransfer = shiftPayments.filter(p => p.payment_method === "transfer").reduce((acc, current) => acc + current.amount, 0);

    // Sum cash movements in / out
    const cashMovementsList = await this.getCashMovements(shiftId);
    const sumCashMovements = cashMovementsList.reduce((acc, curr) => {
      if (curr.movement_type === "cash_in") return acc + curr.amount;
      if (curr.movement_type === "cash_out") return acc - curr.amount;
      if (curr.movement_type === "correction") return acc + curr.amount; // +/- based on amount sign
      if (curr.movement_type === "adjustment") return acc + curr.amount;
      return acc;
    }, 0);

    const shiftFloat = targetShift ? targetShift.opening_float : 0;
    const expectedCash = shiftFloat + totalCash + sumCashMovements;
    const varianceComputed = closingAmount - expectedCash;
    const closedAt = new Date().toISOString();

    await ShiftRepository.closeShift(shiftId, closingAmount, varianceComputed, closedAt);

    await this.emitAudit({
      operator_id: operatorId,
      role: role,
      action: "close_shift",
      resource: `shift:${shiftId}`
    });

    const summary: ShiftSummary = {
      shift_id: shiftId,
      total_cash: totalCash,
      total_pos: totalPos,
      total_transfer: totalTransfer,
      closing_amount: closingAmount,
      variance: varianceComputed
    };

    await ConstitutionalAuditService.emitEvent({
      event_type: "close_shift",
      event_category: "Shifts",
      actor_id: operatorId,
      actor_role: role,
      resource_type: "shift",
      resource_id: shiftId,
      resource_name: `Shift Controller [${shiftId}]`,
      before_state: JSON.stringify({ status: "open" }),
      after_state: JSON.stringify(summary),
      notes: `Closed shift drawer. Reported cash: ₦${closingAmount.toLocaleString()}. Computed cash variance: ₦${varianceComputed.toLocaleString()}`,
      source_module: "operations",
      session_id: `session-ops-${Date.now()}`,
      shift_id: shiftId
    });

    // Save shift summary record
    const summariesList = getStorage<ShiftSummary[]>("carss_shift_summaries", []);
    summariesList.unshift(summary);
    setStorage("carss_shift_summaries", summariesList);

    return summary;
  },

  // --- 2. CASH MOVEMENT ENGINE ---
  async getCashMovements(shiftId?: string): Promise<CashMovement[]> {
    const list = getStorage<CashMovement[]>("carss_cash_movements", []);
    if (shiftId) {
      return list.filter(m => m.shift_id === shiftId);
    }
    return list;
  },

  async addCashMovement(
    shiftId: string,
    amount: number,
    type: "cash_in" | "cash_out" | "correction" | "adjustment",
    notes: string,
    operatorId: string,
    role: string
  ): Promise<CashMovement> {
    const newMovement: CashMovement = {
      id: `cash-outflow-${Date.now()}`,
      shift_id: shiftId,
      amount,
      movement_type: type,
      notes,
      operator_id: operatorId,
      timestamp: new Date().toISOString()
    };

    const currentList = await this.getCashMovements();
    currentList.unshift(newMovement);
    setStorage("carss_cash_movements", currentList);

    await this.emitAudit({
      operator_id: operatorId,
      role,
      action: `cash_movement:${type}`,
      resource: `shift:${shiftId}`
    });

    await ConstitutionalAuditService.emitEvent({
      event_type: `cash_movement:${type}`,
      event_category: "Cash Movements",
      actor_id: operatorId,
      actor_role: role,
      resource_type: "cash_movement",
      resource_id: newMovement.id,
      resource_name: `Drawer Overage/Outflow Logs [${newMovement.id}]`,
      before_state: "{}",
      after_state: JSON.stringify(newMovement),
      notes: `Executed drawer balance flow [${type}] of ₦${amount.toLocaleString()}. Notes: "${notes}"`,
      source_module: "operations",
      session_id: `session-ops-${Date.now()}`,
      shift_id: shiftId
    });

    return newMovement;
  },

  // --- 3. POS RECONCILIATION ENGINE ---
  async getPOSTransactions(): Promise<POSTransaction[]> {
    const res = await TransactionRepository.getTransactions();
    return res.success && res.data ? res.data : [];
  },

  async addPOSTransaction(reference: string, amount: number, terminalId: string, operatorId: string = "system", role: string = "staff"): Promise<POSTransaction> {
    const activeShift = await this.getActiveShift();
    const shiftId = activeShift ? activeShift.id : null;
    
    const res = await TransactionRepository.createTransaction(reference, amount, terminalId, operatorId, shiftId);
    const newTx = res.success && res.data ? res.data : {
      reference,
      amount,
      terminal_id: terminalId,
      status: "pending" as const,
      reconciled_at: null
    };

    await ConstitutionalAuditService.emitEvent({
      event_type: "add_pos_transaction",
      event_category: "POS",
      actor_id: operatorId,
      actor_role: role,
      resource_type: "pos_transaction",
      resource_id: reference,
      resource_name: `POS Journal Record [${reference}]`,
      before_state: "{}",
      after_state: JSON.stringify(newTx),
      notes: `Ingested pending POS credit collection for terminal ${terminalId} of size ₦${amount.toLocaleString()}`,
      source_module: "operations",
      session_id: `session-ops-${Date.now()}`,
      shift_id: shiftId || ""
    });

    return newTx;
  },

  async reconcilePOSTransaction(reference: string, operatorId: string, role: string): Promise<void> {
    await TransactionRepository.reconcileTransaction(reference, operatorId, role);

    await this.emitAudit({
      operator_id: operatorId,
      role,
      action: "reconcile_pos",
      resource: `pos_tx:${reference}`
    });

    await ConstitutionalAuditService.emitEvent({
      event_type: "reconcile_pos",
      event_category: "POS",
      actor_id: operatorId,
      actor_role: role,
      resource_type: "pos_transaction",
      resource_id: reference,
      resource_name: `POS Journal Record [${reference}]`,
      before_state: JSON.stringify({ reference, status: "pending" }),
      after_state: JSON.stringify({ reference, status: "reconciled" }),
      notes: `Reconciled POS credit transaction with manual counter slip verification`,
      source_module: "operations",
      session_id: `session-ops-${Date.now()}`,
      shift_id: ""
    });
  },

  // --- 4. TRANSFER RECONCILIATION ENGINE ---
  async getBankTransfers(): Promise<BankTransfer[]> {
    const res = await PaymentRepository.getBankTransfers();
    return res.success && res.data ? res.data : [];
  },

  async addBankTransfer(reference: string, amount: number, payerName: string, operatorId: string = "system", role: string = "staff"): Promise<BankTransfer> {
    const newTx: BankTransfer = {
      reference,
      amount,
      payer_name: payerName,
      verification_status: "pending",
      verified_by: null
    };
    
    await PaymentRepository.addBankTransfer(newTx);

    await ConstitutionalAuditService.emitEvent({
      event_type: "add_bank_transfer",
      event_category: "Transfers",
      actor_id: operatorId,
      actor_role: role,
      resource_type: "bank_transfer",
      resource_id: reference,
      resource_name: `Bank Transfer Remittance [${reference}]`,
      before_state: "{}",
      after_state: JSON.stringify(newTx),
      notes: `Logged pending electronic bank remittance of ₦${amount.toLocaleString()} from payer ${payerName}`,
      source_module: "operations",
      session_id: `session-ops-${Date.now()}`,
      shift_id: ""
    });

    return newTx;
  },

  async verifyBankTransfer(reference: string, operatorId: string, role: string): Promise<void> {
    await PaymentRepository.verifyBankTransfer(reference);

    await this.emitAudit({
      operator_id: operatorId,
      role,
      action: "verify_bank_transfer",
      resource: `bank_trf:${reference}`
    });

    await ConstitutionalAuditService.emitEvent({
      event_type: "verify_bank_transfer",
      event_category: "Transfers",
      actor_id: operatorId,
      actor_role: role,
      resource_type: "bank_transfer",
      resource_id: reference,
      resource_name: `Bank Transfer Remittance [${reference}]`,
      before_state: JSON.stringify({ reference, verification_status: "pending" }),
      after_state: JSON.stringify({ reference, verification_status: "verified", verified_by: operatorId }),
      notes: `Verified bank transfer remittance statement matching credited amount`,
      source_module: "operations",
      session_id: `session-ops-${Date.now()}`,
      shift_id: ""
    });
  },

  // --- 5. INVENTORY MOVEMENT ENGINE ---
  async getInventoryMovements(): Promise<OperationalInventoryMovement[]> {
    const res = await InventoryRepository.getOperationalInventoryMovements();
    return res.success && res.data ? res.data : [];
  },

  async addInventoryMovement(
    inventoryId: string,
    quantity: number,
    movementType: "stock_in" | "stock_out" | "consumption" | "waste" | "adjustment",
    reason: string,
    operatorId: string,
    role: string
  ): Promise<OperationalInventoryMovement> {
    const newMovement: OperationalInventoryMovement = {
      id: `op-mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      inventory_id: inventoryId,
      quantity,
      movement_type: movementType,
      reason,
      operator_id: operatorId,
      timestamp: new Date().toISOString()
    };

    await InventoryRepository.addOperationalInventoryMovement(newMovement);

    await this.emitAudit({
      operator_id: operatorId,
      role,
      action: `inventory_movement:${movementType}`,
      resource: `inventory_item:${inventoryId}`
    });

    await ConstitutionalAuditService.emitEvent({
      event_type: `inventory_movement:${movementType}`,
      event_category: "Stock Adjustments",
      actor_id: operatorId,
      actor_role: role,
      resource_type: "inventory_item",
      resource_id: inventoryId,
      resource_name: `Operational Inventory Item [${inventoryId}]`,
      before_state: "{}",
      after_state: JSON.stringify(newMovement),
      notes: `Logged inventory flow [${movementType}] of ${quantity} units. Reason: "${reason}"`,
      source_module: "operations",
      session_id: `session-ops-${Date.now()}`,
      shift_id: ""
    });

    return newMovement;
  },

  getBootstrapSQLWave3(): string {
    return `-- CARSS WAVE 3 OPERATIONAL LOOPS SCHEMA BLUEPRINT
-- Execute in Supabase SQL editor to create the high-integrity operations registries.

-- Active Shifts Registrars
CREATE TABLE IF NOT EXISTS shifts (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL,
  role TEXT NOT NULL,
  opening_float NUMERIC NOT NULL DEFAULT 0,
  closing_amount NUMERIC,
  variance NUMERIC,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Active Shift Summaries
CREATE TABLE IF NOT EXISTS shift_summaries (
  shift_id TEXT PRIMARY KEY REFERENCES shifts(id) ON DELETE CASCADE,
  total_cash NUMERIC NOT NULL DEFAULT 0,
  total_pos NUMERIC NOT NULL DEFAULT 0,
  total_transfer NUMERIC NOT NULL DEFAULT 0,
  closing_amount NUMERIC NOT NULL,
  variance NUMERIC NOT NULL
);

-- Custom Cash Movements
CREATE TABLE IF NOT EXISTS cash_movements (
  id TEXT PRIMARY KEY,
  shift_id TEXT REFERENCES shifts(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('cash_in', 'cash_out', 'correction', 'adjustment')),
  notes TEXT,
  operator_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- POS Reconciliation Table
CREATE TABLE IF NOT EXISTS pos_transactions (
  reference TEXT PRIMARY KEY,
  amount NUMERIC NOT NULL,
  terminal_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reconciled')),
  reconciled_at TIMESTAMPTZ
);

-- Unmatched Payments (Electronic Remittance Audits) Table
CREATE TABLE IF NOT EXISTS unmatched_payments (
  id UUID PRIMARY KEY,
  amount NUMERIC NOT NULL,
  reference TEXT UNIQUE,
  sender TEXT,
  detected_at TIMESTAMPTZ,
  matched_order_id UUID,
  status TEXT DEFAULT 'pending'
);

-- Inventory Movement logs (Extended Operational Structure V3)
CREATE TABLE IF NOT EXISTS inventory_movements_v3 (
  id TEXT PRIMARY KEY,
  inventory_id TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('stock_in', 'stock_out', 'consumption', 'waste', 'adjustment')),
  reason TEXT,
  operator_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- High-Integrity Comprehensive Audit Log Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  operator_id TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
`;
  }
};
