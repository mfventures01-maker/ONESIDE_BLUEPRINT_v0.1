/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { Reservation } from "../types";

export interface BookingRecord {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  source: string;
  check_in: string;
  status: string;
  business_id: string;
  customer_id: string | null;
  created_by: string;
  created_at: string;
  // Included as optional fields in case the schema has them or for offline state retention
  quantity_people?: number;
  special_requests?: string;
}

export const BookingAdapter = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * Map from legacy Reservation to Constitutional Booking Record
   */
  mapReservationToBooking(res: Reservation): BookingRecord {
    let customer_id: string | null = null;
    let created_by = "guest-customer";

    if (typeof window !== "undefined") {
      const sessionStr = localStorage.getItem("carss_user_session");
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session && session.id) {
            created_by = session.id;
            customer_id = session.id;
          }
        } catch {
          // Ignore
        }
      }
    }

    // Combine booking_date (YYYY-MM-DD) and booking_time (HH:MM) as ISO or check_in string
    const check_in = `${res.booking_date}T${res.booking_time}:00.000Z`;

    return {
      id: res.id,
      guest_name: res.customer_name,
      guest_email: res.customer_email || "",
      guest_phone: res.customer_phone,
      source: res.reservation_type,
      check_in,
      status: res.status,
      business_id: "biz-1", // Injected canonical branch
      customer_id,
      created_by,
      created_at: res.created_at || new Date().toISOString(),
      quantity_people: res.quantity_people,
      special_requests: res.special_requests || ""
    };
  },

  /**
   * Map from Constitutional Booking Record back to legacy Reservation
   */
  mapBookingToReservation(b: BookingRecord, originalReservation?: Reservation): Reservation {
    let booking_date = "";
    let booking_time = "";

    if (b.check_in) {
      // Handle "YYYY-MM-DDTHH:MM:SS" or "YYYY-MM-DD HH:MM:SS"
      const dateParts = b.check_in.split(/[ T]/);
      booking_date = dateParts[0] || "";
      if (dateParts[1]) {
        booking_time = dateParts[1].substring(0, 5); // Extract "HH:MM"
      }
    }

    const ticket_code = originalReservation?.ticket_code || `ONS-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      id: b.id,
      customer_name: b.guest_name,
      customer_email: b.guest_email || "",
      customer_phone: b.guest_phone,
      reservation_type: b.source as "table" | "snooker" | "vip" | "event",
      quantity_people: b.quantity_people ?? originalReservation?.quantity_people ?? 2,
      booking_date,
      booking_time,
      special_requests: b.special_requests ?? originalReservation?.special_requests ?? "",
      status: b.status as "pending" | "confirmed" | "cancelled",
      ticket_code,
      created_at: b.created_at || new Date().toISOString()
    };
  },

  /**
   * Create booking record on the target bookings table
   */
  async createBooking(reservation: Reservation): Promise<Reservation> {
    const bookingData = this.mapReservationToBooking(reservation);

    if (this.isOnline()) {
      const { data, error } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        throw new Error(`Constitutional database write to 'bookings' failed: ${error.message}`);
      }

      return this.mapBookingToReservation(data || bookingData, reservation);
    } else {
      // Offline fallback: write only to local storage using "carss_bookings"
      if (typeof window !== "undefined") {
        const bookings = JSON.parse(localStorage.getItem("carss_bookings") || "[]") as BookingRecord[];
        bookings.unshift(bookingData);
        localStorage.setItem("carss_bookings", JSON.stringify(bookings));
        
        // Also sync legacy to maintain full offline state parity
        const legacy = JSON.parse(localStorage.getItem("carss_reservations") || "[]") as Reservation[];
        legacy.unshift(reservation);
        localStorage.setItem("carss_reservations", JSON.stringify(legacy));
      }
      return reservation;
    }
  },

  /**
   * Update status of booking record on the target bookings table
   */
  async updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled"): Promise<void> {
    if (this.isOnline()) {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) {
        throw new Error(`Constitutional database update to 'bookings' failed: ${error.message}`);
      }
    } else {
      // Offline fallback: update in local storage "carss_bookings"
      if (typeof window !== "undefined") {
        const bookings = JSON.parse(localStorage.getItem("carss_bookings") || "[]") as BookingRecord[];
        const updatedBookings = bookings.map((b) => {
          if (b.id === id) return { ...b, status };
          return b;
        });
        localStorage.setItem("carss_bookings", JSON.stringify(updatedBookings));

        // Also sync legacy to maintain full offline state parity
        const legacy = JSON.parse(localStorage.getItem("carss_reservations") || "[]") as Reservation[];
        const updatedLegacy = legacy.map((r) => {
          if (r.id === id) return { ...r, status };
          return r;
        });
        localStorage.setItem("carss_reservations", JSON.stringify(updatedLegacy));
      }
    }
  },

  /**
   * Get all booking records from the target bookings table
   */
  async getBookings(): Promise<Reservation[]> {
    if (this.isOnline()) {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Constitutional database fetch from 'bookings' failed: ${error.message}`);
      }

      return (data || []).map((b: BookingRecord) => this.mapBookingToReservation(b));
    } else {
      // Offline fallback: read from local storage "carss_bookings" (migrating legacy if empty)
      if (typeof window !== "undefined") {
        let bookings = JSON.parse(localStorage.getItem("carss_bookings") || "[]") as BookingRecord[];
        if (bookings.length === 0) {
          const legacy = JSON.parse(localStorage.getItem("carss_reservations") || "[]") as Reservation[];
          if (legacy.length > 0) {
            bookings = legacy.map((r) => this.mapReservationToBooking(r));
            localStorage.setItem("carss_bookings", JSON.stringify(bookings));
          }
        }
        return bookings.map((b) => this.mapBookingToReservation(b));
      }
      return [];
    }
  }
};
