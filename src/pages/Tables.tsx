/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Tables() {
  return (
    <PageSkeletonWrapper
      name="Tables Layout Planner"
      territoryName="QR Territory"
      requiredRoles={["superadmin", "ceo", "manager", "staff"]}
      futureDataDependencies={["physical_tables", "qr_codes"]}
      constitutionalStatus="Frozen"
    />
  );
}
