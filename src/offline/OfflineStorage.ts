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

export interface OfflineSyncAdapter {
  read(key: string): string | null;
  write(key: string, value: string): void;
  delete(key: string): void;
}

export class LocalStorageAdapter implements OfflineSyncAdapter {
  read(key: string): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }

  write(key: string, value: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  }

  delete(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
}

export class OfflineMirror implements OfflineSyncAdapter {
  private adapter: OfflineSyncAdapter;

  constructor(adapter: OfflineSyncAdapter) {
    this.adapter = adapter;
  }

  read(key: string): string | null {
    return this.adapter.read(key);
  }

  write(key: string, value: string): void {
    this.adapter.write(key, value);
  }

  delete(key: string): void {
    this.adapter.delete(key);
  }

  getItem(key: string): string | null {
    return this.read(key);
  }

  setItem(key: string, value: string): void {
    this.write(key, value);
  }

  removeItem(key: string): void {
    this.delete(key);
  }

  getJson<T>(key: string, defaultValue: T): T {
    try {
      const val = this.read(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  setJson<T>(key: string, value: T): void {
    this.write(key, JSON.stringify(value));
  }
}

export const OfflineStorage = new OfflineMirror(new LocalStorageAdapter());
