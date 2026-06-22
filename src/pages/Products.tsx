/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Products() {
  return (
    <PageSkeletonWrapper
      name="Products Portfolio"
      territoryName="Menu Territory"
      requiredRoles={["superadmin", "ceo", "manager"]}
      futureDataDependencies={["menu_categories", "menu_items"]}
      constitutionalStatus="Frozen"
    />
  );
}
