/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { StaffMember } from "../repositories/StaffRepository";

export const StaffMapper = {
  mapRowToStaff(row: any): StaffMember {
    return {
      id: row.id,
      name: row.name || row.fullname || "",
      pinHash: row.pin_hash || row.pin || "",
      role: row.role || "staff",
      email: row.email || "",
      created_at: row.created_at
    };
  }
};
