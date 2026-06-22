/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Onboarding() {
  return (
    <PageSkeletonWrapper
      name="Business Onboarding Guide"
      territoryName="Identity Territory"
      requiredRoles={["superadmin", "ceo"]}
      futureDataDependencies={["businesses", "staff_profiles"]}
      constitutionalStatus="Active"
    />
  );
}
