/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

export type RoleType = "superadmin" | "ceo" | "manager" | "staff";

export interface RoleConfig {
  label: string;
  clearances: string[];
}

export const RoleVisibilityMap: Record<RoleType, RoleConfig> = {
  superadmin: {
    label: "Super Administrator",
    clearances: ["all", "audit", "management", "operational"],
  },
  ceo: {
    label: "Chief Executive Officer",
    clearances: ["audit", "management", "operational"],
  },
  manager: {
    label: "Manager",
    clearances: ["management", "operational"],
  },
  staff: {
    label: "Staff Member",
    clearances: ["operational"],
  },
};

// --- WAVE 2 REVENUE ENGINE TYPES ---

export type ThemeType =
  | "midnight_gold"
  | "executive_black"
  | "afro_luxe"
  | "sports_arena"
  | "resort_classic"
  | "vip_platinum"
  | "urban_nightlife";

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  bg: string;
  cardBg: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  accent: string;
  glow: string;
  fontTitle: string;
  fontBody: string;
  buttonClass: string;
  cardClass: string;
  animationClass: string;
  tone: string; // Tone of voice for UI messages
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  tags: string[];
  status: "active" | "archived" | "draft";
  is_popular?: boolean;
  is_featured?: boolean;
  upsell_item_id?: string;
  upsell_message?: string;
  recommend_message?: string;
}

export interface InventoryItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  min_alert_threshold: number;
  location: string;
}

export interface InventoryMovement {
  id: string;
  inventory_item_id: string;
  quantity_changed: number;
  movement_type: "sale" | "restock" | "waste" | "reconciliation";
  notes?: string;
  created_at: string;
}

export interface PricingRule {
  id: string;
  menu_item_id?: string;
  category_id?: string;
  discount_percentage: number;
  rule_type: "happy_hour" | "vip_only" | "volume_discount" | "seasonal";
  start_time?: string; // string representation of hours (e.g. 17:00)
  end_time?: string;
  is_active: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  badge_text: string;
  is_active: boolean;
  target_menu_item_id?: string;
}

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_type: "table" | "snooker" | "vip" | "event";
  quantity_people: number;
  booking_date: string;
  booking_time: string;
  special_requests?: string;
  status: "pending" | "confirmed" | "cancelled";
  ticket_code: string;
  created_at: string;
}

export interface PaymentIntention {
  id: string;
  reservation_id?: string;
  amount: number;
  payment_method: "cash" | "transfer" | "pos";
  status: "pending" | "reconciled" | "failed";
  reconciliation_notes?: string;
  payment_reference: string;
  shift_id: string; // link to active shift
  created_at: string;
}

export interface PaymentAudit {
  id: string;
  business_id: string;
  payment_id: string;
  branch_id?: string;
  action: string;
  actor_user_id?: string;
  note?: string;
  meta: Record<string, any>;
  created_at: string;
}

export interface PaymentDispute {
  id: string;
  business_id: string;
  branch_id?: string;
  payment_id: string;
  dispute_reason: string;
  status: "open" | "resolved";
  opened_by?: string;
  resolved_by?: string;
  resolution_note?: string;
  created_at: string;
  resolved_at?: string;
  paid_at?: string;
}

// --- WAVE 3 OPERATIONAL LOOPS TYPES ---

export interface Shift {
  id: string; // shift_id
  operator_id: string;
  role: string;
  opening_float: number;
  closing_amount: number | null;
  variance: number | null;
  status: "open" | "closed";
  opened_at: string;
  closed_at: string | null;
}

export interface ShiftTransaction {
  id: string;
  shift_id: string;
  amount: number;
  transaction_type: string;
  operator_id: string;
  timestamp: string;
  notes: string;
}

export interface ShiftSummary {
  shift_id: string;
  total_cash: number;
  total_pos: number;
  total_transfer: number;
  closing_amount: number;
  variance: number;
}

export interface CashMovement {
  id: string;
  shift_id: string;
  amount: number;
  movement_type: "cash_in" | "cash_out" | "correction" | "adjustment";
  notes: string;
  operator_id: string;
  timestamp: string;
}

export interface POSTransaction {
  reference: string;
  amount: number;
  terminal_id: string;
  status: "pending" | "reconciled";
  reconciled_at: string | null;
}

export interface BankTransfer {
  reference: string;
  amount: number;
  payer_name: string;
  verification_status: "pending" | "verified";
  verified_by: string | null;
}

export interface OperationalInventoryMovement {
  id: string;
  inventory_id: string;
  quantity: number;
  movement_type: "stock_in" | "stock_out" | "consumption" | "waste" | "adjustment";
  reason: string;
  operator_id: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  operator_id: string;
  role: string;
  action: string;
  resource: string;
  timestamp: string;
}

export type EventCategoryType =
  | "Authentication"
  | "Reservations"
  | "Payments"
  | "POS"
  | "Transfers"
  | "Cash Movements"
  | "Inventory"
  | "Stock Adjustments"
  | "Shifts"
  | "Reports"
  | "System Events"
  | "Configuration Changes";

export interface AuditEvent {
  id: string;
  event_type: string;
  event_category: EventCategoryType;
  actor_id: string;
  actor_role: string;
  resource_type: string;
  resource_id: string;
  resource_name: string;
  before_state: string;
  after_state: string;
  notes: string;
  source_module: string;
  session_id: string;
  shift_id: string;
  created_at: string;
}

export interface ExecutionContext {
  businessId: string;
  branchId: string;
  departmentId: string | null;
  operatorId: string;
  role: string;
  shiftId: string | null;
  requestId: string;
}

export interface CarssResult<T> {
  success: boolean;
  status?: number;
  message?: string;
  requestId?: string;
  timestamp?: string;
  data: T | null;
  errors: string[] | null;
}

