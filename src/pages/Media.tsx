/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Media() {
  return (
    <PageSkeletonWrapper
      name="Media Bank"
      territoryName="Promotion Territory"
      requiredRoles={["superadmin", "ceo", "manager"]}
      futureDataDependencies={["media_assets"]}
      constitutionalStatus="Active"
    />
  );
}
