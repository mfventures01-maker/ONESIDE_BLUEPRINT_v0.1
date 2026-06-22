/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Profile() {
  return (
    <PageSkeletonWrapper
      name="User Profile"
      territoryName="Identity Territory"
      requiredRoles={["superadmin", "ceo", "manager", "staff"]}
      futureDataDependencies={["staff_profiles"]}
      constitutionalStatus="Active"
    />
  );
}
