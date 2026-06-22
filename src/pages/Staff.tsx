/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Staff() {
  return (
    <PageSkeletonWrapper
      name="Staff Directory"
      territoryName="Identity Territory"
      requiredRoles={["superadmin", "ceo", "manager"]}
      futureDataDependencies={["staff_profiles", "business_memberships"]}
      constitutionalStatus="Frozen"
    />
  );
}
