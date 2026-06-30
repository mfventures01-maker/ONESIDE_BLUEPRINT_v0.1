/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured, toUUID } from "../lib/supabaseClient";
import { CarssResult, Reservation } from "../types";
import { OfflineStorage, CustomerProfile } from "../offline/OfflineStorage";
import { CustomerMapper } from "../mappers/CustomerMapper";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const CustomerRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async getCustomers(): Promise<CarssResult<CustomerProfile[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("customers")
          .select("*");
        if (error) {
          console.warn("Supabase customers fetch error:", error.message);
        } else if (data && data.length > 0) {
          const mapped = data.map((row: any) => CustomerMapper.mapRowToCustomer(row));
          return createCarssSuccess(mapped, "Customers fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase customers fetch failed:", err);
    }

    const cached = OfflineStorage.getJson<CustomerProfile[]>("carss_customers", []);
    return createCarssSuccess(cached, "Customers fetched offline successfully");
  },

  async findCustomer(id: string): Promise<CarssResult<CustomerProfile | null>> {
    try {
      const res = await this.getCustomers();
      if (res.success && res.data) {
        const found = res.data.find(c => c.id === id || c.email === id || c.phone === id) || null;
        return createCarssSuccess(found, "Customer found successfully");
      }
      return createCarssError(res.errors || ["Failed to fetch customers"], "Customer find failed");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to find customer");
    }
  },

  async createCustomer(customer: CustomerProfile): Promise<CarssResult<CustomerProfile>> {
    try {
      const cached = await this.getCustomers();
      const current = cached.success && cached.data ? cached.data : [];
      current.push(customer);
      OfflineStorage.setJson("carss_customers", current);

      if (this.isOnline()) {
        const { error } = await supabase
          .from("customers")
          .insert({
            id: toUUID(customer.id),
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            created_at: customer.created_at
          });
        if (error) {
          console.warn("Supabase customer insert error:", error.message);
          return createCarssError([error.message], "Database customer insert failed");
        }
      }
      return createCarssSuccess(customer, "Customer created successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to create customer");
    }
  },

  async updateCustomer(id: string, updates: Partial<CustomerProfile>): Promise<CarssResult<void>> {
    try {
      const cached = await this.getCustomers();
      if (cached.success && cached.data) {
        const updated = cached.data.map(c => {
          if (c.id === id) return { ...c, ...updates };
          return c;
        });
        OfflineStorage.setJson("carss_customers", updated);
      }

      if (this.isOnline()) {
        const { error } = await supabase
          .from("customers")
          .update(updates)
          .eq("id", toUUID(id));
        if (error) {
          console.warn("Supabase customer update error:", error.message);
          return createCarssError([error.message], "Database customer update failed");
        }
      }
      return createCarssSuccess(undefined, "Customer updated successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to update customer");
    }
  },

  async searchCustomers(query: string): Promise<CarssResult<CustomerProfile[]>> {
    try {
      const res = await this.getCustomers();
      if (res.success && res.data) {
        const lower = query.toLowerCase();
        const filtered = res.data.filter(c => 
          c.name.toLowerCase().includes(lower) || 
          c.email.toLowerCase().includes(lower) || 
          c.phone.includes(lower)
        );
        return createCarssSuccess(filtered, "Customers searched successfully");
      }
      return createCarssError(res.errors || ["Failed to fetch customers"], "Customer search failed");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to search customers");
    }
  },

  async getCustomerBookings(customerId: string): Promise<CarssResult<any[]>> {
    try {
      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("customer_id", toUUID(customerId));
        if (error) {
          console.warn("Supabase bookings fetch for customer failed:", error.message);
        } else if (data) {
          return createCarssSuccess(data as any[], "Customer bookings fetched online successfully");
        }
      }
    } catch (err: any) {
      console.warn("Supabase bookings fetch failed:", err);
    }
    return createCarssSuccess([], "No customer bookings found");
  }
};
