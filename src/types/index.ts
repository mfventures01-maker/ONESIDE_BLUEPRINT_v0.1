/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentType } from "react";

export type RoleType = "superadmin" | "ceo" | "manager" | "staff";

export interface RoleDefinition {
  id: RoleType;
  name: string;
  description: string;
}

export interface AppRoute {
  path: string;
  name: string;
  requiredRoles: RoleType[];
  territory: string;
  category: string;
  constitutionalStatus: string;
  dataDependencies: string[];
}

export interface SidebarItem {
  name: string;
  path: string;
  icon: string;
  roles: RoleType[];
}

export interface NavigationGroup {
  groupName: string;
  items: SidebarItem[];
}

export interface PageDefinition {
  name: string;
  territoryName: string;
  requiredRoles: RoleType[];
  futureDataDependencies: string[];
  constitutionalStatus: string;
}

export interface LayoutDefinition {
  id: string;
  name: string;
  description: string;
  hasSidebar: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
}

export interface ProtectedRouteDefinition {
  path: string;
  element: ComponentType<any>;
  allowedRoles: RoleType[];
}
