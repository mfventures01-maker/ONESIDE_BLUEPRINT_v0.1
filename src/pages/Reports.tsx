/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Reports() {
  return (
    <PageSkeletonWrapper
      name="Business Reports Center"
      territoryName="Audit Territory"
      requiredRoles={["superadmin", "ceo", "manager"]}
      futureDataDependencies={["audit_logs", "transactions"]}
      constitutionalStatus="Frozen"
    />
  );
}
