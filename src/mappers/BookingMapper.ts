/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Reservation, ExecutionContext } from "../types";

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
  quantity_people?: number;
  special_requests?: string;
}

export const BookingMapper = {
  mapReservationToBooking(res: Reservation, context?: ExecutionContext): BookingRecord {
    const customerId = context?.operatorId || null;
    const createdBy = context?.operatorId || "guest-customer";
    const businessId = context?.businessId || "biz-1";

    const checkIn = `${res.booking_date}T${res.booking_time}:00.000Z`;

    return {
      id: res.id,
      guest_name: res.customer_name,
      guest_email: res.customer_email || "",
      guest_phone: res.customer_phone,
      source: res.reservation_type,
      check_in: checkIn,
      status: res.status,
      business_id: businessId,
      customer_id: customerId,
      created_by: createdBy,
      created_at: res.created_at || new Date().toISOString(),
      quantity_people: res.quantity_people,
      special_requests: res.special_requests || ""
    };
  },

  mapBookingToReservation(b: BookingRecord, originalReservation?: Reservation): Reservation {
    let bookingDate = "";
    let bookingTime = "";

    if (b.check_in) {
      const dateParts = b.check_in.split(/[ T]/);
      bookingDate = dateParts[0] || "";
      if (dateParts[1]) {
        bookingTime = dateParts[1].substring(0, 5);
      }
    }

    const ticketCode = originalReservation?.ticket_code || `ONS-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      id: b.id,
      customer_name: b.guest_name,
      customer_email: b.guest_email || "",
      customer_phone: b.guest_phone,
      reservation_type: b.source as "table" | "snooker" | "vip" | "event",
      quantity_people: b.quantity_people ?? originalReservation?.quantity_people ?? 2,
      booking_date: bookingDate,
      booking_time: bookingTime,
      special_requests: b.special_requests ?? originalReservation?.special_requests ?? "",
      status: b.status as "pending" | "confirmed" | "cancelled",
      ticket_code: ticketCode,
      created_at: b.created_at || new Date().toISOString()
    };
  }
};
