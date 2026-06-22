/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PageSkeletonWrapper } from "../components/PageSkeletonWrapper";

export default function Orders() {
  return (
    <PageSkeletonWrapper
      name="Orders Hub"
      territoryName="Order Territory"
      requiredRoles={["superadmin", "ceo", "manager", "staff"]}
      futureDataDependencies={["orders", "order_items"]}
      constitutionalStatus="Active - CARSS Authorized"
    />
  );
}
