/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Inventory() {
  return (
    <PageSkeletonWrapper
      name="Inventory Control"
      territoryName="Inventory Territory"
      requiredRoles={["superadmin", "ceo", "manager"]}
      futureDataDependencies={["inventory_stock"]}
      constitutionalStatus="Frozen"
    />
  );
}
