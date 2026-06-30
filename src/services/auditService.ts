/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditRepository } from "../repositories/AuditRepository";
import { AuditEvent, EventCategoryType } from "../types";

// Development Seed Audit Events to populate chronological history on initial load
const SEED_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "evt-seed-1",
    event_type: "open_shift",
    event_category: "Shifts",
    actor_id: "operator-active-02",
    actor_role: "manager",
    resource_type: "shift",
    resource_id: "SHIFT-REV-ACTIVE-02",
    resource_name: "Shift Active Registry",
    before_state: JSON.stringify({ status: "closed", opening_float: 0 }),
    after_state: JSON.stringify({ status: "open", opening_float: 10000 }),
    notes: "Ignited active shift core and initialized counter float at ₦10,000",
    source_module: "operations",
    session_id: "session-77a8b",
    shift_id: "SHIFT-REV-ACTIVE-02",
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "evt-seed-2",
    event_type: "add_reservation",
    event_category: "Reservations",
    actor_id: "customer-guest-101",
    actor_role: "staff",
    resource_type: "reservation",
    resource_id: "res-seed-992",
    resource_name: "Snooker VIP Lounge Table 4",
    before_state: "{}",
    after_state: JSON.stringify({ customer_name: "Kolawole Sanusi", status: "confirmed", price: 15000 }),
    notes: "Secured VIP reserve with instant food package attachment",
    source_module: "revenue",
    session_id: "session-9b2f1",
    shift_id: "SHIFT-REV-ACTIVE-02",
    created_at: new Date(Date.now() - 3.5 * 3600000).toISOString(),
  },
  {
    id: "evt-seed-3",
    event_type: "cash_movement:cash_out",
    event_category: "Cash Movements",
    actor_id: "operator-active-02",
    actor_role: "manager",
    resource_type: "cash_movement",
    resource_id: "cash-seed-44",
    resource_name: "Operations Expense Voucher",
    before_state: "{}",
    after_state: JSON.stringify({ amount: 12000, purpose: "Diesel generator top-up" }),
    notes: "Discharged ₦12,000 cash from drawer for power plant fuel sustenance",
    source_module: "operations",
    session_id: "session-77a8b",
    shift_id: "SHIFT-REV-ACTIVE-02",
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "evt-seed-4",
    event_type: "reconcile_pos",
    event_category: "POS",
    actor_id: "operator-active-02",
    actor_role: "manager",
    resource_type: "pos_transaction",
    resource_id: "POS-TX-9823",
    resource_name: "Terminal A POS Collection Receipt",
    before_state: JSON.stringify({ reference: "POS-TX-9823", status: "pending" }),
    after_state: JSON.stringify({ reference: "POS-TX-9823", status: "reconciled" }),
    notes: "Matched card collection voucher with terminal aggregate records",
    source_module: "operations",
    session_id: "session-77a8b",
    shift_id: "SHIFT-REV-ACTIVE-02",
    created_at: new Date(Date.now() - 2.5 * 3600000).toISOString(),
  },
  {
    id: "evt-seed-5",
    event_type: "verify_bank_transfer",
    event_category: "Transfers",
    actor_id: "operator-active-02",
    actor_role: "manager",
    resource_type: "bank_transfer",
    resource_id: "TRF-TX-1003",
    resource_name: "Standard Chartered Bank Remittance",
    before_state: JSON.stringify({ reference: "TRF-TX-1003", verification_status: "pending" }),
    after_state: JSON.stringify({ reference: "TRF-TX-1003", verification_status: "verified" }),
    notes: "Audited payer statement matching credit ledger reference directly",
    source_module: "operations",
    session_id: "session-77a8b",
    shift_id: "SHIFT-REV-ACTIVE-02",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "evt-seed-6",
    event_type: "inventory_movement:waste",
    event_category: "Stock Adjustments",
    actor_id: "staff-operator-33",
    actor_role: "staff",
    resource_type: "inventory_item",
    resource_id: "inv-2",
    resource_name: "Fried Chicken Stock",
    before_state: JSON.stringify({ quantity: 8 }),
    after_state: JSON.stringify({ quantity: 3, change: -5 }),
    notes: "Declared 5 units of kitchen spoilage from cooling fault",
    source_module: "operations",
    session_id: "session-2ab99",
    shift_id: "SHIFT-REV-ACTIVE-02",
    created_at: new Date(Date.now() - 1.5 * 3600000).toISOString(),
  },
];

// Helper to interact with LocalStorage
const getStorageEvents = (): AuditEvent[] => {
  const data = localStorage.getItem("carss_audit_events");
  if (!data) {
    localStorage.setItem("carss_audit_events", JSON.stringify(SEED_AUDIT_EVENTS));
    return SEED_AUDIT_EVENTS;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    return SEED_AUDIT_EVENTS;
  }
};

