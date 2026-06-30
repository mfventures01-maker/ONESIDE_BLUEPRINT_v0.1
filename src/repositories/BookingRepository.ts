/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured, toUUID } from "../lib/supabaseClient";
import { Reservation, CarssResult, ExecutionContext } from "../types";
import { OfflineStorage } from "../offline/OfflineStorage";
import { BookingMapper, BookingRecord } from "../mappers/BookingMapper";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const BookingRepository = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async createBooking(reservation: Reservation, context?: ExecutionContext): Promise<CarssResult<Reservation>> {
    try {
      const bookingData = BookingMapper.mapReservationToBooking(reservation, context);

      if (this.isOnline()) {
        const { data, error } = await supabase
          .from("bookings")
          .insert(bookingData)
          .select()
          .single();

        if (error) {
          console.warn("Supabase bookings write failed:", error.message);
          return createCarssError([error.message], "Database write failed");
        }

        const mapped = BookingMapper.mapBookingToReservation(data || bookingData, reservation);
        return createCarssSuccess(mapped, "Booking created online successfully");
      } else {
        const bookings = OfflineStorage.getJson<BookingRecord[]>("carss_bookings", []);
        bookings.unshift(bookingData);
        OfflineStorage.setJson("carss_bookings", bookings);

        const legacy = OfflineStorage.getJson<Reservation[]>("carss_reservations", []);
        legacy.unshift(reservation);
        OfflineStorage.setJson("carss_reservations", legacy);
        return createCarssSuccess(reservation, "Booking created offline successfully");
      }
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to create booking");
    }
  },

  async updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled"): Promise<CarssResult<void>> {
    try {
      if (this.isOnline()) {
        const { error } = await supabase
          .from("bookings")
          .update({ status })
          .eq("id", id);

        if (error) {
          console.warn("Supabase bookings status update failed:", error.message);
          return createCarssError([error.message], "Database status update failed");
        }
      } else {
        const bookings = OfflineStorage.getJson<BookingRecord[]>("carss_bookings", []);
        const updatedBookings = bookings.map((b) => {
          if (b.id === id) return { ...b, status };
          return b;
        });
        OfflineStorage.setJson("carss_bookings", updatedBookings);

        const legacy = OfflineStorage.getJson<Reservation[]>("carss_reservations", []);
        const updatedLegacy = legacy.map((r) => {
          if (r.id === id) return { ...r, status };
          return r;
        });
        OfflineStorage.setJson("carss_reservations", updatedLegacy);
      }
      return createCarssSuccess(undefined, "Booking status updated successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to update booking status");
    }
  },

  async getBookings(context?: ExecutionContext): Promise<CarssResult<Reservation[]>> {
    try {
      if (this.isOnline()) {
        let query = supabase.from("bookings").select("*");
        if (context?.businessId) {
          query = query.eq("business_id", context.businessId);
        }
        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
          console.warn("Supabase bookings fetch failed:", error.message);
        } else if (data) {
          const mapped = (data || []).map((b: BookingRecord) => BookingMapper.mapBookingToReservation(b));
          return createCarssSuccess(mapped, "Bookings fetched online successfully");
        }
      }

      let bookings = OfflineStorage.getJson<BookingRecord[]>("carss_bookings", []);
      if (bookings.length === 0) {
        const legacy = OfflineStorage.getJson<Reservation[]>("carss_reservations", []);
        if (legacy.length > 0) {
          bookings = legacy.map((r) => BookingMapper.mapReservationToBooking(r, context));
          OfflineStorage.setJson("carss_bookings", bookings);
        }
      }
      const mapped = bookings.map((b) => BookingMapper.mapBookingToReservation(b));
      return createCarssSuccess(mapped, "Bookings fetched offline successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to fetch bookings");
    }
  }
};
