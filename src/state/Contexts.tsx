/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { RoleType, AppRoute, SidebarItem } from "../types";
import { RouteRegistry, SidebarRegistry } from "../navigation/registries";

// ============================================================================
// ROLE & VISIBILITY MAPS (Architectures)
// ============================================================================

// Statically built maps from our master route and sidebar configurations
export const RoleVisibilityMap: Record<RoleType, { label: string; clearances: string[] }> = {
  superadmin: {
    label: "Super Administrator",
    clearances: ["ALL_TERRITORIES", "BYPASS_AUTHORITY", "AUDIT_RECONCILE"],
  },
  ceo: {
    label: "Chief Executive Officer",
    clearances: ["FINANCIAL_AUDIT", "STRATEGY_DEEP_DIVE", "READ_ALL_METRICS"],
  },
  manager: {
    label: "Session Manager",
    clearances: ["STAFF_CONTROL", "OVERRIDE_LOCAL", "SHIFT_SCHEDULING"],
  },
  staff: {
    label: "General Roster Staff",
    clearances: ["CREATE_ORDER", "UPDATE_ORDER", "SHIFT_CLOCK_IN"],
  },
};

export const RouteVisibilityMap: Record<string, RoleType[]> = RouteRegistry.reduce(
  (acc, route) => {
    acc[route.path] = route.requiredRoles;
    return acc;
  },
  {} as Record<string, RoleType[]>
);

export const SidebarVisibilityMap: Record<string, RoleType[]> = SidebarRegistry.reduce(
  (acc, group) => {
    group.items.forEach((item) => {
      acc[item.path] = item.roles;
    });
    return acc;
  },
  {} as Record<string, RoleType[]>
);

// ============================================================================
// CONTEXT STATE INTERFACES
// ============================================================================

interface UserState {
  id: string;
  name: string;
  email: string;
}

interface UserContextStoreType {
  user: UserState | null;
  isAuthenticated: boolean;
  loginAs: (role: RoleType) => void;
  logout: () => void;
}

interface RoleContextStoreType {
  activeRole: RoleType;
  setRole: (role: RoleType) => void;
  clearances: string[];
}

interface LayoutStoreType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeLayout: "public" | "authenticated" | "dashboard" | "onboarding" | "error";
  setActiveLayout: (layout: "public" | "authenticated" | "dashboard" | "onboarding" | "error") => void;
}

interface NavigationStoreType {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  breadcrumbs: string[];
  setBreadcrumbs: (crumbs: string[]) => void;
}

interface ApplicationStoreType {
  enterpriseName: string;
  isOnline: boolean;
  notificationSlot: string | null;
  setNotificationSlot: (notification: string | null) => void;
  systemLogs: string[];
  addSystemLog: (log: string) => void;
}

// ============================================================================
// CONTEXT INSTANCES
// ============================================================================

const UserContextStore = createContext<UserContextStoreType | undefined>(undefined);
const RoleContextStore = createContext<RoleContextStoreType | undefined>(undefined);
const LayoutStore = createContext<LayoutStoreType | undefined>(undefined);
const NavigationStore = createContext<NavigationStoreType | undefined>(undefined);
const ApplicationStore = createContext<ApplicationStoreType | undefined>(undefined);

// ============================================================================
// PROVIDERS COMBINATOR
// ============================================================================

export function ShellStateProvider({ children }: { children: ReactNode }) {
  // Current user & authentication simulation
  const [user, setUser] = useState<UserState | null>({
    id: "staff-091",
    name: "Enterprise Operator",
    email: "mfventures01@gmail.com",
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Active Role simulation
  const [activeRole, setActiveRole] = useState<RoleType>("ceo");
  const [clearances, setClearances] = useState<string[]>(RoleVisibilityMap.ceo.clearances);

  // Layout states
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeLayout, setActiveLayout] = useState<"public" | "authenticated" | "dashboard" | "onboarding" | "error">("dashboard");

  // Navigation states
  const [currentPath, setCurrentPath] = useState<string>("/dashboard");
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(["Root", "Dashboard"]);

  // Global App states
  const [enterpriseName] = useState<string>("CARSS Enterprise Core");
  const [isOnline] = useState<boolean>(true);
  const [notificationSlot, setNotificationSlot] = useState<string | null>(
    "CONSTITUTIONAL SECURE CHANNEL ESTABLISHED (v0.1-enterprise-shell-audit)"
  );
  const [systemLogs, setSystemLogs] = useState<string[]>(["Core Engine Booted", "Route Map Registry Loaded"]);

  const addSystemLog = (log: string) => {
    setSystemLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${log}`, ...prev.slice(0, 49)]);
  };

  const loginAs = (role: RoleType) => {
    setUser({
      id: `operator-${role}`,
      name: `Demo User (${RoleVisibilityMap[role].label})`,
      email: `${role}@carss.constitutional.internal`,
    });
    setActiveRole(role);
    setClearances(RoleVisibilityMap[role].clearances);
    setIsAuthenticated(true);
    addSystemLog(`User simulated login completed as authority level: ${role.toUpperCase()}`);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    addSystemLog("Simulated authentication sign-out executed. Public bounds active.");
  };

  // Keep role clearances synchronized in simulation
  useEffect(() => {
    setClearances(RoleVisibilityMap[activeRole].clearances);
    addSystemLog(`Context synchronized authority level to [ ${activeRole.toUpperCase()} ]`);
  }, [activeRole]);

  return (
    <ApplicationStore.Provider
      value={{
        enterpriseName,
        isOnline,
        notificationSlot,
        setNotificationSlot,
        systemLogs,
        addSystemLog,
      }}
    >
      <UserContextStore.Provider value={{ user, isAuthenticated, loginAs, logout }}>
        <RoleContextStore.Provider value={{ activeRole, setRole: setActiveRole, clearances }}>
          <LayoutStore.Provider value={{ sidebarOpen, setSidebarOpen, activeLayout, setActiveLayout }}>
            <NavigationStore.Provider value={{ currentPath, setCurrentPath, breadcrumbs, setBreadcrumbs }}>
              {children}
            </NavigationStore.Provider>
          </LayoutStore.Provider>
        </RoleContextStore.Provider>
      </UserContextStore.Provider>
    </ApplicationStore.Provider>
  );
}

// ============================================================================
// CONVENIENT OUTLET CONSUMPTION HOOKS
// ============================================================================

export function useUserStore() {
  const context = useContext(UserContextStore);
  if (!context) throw new Error("useUserStore must be used inside ShellStateProvider");
  return context;
}

export function useRoleStore() {
  const context = useContext(RoleContextStore);
  if (!context) throw new Error("useRoleStore must be used inside ShellStateProvider");
  return context;
}

export function useLayoutStore() {
  const context = useContext(LayoutStore);
  if (!context) throw new Error("useLayoutStore must be used inside ShellStateProvider");
  return context;
}

export function useNavigationStore() {
  const context = useContext(NavigationStore);
  if (!context) throw new Error("useNavigationStore must be used inside ShellStateProvider");
  return context;
}

export function useApplicationStore() {
  const context = useContext(ApplicationStore);
  if (!context) throw new Error("useApplicationStore must be used inside ShellStateProvider");
  return context;
}
