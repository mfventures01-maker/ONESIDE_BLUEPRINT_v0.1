/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useRoleStore } from "../state/Contexts";
import { RoleType } from "../types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleType[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { activeRole } = useRoleStore();

  if (!allowedRoles.includes(activeRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
