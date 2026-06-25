/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { RoleType, RoleVisibilityMap } from "../types";
import { useAuth } from "./auth/useAuth";

export interface ShellStateContextType {
  activeRole: RoleType;
  clearances: string[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  systemLogs: string[];
  addSystemLog: (log: string) => void;
  loginAs: (role: RoleType) => void;
  logout: () => Promise<void>;
}

export const ApplicationStore = createContext<ShellStateContextType | undefined>(undefined);

export function ShellStateProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const user = auth.user;

  const [activeRole, setActiveRole] = useState<RoleType>("staff");
  const [clearances, setClearances] = useState<string[]>(RoleVisibilityMap.staff.clearances);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  const addSystemLog = (log: string) => {
    setSystemLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${log}`, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    if (user) {
      setActiveRole(user.role);
      setClearances(RoleVisibilityMap[user.role].clearances);
      addSystemLog(`User synchronized in Shell as [ ${user.role.toUpperCase()} ] : ${user.email}`);
    } else {
      setActiveRole("staff");
      setClearances(RoleVisibilityMap.staff.clearances);
    }
  }, [user]);

  const loginAs = (role: RoleType) => {
    setActiveRole(role);
    setClearances(RoleVisibilityMap[role].clearances);
    addSystemLog(`Switched clearance authority to: ${role.toUpperCase()}`);
  };

  const logout = async () => {
    await auth.logout();
    addSystemLog("Constitutional sign-out executed. Session cleared.");
  };

  return (
    <ApplicationStore.Provider
      value={{
        activeRole,
        clearances,
        sidebarOpen,
        setSidebarOpen,
        systemLogs,
        addSystemLog,
        loginAs,
        logout,
      }}
    >
      {children}
    </ApplicationStore.Provider>
  );
}

export function useRoleStore() {
  const context = useContext(ApplicationStore);
  if (context === undefined) {
    throw new Error("useRoleStore must be used inside a ShellStateProvider");
  }
  return context;
}
