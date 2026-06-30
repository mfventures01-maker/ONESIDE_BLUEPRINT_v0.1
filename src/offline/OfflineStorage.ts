/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { computeSha256Fingerprint } from "../audit/auditLogger";
import { MenuItem } from "../types";

export interface StaffMember {
  id: string;
  name: string;
  pinHash: string;
  role: "staff" | "manager" | "ceo" | "superadmin";
  email?: string;
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface BranchProfile {
  id: string;
  business_id: string;
  name: string;
  created_at: string;
}

export const OFFLINE_STAFF_SEEDS: StaffMember[] = [];

export const DEFAULT_CUSTOMERS: CustomerProfile[] = [];

export const DEFAULT_BUSINESS: BusinessProfile | null = null;

export const DEFAULT_BRANCH: BranchProfile | null = null;

export const INITIAL_CATEGORIES: any[] = [];

export const INITIAL_MENU_ITEMS: MenuItem[] = [];

export const INITIAL_PROMOTIONS: any[] = [];

export const INITIAL_INVENTORY: any[] = [];

export const OfflineStorage = {
  getItem(key: string): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },

  setItem(key: string, value: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },

  removeItem(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },

  getJson<T>(key: string, defaultValue: T): T {
    try {
      const val = this.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  setJson<T>(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value));
  }
};
