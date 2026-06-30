/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { AuditEvent, AuditLog, CarssResult } from "../types";
import { OfflineStorage } from "../offline/OfflineStorage";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const AuditRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async recordEvent(event: Omit<AuditEvent, "id" | "created_at">): Promise<CarssResult<AuditEvent>> {
    try {
      const newEvent: AuditEvent = {
        ...event,
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        created_at: new Date().toISOString()
      };

      // 1. Local Storage via OfflineStorage
      const cached = OfflineStorage.getJson<AuditEvent[]>("carss_audit_events", []);
      cached.unshift(newEvent);
      OfflineStorage.setJson("carss_audit_events", cached);

      // 2. Online Write
      if (this.isOnline()) {
        const { error } = await supabase.from("audit_events").insert(newEvent);
        if (error) {
          console.warn("Supabase audit_events write failed:", error.message);
        }
      }

      return createCarssSuccess(newEvent, "Audit event recorded successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to record audit event");
    }
  },

  async recordAudit(log: Omit<AuditLog, "id" | "timestamp">): Promise<CarssResult<AuditLog>> {
    try {
      const newLog: AuditLog = {
        ...log,
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString()
      };

      // 1. Local Storage via OfflineStorage
      const cached = OfflineStorage.getJson<AuditLog[]>("carss_audit_logs", []);
      cached.unshift(newLog);
      OfflineStorage.setJson("carss_audit_logs", cached);

      // 2. Online Write
      if (this.isOnline()) {
        const { error } = await supabase.from("audit_logs").insert(newLog);
        if (error) {
          console.warn("Supabase audit_logs write failed:", error.message);
        }
      }

      return createCarssSuccess(newLog, "Audit log recorded successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to record audit log");
    }
  },

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
  }): Promise<CarssResult<AuditEvent[]>> {
    try {
      let events: AuditEvent[] = [];
      
      // 1. Fetch from DB if online
      if (this.isOnline()) {
        let query = supabase.from("audit_events").select("*").order("created_at", { ascending: false });
        if (filters?.operatorId) query = query.eq("actor_id", filters.operatorId);
        if (filters?.role) query = query.eq("actor_role", filters.role);
        if (filters?.resourceType) query = query.eq("resource_type", filters.resourceType);
        if (filters?.resourceId) query = query.eq("resource_id", filters.resourceId);
        if (filters?.eventCategory) query = query.eq("event_category", filters.eventCategory);
        if (filters?.shiftId) query = query.eq("shift_id", filters.shiftId);

        const { data, error } = await query;
        if (error) {
          console.warn("Supabase audit timeline fetch failed:", error.message);
        } else if (data) {
          events = data as AuditEvent[];
          return createCarssSuccess(events, "Timeline fetched successfully");
        }
      }

      // 2. Fallback to Local Storage via OfflineStorage
      events = OfflineStorage.getJson<AuditEvent[]>("carss_audit_events", []);
      if (filters?.operatorId) events = events.filter(e => e.actor_id === filters.operatorId);
      if (filters?.role) events = events.filter(e => e.actor_role === filters.role);
      if (filters?.resourceType) events = events.filter(e => e.resource_type === filters.resourceType);
      if (filters?.resourceId) events = events.filter(e => e.resource_id === filters.resourceId);
      if (filters?.eventCategory) events = events.filter(e => e.event_category === filters.eventCategory);
      if (filters?.shiftId) events = events.filter(e => e.shift_id === filters.shiftId);

      return createCarssSuccess(events, "Offline timeline fetched successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to fetch timeline");
    }
  },

  async getResourceHistory(resourceType: string, resourceId: string): Promise<CarssResult<AuditEvent[]>> {
    return this.getTimeline({ resourceType, resourceId });
  },

  async getOperatorHistory(operatorId: string): Promise<CarssResult<AuditEvent[]>> {
    return this.getTimeline({ operatorId });
  },

  async getAuditLogs(): Promise<CarssResult<AuditLog[]>> {
    try {
      let logs: AuditLog[] = [];
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .order("timestamp", { ascending: false });
        if (error) {
          console.warn("Supabase audit logs fetch failed:", error.message);
        } else if (data) {
          logs = data as AuditLog[];
          return createCarssSuccess(logs, "Audit logs fetched successfully");
        }
      }

      logs = OfflineStorage.getJson<AuditLog[]>("carss_audit_logs", []);
      return createCarssSuccess(logs, "Offline audit logs fetched successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to fetch audit logs");
    }
  }
};
