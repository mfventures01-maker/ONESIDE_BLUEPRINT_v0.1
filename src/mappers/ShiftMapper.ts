/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Shift } from "../types";

export interface ConstitutionalShiftRecord {
  id: string;
  business_id: string;
  staff_id: string;
  branch_id: string | null;
  department_id: string | null;
  start_time: string;
  end_time: string | null;
  status: "open" | "closed";
  total_revenue: number;
  expected_revenue: number;
  variance: number;
}

export const ShiftMapper = {
  mapShiftToConstitutional(
    s: Shift,
    businessId: string,
    branchId: string | null = null,
    departmentId: string | null = null
  ): ConstitutionalShiftRecord {
    return {
      id: s.id,
      business_id: businessId,
      staff_id: s.operator_id,
      branch_id: branchId,
      department_id: departmentId,
      start_time: s.opened_at,
      end_time: s.closed_at,
      status: s.status,
      total_revenue: s.closing_amount || 0,
      expected_revenue: s.opening_float || 0,
      variance: s.variance || 0
    };
  },

  mapConstitutionalToLegacy(c: ConstitutionalShiftRecord): Shift {
    return {
      id: c.id,
      operator_id: c.staff_id,
      role: "staff",
      opening_float: Number(c.expected_revenue || 0),
      closing_amount: c.total_revenue !== null ? Number(c.total_revenue) : null,
      variance: c.variance !== null ? Number(c.variance) : null,
      status: c.status,
      opened_at: c.start_time,
      closed_at: c.end_time
    };
  }
};
