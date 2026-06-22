/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Settings() {
  return (
    <PageSkeletonWrapper
      name="System Settings"
      territoryName="Business Territory"
      requiredRoles={["superadmin", "ceo", "manager"]}
      futureDataDependencies={["businesses", "business_contact_channels"]}
      constitutionalStatus="Frozen"
    />
  );
}