const setStorageEvents = (events: AuditEvent[]): void => {
  localStorage.setItem("carss_audit_events", JSON.stringify(events));
};

export interface AnomalyLog {
  id: string;
  type: "inventory_variance" | "cash_variance" | "shift_variance" | "duplicate_reconciliation" | "suspicious_activity";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  resource_id?: string;
  operator_id?: string;
  timestamp: string;
}

export const ConstitutionalAuditService = {
  isOnline(): boolean {
    return AuditRepository.isOnline();
  },

  reseedSandbox(): AuditEvent[] {
    localStorage.setItem("carss_audit_events", JSON.stringify(SEED_AUDIT_EVENTS));
    return SEED_AUDIT_EVENTS;
  },

  /**
   * CENTRALIZED AUDIT WRITER
   * Safely dispatches audit events to local storage first, then proxies to Supabase async
   */
  async emitEvent(event: Omit<AuditEvent, "id" | "created_at">): Promise<AuditEvent> {
    const res = await AuditRepository.recordEvent(event);
    if (res.success && res.data) {
      return res.data;
    }
    const fallbackEvent: AuditEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      created_at: new Date().toISOString()
    };
    return fallbackEvent;
  },

  /**
   * CHRONOLOGICAL TIMELINE ENGINE
   * Dispatches filtered, chronological audit stream safely.
   */
  async getTimeline(filters?: {
    operatorId?: string;
    role?: string;
    resourceType?: string;
    resourceId?: string;
    eventCategory?: string;
    shiftId?: string;
    search?: string;
    timeRange?: "today" | "yesterday" | "this_week" | "this_month" | "all";
    customStart?: string;
    customEnd?: string;
  }): Promise<AuditEvent[]> {
    const res = await AuditRepository.getTimeline(filters);
    let events = res.success && res.data ? res.data : [];

    // Apply strict semantic filtering locally to guarantee consistency
    return events.filter(e => {
      if (filters?.operatorId && e.actor_id !== filters.operatorId) return false;
      if (filters?.role && e.actor_role !== filters.role) return false;
      if (filters?.resourceType && e.resource_type !== filters.resourceType) return false;
      if (filters?.resourceId && e.resource_id !== filters.resourceId) return false;
      if (filters?.eventCategory && e.event_category !== filters.eventCategory) return false;
      if (filters?.shiftId && e.shift_id !== filters.shiftId) return false;

      // Time Filter calculations
      const eventTime = new Date(e.created_at).getTime();
      const now = Date.now();
      
      if (filters?.timeRange) {
        const startOfToday = new Date().setHours(0, 0, 0, 0);
        const startOfYesterday = startOfToday - 24 * 3600000;
        const startOfWeek = startOfToday - 7 * 24 * 3600000;
        const startOfMonth = startOfToday - 30 * 24 * 3600000;

        if (filters.timeRange === "today" && eventTime < startOfToday) return false;
        if (filters.timeRange === "yesterday" && (eventTime < startOfYesterday || eventTime >= startOfToday)) return false;
        if (filters.timeRange === "this_week" && eventTime < startOfWeek) return false;
        if (filters.timeRange === "this_month" && eventTime < startOfMonth) return false;
      }

      if (filters?.customStart) {
        const startMs = new Date(filters.customStart).getTime();
        if (eventTime < startMs) return false;
      }
      if (filters?.customEnd) {
        const endMs = new Date(filters.customEnd).getTime();
        if (eventTime > endMs) return false;
      }

      // Dynamic Free text searching across Actor, Type, and Notes
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        const actorMatch = e.actor_id.toLowerCase().includes(s);
        const roleMatch = e.actor_role.toLowerCase().includes(s);
        const noteMatch = e.notes.toLowerCase().includes(s);
        const resMatch = e.resource_name.toLowerCase().includes(s) || e.resource_id.toLowerCase().includes(s);
        const typeMatch = e.event_type.toLowerCase().includes(s) || e.event_category.toLowerCase().includes(s);
        if (!actorMatch && !roleMatch && !noteMatch && !resMatch && !typeMatch) return false;
      }

      return true;
    });
  },

  /**
   * RESOURCE HISTORY API
   * Extracts chronological transitions for any specific entity resource
   */
  async getResourceHistory(resourceType: string, resourceId: string): Promise<AuditEvent[]> {
    return this.getTimeline({ resourceType, resourceId });
  },

  /**
   * OPERATOR SUMMARY/HISTORY API
   * Extracts operator activity summary metrics
   */
  async getOperatorHistory(operatorId: string): Promise<AuditEvent[]> {
    return this.getTimeline({ operatorId });
  },

  /**
   * ANOMALY INTELLIGENCE ENGINE
   * Realtime scan for high risk activities, cash variances, and potential dual entries
   */
  async detectAnomalies(): Promise<AnomalyLog[]> {
    const anomalies: AnomalyLog[] = [];
    const events = getStorageEvents();

    // 1. Check for cash variance at Shift Close
    const closeEvents = events.filter(e => e.event_type === "close_shift");
    closeEvents.forEach(evt => {
      try {
        const state = JSON.parse(evt.after_state);
        if (state && typeof state.variance === "number" && state.variance !== 0) {
          anomalies.push({
            id: `anom-cash-${evt.id}`,
            type: "cash_variance",
            severity: Math.abs(state.variance) > 5000 ? "high" : "medium",
            title: "Significant Shift Cash Variance",
            description: `Shift closed by ${evt.actor_id} with drawer discrepancy of ₦${state.variance.toLocaleString()}`,
            resource_id: evt.resource_id,
            operator_id: evt.actor_id,
            timestamp: evt.created_at
          });
        }
      } catch (e) {
        // Skip
      }
    });

    // 2. Check for stock adjustments/waste declared in excessive numbers
    const stockOuts = events.filter(e => e.event_type.includes("inventory_movement"));
    stockOuts.forEach(evt => {
      try {
        const state = JSON.parse(evt.after_state);
        // If movement type is correction, waste or adjustment and quantity is high
        const qty = state.quantity || state.quantity_changed || state.change || 0;
        if (Math.abs(qty) >= 10 && (evt.event_type.includes("waste") || evt.event_type.includes("adjustment"))) {
          anomalies.push({
            id: `anom-stock-${evt.id}`,
            type: "inventory_variance",
            severity: "high",
            title: "Large Inventory Shrinkage Alert",
            description: `Operational adjustment of ${qty} units declared for resource ${evt.resource_name} under reason: "${evt.notes}"`,
            resource_id: evt.resource_id,
            operator_id: evt.actor_id,
            timestamp: evt.created_at
          });
        }
      } catch (err) {
        // Skip
      }
    });

    // 3. Double POS entries or Double Transfer reconciling occurrences
    const matchGroup: Record<string, AuditEvent[]> = {};
    events.forEach(e => {
      if (e.event_type === "reconcile_pos" || e.event_type === "verify_bank_transfer") {
        if (!matchGroup[e.resource_id]) matchGroup[e.resource_id] = [];
        matchGroup[e.resource_id].push(e);
      }
    });

    Object.keys(matchGroup).forEach(resId => {
      const matchLogs = matchGroup[resId];
      if (matchLogs.length > 1) {
        anomalies.push({
          id: `anom-reconcile-${resId}`,
          type: "duplicate_reconciliation",
          severity: "high",
          title: "Potential Duplicate Collection Check",
          description: `Asset ${resId} was resolved multiple times (${matchLogs.length} times) within active log intervals.`,
          resource_id: resId,
          operator_id: matchLogs[0].actor_id,
          timestamp: matchLogs[0].created_at
        });
      }
    });

    // 4. Repeated failed validations or suspicious operator actions (e.g. actions by non-privileged operators outside active roles)
    events.forEach(e => {
      if (e.actor_role === "staff" && (e.event_type === "open_shift" || e.event_type === "close_shift")) {
        anomalies.push({
          id: `anom-role-${e.id}`,
          type: "suspicious_activity",
          severity: "high",
          title: "Non-Privileged Critical Protocol Attempted",
          description: `Staff member ${e.actor_id} tried to dispatch shift controller transitions directly.`,
          resource_id: e.resource_id,
          operator_id: e.actor_id,
          timestamp: e.created_at
        });
      }
    });

    return anomalies;
  },

  /**
   * SCHEMA SCHEMA BLUEPRINTS FOR WAVE 4 DATABASE MIGRATIONS
   */
  getBootstrapSQLWave4(): string {
    return `-- CARSS WAVE 4 CONSTITUTIONAL TRUST LAYER AUDIT SCHEMAS
-- Run this in Supabase query terminal to instantiate database storage for audit timeline streams.

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  before_state TEXT NOT NULL DEFAULT '{}',
  after_state TEXT NOT NULL DEFAULT '{}',
  notes TEXT,
  source_module TEXT NOT NULL,
  session_id TEXT,
  shift_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index critical fields for microsecond range queries and high efficiency timelines
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_category ON audit_events(event_category);
CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON audit_events(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events(created_at DESC);
`;
  }
};
