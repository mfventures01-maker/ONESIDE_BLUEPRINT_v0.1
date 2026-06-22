/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Notifications() {
  return (
    <PageSkeletonWrapper
      name="System Dispatch Notifications"
      territoryName="Identity Territory"
      requiredRoles={["superadmin", "ceo", "manager", "staff"]}
      futureDataDependencies={["audit_logs"]}
      constitutionalStatus="Active"
    />
  );
}
