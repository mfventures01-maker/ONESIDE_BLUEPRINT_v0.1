/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Roles() {
  return (
    <PageSkeletonWrapper
      name="Authority & Roles Matrix"
      territoryName="Identity Territory"
      requiredRoles={["superadmin", "ceo"]}
      futureDataDependencies={["roles", "permissions"]}
      constitutionalStatus="Frozen"
    />
  );
}
