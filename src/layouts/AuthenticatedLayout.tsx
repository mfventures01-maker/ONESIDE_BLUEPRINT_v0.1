/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import DashboardLayout from "./DashboardLayout";

// Authenticated layout mirrors Dashboard layout in our enterprise shell, supporting sidebars, headers, and slots.
export default function AuthenticatedLayout({ children }: { children?: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
