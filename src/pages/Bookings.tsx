/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Bookings() {
  return (
    <PageSkeletonWrapper
      name="Bookings Registry"
      territoryName="Business Territory"
      requiredRoles={["superadmin", "ceo", "manager", "staff"]}
      futureDataDependencies={["bookings"]}
      constitutionalStatus="Active"
    />
  );
}
