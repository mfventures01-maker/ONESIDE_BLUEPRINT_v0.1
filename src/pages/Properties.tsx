/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Properties() {
  return (
    <PageSkeletonWrapper
      name="Properties & Branch Ledger"
      territoryName="Business Territory"
      requiredRoles={["superadmin", "ceo"]}
      futureDataDependencies={["businesses", "branches"]}
      constitutionalStatus="Active"
    />
  );
}
