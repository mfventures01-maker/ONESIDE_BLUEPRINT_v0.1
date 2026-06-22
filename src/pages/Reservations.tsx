/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Reservations() {
  return (
    <PageSkeletonWrapper
      name="Reservations Matrix"
      territoryName="Business Territory"
      requiredRoles={["superadmin", "ceo", "manager", "staff"]}
      futureDataDependencies={["reservations", "physical_tables"]}
      constitutionalStatus="Active"
    />
  );
}
