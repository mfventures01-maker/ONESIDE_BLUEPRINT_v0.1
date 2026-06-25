/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { computeSha256Fingerprint } from "../audit/auditLogger";

export interface StaffProfile {
  id: string;
  name: string;
  pinHash: string;
  role: "staff" | "manager";
}

const CERTIFIED_STAFF_PROFILES: Record<string, StaffProfile> = {
  "STAFF-01": {
    id: "STAFF-01",
    name: "Jane Doe (Staff)",
    pinHash: computeSha256Fingerprint("1234"),
    role: "staff",
  },
  "STAFF-99": {
    id: "STAFF-99",
    name: "Active Operator",
    pinHash: computeSha256Fingerprint("9999"),
    role: "staff",
  },
  "MGR-01": {
    id: "MGR-01",
    name: "Bob Manager (Manager)",
    pinHash: computeSha256Fingerprint("5555"),
    role: "manager",
  },
};

export function verifyPin(id: string, pin: string): StaffProfile | null {
  const profile = CERTIFIED_STAFF_PROFILES[id];
  if (!profile) return null;
  const hash = computeSha256Fingerprint(pin);
  if (profile.pinHash === hash) {
    return profile;
  }
  return null;
}
