/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { CustomerProfile } from "../offline/OfflineStorage";

export const CustomerMapper = {
  mapRowToCustomer(row: any): CustomerProfile {
    return {
      id: row.id,
      name: row.name || row.fullname || "",
      email: row.email || "",
      phone: row.phone || "",
      created_at: row.created_at
    };
  }
};
