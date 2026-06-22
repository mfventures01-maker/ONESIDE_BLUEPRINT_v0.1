/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Dashboard() {
  return (
    <PageSkeletonWrapper
      name="Dashboard"
      territoryName="Financial Territory"
      requiredRoles={["superadmin", "ceo", "manager", "staff"]}
      futureDataDependencies={["transactions", "payment_intents"]}
      constitutionalStatus="Frozen - SSOT"
    />
  );
}
