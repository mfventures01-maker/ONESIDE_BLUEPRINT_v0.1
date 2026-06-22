/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Analytics() {
  return (
    <PageSkeletonWrapper
      name="Intelligence Analytics Room"
      territoryName="Financial Territory"
      requiredRoles={["superadmin", "ceo"]}
      futureDataDependencies={["transactions", "payment_intents"]}
      constitutionalStatus="Active"
    />
  );
}
