/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Shifts() {
  return (
    <PageSkeletonWrapper
      name="Shift Controls Roster"
      territoryName="Financial Territory"
      requiredRoles={["superadmin", "ceo", "manager", "staff"]}
      futureDataDependencies={["shifts", "transactions"]}
      constitutionalStatus="Active"
    />
  );
}
